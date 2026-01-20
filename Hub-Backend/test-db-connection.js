const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'geobukschool_dev',
  user: 'tsuser',
  password: 'tsuser1234',
});

console.log('Attempting to connect with config:', {
  host: '127.0.0.1',
  port: 5432,
  database: 'geobukschool_dev',
  user: 'tsuser',
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL!');
    return client.query('SELECT current_database(), current_user');
  })
  .then(res => {
    console.log('Current database:', res.rows[0].current_database);
    console.log('Current user:', res.rows[0].current_user);
    return client.end();
  })
  .then(() => {
    console.log('Connection closed');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    console.error('Error code:', err.code);
    console.error('Error stack:', err.stack);
    process.exit(1);
  });
