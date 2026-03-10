const { Pool, Client } = require('pg')
const pool = new Pool({
    user: 'ing2020',
    host: 'database-1.cuusz4nwx7iv.ap-northeast-2.rds.amazonaws.com',
    database: 'postgres',
    password: 'ing91789178',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    timezone: 'Asia/seoul'
})

module.exports = pool