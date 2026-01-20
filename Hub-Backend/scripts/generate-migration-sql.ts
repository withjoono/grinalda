#!/usr/bin/env ts-node

/**
 * DB 마이그레이션 SQL 생성 스크립트
 *
 * 기능:
 * 1. 테이블명 변경 SQL 생성
 * 2. 시퀀스명 변경 SQL 생성
 * 3. 외래키 재생성 SQL 생성
 * 4. 롤백 SQL 생성
 *
 * 사용법:
 * npx ts-node scripts/generate-migration-sql.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 매핑 테이블 로드 (정리된 버전 사용)
const mappingPath = path.join(__dirname, '../table-rename-mapping-clean.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

// 전체 매핑을 하나의 객체로 변환
const fullMapping: Record<string, string> = {};
Object.values(mapping).forEach((serviceMapping: any) => {
  Object.assign(fullMapping, serviceMapping);
});

/**
 * 마이그레이션 SQL 생성
 */
function generateMigrationSQL(): string {
  const lines: string[] = [];

  lines.push('-- ====================================================================');
  lines.push('-- 거북스쿨 테이블명 변경 마이그레이션');
  lines.push('-- 생성일: ' + new Date().toISOString());
  lines.push('-- ====================================================================');
  lines.push('');
  lines.push('-- ⚠️ 주의사항:');
  lines.push('-- 1. 실행 전 반드시 데이터베이스 백업');
  lines.push('-- 2. 개발 환경에서 먼저 테스트');
  lines.push('-- 3. 애플리케이션 중지 상태에서 실행');
  lines.push('-- 4. 트랜잭션 사용 권장 (BEGIN; ... COMMIT;)');
  lines.push('');
  lines.push('-- ====================================================================');
  lines.push('-- STEP 1: 외래키 제약조건 조회');
  lines.push('-- ====================================================================');
  lines.push('-- 아래 쿼리로 외래키 목록 확인 후 수동으로 DROP 처리 필요');
  lines.push('');
  lines.push('SELECT');
  lines.push('  tc.constraint_name,');
  lines.push('  tc.table_name AS source_table,');
  lines.push('  kcu.column_name AS source_column,');
  lines.push('  ccu.table_name AS target_table,');
  lines.push('  ccu.column_name AS target_column,');
  lines.push('  rc.delete_rule,');
  lines.push('  rc.update_rule');
  lines.push('FROM information_schema.table_constraints AS tc');
  lines.push('JOIN information_schema.key_column_usage AS kcu');
  lines.push('  ON tc.constraint_name = kcu.constraint_name');
  lines.push('  AND tc.table_schema = kcu.table_schema');
  lines.push('JOIN information_schema.constraint_column_usage AS ccu');
  lines.push('  ON ccu.constraint_name = tc.constraint_name');
  lines.push('  AND ccu.table_schema = tc.table_schema');
  lines.push('JOIN information_schema.referential_constraints AS rc');
  lines.push('  ON tc.constraint_name = rc.constraint_name');
  lines.push('  AND tc.table_schema = rc.constraint_schema');
  lines.push('WHERE tc.constraint_type = \'FOREIGN KEY\'');
  lines.push('  AND (');

  const tableNames = Object.keys(fullMapping);
  tableNames.forEach((tableName, index) => {
    const prefix = index === 0 ? '    ' : '    OR ';
    lines.push(`${prefix}tc.table_name = '${tableName}'`);
  });

  lines.push('  )');
  lines.push('ORDER BY tc.table_name, tc.constraint_name;');
  lines.push('');
  lines.push('-- 위 결과를 바탕으로 아래와 같이 외래키 DROP (예시)');
  lines.push('-- ALTER TABLE source_table DROP CONSTRAINT constraint_name;');
  lines.push('');
  lines.push('');

  lines.push('-- ====================================================================');
  lines.push('-- STEP 2: 인덱스 조회');
  lines.push('-- ====================================================================');
  lines.push('-- 테이블명 변경 시 인덱스도 함께 변경됩니다. 확인용 쿼리:');
  lines.push('');
  lines.push('SELECT');
  lines.push('  schemaname,');
  lines.push('  tablename,');
  lines.push('  indexname,');
  lines.push('  indexdef');
  lines.push('FROM pg_indexes');
  lines.push('WHERE tablename IN (');

  tableNames.forEach((tableName, index) => {
    const suffix = index === tableNames.length - 1 ? '' : ',';
    lines.push(`  '${tableName}'${suffix}`);
  });

  lines.push(')');
  lines.push('ORDER BY tablename, indexname;');
  lines.push('');
  lines.push('');

  lines.push('-- ====================================================================');
  lines.push('-- STEP 3: 트랜잭션 시작');
  lines.push('-- ====================================================================');
  lines.push('BEGIN;');
  lines.push('');
  lines.push('');

  lines.push('-- ====================================================================');
  lines.push('-- STEP 4: 테이블명 변경');
  lines.push('-- ====================================================================');
  lines.push('');

  // 서비스별로 그룹화하여 출력
  Object.entries(mapping).forEach(([servicePrefix, tables]: [string, any]) => {
    const serviceName = {
      auth: '인증/회원',
      sp: 'Study Planner',
      mt: 'Mentoring',
      mc: 'My Class',
      board: '게시판',
      payment: '결제',
      eh: 'Exam Hub',
      ss: '수시 전형',
      js: '정시 전형',
    }[servicePrefix] || servicePrefix;

    lines.push(`-- ${serviceName} (${servicePrefix}_*)`);

    Object.entries(tables).forEach(([oldName, newName]) => {
      lines.push(`ALTER TABLE ${oldName} RENAME TO ${newName};`);
    });

    lines.push('');
  });

  lines.push('');

  lines.push('-- ====================================================================');
  lines.push('-- STEP 5: 시퀀스명 변경 (Primary Key Auto Increment)');
  lines.push('-- ====================================================================');
  lines.push('');

  Object.entries(mapping).forEach(([servicePrefix, tables]: [string, any]) => {
    const serviceName = {
      auth: '인증/회원',
      sp: 'Study Planner',
      mt: 'Mentoring',
      mc: 'My Class',
      board: '게시판',
      payment: '결제',
      eh: 'Exam Hub',
      ss: '수시 전형',
      js: '정시 전형',
    }[servicePrefix] || servicePrefix;

    lines.push(`-- ${serviceName} (${servicePrefix}_*)`);

    Object.entries(tables).forEach(([oldName, newName]) => {
      lines.push(`ALTER SEQUENCE IF EXISTS ${oldName}_id_seq RENAME TO ${newName}_id_seq;`);
    });

    lines.push('');
  });

  lines.push('');

  lines.push('-- ====================================================================');
  lines.push('-- STEP 6: 외래키 제약조건 재생성');
  lines.push('-- ====================================================================');
  lines.push('-- ⚠️ 주의: STEP 1에서 확인한 외래키를 바탕으로 수동 작성 필요');
  lines.push('-- 아래는 예시입니다.');
  lines.push('');
  lines.push('-- 예시: planner_class의 planner_id → auth_member.id 외래키');
  lines.push('-- ALTER TABLE sp_class');
  lines.push('--   ADD CONSTRAINT fk_sp_class_auth_member');
  lines.push('--   FOREIGN KEY (planner_id) REFERENCES auth_member(id) ON DELETE CASCADE;');
  lines.push('');
  lines.push('');

  lines.push('-- ====================================================================');
  lines.push('-- STEP 7: 커밋 (모든 변경사항 확정)');
  lines.push('-- ====================================================================');
  lines.push('COMMIT;');
  lines.push('');
  lines.push('-- 문제 발생 시 롤백:');
  lines.push('-- ROLLBACK;');
  lines.push('');

  return lines.join('\n');
}

