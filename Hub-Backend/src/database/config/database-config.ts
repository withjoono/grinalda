import { registerAs } from '@nestjs/config';
import { IsOptional, IsInt, Min, Max, IsString, IsBoolean } from 'class-validator';
import { validateConfig } from '../../common/utils/validate-config';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  DB_TYPE: string;

  @IsString()
  @IsOptional()
  DB_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  DB_PORT: number;

  @IsString()
  @IsOptional()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  @IsOptional()
  DB_USER: string;

  @IsBoolean()
  @IsOptional()
  DB_SYNCHRONIZE: boolean;
}

export default registerAs<DatabaseConfig>('database', () => {
  // DATABASE_URL이 존재하면 (운영 환경), 파싱하여 사용
  if (process.env.DATABASE_URL) {
    try {
      // 공백/개행 제거
      const databaseUrl = process.env.DATABASE_URL.trim();

      // DATABASE_URL 형식 로깅 (비밀번호 마스킹)
      const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@');
      console.log('🔗 DATABASE_URL 감지:', maskedUrl);

      // Cloud SQL Unix Socket 연결 형식 체크
      // postgresql://user:password@/database?host=/cloudsql/PROJECT:REGION:INSTANCE
      if (databaseUrl.includes('?host=/cloudsql/')) {
        // 수동 파싱 (@/ 형식을 new URL()이 처리 못함)
        // 비밀번호에 특수문자가 있을 수 있으므로 [^@]+ 사용
        const match = databaseUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@\/([^?]+)\?host=(.+)$/);

        if (!match) {
          console.error('❌ 정규식 매칭 실패. URL 길이:', databaseUrl.length);
          throw new Error('Cloud SQL URL 형식 불일치');
        }

        const [, username, password, database, socketPath] = match;

        console.log('✅ Cloud SQL Unix Socket 연결:', {
          socket: socketPath,
          database,
          username,
        });

        return {
          type: 'postgres',
          host: socketPath, // Unix 소켓 경로
          port: undefined, // Unix 소켓은 포트 불필요
          password, // decodeURIComponent 불필요 (이미 plain text)
          name: database,
          username,
          synchronize: process.env.DB_SYNCHRONIZE === 'true',
        };
      }

      // 일반 PostgreSQL URL: postgresql://user:password@host:port/database
      const url = new URL(databaseUrl);

      console.log('✅ PostgreSQL 일반 연결:', {
        host: url.hostname,
        port: url.port || 5432,
        database: url.pathname.slice(1),
        username: url.username,
      });

      return {
        type: 'postgres',
        host: url.hostname,
        port: url.port ? parseInt(url.port, 10) : 5432,
        password: decodeURIComponent(url.password),
        name: url.pathname.slice(1),
        username: decodeURIComponent(url.username),
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
      };
    } catch (error) {
      // 에러 상세 정보 출력
      console.error('❌ DATABASE_URL 파싱 실패:', {
        error: error.message,
        stack: error.stack,
        urlLength: process.env.DATABASE_URL?.length,
        urlStart: process.env.DATABASE_URL?.substring(0, 20),
      });
      throw new Error(
        `Invalid DATABASE_URL format. Expected: postgresql://user:password@host:port/database. Error: ${error.message}`,
      );
    }
  }

  // DATABASE_URL이 없으면 개별 변수 사용 (개발 환경)
  validateConfig(process.env, EnvironmentVariablesValidator);

  // 주의: DB_SYNCHRONIZE=true는 기존 테이블을 삭제할 수 있으므로 주의해서 사용
  // 프로덕션 환경에서는 마이그레이션을 사용하는 것을 권장
  if (
    process.env.DB_SYNCHRONIZE === 'true' &&
    process.env.NODE_ENV !== 'development' &&
    process.env.DB_TYPE !== 'better-sqlite3'
  ) {
    console.warn(
      '⚠️ 경고: 프로덕션 환경에서 DB_SYNCHRONIZE=true가 설정되어 있습니다. 기존 데이터에 영향을 줄 수 있습니다.',
    );
  }

  return {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  };
});
