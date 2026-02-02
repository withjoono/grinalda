import dataSource from '../ormconfig';

/**
 * 스키마 검증 스크립트
 * 애플리케이션 시작 전 필수 컬럼 존재 여부 확인
 */

const REQUIRED_COLUMNS = {
  auth_member: ['firebase_uid', 'email', 'phone', 'role_type'],
  // 필요에 따라 다른 테이블도 추가
};

async function verifySchema() {
  // const dataSource = new DataSource(typeOrmConfig); // REMOVED

  try {
    await dataSource.initialize();
    console.log('✅ 데이터베이스 연결 성공');

    const queryRunner = dataSource.createQueryRunner();
    let hasErrors = false;

    for (const [tableName, columns] of Object.entries(REQUIRED_COLUMNS)) {
      console.log(`\n🔍 ${tableName} 테이블 검증 중...`);

      for (const columnName of columns) {
        const result = await queryRunner.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = $1 AND column_name = $2
        `, [tableName, columnName]);

        if (result.length === 0) {
          console.error(`❌ ${tableName}.${columnName} 컬럼이 없습니다!`);
          hasErrors = true;
        } else {
          console.log(`✅ ${tableName}.${columnName} 존재`);
        }
      }
    }

    await queryRunner.release();
    await dataSource.destroy();

    if (hasErrors) {
      console.error('\n❌ 스키마 검증 실패! 마이그레이션을 실행하세요:');
      console.error('   yarn typeorm:run');
      process.exit(1);
    }

    console.log('\n✅ 모든 필수 컬럼이 존재합니다!');
    process.exit(0);

  } catch (error) {
    console.error('❌ 스키마 검증 실패:', error);
    process.exit(1);
  }
}

verifySchema();
