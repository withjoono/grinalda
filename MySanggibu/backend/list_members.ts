
import { Client } from 'pg';

const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'tsuser',
    password: 'tsuser1234',
    database: 'geobukschool_dev',
});

async function listMembers() {
    try {
        await client.connect();
        console.log('Connected to database geobukschool_dev');

        console.log('Listing top 5 members from auth_member:');
        const resAuth = await client.query('SELECT id, email, nickname, oauth_id, provider_type FROM auth_member LIMIT 5');
        console.table(resAuth.rows);

        try {
            console.log('Listing top 5 members from ms_auth_member:');
            const resMs = await client.query('SELECT * FROM ms_auth_member LIMIT 5');
            console.table(resMs.rows);
        } catch (e) {
            console.log('Error listing ms_auth_member:', e.message);
        }

    } catch (err) {
        console.error('Error connecting:', err);
    } finally {
        await client.end();
    }
}

listMembers();
