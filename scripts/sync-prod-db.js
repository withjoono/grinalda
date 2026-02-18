/**
 * Docker DB 스키마 덤프를 운영 DB에 적용하는 스크립트
 * 
 * 1. 운영 DB의 기존 스키마/테이블 확인
 * 2. 충돌되는 테이블 DROP (사용자 데이터 삭제 허용됨)
 * 3. Docker 덤프를 운영 DB에 적용
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
    const client = new Client({
        host: '34.64.165.158',
        port: 5432,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_dev',
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('✅ 운영 DB 연결 성공');

        // 1. 운영 DB 현재 상태 확인
        const schemas = await client.query(`
      SELECT schema_name FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name
    `);
        console.log('\n📋 운영 DB 현재 스키마:');
        schemas.rows.forEach(r => console.log('  -', r.schema_name));

        const tables = await client.query(`
      SELECT table_schema, table_name FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `);
        console.log(`\n📋 운영 DB 현재 테이블 (${tables.rows.length}개):`);
        tables.rows.forEach(r => console.log(`  - ${r.table_schema}.${r.table_name}`));

        // 2. 기존 스키마들을 CASCADE로 삭제 (사용자 데이터 삭제 허용됨)
        // hub 스키마는 주의 필요 - 기존 데이터가 있을 수 있음
        const schemasToDropAndRecreate = [
            'jungsi',    // 방금 만든 4개 테이블만 있음
            'susi',      // 없음
            'examhub',   // 없음
            'mysanggibu', // 없음
            'studyarena', // 없음
            'studyplanner', // 없음
            'tutorboard',  // 없음
        ];

        for (const schema of schemasToDropAndRecreate) {
            const exists = schemas.rows.some(r => r.schema_name === schema);
            if (exists) {
                console.log(`\n🗑️ ${schema} 스키마 삭제 중 (CASCADE)...`);
                await client.query(`DROP SCHEMA "${schema}" CASCADE`);
                console.log(`✅ ${schema} 스키마 삭제 완료`);
            }
        }

        // hub, teacher_admin, public 스키마는 유지하되 충돌 테이블만 처리
        // pg_dump에서 CREATE TABLE IF NOT EXISTS를 쓰지 않기 때문에
        // hub의 기존 테이블도 삭제 필요 (사용자 데이터 삭제 허용됨)
        console.log('\n🗑️ hub 스키마 테이블 삭제 중...');
        const hubTables = tables.rows.filter(r => r.table_schema === 'hub');
        for (const t of hubTables) {
            try {
                await client.query(`DROP TABLE IF EXISTS "hub"."${t.table_name}" CASCADE`);
            } catch (e) {
                console.log(`  ⚠️ hub.${t.table_name} 삭제 실패: ${e.message}`);
            }
        }
        console.log('✅ hub 테이블 삭제 완료');

        console.log('\n🗑️ teacher_admin 스키마 테이블 삭제 중...');
        const taTables = tables.rows.filter(r => r.table_schema === 'teacher_admin');
        for (const t of taTables) {
            try {
                await client.query(`DROP TABLE IF EXISTS "teacher_admin"."${t.table_name}" CASCADE`);
            } catch (e) {
                console.log(`  ⚠️ teacher_admin.${t.table_name} 삭제 실패: ${e.message}`);
            }
        }
        console.log('✅ teacher_admin 테이블 삭제 완료');

        // hub, teacher_admin의 기존 시퀀스, 타입도 제거
        const seqs = await client.query(`
      SELECT sequence_schema, sequence_name FROM information_schema.sequences
      WHERE sequence_schema IN ('hub', 'teacher_admin')
    `);
        for (const s of seqs.rows) {
            try {
                await client.query(`DROP SEQUENCE IF EXISTS "${s.sequence_schema}"."${s.sequence_name}" CASCADE`);
            } catch (e) { /* ignore */ }
        }

        // 기존 ENUM TYPE 삭제
        const types = await client.query(`
      SELECT n.nspname as schema, t.typname as name
      FROM pg_type t
      JOIN pg_namespace n ON t.typnamespace = n.oid
      WHERE n.nspname IN ('hub', 'teacher_admin', 'public')
      AND t.typtype = 'e'
    `);
        for (const t of types.rows) {
            try {
                await client.query(`DROP TYPE IF EXISTS "${t.schema}"."${t.name}" CASCADE`);
            } catch (e) { /* ignore */ }
        }

        // 3. Docker 덤프 적용
        console.log('\n🔨 Docker 스키마 덤프 적용 중...');
        let dumpSql = fs.readFileSync(path.join(__dirname, '..', 'schema_dump.sql'), 'utf8');

        // CREATE SCHEMA를 CREATE SCHEMA IF NOT EXISTS로 변경
        dumpSql = dumpSql.replace(/CREATE SCHEMA (\w+);/g, 'CREATE SCHEMA IF NOT EXISTS $1;');
        dumpSql = dumpSql.replace(/CREATE SCHEMA "([^"]+)";/g, 'CREATE SCHEMA IF NOT EXISTS "$1";');

        // SET search_path, comment 등은 그대로 유지

        // SQL을 구문별로 나누어 실행
        // pg_dump 출력에서 세미콜론으로 구분된 구문 추출
        const statements = [];
        let currentStatement = '';
        const lines = dumpSql.split('\n');

        for (const line of lines) {
            // 주석 건너뛰기
            if (line.startsWith('--') || line.trim() === '') {
                continue;
            }

            currentStatement += line + '\n';

            // 세미콜론으로 끝나면 구문 완성
            if (line.trim().endsWith(';')) {
                statements.push(currentStatement.trim());
                currentStatement = '';
            }
        }

        // 남은 구문이 있으면 추가
        if (currentStatement.trim()) {
            statements.push(currentStatement.trim());
        }

        console.log(`  총 ${statements.length}개 SQL 구문 실행 예정`);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            try {
                await client.query(stmt);
                successCount++;
            } catch (e) {
                errorCount++;
                // 이미 존재하는 객체 에러는 무시
                if (!e.message.includes('already exists') &&
                    !e.message.includes('does not exist') &&
                    !e.message.includes('duplicate key')) {
                    errors.push({ index: i, sql: stmt.substring(0, 100), error: e.message });
                }
            }

            // 진행률 표시 (매 50개)
            if ((i + 1) % 50 === 0) {
                console.log(`  진행: ${i + 1}/${statements.length} (성공: ${successCount}, 에러: ${errorCount})`);
            }
        }

        console.log(`\n📊 적용 결과: 성공 ${successCount}개, 에러 ${errorCount}개`);

        if (errors.length > 0) {
            console.log('\n⚠️ 주요 에러:');
            errors.slice(0, 20).forEach(e => {
                console.log(`  [${e.index}] ${e.sql}...`);
                console.log(`       → ${e.error}`);
            });
        }

        // 4. 최종 확인
        const finalSchemas = await client.query(`
      SELECT schema_name FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name
    `);
        console.log('\n📋 최종 운영 DB 스키마:');
        finalSchemas.rows.forEach(r => console.log('  -', r.schema_name));

        const finalTables = await client.query(`
      SELECT table_schema, count(*) as cnt FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      GROUP BY table_schema
      ORDER BY table_schema
    `);
        console.log('\n📋 스키마별 테이블 수:');
        finalTables.rows.forEach(r => console.log(`  - ${r.table_schema}: ${r.cnt}개`));

        console.log('\n✅ 운영 DB 스키마 동기화 완료!');

    } catch (error) {
        console.error('❌ 에러:', error.message);
        console.error(error.stack);
    } finally {
        await client.end();
    }
}

main();
