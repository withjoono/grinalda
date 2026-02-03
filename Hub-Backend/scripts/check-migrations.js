
const { Client } = require('pg');
const { execSync } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

console.log(`Loaded env file: ${envFile}`);
console.log('DB Config:', {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

console.log('🔍 마이그레이션 상태 확인 중...\n');

// 1. TypeORM CLI Check
try {
  execSync('yarn typeorm migration:show 2>&1', {
    encoding: 'utf8',
    cwd: path.join(__dirname, '..'),
    stdio: 'ignore'
  });
  console.log('✅ TypeORM CLI 정상 작동');
} catch (e) {
  console.log('⚠️  TypeORM CLI 확인 실패 (무시 가능)');
}

async function checkDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();

    // 2. Check Valid Migrations
    console.log('\n✅ 실행된 마이그레이션 (최근 5개):');
    const historyRes = await client.query(
      'SELECT id, name FROM typeorm_migrations ORDER BY id DESC LIMIT 5'
    );

    if (historyRes.rows.length === 0) {
      console.log('  (없음)');
    } else {
      console.table(historyRes.rows);
    }

    // Debug: List all columns
    console.log('DEBUG: Listing all columns for auth_member:');
    const allCols = await client.query(
      "SELECT column_name, table_schema FROM information_schema.columns WHERE table_name = 'auth_member'"
    );
    console.table(allCols.rows);

    // 3. Check firebase_uid Column (Safe Select Method)
    console.log('\n🔍 firebase_uid 컬럼 상태:');
    try {
      const res = await client.query('SELECT * FROM auth_member LIMIT 1');

      // Check if column exists in fields/metadata
      const fieldExists = res.fields.some(f => f.name === 'firebase_uid');

      if (fieldExists) {
        console.log('✅ 컬럼 존재 (확인됨)');
        console.log('\n✅ 모든 마이그레이션이 정상적으로 적용되었습니다!');
      } else {
        console.log('❌ firebase_uid 컬럼이 없습니다! (필드 목록에 없음)');
        // process.exit(1); // Temporarily allow passing if this is just a false positive, but better to fail if truly missing
        // User wants fundamental fix: if it's missing, fail.
        throw new Error('Column missing');
      }

    } catch (err) {
      console.log('❌ 체크 실패:', err.message);
      console.log('\n해결 방법:');
      console.log('1. yarn typeorm:revert (마지막 마이그레이션 롤백)');
      console.log('2. yarn typeorm:run (다시 실행)');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 데이터베이스 연결 또는 쿼리 실패:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkDatabase();
