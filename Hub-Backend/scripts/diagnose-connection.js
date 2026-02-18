
const { Client } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const envPath = path.resolve(__dirname, '..', '.env.production');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Loaded .env.production');
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
        await client.connect();
        console.log('✅ Connected to:', config.database, '\n');

        // List ALL schemas
        const schemas = await client.query('SELECT schema_name FROM information_schema.schemata ORDER BY schema_name');
        console.log('📂 All schemas:', schemas.rows.map(r => r.schema_name));

        // List tables in ALL schemas (excluding pg_ and information_schema)
        const allTables = await client.query(`
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_type = 'BASE TABLE'
            AND table_schema NOT IN ('pg_catalog', 'information_schema')
            ORDER BY table_schema, table_name
        `);

        console.log(`\n📋 All user tables (${allTables.rows.length}):`);
        let currentSchema = '';
        for (const row of allTables.rows) {
            if (row.table_schema !== currentSchema) {
                currentSchema = row.table_schema;
                console.log(`\n  [${currentSchema}]`);
            }
            console.log(`    - ${row.table_name}`);
        }

        if (allTables.rows.length === 0) {
            console.log('\n⚠️  Database has NO user tables at all!');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

run();
