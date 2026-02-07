const pg = require('pg');
const client = new pg.Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'tsuser',
    password: 'tsuser1234',
    database: 'geobukschool_dev',
});

async function run() {
    await client.connect();
    console.log('Connected to database');

    // 1. mentoring_temp_code_tb (초대 코드 테이블) 생성
    await client.query(`
    CREATE TABLE IF NOT EXISTS "mentoring_temp_code_tb" (
      "id" BIGSERIAL PRIMARY KEY,
      "member_id" BIGINT NOT NULL,
      "code" VARCHAR(255) NOT NULL,
      "return_url" VARCHAR(1000) NULL,
      "status" VARCHAR(20) DEFAULT 'pending',
      "expire_at" TIMESTAMP NOT NULL,
      "created_at" TIMESTAMP DEFAULT now(),
      CONSTRAINT "FK_mentoring_temp_code_member" 
        FOREIGN KEY ("member_id") REFERENCES "auth_member"("id") ON DELETE CASCADE
    )
  `);
    console.log('Created mentoring_temp_code_tb');

    // 인덱스 생성
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_mentoring_temp_code_code" ON "mentoring_temp_code_tb" ("code")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_mentoring_temp_code_expire_at" ON "mentoring_temp_code_tb" ("expire_at")`);
    console.log('Created indexes for mentoring_temp_code_tb');

    // 2. mentoring_account_link_tb (계정 연동 테이블) 생성
    await client.query(`
    CREATE TABLE IF NOT EXISTS "mentoring_account_link_tb" (
      "id" BIGSERIAL PRIMARY KEY,
      "member_id" BIGINT NOT NULL,
      "linked_member_id" BIGINT NOT NULL,
      "created_at" TIMESTAMP DEFAULT now(),
      CONSTRAINT "FK_mentoring_link_member" 
        FOREIGN KEY ("member_id") REFERENCES "auth_member"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_mentoring_link_linked_member" 
        FOREIGN KEY ("linked_member_id") REFERENCES "auth_member"("id") ON DELETE CASCADE
    )
  `);
    console.log('Created mentoring_account_link_tb');

    // 인덱스 생성
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_mentoring_account_link_member_id" ON "mentoring_account_link_tb" ("member_id")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "IDX_mentoring_account_link_linked_member_id" ON "mentoring_account_link_tb" ("linked_member_id")`);
    console.log('Created indexes for mentoring_account_link_tb');

    await client.end();
    console.log('Migration complete!');
}

run().catch(e => { console.error(e); process.exit(1); });
