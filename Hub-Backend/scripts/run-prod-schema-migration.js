const { Client } = require('pg');
const fs = require('fs');

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

    // Read and execute SQL file
    const sql = fs.readFileSync('scripts/reorganize-schemas.sql', 'utf8');

    // Split by semicolons and filter out empty/comment-only statements
    const stmts = sql.split(';')
        .map(s => s.trim())
        .filter(s => {
            // Remove lines that are purely comments
            const lines = s.split('\n').filter(l => !l.trim().startsWith('--') && l.trim().length > 0);
            return lines.length > 0;
        });

    let ok = 0, err = 0;
    for (const stmt of stmts) {
        // Extract non-comment lines for the actual SQL
        const sqlLines = stmt.split('\n').filter(l => !l.trim().startsWith('--')).join('\n').trim();
        if (!sqlLines) continue;

        try {
            await c.query(sqlLines);
            console.log('OK:', sqlLines.substring(0, 70).replace(/\n/g, ' '));
            ok++;
        } catch (e) {
            console.log('ERR:', sqlLines.substring(0, 70).replace(/\n/g, ' '), '->', e.message);
            err++;
        }
    }

    // Verify
    const r = await c.query(
        "SELECT schemaname, count(*) as tables FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') GROUP BY schemaname ORDER BY schemaname"
    );
    console.log('\n=== Final Schema Distribution ===');
    console.table(r.rows);

    await c.end();
    console.log(`\nDone: ${ok} OK, ${err} errors`);
}

run().catch(e => console.error(e));
