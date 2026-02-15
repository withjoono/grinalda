// Create test accounts in PRODUCTION database
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function main() {
    const client = new Client({
        host: '34.64.165.158',
        port: 5432,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_prod',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000,
    });

    try {
        await client.connect();
        console.log('Connected to PRODUCTION DB (geobukschool_prod)');

        const hashedPassword = await bcrypt.hash('123456', 10);
        console.log('Hashed password generated');

        const accounts = [
            { id: 'S26TEST0001', email: 'student@test.com', nickname: '테스트학생', phone: '010-0000-0001', memberType: 'student', userTypeCode: 'S' },
            { id: 'T26TEST0002', email: 'teacher@test.com', nickname: '테스트선생님', phone: '010-0000-0002', memberType: 'teacher', userTypeCode: 'T' },
            { id: 'P26TEST0003', email: 'parent@test.com', nickname: '테스트학부모', phone: '010-0000-0003', memberType: 'parent', userTypeCode: 'P' },
        ];

        for (const acc of accounts) {
            try {
                const existing = await client.query('SELECT id, email FROM auth_member WHERE email = $1', [acc.email]);
                if (existing.rows.length > 0) {
                    console.log('Already exists:', acc.email, '(id:', existing.rows[0].id + ')');
                    continue;
                }

                await client.query(
                    `INSERT INTO auth_member (id, email, password, role_type, phone, ck_sms, ck_sms_agree, nickname, member_type, provider_type, user_type_code, account_stop_yn, create_dt, update_dt) VALUES ($1, $2, $3, 'USER', $4, B'0', B'0', $5, $6, 'email', $7, 'N', NOW(), NOW())`,
                    [acc.id, acc.email, hashedPassword, acc.phone, acc.nickname, acc.memberType, acc.userTypeCode]
                );
                console.log('Created:', acc.email, '(id:', acc.id + ', type:', acc.memberType + ')');
            } catch (err) {
                console.error('Error creating', acc.email + ':', err.message);
            }
        }

        const result = await client.query("SELECT id, email, nickname, member_type FROM auth_member WHERE email IN ('student@test.com', 'teacher@test.com', 'parent@test.com')");
        console.log('\nTest accounts in PRODUCTION DB:');
        console.table(result.rows);
    } catch (err) {
        console.error('DB connection error:', err.message);
    } finally {
        await client.end();
    }
}

main();
