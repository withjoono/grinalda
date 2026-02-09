const pg = require('pg');
const fs = require('fs');
const c = new pg.Client({
    host: '127.0.0.1', port: 5432, user: 'tsuser',
    password: 'tsuser1234', database: 'geobukschool_dev'
});

async function main() {
    const lines = [];
    const log = (msg) => lines.push(msg);

    try {
        await c.connect();

        // Check FK constraints referencing auth_member
        log('=== FK constraints referencing auth_member ===');
        const fks = await c.query(`
      SELECT
        tc.table_name AS source_table,
        kcu.column_name AS source_column,
        ccu.table_name AS target_table,
        ccu.column_name AS target_column,
        tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'auth_member'
    `);
        if (fks.rows.length === 0) {
            log('  No FK constraints found');
        } else {
            fks.rows.forEach(r => log(`  ${r.source_table}.${r.source_column} -> ${r.target_table}.${r.target_column} (${r.constraint_name})`));
        }

        // Check indexes on auth_member
        log('');
        log('=== Indexes on auth_member ===');
        const idxs = await c.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'auth_member'
    `);
        idxs.rows.forEach(r => log(`  ${r.indexname}: ${r.indexdef}`));

        // Check PK constraint
        log('');
        log('=== Primary key constraint on auth_member ===');
        const pk = await c.query(`
      SELECT constraint_name, column_name
      FROM information_schema.key_column_usage
      WHERE table_name = 'auth_member'
        AND constraint_name IN (
          SELECT constraint_name FROM information_schema.table_constraints
          WHERE table_name = 'auth_member' AND constraint_type = 'PRIMARY KEY'
        )
    `);
        pk.rows.forEach(r => log(`  ${r.constraint_name}: ${r.column_name}`));

        // Check all columns and their defaults
        log('');
        log('=== auth_member column defaults ===');
        const defs = await c.query(`
      SELECT column_name, column_default, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'auth_member'
      ORDER BY ordinal_position
    `);
        defs.rows.forEach(r => log(`  ${r.column_name} | ${r.data_type}(${r.character_maximum_length || ''}) | default: ${r.column_default || 'null'}`));

    } catch (e) {
        log(`Error: ${e.message}`);
    } finally {
        await c.end();
        fs.writeFileSync('scripts/schema-check-result3.txt', lines.join('\n'));
        console.log('Done');
    }
}
main();
