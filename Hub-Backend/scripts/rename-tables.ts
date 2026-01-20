#!/usr/bin/env ts-node

/**
 * 테이블명 일괄 변경 스크립트
 *
 * 기능:
 * 1. 엔티티 파일의 @Entity 데코레이터 변경
 * 2. Raw SQL 쿼리의 테이블명 변경
 * 3. 주석의 테이블명 변경
 *
 * 사용법:
 * npx ts-node scripts/rename-tables.ts [--dry-run] [--backup]
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// 매핑 테이블 로드 (정리된 버전 사용)
const mappingPath = path.join(__dirname, '../table-rename-mapping-clean.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

// 전체 매핑을 하나의 객체로 변환
const fullMapping: Record<string, string> = {};
Object.values(mapping).forEach((serviceMapping: any) => {
  Object.assign(fullMapping, serviceMapping);
});

// CLI 옵션
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const shouldBackup = args.includes('--backup');

console.log('🚀 테이블명 변경 스크립트 시작');
console.log(`📋 모드: ${isDryRun ? 'DRY RUN (미리보기)' : '실제 변경'}`);
console.log(`💾 백업: ${shouldBackup ? '활성화' : '비활성화'}`);
console.log('');

// 통계
let stats = {
  filesProcessed: 0,
  filesChanged: 0,
  entitiesChanged: 0,
  sqlQueriesChanged: 0,
  commentsChanged: 0,
};

/**
 * 파일 백업
 */
function backupFile(filePath: string): void {
  if (!shouldBackup) return;

  const backupPath = `${filePath}.backup`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`  💾 백업: ${backupPath}`);
}

/**
 * 엔티티 데코레이터 변경
 */
function replaceEntityDecorator(content: string): { content: string; changed: boolean } {
  let changed = false;
  let newContent = content;

  // @Entity('old_table') → @Entity('new_table')
  Object.entries(fullMapping).forEach(([oldTable, newTable]) => {
    const regex = new RegExp(`@Entity\\(['"\`]${oldTable}['"\`]`, 'g');
    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, `@Entity('${newTable}'`);
      changed = true;
      stats.entitiesChanged++;
      console.log(`    ✅ @Entity: ${oldTable} → ${newTable}`);
    }
  });

  return { content: newContent, changed };
}

/**
 * Raw SQL 쿼리의 테이블명 변경
 */
function replaceSqlQueries(content: string): { content: string; changed: boolean } {
  let changed = false;
  let newContent = content;

  Object.entries(fullMapping).forEach(([oldTable, newTable]) => {
    // SQL 컨텍스트에서 테이블명 찾기 (대소문자 구분 없음)
    const patterns = [
      // FROM table_name
      new RegExp(`(FROM\\s+)${oldTable}(\\s|,|\\)|;|$)`, 'gi'),
      // JOIN table_name
      new RegExp(`(JOIN\\s+)${oldTable}(\\s|,|\\)|;|$)`, 'gi'),
      // INTO table_name
      new RegExp(`(INTO\\s+)${oldTable}(\\s|,|\\(|;|$)`, 'gi'),
      // UPDATE table_name
      new RegExp(`(UPDATE\\s+)${oldTable}(\\s|,|;|$)`, 'gi'),
      // DELETE FROM table_name
      new RegExp(`(DELETE\\s+FROM\\s+)${oldTable}(\\s|,|;|$)`, 'gi'),
      // table_name 단독 (backtick 또는 quote 내부)
      new RegExp(`(['"\`])${oldTable}(['"\`])`, 'g'),
    ];

    patterns.forEach(pattern => {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, (match, p1, p2) => {
          if (p2) {
            // FROM, JOIN 등의 경우
            return `${p1}${newTable}${p2}`;
          } else {
            // quote 내부의 경우
            return `${p1}${newTable}${p2 || p1}`;
          }
        });
        changed = true;
        stats.sqlQueriesChanged++;
        console.log(`    ✅ SQL: ${oldTable} → ${newTable}`);
      }
    });
  });

  return { content: newContent, changed };
}

