const { Client } = require('pg');

// Direct connection to Cloud SQL (IP allowlisted for 5 minutes)
const client = new Client({
    host: '34.64.165.158',
    port: 5432,
    user: 'tsuser',
    password: 'tsuser1234',
    database: 'geobukschool_prod',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('✅ Connected to production database');

        // Check current column type
        const typeCheck = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'auth_member' AND column_name = 'id'
    `);
        console.log('Current auth_member.id type:', typeCheck.rows);

        if (typeCheck.rows.length === 0) {
            console.log('❌ auth_member table or id column not found!');
            return;
        }

        if (typeCheck.rows[0].data_type === 'character varying') {
            console.log('✅ auth_member.id is already varchar. No migration needed.');
            return;
        }

        console.log('🔧 Starting migration: bigint -> varchar(30)...');

        // 1. Drop all foreign keys referencing auth_member(id)
        console.log('  Step 1: Dropping foreign keys...');
        await client.query(`
      DO $$ 
      DECLARE 
        r RECORD;
      BEGIN 
        FOR r IN (
          SELECT 
            tc.table_schema, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name, 
            ccu.column_name AS foreign_column_name, 
            tc.constraint_name
          FROM information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu 
            ON tc.constraint_name = kcu.constraint_name 
            AND tc.table_schema = kcu.table_schema 
          JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name 
            AND ccu.table_schema = tc.table_schema 
          WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.table_name = 'auth_member'
            AND ccu.column_name = 'id'
        ) LOOP 
          EXECUTE 'ALTER TABLE "' || r.table_schema || '"."' || r.table_name || '" DROP CONSTRAINT "' || r.constraint_name || '"';
          RAISE NOTICE 'Dropped FK: % on %.%', r.constraint_name, r.table_schema, r.table_name;
        END LOOP; 
      END $$;
    `);
        console.log('  ✅ Foreign keys dropped');

        // 2. Change column type of referenced tables
        console.log('  Step 2: Altering referencing columns...');
        const standardTables = [
            'auth_member_s', 'auth_member_t', 'auth_member_p',
            'ss_user_university_interest',
            'board_post', 'board_comment',
            'payment_order',
            'hub_app_subscriptions',
            'sgb_subject_learning', 'sgb_creative_activity', 'sgb_volunteer',
            'sgb_attendance_detail', 'sgb_sport_art', 'sgb_select_subject',
            'sgb_behavior_opinion'
        ];

        for (const table of standardTables) {
            const exists = await client.query(`SELECT to_regclass('public.${table}') IS NOT NULL AS exists`);
            if (exists.rows[0].exists) {
                try {
                    await client.query(`ALTER TABLE "${table}" ALTER COLUMN "member_id" TYPE varchar(30)`);
                    console.log(`    ✅ ${table}.member_id -> varchar(30)`);
                } catch (e) {
                    console.log(`    ⚠️  ${table}.member_id: ${e.message}`);
                }
            } else {
                console.log(`    ⏭️  ${table} does not exist, skipping`);
            }
        }

        // camelCase tables
        const camelCaseTables = ['oauth_authorization_codes'];
        for (const table of camelCaseTables) {
            const exists = await client.query(`SELECT to_regclass('public.${table}') IS NOT NULL AS exists`);
            if (exists.rows[0].exists) {
                try {
                    await client.query(`ALTER TABLE "${table}" ALTER COLUMN "memberId" TYPE varchar(30)`);
                    console.log(`    ✅ ${table}.memberId -> varchar(30)`);
                } catch (e) {
                    console.log(`    ⚠️  ${table}.memberId: ${e.message}`);
                }
            } else {
                console.log(`    ⏭️  ${table} does not exist, skipping`);
            }
        }

        // 3. Change Primary Key
        console.log('  Step 3: Altering auth_member.id...');
        await client.query(`ALTER TABLE "auth_member" ALTER COLUMN "id" TYPE varchar(30)`);
        console.log('  ✅ auth_member.id -> varchar(30)');

        // 4. Restore Foreign Keys
        console.log('  Step 4: Restoring foreign keys...');

        const profiles = ['auth_member_s', 'auth_member_t', 'auth_member_p'];
        for (const table of profiles) {
            const exists = await client.query(`SELECT to_regclass('public.${table}') IS NOT NULL AS exists`);
            if (exists.rows[0].exists) {
                try {
                    await client.query(`ALTER TABLE "${table}" ADD CONSTRAINT "FK_${table}_member_id" FOREIGN KEY ("member_id") REFERENCES "auth_member"("id") ON DELETE CASCADE`);
                    console.log(`    ✅ FK restored: ${table} (CASCADE)`);
                } catch (e) {
                    console.log(`    ⚠️  FK ${table}: ${e.message}`);
                }
            }
        }

        const otherTables = standardTables.filter(t => !profiles.includes(t));
        for (const table of otherTables) {
            const exists = await client.query(`SELECT to_regclass('public.${table}') IS NOT NULL AS exists`);
            if (exists.rows[0].exists) {
                try {
                    await client.query(`ALTER TABLE "${table}" ADD CONSTRAINT "FK_${table}_member_id" FOREIGN KEY ("member_id") REFERENCES "auth_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
                    console.log(`    ✅ FK restored: ${table}`);
                } catch (e) {
                    console.log(`    ⚠️  FK ${table}: ${e.message}`);
                }
            }
        }

        for (const table of camelCaseTables) {
            const exists = await client.query(`SELECT to_regclass('public.${table}') IS NOT NULL AS exists`);
            if (exists.rows[0].exists) {
                try {
                    await client.query(`ALTER TABLE "${table}" ADD CONSTRAINT "FK_${table}_memberId" FOREIGN KEY ("memberId") REFERENCES "auth_member"("id") ON DELETE CASCADE`);
                    console.log(`    ✅ FK restored: ${table} (camelCase, CASCADE)`);
                } catch (e) {
                    console.log(`    ⚠️  FK ${table}: ${e.message}`);
                }
            }
        }

        // 5. Record migration in typeorm_migrations
        console.log('  Step 5: Recording migration...');
        try {
            await client.query(`
        INSERT INTO typeorm_migrations (timestamp, name) 
        VALUES (1771132529888, 'FixMemberIdType1771132529888')
      `);
            console.log('  ✅ Migration recorded in typeorm_migrations');
        } catch (e) {
            console.log(`  ⚠️  Recording migration: ${e.message}`);
        }

        // 6. Verify
        const verifyResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'auth_member' AND column_name = 'id'
    `);
        console.log('\n🎉 Migration complete!');
        console.log('Verified auth_member.id type:', verifyResult.rows);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

run();
