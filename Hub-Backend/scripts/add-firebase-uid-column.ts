
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

async function addColumn() {
    try {
        await client.connect();
        console.log('Connected to database!');

        // Add column
        const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'auth_member' AND column_name = 'firebase_uid';
    `;
        const checkRes = await client.query(checkQuery);

        if (checkRes.rowCount === 0) {
            console.log('Adding firebase_uid column...');
            await client.query(`ALTER TABLE auth_member ADD COLUMN firebase_uid VARCHAR(128)`);
            console.log('Column added.');

            console.log('Adding index idx_member_firebase_uid...');
            await client.query(`CREATE INDEX idx_member_firebase_uid ON auth_member (firebase_uid)`);
            console.log('Index created.');
        } else {
            console.log('Column firebase_uid already exists.');
        }

    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await client.end();
    }
}

addColumn();