/**
 * 롤백 SQL 생성
 */
function generateRollbackSQL(): string {
  const lines: string[] = [];

  lines.push('-- ====================================================================');
  lines.push('-- 거북스쿨 테이블명 변경 롤백 SQL');
  lines.push('-- 생성일: ' + new Date().toISOString());
  lines.push('-- ====================================================================');
  lines.push('');
  lines.push('-- ⚠️ 주의: 마이그레이션 실행 후 문제 발생 시에만 사용');
  lines.push('');
  lines.push('BEGIN;');
  lines.push('');

  lines.push('-- 테이블명 원복');

  Object.entries(mapping).forEach(([servicePrefix, tables]: [string, any]) => {
    const serviceName = {
      auth: '인증/회원',
      sp: 'Study Planner',
      mt: 'Mentoring',
      mc: 'My Class',
      board: '게시판',
      payment: '결제',
      eh: 'Exam Hub',
      ss: '수시 전형',
      js: '정시 전형',
    }[servicePrefix] || servicePrefix;

    lines.push(`-- ${serviceName} (${servicePrefix}_*)`);

    Object.entries(tables).forEach(([oldName, newName]) => {
      lines.push(`ALTER TABLE ${newName} RENAME TO ${oldName};`);
    });

    lines.push('');
  });

  lines.push('-- 시퀀스명 원복');

  Object.entries(mapping).forEach(([servicePrefix, tables]: [string, any]) => {
    const serviceName = {
      auth: '인증/회원',
      sp: 'Study Planner',
      mt: 'Mentoring',
      mc: 'My Class',
      board: '게시판',
      payment: '결제',
      eh: 'Exam Hub',
      ss: '수시 전형',
      js: '정시 전형',
    }[servicePrefix] || servicePrefix;

    lines.push(`-- ${serviceName} (${servicePrefix}_*)`);

    Object.entries(tables).forEach(([oldName, newName]) => {
      lines.push(`ALTER SEQUENCE IF EXISTS ${newName}_id_seq RENAME TO ${oldName}_id_seq;`);
    });

    lines.push('');
  });

  lines.push('COMMIT;');
  lines.push('');

  return lines.join('\n');
}

/**
 * 메인 실행
 */
function main() {
  console.log('🚀 DB 마이그레이션 SQL 생성 시작\n');

  const migrationSQL = generateMigrationSQL();
  const rollbackSQL = generateRollbackSQL();

  const migrationPath = path.join(__dirname, '../migrations/rename-tables-migration.sql');
  const rollbackPath = path.join(__dirname, '../migrations/rename-tables-rollback.sql');

  // migrations 디렉토리 생성
  const migrationsDir = path.join(__dirname, '../migrations');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  fs.writeFileSync(migrationPath, migrationSQL, 'utf-8');
  fs.writeFileSync(rollbackPath, rollbackSQL, 'utf-8');

  console.log(`✅ 마이그레이션 SQL 생성 완료: ${migrationPath}`);
  console.log(`✅ 롤백 SQL 생성 완료: ${rollbackPath}`);

  console.log('\n📊 통계:');
  console.log(`  📁 총 테이블 개수: ${Object.keys(fullMapping).length}개`);
  console.log('');
  console.log('🔍 다음 단계:');
  console.log('  1. migrations/rename-tables-migration.sql 파일 확인');
  console.log('  2. STEP 1의 외래키 조회 쿼리 실행 및 결과 확인');
  console.log('  3. STEP 6의 외래키 재생성 SQL 작성');
  console.log('  4. 개발 DB에서 마이그레이션 테스트');
  console.log('  5. 문제 없으면 프로덕션 적용');
}

// 실행
main();
