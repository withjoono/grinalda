const { Client } = require('pg');

async function run() {
    const c = new Client({
        host: '127.0.0.1',
        port: 5435,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_prod',
    });
    await c.connect();
    console.log('Connected to production DB');

    // Check what's in public
    const r1 = await c.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
    console.log('Tables in public:', r1.rows.map(r => r.tablename));

    // Drop duplicate tables and public schema
    const stmts = [
        ...r1.rows.map(r => `DROP TABLE IF EXISTS public."${r.tablename}" CASCADE`),
        'DROP SCHEMA IF EXISTS public CASCADE',
    ];
    for (const stmt of stmts) {
        try {
            await c.query(stmt);
            console.log('OK:', stmt);
        } catch (e) {
            console.log('ERR:', stmt, '->', e.message);
        }
    }

    // Verify
    const r2 = await c.query("SELECT schemaname, count(*) as tables FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') GROUP BY schemaname ORDER BY schemaname");
    console.log('\n=== Final Schema Distribution ===');
    console.table(r2.rows);

    await c.end();
}

run().catch(e => console.error(e));
