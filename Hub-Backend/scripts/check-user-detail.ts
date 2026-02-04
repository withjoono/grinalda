
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

        const email = 'withjuno6@naver.com';
        const uid = '9Dnp9dhZubQKXhE6eI3kKztEqRD3';

        // Check user by email
        const res = await client.query('SELECT id, email, firebase_uid, provider_type, phone FROM auth_member WHERE email = $1', [email]);
        if (res.rows.length > 0) {
            console.log('User found by email:', res.rows[0]);
        } else {
            console.log('User NOT found by email.');
        }

        // Check user by UID
        const resUid = await client.query('SELECT id, email, firebase_uid FROM auth_member WHERE firebase_uid = $1', [uid]);
        console.log(`User found by Firebase UID (${uid}):`, resUid.rowCount);
        if (resUid.rows.length > 0) {
            console.log('User Details by UID:', resUid.rows[0]);
        }

    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await client.end();
    }
}

checkUser();