/**
 * 주석의 테이블명 변경
 */
function replaceComments(content: string): { content: string; changed: boolean } {
  let changed = false;
  let newContent = content;

  Object.entries(fullMapping).forEach(([oldTable, newTable]) => {
    // 주석 내 테이블명 (auth_member.id 같은 형태)
    const commentPatterns = [
      new RegExp(`(\\*\\s+.*?)${oldTable}(\\.)`, 'g'),
      new RegExp(`(//\\s+.*?)${oldTable}(\\.)`, 'g'),
      new RegExp(`(['"\`])${oldTable}(['"\`])`, 'g'),
    ];

    commentPatterns.forEach(pattern => {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, `$1${newTable}$2`);
        changed = true;
        stats.commentsChanged++;
        console.log(`    ✅ 주석: ${oldTable} → ${newTable}`);
      }
    });
  });

  return { content: newContent, changed };
}

/**
 * 파일 처리
 */
function processFile(filePath: string): void {
  stats.filesProcessed++;

  console.log(`\n📄 처리 중: ${filePath}`);

  const originalContent = fs.readFileSync(filePath, 'utf-8');
  let { content, changed } = replaceEntityDecorator(originalContent);

  const sqlResult = replaceSqlQueries(content);
  content = sqlResult.content;
  changed = changed || sqlResult.changed;

  const commentResult = replaceComments(content);
  content = commentResult.content;
  changed = changed || commentResult.changed;

  if (changed) {
    stats.filesChanged++;

    if (!isDryRun) {
      backupFile(filePath);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('  ✅ 파일 저장 완료');
    } else {
      console.log('  ℹ️  DRY RUN: 변경 사항 미적용');
    }
  } else {
    console.log('  ⏭️  변경 사항 없음');
  }
}

/**
 * 메인 실행
 */
async function main() {
  const basePath = path.join(__dirname, '..');

  // 처리할 파일 패턴
  const filePatterns = [
    'src/**/*.entity.ts',
    'src/**/*.service.ts',
    'src/**/*.repository.ts',
    'scripts/**/*.ts',
    'be-shared-packages/**/*.entity.ts',
    'be-shared-packages/**/*.types.ts',
    'GB-Back-Nest-Original/src/**/*.ts',
  ];

  console.log('📂 파일 검색 중...\n');

  const allFiles = new Set<string>();
  filePatterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: basePath, absolute: true });
    files.forEach(f => allFiles.add(f));
  });

  console.log(`📊 총 ${allFiles.size}개 파일 발견\n`);
  console.log('=' .repeat(80));

  for (const file of Array.from(allFiles)) {
    processFile(file);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 최종 통계:');
  console.log(`  📁 처리된 파일: ${stats.filesProcessed}개`);
  console.log(`  ✏️  변경된 파일: ${stats.filesChanged}개`);
  console.log(`  🏷️  변경된 엔티티: ${stats.entitiesChanged}개`);
  console.log(`  📝 변경된 SQL 쿼리: ${stats.sqlQueriesChanged}개`);
  console.log(`  💬 변경된 주석: ${stats.commentsChanged}개`);

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN 모드: 실제로 파일이 변경되지 않았습니다.');
    console.log('   실제 변경하려면 --dry-run 플래그 없이 실행하세요.');
  } else {
    console.log('\n✅ 작업 완료!');
    if (shouldBackup) {
      console.log('💾 백업 파일: *.backup 확장자로 저장됨');
    }
  }

  console.log('\n🔍 다음 단계:');
  console.log('  1. 변경 사항 확인: git diff');
  console.log('  2. 빌드 테스트: npm run build');
  console.log('  3. DB 마이그레이션 SQL 실행');
  console.log('  4. 애플리케이션 테스트');
}

// 실행
main().catch(console.error);
