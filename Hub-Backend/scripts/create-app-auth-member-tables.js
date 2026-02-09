/**
 * Hub auth_member + 서브테이블 + 앱별 auth_member 테이블 생성
 * 
 * Step 1: Hub 핵심 테이블 생성 (없을 경우)
 *   - auth_member (메인 회원 테이블)
 *   - auth_member_s (학생 프로필)
 *   - auth_member_t (선생님 프로필)
 *   - auth_member_p (학부모 프로필)
 * 
 * Step 2: 앱별 auth_member 테이블 생성
 *   - ss_auth_member (수시)
 *   - js_auth_member (정시)
 *   - pl_auth_member (플래너)
 *   - eh_auth_member (ExamHub)
 *   - tb_auth_member (TutorBoard)
 * 
 * 실행: node scripts/create-app-auth-member-tables.js
 */

const { Client } = require('pg');
require('dotenv').config();

const APP_TABLES = [
  { prefix: 'ss', name: '수시 (Susi)' },
  { prefix: 'js', name: '정시 (Jungsi)' },
  { prefix: 'pl', name: '플래너 (StudyPlanner)' },
  { prefix: 'eh', name: 'ExamHub' },
  { prefix: 'tb', name: 'TutorBoard' },
];

async function tableExists(client, tableName) {
  const r = await client.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name=$1)`,
    [tableName]
  );
  return r.rows[0].exists;
}

async function createHubCoreTables(client) {
  console.log('=== Step 1: Hub 핵심 테이블 생성 ===\n');

  // 1. auth_member
  if (await tableExists(client, 'auth_member')) {
    console.log('  ⚠️  auth_member — 이미 존재');
  } else {
    await client.query(`
      CREATE TABLE auth_member (
        id                    VARCHAR(30) PRIMARY KEY,
        email                 VARCHAR(500) NOT NULL,
        password              VARCHAR(500),
        role_type             VARCHAR(500),
        phone                 VARCHAR(255),
        ck_sms                BIT(1),
        ck_sms_agree          BIT(1),
        nickname              VARCHAR(255),
        member_type           VARCHAR(20),
        profile_image_url     VARCHAR(4000),
        provider_type         VARCHAR(20),
        oauth_id              VARCHAR(500),
        account_stop_yn       VARCHAR(1),
        create_dt             TIMESTAMP,
        update_dt             TIMESTAMP,
        firebase_uid          VARCHAR(128),
        user_type_code        VARCHAR(5),
        user_type_detail_code VARCHAR(5),
        reg_year              INTEGER,
        reg_month             VARCHAR(2),
        reg_day               VARCHAR(2)
      )
    `);
    // 인덱스 생성
    await client.query(`CREATE INDEX idx_auth_member_email_phone_oauth ON auth_member (email, phone, oauth_id)`);
    console.log('  ✅ auth_member — 생성 완료 (21 columns)');
  }

  // 2. auth_member_s (학생 프로필)
  if (await tableExists(client, 'auth_member_s')) {
    console.log('  ⚠️  auth_member_s — 이미 존재');
  } else {
    await client.query(`
      CREATE TABLE auth_member_s (
        member_id       VARCHAR(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        school_code     VARCHAR(20),
        school_name     VARCHAR(100),
        school_location VARCHAR(50),
        school_type     VARCHAR(50),
        school_level    VARCHAR(10),
        grade           INTEGER
      )
    `);
    console.log('  ✅ auth_member_s — 생성 완료 (학생 프로필)');
  }

  // 3. auth_member_t (선생님 프로필)
  if (await tableExists(client, 'auth_member_t')) {
    console.log('  ⚠️  auth_member_t — 이미 존재');
  } else {
    await client.query(`
      CREATE TABLE auth_member_t (
        member_id    VARCHAR(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        school_level VARCHAR(10),
        subject      VARCHAR(50)
      )
    `);
    console.log('  ✅ auth_member_t — 생성 완료 (선생님 프로필)');
  }

  // 4. auth_member_p (학부모 프로필)
  if (await tableExists(client, 'auth_member_p')) {
    console.log('  ⚠️  auth_member_p — 이미 존재');
  } else {
    await client.query(`
      CREATE TABLE auth_member_p (
        member_id   VARCHAR(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        parent_type VARCHAR(20)
      )
    `);
    console.log('  ✅ auth_member_p — 생성 완료 (학부모 프로필)');
  }
}

async function createAppAuthMemberTables(client) {
  console.log('\n=== Step 2: 앱별 auth_member 테이블 생성 ===\n');

  for (const app of APP_TABLES) {
    const tableName = `${app.prefix}_auth_member`;
    const pkCol = `${app.prefix}_auth_id`;

    if (await tableExists(client, tableName)) {
      console.log(`  ⚠️  ${tableName} (${app.name}) — 이미 존재`);
      continue;
    }

    await client.query(`
      CREATE TABLE ${tableName} (
        ${pkCol}        VARCHAR(30) PRIMARY KEY,
        nickname        VARCHAR(255),
        email           VARCHAR(500),
        member_type     VARCHAR(20),
        phone           VARCHAR(255),
        created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        
        CONSTRAINT fk_${tableName}_hub_member
          FOREIGN KEY (${pkCol}) REFERENCES auth_member(id)
          ON DELETE CASCADE
      )
    `);
    console.log(`  ✅ ${tableName} (${app.name}) — 생성 완료 (PK: ${pkCol})`);
  }
}

async function verifyResults(client) {
  console.log('\n=== 전체 테이블 확인 ===\n');

  const allTables = [
    'auth_member', 'auth_member_s', 'auth_member_t', 'auth_member_p',
    ...APP_TABLES.map(a => `${a.prefix}_auth_member`)
  ];

  for (const table of allTables) {
    const cols = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [table]);

    if (cols.rows.length === 0) {
      console.log(`  ❌ ${table} — 없음!`);
      continue;
    }

    console.log(`  📋 ${table} (${cols.rows.length} columns):`);
    for (const col of cols.rows) {
      const len = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
      console.log(`     ${col.column_name}: ${col.data_type}${len}`);
    }
    console.log('');
  }
}

async function main() {
  const client = new Client({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'tsuser',
    password: process.env.DB_PASSWORD || 'tsuser1234',
    database: process.env.DB_NAME || 'geobukschool_dev',
  });

  try {
    await client.connect();
    console.log('✅ DB 연결 성공\n');

    await createHubCoreTables(client);
    await createAppAuthMemberTables(client);
    await verifyResults(client);

  } catch (error) {
    console.error('❌ 에러:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 DB 연결 종료');
  }
}

main();
