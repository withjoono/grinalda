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

  // Find all bigint columns that might receive member IDs
  const r = await c.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND data_type = 'bigint'
      AND (
        column_name LIKE '%member%' 
        OR column_name = 'id'
        OR column_name LIKE '%_id'
      )
    ORDER BY table_name, column_name
  `);

  console.log('=== Remaining bigint columns ===');
  r.rows.forEach(row => {
    console.log(`${row.table_name}.${row.column_name} -> ${row.data_type}`);
  });
  console.log(`Total: ${r.rows.length}`);

  // Also check auth_member specifically
  const r2 = await c.query(`
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'auth_member'
    ORDER BY ordinal_position
  `);

  console.log('\n=== auth_member columns ===');
  r2.rows.forEach(row => {
    const len = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
    console.log(`  ${row.column_name}: ${row.data_type}${len}`);
  });

  // Check auth_member sub-profile tables
  for (const table of ['auth_member_s', 'auth_member_t', 'auth_member_p']) {
    const r3 = await c.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position
    `, [table]);

    if (r3.rows.length > 0) {
      console.log(`\n=== ${table} columns ===`);
      r3.rows.forEach(row => {
        const len = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
        console.log(`  ${row.column_name}: ${row.data_type}${len}`);
      });
    }
  }

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
