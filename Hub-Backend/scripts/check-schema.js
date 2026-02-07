const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const c = new Client({ host: '127.0.0.1', port: 5432, user: 'tsuser', password: 'tsuser1234', database: 'geobukschool_dev' });

async function run() {
    await c.connect();

    // Get a member ID to test with
    const members = await c.query(`SELECT id, nickname, member_type FROM auth_member LIMIT 3`);
    console.log('Members:', JSON.stringify(members.rows));

    if (members.rows.length === 0) {
        console.log('No members found!');
        await c.end();
        return;
    }

    const memberId = members.rows[0].id;
    const code = uuidv4();
    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Try inserting directly
    try {
        const result = await c.query(
            `INSERT INTO mentoring_temp_code_tb (member_id, code, return_url, status, expire_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [memberId, code, null, 'pending', expireAt]
        );
        console.log('Insert success:', JSON.stringify(result.rows[0]));
    } catch (e) {
        console.error('Insert failed:', e.message);
    }

    await c.end();
}
run().catch(e => console.error(e));
