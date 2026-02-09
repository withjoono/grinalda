/**
 * auth_member 테이블 레거시 칼럼 제거
 * 
 * Entity에 정의되지 않은 옛날 칼럼들을 제거합니다:
 * - expiration_period (integer)
 * - introduction (varchar 255)
 * - address (varchar 500)
 * - s_type_id (bigint) - 옛날 FK, 더 이상 사용 안 함
 * - hst_type_id (bigint) - 옛날 FK, 더 이상 사용 안 함
 * - g_type_id (bigint) - 옛날 FK, 더 이상 사용 안 함
 * - graduate_year (varchar 500)
 * - major (varchar 500)
 */
const { Client } = require('pg');

const LEGACY_COLUMNS = [
    'expiration_period',
    'introduction',
    'address',
    's_type_id',
    'hst_type_id',
    'g_type_id',
    'graduate_year',
    'major',
];

async function main() {
    const c = new Client({
        host: 'localhost',
        port: 5432,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_dev',
    });

    await c.connect();
    console.log('Connected to database\n');

    // 1. 현재 auth_member 칼럼 목록 확인
    const before = await c.query(`
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'auth_member'
    ORDER BY ordinal_position
  `);
    console.log('=== 변경 전 auth_member 칼럼 (%d개) ===', before.rows.length);
    before.rows.forEach(r => {
        const len = r.character_maximum_length ? `(${r.character_maximum_length})` : '';
        const isLegacy = LEGACY_COLUMNS.includes(r.column_name) ? ' ❌ LEGACY - 삭제 예정' : '';
        console.log(`  ${r.column_name}: ${r.data_type}${len}${isLegacy}`);
    });

    // 2. 레거시 칼럼에 FK 제약조건이 있으면 먼저 제거
    await c.query('BEGIN');
    try {
        for (const col of LEGACY_COLUMNS) {
            // 칼럼이 존재하는지 확인
            const exists = await c.query(`
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'auth_member' AND column_name = $1
      `, [col]);

            if (exists.rows.length === 0) {
                console.log(`  ⏭️ ${col}: 이미 없음 (스킵)`);
                continue;
            }

            // FK 제약조건 확인 및 제거
            const fks = await c.query(`
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'auth_member'
          AND kcu.column_name = $1
          AND tc.table_schema = 'public'
      `, [col]);

            for (const fk of fks.rows) {
                console.log(`  🔗 FK 제거: ${fk.constraint_name}`);
                await c.query(`ALTER TABLE auth_member DROP CONSTRAINT "${fk.constraint_name}"`);
            }

            // 칼럼 삭제
            await c.query(`ALTER TABLE auth_member DROP COLUMN "${col}"`);
            console.log(`  ✅ ${col} 삭제 완료`);
        }

        await c.query('COMMIT');
        console.log('\n✅ 레거시 칼럼 제거 완료!');
    } catch (e) {
        await c.query('ROLLBACK');
        console.error('\n❌ 실패, 롤백됨:', e.message);
        throw e;
    }

    // 3. 변경 후 칼럼 확인
    const after = await c.query(`
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'auth_member'
    ORDER BY ordinal_position
  `);
    console.log('\n=== 변경 후 auth_member 칼럼 (%d개) ===', after.rows.length);
    after.rows.forEach(r => {
        const len = r.character_maximum_length ? `(${r.character_maximum_length})` : '';
        console.log(`  ${r.column_name}: ${r.data_type}${len}`);
    });

    await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
