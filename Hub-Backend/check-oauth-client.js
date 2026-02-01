const { Pool } = require('pg');

async function checkOAuthClient() {
  const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'geobukschool_dev',
    user: 'tsuser',
    password: 'tsuser1234',
  });

  try {
    // Check current OAuth client
    const currentResult = await pool.query(
      `SELECT "clientId", "clientSecret", "clientName", "redirectUris", "allowedScopes", "isActive"
       FROM "oauth_clients"
       WHERE "clientId" = 'susi-app'`
    );

    console.log('📋 Current OAuth Client:');
    if (currentResult.rowCount > 0) {
      console.log(JSON.stringify(currentResult.rows[0], null, 2));
    } else {
      console.log('❌ No OAuth client found for susi-app');
    }

    // Update to correct secret
    const correctSecret = 'susi-secret-change-in-production';
    const updateResult = await pool.query(
      `INSERT INTO "oauth_clients" ("clientId", "clientSecret", "clientName", "redirectUris", "allowedScopes", "isActive")
       VALUES (
         'susi-app',
         $1,
         'Susi Backend',
         ARRAY['http://localhost:4001/auth/oauth/callback', 'http://localhost:3001/auth/oauth/callback'],
         ARRAY['openid', 'profile', 'email'],
         true
       )
       ON CONFLICT ("clientId") DO UPDATE SET
         "clientSecret" = EXCLUDED."clientSecret",
         "redirectUris" = EXCLUDED."redirectUris",
         "updatedAt" = CURRENT_TIMESTAMP
       RETURNING *`,
      [correctSecret]
    );

    console.log('\n✅ Updated OAuth Client:');
    console.log(JSON.stringify(updateResult.rows[0], null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkOAuthClient();
