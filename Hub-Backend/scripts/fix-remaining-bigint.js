/**
 * Fix remaining bigint columns that reference auth_member.id (now varchar(30))
 * 
 * These columns were missed by the initial migration and cause
 * "invalid input syntax for type bigint" errors when new varchar IDs are used.
 */
const { Client } = require('pg');

async function main() {
    const c = new Client({
        host: 'localhost',
        port: 5432,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_dev',
    });

    await c.connect();
    console.log('Connected to database');

    // Find ALL columns that reference member IDs and are still bigint
    const r = await c.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type = 'bigint'
      AND (
        column_name = 'member_id'
        OR column_name = 'student_id'
      )
    ORDER BY table_name
  `);

    console.log('\n=== Columns to fix ===');
    r.rows.forEach(row => console.log(`  ${row.table_name}.${row.column_name}`));
    console.log(`Total: ${r.rows.length}`);

    // Begin transaction
    await c.query('BEGIN');

    try {
        for (const row of r.rows) {
            const { table_name, column_name } = row;

            // Drop foreign key constraints referencing this column first
            const fks = await c.query(`
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1
          AND kcu.column_name = $2
          AND tc.table_schema = 'public'
      `, [table_name, column_name]);

            for (const fk of fks.rows) {
                console.log(`  Dropping FK: ${table_name}.${fk.constraint_name}`);
                await c.query(`ALTER TABLE "${table_name}" DROP CONSTRAINT "${fk.constraint_name}"`);
            }

            // Alter column type
            console.log(`  Converting ${table_name}.${column_name} from bigint to varchar(30)...`);
            await c.query(`ALTER TABLE "${table_name}" ALTER COLUMN "${column_name}" TYPE varchar(30) USING "${column_name}"::text`);

            // Convert any existing bigint values to LEGACY format
            const existingData = await c.query(
                `SELECT COUNT(*) as cnt FROM "${table_name}" WHERE "${column_name}" IS NOT NULL AND "${column_name}" != ''`
            );
            if (parseInt(existingData.rows[0].cnt) > 0) {
                // Only convert values that look like plain numbers (not already LEGACY or new format)
                await c.query(`
          UPDATE "${table_name}" 
          SET "${column_name}" = 'LEGACY' || LPAD("${column_name}", 6, '0') 
          WHERE "${column_name}" IS NOT NULL 
            AND "${column_name}" != '' 
            AND "${column_name}" NOT LIKE 'LEGACY%'
            AND "${column_name}" NOT LIKE 's%'
            AND "${column_name}" NOT LIKE 't%'
            AND "${column_name}" NOT LIKE 'p%'
        `);
            }

            console.log(`  ✓ ${table_name}.${column_name} -> varchar(30)`);
        }

        await c.query('COMMIT');
        console.log('\n✅ All member_id/student_id columns fixed successfully!');
    } catch (e) {
        await c.query('ROLLBACK');
        console.error('\n❌ Migration failed, rolled back:', e.message);
        throw e;
    }

    await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
