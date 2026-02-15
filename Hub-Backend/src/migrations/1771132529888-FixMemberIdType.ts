import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMemberIdType1771132529888 implements MigrationInterface {
    name = 'FixMemberIdType1771132529888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Drop all foreign keys referencing auth_member(id)
        const dropForeignKeyQuery = `
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
                END LOOP; 
            END $$;
        `;
        await queryRunner.query(dropForeignKeyQuery);

        // 2. Change column type of referenced tables (Foreign Keys) to VARCHAR(30)
        
        // Group 1: Tables with standard 'member_id' column
        const standardTables = [
            'auth_member_s', 'auth_member_t', 'auth_member_p',  // Profiles
            'ss_user_university_interest',                      // Interests
            'board_post', 'board_comment',                      // Community
            'payment_order',                                    // Payment
            'hub_app_subscriptions',                            // Subscription
            // School Records
            'sgb_subject_learning', 'sgb_creative_activity', 'sgb_volunteer', 
            'sgb_attendance_detail', 'sgb_sport_art', 'sgb_select_subject',
            'sgb_behavior_opinion'
        ];

        for (const table of standardTables) {
            const tableExists = await queryRunner.hasTable(table);
            if (tableExists) {
                 try {
                    await queryRunner.query(`ALTER TABLE "${table}" ALTER COLUMN "member_id" TYPE varchar(30)`);
                 } catch (e) {
                    console.log(`Error altering member_id for table ${table}: ${e}`);
                 }
            }
        }

        // Group 2: Tables with 'memberId' column (camelCase)
        const camelCaseTables = [
            'oauth_authorization_codes'
        ];

        for (const table of camelCaseTables) {
            const tableExists = await queryRunner.hasTable(table);
            if (tableExists) {
                 try {
                    await queryRunner.query(`ALTER TABLE "${table}" ALTER COLUMN "memberId" TYPE varchar(30)`);
                 } catch (e) {
                    console.log(`Error altering memberId for table ${table}: ${e}`);
                 }
            }
        }

        // 3. Change Primary Key of auth_member to VARCHAR(30)
        await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "id" TYPE varchar(30)`);

        // 4. Restore Foreign Keys
        
        // Profiles (Cascade Delete)
        const profiles = ['auth_member_s', 'auth_member_t', 'auth_member_p'];
        for (const table of profiles) {
            if (await queryRunner.hasTable(table)) {
                await queryRunner.query(`ALTER TABLE "${table}" ADD CONSTRAINT "FK_${table}_member_id" FOREIGN KEY ("member_id") REFERENCES "auth_member"("id") ON DELETE CASCADE`);
            }
        }

        // Standard Tables (No Cascade usually, or default)
        const otherStandardTables = standardTables.filter(t => !profiles.includes(t));
        
        for (const table of otherStandardTables) {
             const tableExists = await queryRunner.hasTable(table);
             if (tableExists) {
                const constraintName = `FK_${table}_member_id`;
                try {
                    await queryRunner.query(`ALTER TABLE "${table}" ADD CONSTRAINT "${constraintName}" FOREIGN KEY ("member_id") REFERENCES "auth_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
                } catch (e) {
                    console.log(`Error restoring FK for table ${table}: ${e}`);
                }
             }
        }

        // CamelCase Tables
        for (const table of camelCaseTables) {
             const tableExists = await queryRunner.hasTable(table);
             if (tableExists) {
                const constraintName = `FK_${table}_memberId`;
                try {
                    await queryRunner.query(`ALTER TABLE "${table}" ADD CONSTRAINT "${constraintName}" FOREIGN KEY ("memberId") REFERENCES "auth_member"("id") ON DELETE CASCADE`);
                } catch (e) {
                    console.log(`Error restoring FK for table ${table}: ${e}`);
                }
             }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        throw new Error('Cannot revert Member ID type change from VARCHAR to BIGINT without potential data loss.');
    }

}
