
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.development
dotenv.config({ path: path.resolve(__dirname, '../.env.development') });

const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function checkUser() {
    try {
        await client.connect();
        console.log('Connected to database!');

        const email = 'withjuno6@naver.com';
        const query = `SELECT * FROM auth_member WHERE email = $1`;
        const res = await client.query(query, [email]);

        console.log(`User found:`, res.rowCount);
        if (res.rows.length > 0) {
            // Explicitly check key
            const row = res.rows[0];
            const hasUid = 'firebase_uid' in row;
            console.log(`CHECK_RESULT: firebase_uid column exists: ${hasUid}`);
            console.log(`CHECK_RESULT: firebase_uid value: ${row.firebase_uid}`);
            console.log('User Details:', JSON.stringify(res.rows[0], null, 2));
        } else {
            console.log('User NOT found via email search.');
        }

        const uid = '9Dnp9dhZubQKXhE6eI3kKztEqRD3';
        const queryUid = `SELECT * FROM auth_member WHERE firebase_uid = $1`;
        const resUid = await client.query(queryUid, [uid]);
        console.log(`User found by Firebase UID:`, resUid.rowCount);
        if (resUid.rows.length > 0) {
            console.log('User Details by UID:', JSON.stringify(resUid.rows[0], null, 2));
        }


    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await client.end();
    }
}

checkUser();
