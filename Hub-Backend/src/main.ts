// tsconfig paths 등록 (런타임 경로 매핑) - 개발 환경에서만 필요
if (process.env.NODE_ENV !== 'production') {
  require('tsconfig-paths/register');
}

// Sentry 초기화 (애플리케이션 시작 전에 로드)
import './instrumentation';

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as admin from 'firebase-admin';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ---------------------------------------------------------------------------
  // [HOTFIX] Production Schema Patch
  // 마이그레이션 누락으로 인한 auth_member 테이블 스키마 불일치 해결 (2026-02-14)
  // ---------------------------------------------------------------------------
  try {
    const { DataSource } = await import('typeorm');
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    console.log('[SchemaPatch] Checking auth_member schema...');

    // 1) id 컬럼 타입 확인 및 변환 (bigint → varchar)
    const idColInfo = await queryRunner.query(`
      SELECT data_type FROM information_schema.columns
      WHERE table_name = 'auth_member' AND column_name = 'id'
    `);

    if (idColInfo.length > 0 && idColInfo[0].data_type === 'bigint') {
      console.log('[SchemaPatch] auth_member.id is bigint — converting to varchar(30)...');

      await queryRunner.startTransaction();
      try {
        // 1a) auth_member.id를 참조하는 모든 FK 조회
        const fkRows = await queryRunner.query(`
          SELECT
            tc.constraint_name,
            tc.table_name AS fk_table,
            kcu.column_name AS fk_column,
            ccu.table_name AS ref_table,
            ccu.column_name AS ref_column
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage ccu
            ON tc.constraint_name = ccu.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND ccu.table_name = 'auth_member'
            AND ccu.column_name = 'id'
        `);

        console.log(`[SchemaPatch] Found ${fkRows.length} FK constraints referencing auth_member.id`);

        // 1b) FK 제약 조건 모두 DROP
        for (const fk of fkRows) {
          console.log(`[SchemaPatch] Dropping FK: ${fk.constraint_name} on ${fk.fk_table}`);
          await queryRunner.query(`ALTER TABLE "${fk.fk_table}" DROP CONSTRAINT "${fk.constraint_name}"`);
        }

        // 1c) auth_member PK 제약 조건 찾아서 DROP
        const pkRows = await queryRunner.query(`
          SELECT constraint_name FROM information_schema.table_constraints
          WHERE table_name = 'auth_member' AND constraint_type = 'PRIMARY KEY'
        `);
        for (const pk of pkRows) {
          console.log(`[SchemaPatch] Dropping PK: ${pk.constraint_name}`);
          await queryRunner.query(`ALTER TABLE auth_member DROP CONSTRAINT "${pk.constraint_name}"`);
        }

        // 1d) auth_member.id의 DEFAULT(시퀀스) 제거 및 타입 변경
        await queryRunner.query(`ALTER TABLE auth_member ALTER COLUMN id DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE auth_member ALTER COLUMN id TYPE varchar(30) USING CAST(id AS TEXT)`);
        console.log('[SchemaPatch] auth_member.id converted to varchar(30)');

        // 1e) PK 복원
        await queryRunner.query(`ALTER TABLE auth_member ADD PRIMARY KEY (id)`);

        // 1f) FK가 참조하는 테이블의 member_id 컬럼도 varchar로 변환 + FK 복원
        for (const fk of fkRows) {
          try {
            const colInfo = await queryRunner.query(`
              SELECT data_type FROM information_schema.columns
              WHERE table_name = $1 AND column_name = $2
            `, [fk.fk_table, fk.fk_column]);

            if (colInfo.length > 0 && colInfo[0].data_type !== 'character varying') {
              console.log(`[SchemaPatch] Converting ${fk.fk_table}.${fk.fk_column} to varchar(30)`);
              await queryRunner.query(`ALTER TABLE "${fk.fk_table}" ALTER COLUMN "${fk.fk_column}" TYPE varchar(30) USING CAST("${fk.fk_column}" AS TEXT)`);
            }

            // FK 복원
            console.log(`[SchemaPatch] Restoring FK: ${fk.constraint_name}`);
            await queryRunner.query(`ALTER TABLE "${fk.fk_table}" ADD CONSTRAINT "${fk.constraint_name}" FOREIGN KEY ("${fk.fk_column}") REFERENCES auth_member(id)`);
          } catch (fkErr) {
            console.warn(`[SchemaPatch] FK restore warning for ${fk.fk_table}: ${fkErr.message}`);
          }
        }

        await queryRunner.commitTransaction();
        console.log('[SchemaPatch] id column type conversion completed successfully.');
      } catch (txErr) {
        console.error('[SchemaPatch] Transaction failed, rolling back:', txErr.message);
        await queryRunner.rollbackTransaction();
      }
    }

    // 2) 누락된 컬럼 추가
    const table = await queryRunner.getTable('auth_member');
    if (table) {
      const missingColumns = [
        { name: 'user_type_code', type: 'character varying(5)' },
        { name: 'user_type_detail_code', type: 'character varying(5)' },
        { name: 'reg_year', type: 'integer' },
        { name: 'reg_month', type: 'character varying(2)' },
        { name: 'reg_day', type: 'character varying(2)' },
        { name: 'firebase_uid', type: 'character varying(255)' },
        { name: 'member_type', type: 'character varying(20)' },
        { name: 'profile_image_url', type: 'character varying(1000)' },
        { name: 'oauth_id', type: 'character varying(255)' },
        { name: 'provider_type', type: 'character varying(20)' },
      ];

      for (const col of missingColumns) {
        if (!table.findColumnByName(col.name)) {
          console.log(`[SchemaPatch] Adding missing column: ${col.name}`);
          await queryRunner.query(`ALTER TABLE "auth_member" ADD "${col.name}" ${col.type}`);
        }
      }
    }

    // 3) 누락된 서브 테이블 생성 (auth_member_s, auth_member_t, auth_member_p)
    console.log('[SchemaPatch] Checking sub-tables...');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_member_s (
        member_id varchar(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        school_code varchar(20),
        school_name varchar(100),
        school_location varchar(50),
        school_type varchar(50),
        school_level varchar(10),
        grade integer
      )
    `);
    console.log('[SchemaPatch] auth_member_s (student) ensured.');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_member_t (
        member_id varchar(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        school_level varchar(10),
        subject varchar(50)
      )
    `);
    console.log('[SchemaPatch] auth_member_t (teacher) ensured.');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_member_p (
        member_id varchar(30) PRIMARY KEY REFERENCES auth_member(id) ON DELETE CASCADE,
        parent_type varchar(20)
      )
    `);
    console.log('[SchemaPatch] auth_member_p (parent) ensured.');

    await queryRunner.release();
    console.log('[SchemaPatch] Completed.');
  } catch (error) {
    console.error('[SchemaPatch] Failed:', error);
    // 패치 실패해도 앱 시작은 시도
  }
  // ---------------------------------------------------------------------------

  // Helmet - HTTP 보안 헤더 설정 (XSS, Clickjacking, MIME 스니핑 방지)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // API 서버는 비활성화
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // CORS와 호환
      crossOriginOpenerPolicy: false, // Firebase Auth Popup 허용을 위해 비활성화
    }),
  );

  // Cookie Parser - HttpOnly 쿠키 파싱 (JWT 토큰 보안 저장)
  app.use(cookieParser());

  // Initialize Firebase Admin SDK
  try {
    let serviceAccount;

    // 환경 변수에서 Firebase 설정 로드 (우선)
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL
    ) {
      serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`,
      };
      console.log('Firebase Admin SDK initialized from environment variables');
    } else {
      // 환경 변수가 없으면 파일에서 로드 (fallback)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      serviceAccount = require('../firebase-service-account-key.json');
      console.log('Firebase Admin SDK initialized from file');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.warn('Firebase service account key not found. Firebase features will be disabled.');
  }

  const configService = app.get(ConfigService<AllConfigType>);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의된 필드만 받아들임
      forbidNonWhitelisted: true, // 정의되지 않은 필드가 포함되어 있으면 요청을 거부
      transform: true, // 요청데이터를 자동으로 변환
    }),
  );

  // ClassSerializerInterceptor를 전역으로 사용
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // SentryInterceptor에 Logger를 주입
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalInterceptors(new SentryInterceptor(logger));

  // Swagger 문서 설정 - 프로덕션에서는 비활성화
  const isProduction = process.env.NODE_ENV === 'production';
  const swaggerEnabled = process.env.SWAGGER_ENABLED !== 'false'; // 기본값: 활성화

  if (!isProduction || swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('거북스쿨 (TurtleSchool) API')
      .setDescription(
        '대학 입시 컨설팅 서비스를 위한 교육 플랫폼 REST API\n\n' +
        '## 주요 기능\n' +
        '- 회원 인증 및 관리 (이메일, 소셜 로그인)\n' +
        '- 학생부 기록 관리 (출석, 성적, 과목)\n' +
        '- 수시/정시 전형 탐색 및 조합\n' +
        '- 모의고사 점수 관리 및 표준화\n' +
        '- 결제 처리 (Iamport 연동)\n' +
        '- 입학사정관 평가 시스템\n' +
        '- 파일 업로드 (Google Cloud Storage)\n\n' +
        '## 인증 방법\n' +
        '대부분의 엔드포인트는 JWT Bearer 토큰 인증이 필요합니다.\n' +
        '1. `/auth/login/email` 또는 `/auth/login/social`로 로그인\n' +
        '2. 응답에서 `accessToken` 획득\n' +
        '3. 이후 요청 헤더에 `Authorization: Bearer {accessToken}` 포함\n\n' +
        '## 에러 응답 형식\n' +
        '모든 에러는 다음 형식으로 반환됩니다:\n' +
        '```json\n' +
        '{\n' +
        '  "success": false,\n' +
        '  "statusCode": 400,\n' +
        '  "message": "에러 메시지",\n' +
        '  "error": "BadRequestException"\n' +
        '}\n' +
        '```\n',
      )
      .setVersion('2.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'JWT 토큰을 입력하세요 (Bearer 접두사 제외)',
          in: 'header',
        },
        'access-token', // 이름은 컨트롤러에서 @ApiBearerAuth('access-token')로 참조
      )
      .addTag('auth', '인증 및 회원가입')
      .addTag('members', '회원 관리')
      .addTag('schoolrecord', '학생부 기록')
      .addTag('susi', '수시 전형 (교과, 학종, 논술)')
      .addTag('regular', '정시 전형')
      .addTag('mock-exam', '모의고사')
      .addTag('payments', '결제')
      .addTag('officer', '입학사정관 평가')
      .addTag('board', '게시판')
      .addTag('file-upload', '파일 업로드')
      .addTag('core', '기본 데이터 (대학, 전형, 모집단위)')
      .addTag('admin', '관리자 전용')
      .addTag('static-data', '정적 데이터')
      .addTag('sms', 'SMS 알림')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      customSiteTitle: '거북스쿨 API 문서',
      customfavIcon: 'https://nestjs.com/img/logo-small.svg',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-standalone-preset.min.css',
      ],
    });
    console.log('Swagger documentation: enabled');
  } else {
    console.log('Swagger documentation: disabled (production mode)');
  }

  app.enableCors({
    origin: [
      // 허용할 도메인
      'https://ts-admin-479323.web.app',
      'https://turtleschool-admin-front.vercel.app',
      'https://admin2.turtleskool.com',
      'https://turtleskool.com',
      'https://turtleanp.com',
      'https://turtlemedi.com',
      'https://ts-front.vercel.app',
      'https://www.geobukschool.kr',
      'https://geobukschool.kr',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:4173',
      // Hub (Frontend: 3000, Backend: 4000)
      'http://localhost:3000',
      'http://localhost:4000',
      // Susi (Frontend: 3001, Backend: 4001)
      'http://localhost:3001',
      'http://localhost:4001',
      // Jungsi (Frontend: 3002, Backend: 4002)
      'http://localhost:3002',
      'http://localhost:4002',
      // ExamHub (Frontend: 3003, Backend: 4003)
      'http://localhost:3003',
      'http://localhost:4003',
      // StudyPlanner (Frontend: 3004, Backend: 4004)
      'http://localhost:3004',
      'http://localhost:4004',
      'https://idaacademy.vercel.app',
      'https://hizen-front-gb.web.app',
      // StudyPlanner 프로덕션 도메인
      'https://studyplanner.kr',
      'https://www.studyplanner.kr',
      'https://studyplanner-new.web.app',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true, // 자격 증명 허용
  });

  // Cloud Run provides PORT as string, convert to number
  const appPort = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : configService.getOrThrow('app', { infer: true }).port;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

  await app.listen(appPort, host);

  console.log(`Application is running on: http://${host}:${appPort}`);
  console.log(`Swagger documentation: http://localhost:${appPort}/swagger`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Sentry DSN configured: ${!!process.env.SENTRY_DSN}`);
}
bootstrap();
