/**
 * StudyArena용 sa_auth_member 테이블 추가 생성
 * 실행: node scripts/create-sa-auth-member.js
 */
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const c = new Client({
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'tsuser',
        password: process.env.DB_PASSWORD || 'tsuser1234',
        database: process.env.DB_NAME || 'geobukschool_dev',
    });
    await c.connect();

    const exists = await c.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='sa_auth_member')`);
    if (exists.rows[0].exists) {
        console.log('⚠️  sa_auth_member 이미 존재');
    } else {
        await c.query(`
      CREATE TABLE sa_auth_member (
        sa_auth_id    VARCHAR(30) PRIMARY KEY,
        nickname      VARCHAR(255),
        email         VARCHAR(500),
        member_type   VARCHAR(20),
        phone         VARCHAR(255),
        created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_sa_auth_member_hub_member
          FOREIGN KEY (sa_auth_id) REFERENCES auth_member(id) ON DELETE CASCADE
      )
    `);
        console.log('✅ sa_auth_member (StudyArena) 생성 완료');
    }
    await c.end();
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
