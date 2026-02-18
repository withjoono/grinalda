
const { Client } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const envPath = path.resolve(__dirname, '..', '.env.production');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Loaded .env.production');
} else {
    console.error('❌ .env.production not found');
    process.exit(1);
}

const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5434', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionTimeoutMillis: 10000,
};

async function run() {
    const client = new Client(config);
    try {
        console.log('🔌 Connecting to production DB...');
        await client.connect();
        console.log('✅ Connected!\n');

        // Step 1: Create hub schema
        console.log('📂 Step 1: Creating hub schema...');
        await client.query('CREATE SCHEMA IF NOT EXISTS hub');
        console.log('✅ hub schema ready.\n');

        // Step 2: Get all tables in public schema
        console.log('📋 Step 2: Listing tables in public schema...');
        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);

        const tables = tablesRes.rows.map(r => r.table_name);
        console.log(`Found ${tables.length} tables in public:`, tables);
        console.log('');

        if (tables.length === 0) {
            console.log('⚠️  No tables found in public schema. Nothing to move.');
            return;
        }

        // Step 3: Move each table
        console.log('🚚 Step 3: Moving tables from public → hub...');
        let successCount = 0;
        let errorCount = 0;

        for (const table of tables) {
            try {
                // Check if table already exists in hub schema
                const existsRes = await client.query(`
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_schema = 'hub' AND table_name = $1
                `, [table]);

                if (existsRes.rows.length > 0) {
                    console.log(`  ⏭️  ${table} - already exists in hub, skipping`);
                    continue;
                }

                await client.query(`ALTER TABLE public."${table}" SET SCHEMA hub`);
                console.log(`  ✅ ${table} → hub`);
                successCount++;
            } catch (err) {
                console.error(`  ❌ ${table} failed: ${err.message}`);
                errorCount++;
            }
        }

        console.log(`\n📊 Results: ${successCount} moved, ${errorCount} failed\n`);

        // Step 4: Move sequences too
        console.log('🔢 Step 4: Moving sequences from public → hub...');
        const seqRes = await client.query(`
            SELECT sequence_name 
            FROM information_schema.sequences 
            WHERE sequence_schema = 'public'
        `);

        for (const row of seqRes.rows) {
            try {
                await client.query(`ALTER SEQUENCE public."${row.sequence_name}" SET SCHEMA hub`);
                console.log(`  ✅ sequence ${row.sequence_name} → hub`);
            } catch (err) {
                console.error(`  ❌ sequence ${row.sequence_name} failed: ${err.message}`);
            }
        }

        // Step 5: Verify
        console.log('\n🔍 Step 5: Verification...');
        const hubTablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'hub' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);
        console.log(`Tables now in hub schema (${hubTablesRes.rows.length}):`,
            hubTablesRes.rows.map(r => r.table_name));

        const publicTablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);
        console.log(`Tables remaining in public (${publicTablesRes.rows.length}):`,
            publicTablesRes.rows.map(r => r.table_name));

        console.log('\n✅ Done! All tables moved to hub schema.');

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('💡 Hint: Cloud SQL Proxy가 실행 중인지 확인하세요 (port 5434)');
        }
    } finally {
        await client.end();
    }
}

run();
