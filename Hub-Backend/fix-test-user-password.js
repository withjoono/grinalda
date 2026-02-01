const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function fixTestUserPassword() {
  const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'geobukschool_dev',
    user: 'tsuser',
    password: 'tsuser1234',
  });

  try {
    // Generate correct bcrypt hash for test1234
    const plainPassword = 'test1234';
    const hash = await bcrypt.hash(plainPassword, 10);
    const hashWithPrefix = `{bcrypt}${hash}`;

    console.log('Generated hash for test1234:', hashWithPrefix);

    // Update the database
    const result = await pool.query(
      `UPDATE auth_member
       SET password = $1, update_dt = CURRENT_TIMESTAMP
       WHERE email = 'test@test.com'
       RETURNING id, email, password`,
      [hashWithPrefix]
    );

    if (result.rowCount > 0) {
      console.log('\n✅ Successfully updated test user password');
      console.log('User:', result.rows[0]);
    } else {
      console.log('\n❌ No user found with email test@test.com');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixTestUserPassword();
