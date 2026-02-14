const { Client } = require('pg');

async function main() {
    const c = new Client({
        host: '127.0.0.1',
        port: 15432,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_prod'
    });

    await c.connect();
    console.log('Connected to geobukschool_prod');

    const res = await c.query(
        `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`
    );

    console.log(`\nFound ${res.rows.length} tables:`);
    res.rows.forEach(r => console.log(`  - ${r.tablename}`));

    // Check if auth_member exists
    const authMember = res.rows.find(r => r.tablename === 'auth_member');
    console.log(`\nauth_member exists: ${!!authMember}`);

    // Check migrations table
    const migTable = res.rows.find(r => r.tablename === 'typeorm_migrations');
    if (migTable) {
        const migs = await c.query('SELECT * FROM typeorm_migrations ORDER BY id');
        console.log(`\nMigrations run (${migs.rows.length}):`);
        migs.rows.forEach(m => console.log(`  ${m.id}: ${m.name} (${m.timestamp})`));
    } else {
        console.log('\ntypeorm_migrations table does not exist');
    }

    await c.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
