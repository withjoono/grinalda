/**
 * DB 스키마 마이그레이션: Entity 정의에 맞춰 auth_member 스키마 업데이트
 * 
 * 변경 사항:
 * 1. auth_member.id: bigint → varchar(30)
 * 2. 모든 FK 참조 컬럼: bigint → varchar(30) 
 * 3. 누락된 컬럼 추가: user_type_code, user_type_detail_code, reg_year, reg_month, reg_day
 * 4. 서브 프로필 테이블 생성: auth_member_s, auth_member_t, auth_member_p
 * 5. 기존 bigint ID → varchar 변환
 */

const pg = require('pg');
const fs = require('fs');

const c = new pg.Client({
    host: '127.0.0.1', port: 5432, user: 'tsuser',
    password: 'tsuser1234', database: 'geobukschool_dev'
});

const logs = [];
function log(msg) { logs.push(msg); console.log(msg); }

async function migrate() {
    try {
        await c.connect();
        log('✅ Connected to database');

        // =============================================
        // Step 0: 기존 데이터 백업 (안전용)
        // =============================================
        log('\n📋 Step 0: Backing up existing member data...');
        const members = await c.query('SELECT * FROM auth_member ORDER BY id');
        log(`  Found ${members.rows.length} members`);
        fs.writeFileSync(
            'scripts/auth_member_backup.json',
            JSON.stringify(members.rows, null, 2)
        );
        log('  Backup saved to scripts/auth_member_backup.json');

        await c.query('BEGIN');
        log('\n🔄 Transaction started');

        // =============================================
        // Step 1: FK 제약조건 모두 드롭
        // =============================================
        log('\n📋 Step 1: Dropping FK constraints referencing auth_member.id...');
        const fks = await c.query(`
      SELECT tc.constraint_name, tc.table_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'auth_member'
        AND ccu.column_name = 'id'
    `);

        for (const fk of fks.rows) {
            log(`  Dropping: ${fk.table_name} -> ${fk.constraint_name}`);
            await c.query(`ALTER TABLE "${fk.table_name}" DROP CONSTRAINT "${fk.constraint_name}"`);
        }
        log(`  Dropped ${fks.rows.length} FK constraints`);

        // =============================================
        // Step 2: PK 및 인덱스 드롭
        // =============================================
        log('\n📋 Step 2: Dropping PK, unique constraints, and indexes on auth_member...');

        // Drop ALL constraints on auth_member first (unique, pk — NOT 'not null' or 'check')
        const allConstraints = await c.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'auth_member'
        AND constraint_type IN ('UNIQUE', 'PRIMARY KEY', 'FOREIGN KEY')
      ORDER BY CASE constraint_type
        WHEN 'FOREIGN KEY' THEN 1
        WHEN 'UNIQUE' THEN 2
        WHEN 'PRIMARY KEY' THEN 3
        ELSE 4
      END
    `);
        for (const ct of allConstraints.rows) {
            try {
                await c.query(`ALTER TABLE auth_member DROP CONSTRAINT "${ct.constraint_name}"`);
                log(`  Dropped ${ct.constraint_type}: ${ct.constraint_name}`);
            } catch (e) { log(`  (skip ${ct.constraint_name}) ${e.message}`); }
        }

        // Drop remaining indexes (non-constraint based)
        const indexes = await c.query(`
      SELECT indexname FROM pg_indexes 
      WHERE tablename = 'auth_member' 
        AND indexname NOT LIKE 'pg_%'
    `);
        for (const idx of indexes.rows) {
            try {
                await c.query(`DROP INDEX IF EXISTS "${idx.indexname}"`);
                log(`  Dropped index: ${idx.indexname}`);
            } catch (e) { log(`  (skip ${idx.indexname}) ${e.message}`); }
        }
        // Drop sequence default
        await c.query("ALTER TABLE auth_member ALTER COLUMN id DROP DEFAULT");
        log('  Dropped id default (sequence)');

        // =============================================
        // Step 3: auth_member.id를 varchar(30)로 변경
        // =============================================
        log('\n📋 Step 3: Changing auth_member.id from bigint to varchar(30)...');
        await c.query('ALTER TABLE auth_member ALTER COLUMN id TYPE varchar(30) USING id::text');
        log('  Changed auth_member.id to varchar(30)');

        // Re-add PK
        await c.query('ALTER TABLE auth_member ADD PRIMARY KEY (id)');
        log('  Re-added PK on auth_member.id');

        // =============================================
        // Step 4: 기존 ID를 새 형식으로 변환
        // =============================================
        log('\n📋 Step 4: Converting existing IDs to new format...');
        const existingMembers = await c.query('SELECT id, member_type FROM auth_member ORDER BY id');
        for (const m of existingMembers.rows) {
            const oldId = m.id;
            // 기존 bigint ID를 그대로 문자열로: 호환성 위해 유지 (새 가입자부터 새 형식 사용)
            const newId = `LEGACY${String(oldId).padStart(6, '0')}`;
            await c.query('UPDATE auth_member SET id = $1 WHERE id = $2', [newId, oldId]);
            log(`  ${oldId} -> ${newId}`);
        }

        // =============================================
        // Step 5: FK 참조 컬럼들을 varchar(30)로 변경
        // =============================================
        log('\n📋 Step 5: Changing FK reference columns to varchar(30)...');

        // 모든 FK 참조 컬럼 수집 (이미 드롭된 상태이므로 컬럼 타입만 변경)
        const refColumns = [
            ['susi_user_calculated_scores', 'member_id'],
            ['oauth_authorization_codes', 'memberId'],
            ['hub_app_subscriptions', 'member_id'],
            ['ss_user_university_interest', 'member_id'],
            ['sgb_attendance', 'member_id'],
            ['sgb_select_subject', 'member_id'],
            ['sgb_subject_learning', 'member_id'],
            ['sgb_volunteer', 'member_id'],
            ['js_sunung_raw_score', 'member_id'],
            ['js_sunung_standard_score', 'member_id'],
            ['js_pyunggawon_raw_score', 'member_id'],
            ['sgb_sport_art', 'member_id'],
            ['board_comment', 'member_id'],
            ['board_post', 'member_id'],
            ['ss_user_application_combination', 'member_id'],
            ['js_user_university_interest', 'member_id'],
            ['officer_list_tb', 'member_id'],
            ['payment_order', 'member_id'],
            ['js_user_application_combination', 'member_id'],
            ['js_user_calculated_scores', 'member_id'],
            ['js_user_input_scores', 'member_id'],
            ['js_user_recruitment_scores', 'member_id'],
            ['js_user_hwansan_score', 'member_id'],
            ['tr_temp_code', 'member_id'],
            ['tr_account_link', 'member_id'],
            ['tr_account_link', 'linked_member_id'],
            ['tr_admin_class', 'member_id'],
            ['tr_admin_class', 'target_member_id'],
            ['pl_plan', 'member_id'],
            ['pl_item', 'member_id'],
            ['pl_routine', 'member_id'],
            ['pl_class', 'planner_id'],
            ['pl_management', 'member_id'],
            ['pl_management', 'planner_id'],
            ['pl_notice', 'planner_id'],
            ['mc_health_record', 'member_id'],
            ['mc_consultation', 'member_id'],
            ['mc_consultation', 'mentor_id'],
            ['mc_attendance', 'member_id'],
            ['mc_test', 'member_id'],
            ['user_notification_settings', 'member_id'],
            ['user_notification_types', 'member_id'],
            ['notification_logs', 'member_id'],
            ['mentoring_temp_code_tb', 'member_id'],
            ['mentoring_account_link_tb', 'member_id'],
            ['mentoring_account_link_tb', 'linked_member_id'],
            ['ts_member_calculated_scores', 'member_id'],
            ['ts_member_jungsi_input_scores', 'member_id'],
            ['susi_user_recruitment_scores', 'member_id'],
        ];

        // Deduplicate
        const seen = new Set();
        const uniqueRefs = refColumns.filter(([t, col]) => {
            const key = `${t}.${col}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        for (const [table, col] of uniqueRefs) {
            try {
                // 1. 먼저 컬럼 타입을 varchar(30)로 변경 (bigint → text 캐스팅)
                await c.query(`ALTER TABLE "${table}" ALTER COLUMN "${col}" TYPE varchar(30) USING "${col}"::text`);
                // 2. 그 다음 데이터를 LEGACY 형식으로 변환
                await c.query(`UPDATE "${table}" SET "${col}" = 'LEGACY' || LPAD("${col}", 6, '0') WHERE "${col}" IS NOT NULL AND "${col}" != ''`);
                log(`  ✓ ${table}.${col}`);
            } catch (e) {
                log(`  ✗ ${table}.${col}: ${e.message}`);
            }
        }

        // =============================================
        // Step 6: FK 제약조건 재생성 
        // =============================================
        log('\n📋 Step 6: Re-creating FK constraints...');
        for (const fk of fks.rows) {
            // FK의 원본 컬럼 찾기
            const colInfo = await c.query(`
        SELECT kcu.column_name 
        FROM information_schema.key_column_usage kcu
        WHERE kcu.constraint_name = $1
      `, [fk.constraint_name]);

            // 이미 드롭된 constraint이므로 이 쿼리는 빈 결과를 반환함
            // 대신 uniqueRefs에서 매핑하여 재생성
        }

        // FK 재생성 (uniqueRefs 기반)
        for (const [table, col] of uniqueRefs) {
            try {
                const constraintName = `FK_${table}_${col}_auth_member`;
                await c.query(`
          ALTER TABLE "${table}" 
          ADD CONSTRAINT "${constraintName}" 
          FOREIGN KEY ("${col}") REFERENCES auth_member(id) 
          ON DELETE CASCADE
        `);
                log(`  ✓ ${constraintName}`);
            } catch (e) {
                log(`  ✗ FK on ${table}.${col}: ${e.message}`);
            }
        }

        // =============================================
        // Step 7: 누락된 컬럼 추가
        // =============================================
        log('\n📋 Step 7: Adding missing columns to auth_member...');
        const addColumns = [
            ["user_type_code", "varchar(5)"],
            ["user_type_detail_code", "varchar(5)"],
            ["reg_year", "int"],
            ["reg_month", "varchar(2)"],
            ["reg_day", "varchar(2)"],
        ];

        for (const [colName, colType] of addColumns) {
            const exists = await c.query(
                "SELECT 1 FROM information_schema.columns WHERE table_name = 'auth_member' AND column_name = $1",
                [colName]
            );
            if (exists.rows.length === 0) {
                await c.query(`ALTER TABLE auth_member ADD COLUMN "${colName}" ${colType}`);
                log(`  Added: ${colName} (${colType})`);
            } else {
                log(`  Exists: ${colName}`);
            }
        }

        // =============================================
        // Step 8: 서브 프로필 테이블 생성
        // =============================================
        log('\n📋 Step 8: Creating sub-profile tables...');

        // auth_member_s (학생 프로필)
        await c.query(`
      CREATE TABLE IF NOT EXISTS auth_member_s (
        member_id varchar(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        school_code varchar(20),
        school_name varchar(100),
        school_location varchar(50),
        school_type varchar(50),
        school_level varchar(10),
        grade int
      )
    `);
        log('  Created: auth_member_s (학생 프로필)');

        // auth_member_t (교사 프로필)
        await c.query(`
      CREATE TABLE IF NOT EXISTS auth_member_t (
        member_id varchar(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        school_level varchar(10),
        subject varchar(100)
      )
    `);
        log('  Created: auth_member_t (교사 프로필)');

        // auth_member_p (학부모 프로필)
        await c.query(`
      CREATE TABLE IF NOT EXISTS auth_member_p (
        member_id varchar(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        parent_type varchar(20)
      )
    `);
        log('  Created: auth_member_p (학부모 프로필)');

        // =============================================
        // Step 9: 인덱스 재생성
        // =============================================
        log('\n📋 Step 9: Recreating indexes...');

        // email, phone, oauth_id 복합 인덱스 (Unique가 아닌 일반 인덱스로 - 동일 이메일+다른 provider 허용)
        await c.query('CREATE INDEX IF NOT EXISTS "IDX_auth_member_email_phone_oauth" ON auth_member (email, phone, oauth_id)');
        log('  Created: IDX_auth_member_email_phone_oauth');

        // firebase_uid 인덱스 (이미 존재할 수 있음)
        await c.query('CREATE INDEX IF NOT EXISTS "idx_member_firebase_uid" ON auth_member (firebase_uid)');
        log('  Created: idx_member_firebase_uid');

        // =============================================
        // Step 10: sequence 정리
        // =============================================
        log('\n📋 Step 10: Dropping unused sequence...');
        try {
            await c.query('DROP SEQUENCE IF EXISTS auth_member_id_seq');
            log('  Dropped: auth_member_id_seq');
        } catch (e) {
            log(`  (skip) ${e.message}`);
        }

        // =============================================
        // Commit
        // =============================================
        await c.query('COMMIT');
        log('\n✅ Migration completed successfully!');

        // =============================================
        // Verification
        // =============================================
        log('\n📋 Verification:');

        const verifyId = await c.query("SELECT id, pg_typeof(id) as id_type FROM auth_member LIMIT 3");
        verifyId.rows.forEach(r => log(`  id=${r.id} | type=${r.id_type}`));

        const verifyTables = await c.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name IN ('auth_member_s', 'auth_member_t', 'auth_member_p')
    `);
        verifyTables.rows.forEach(r => log(`  Table exists: ${r.table_name}`));

        // Test varchar ID insert
        try {
            await c.query('BEGIN');
            await c.query(`
        INSERT INTO auth_member (id, email, password, role_type, phone, ck_sms, ck_sms_agree, member_type, account_stop_yn)
        VALUES ('S26H208099', 'migration-test@test.com', 'hash', 'ROLE_USER', '010', b'0', b'0', 'student', 'N')
      `);
            log('  ✅ VARCHAR ID insert: SUCCESS');
            await c.query('ROLLBACK');
            log('  (rolled back test insert)');
        } catch (e) {
            log(`  ❌ VARCHAR ID insert: FAILED - ${e.message}`);
            await c.query('ROLLBACK');
        }

    } catch (e) {
        log(`\n❌ ERROR: ${e.message}`);
        log(e.stack);
        try { await c.query('ROLLBACK'); log('Rolled back transaction'); } catch (_) { }
    } finally {
        await c.end();
        fs.writeFileSync('scripts/migration-log.txt', logs.join('\n'));
        console.log('\nFull log saved to scripts/migration-log.txt');
    }
}

migrate();
