# PostgreSQL 스키마 분리 마이그레이션 계획

## 📋 목표

하나의 PostgreSQL 데이터베이스(`geobukschool_dev`)에서 **스키마 기반 논리적 분리**를 통해 멀티 프로젝트 지원

```
geobukschool_dev
├── common (공통 데이터)
│   ├── ss_university
│   ├── ss_admission
│   └── ss_recruitment_unit
├── hub (Hub 전용)
│   ├── auth_member
│   ├── oauth_clients
│   └── hub_apps
├── susi (Susi 전용)
│   ├── susi_subject_tb
│   └── susi_user_scores
├── jungsi (Jungsi 전용)
│   ├── js_admission
│   └── js_user_scores
└── examhub (문제 은행)
    └── exam_questions
```

---

## 🔍 Phase 0: 현재 상황 분석

### 현재 데이터베이스 구조
- **DB 이름**: `hub_dev`
- **스키마**: `public` (모든 테이블이 단일 스키마에 존재)
- **엔티티 개수**: 50+ 테이블
- **TypeORM 버전**: 0.3.x

### 현재 테이블 분류

#### Common 스키마로 이동 예정
```sql
-- 대학 정보
ss_university
ss_admission
ss_admission_method
ss_admission_category
ss_admission_subtype
ss_recruitment_unit
ss_recruitment_unit_*

-- 계열 분류
general_field
major_field
mid_field
minor_field
```

#### Hub 스키마로 이동 예정
```sql
-- 인증/멤버
auth_member
auth_member_file
oauth_clients
oauth_authorization_codes

-- Hub 앱 관리
hub_apps
hub_app_subscriptions
hub_product_permission_mappings

-- 결제
payment_*

-- 게시판
board_*
```

#### Susi 스키마로 이동 예정
```sql
-- 수시 데이터
earlyd_subject_code_list_tb
susi_* (향후 추가될 테이블들)
```

#### Jungsi 스키마로 이동 예정
```sql
-- 정시 데이터
js_admission
js_admission_previous_result
js_pyunggawon_*
js_raw_to_standard
js_sunung_*
js_user_*
```

#### MyClass 스키마로 이동 예정
```sql
-- 학급 관리
mc_attendance
mc_consultation
mc_health_record
mc_test
```

---

## 🎯 Phase 1: 데이터베이스 준비 (1-2일)

### 1.1 새 데이터베이스 생성
```bash
# Docker 컨테이너에서 실행
docker exec geobuk-postgres psql -U hub_user_4559 -c "CREATE DATABASE geobukschool_dev;"
```

### 1.2 스키마 생성 스크립트
```sql
-- scripts/create-schemas.sql

-- 공통 데이터 스키마
CREATE SCHEMA IF NOT EXISTS common;
COMMENT ON SCHEMA common IS '프로젝트 간 공유되는 데이터 (대학, 입학 정보 등)';

-- Hub 프로젝트 스키마
CREATE SCHEMA IF NOT EXISTS hub;
COMMENT ON SCHEMA hub IS 'Hub 프로젝트 전용 데이터 (인증, OAuth, 결제 등)';

-- Susi 프로젝트 스키마
CREATE SCHEMA IF NOT EXISTS susi;
COMMENT ON SCHEMA susi IS 'Susi 프로젝트 전용 데이터 (수시 전형 관련)';

-- Jungsi 프로젝트 스키마
CREATE SCHEMA IF NOT EXISTS jungsi;
COMMENT ON SCHEMA jungsi IS 'Jungsi 프로젝트 전용 데이터 (정시 전형 관련)';

-- ExamHub 프로젝트 스키마
CREATE SCHEMA IF NOT EXISTS examhub;
COMMENT ON SCHEMA examhub IS 'ExamHub 프로젝트 전용 데이터 (문제 은행)';

-- MyClass 프로젝트 스키마
CREATE SCHEMA IF NOT EXISTS myclass;
COMMENT ON SCHEMA myclass IS 'MyClass 프로젝트 전용 데이터 (학급 관리)';

-- 스키마 권한 설정
GRANT USAGE ON SCHEMA common TO hub_user_4559;
GRANT USAGE ON SCHEMA hub TO hub_user_4559;
GRANT USAGE ON SCHEMA susi TO hub_user_4559;
GRANT USAGE ON SCHEMA jungsi TO hub_user_4559;
GRANT USAGE ON SCHEMA examhub TO hub_user_4559;
GRANT USAGE ON SCHEMA myclass TO hub_user_4559;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA common TO hub_user_4559;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA hub TO hub_user_4559;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA susi TO hub_user_4559;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA jungsi TO hub_user_4559;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA examhub TO hub_user_4559;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA myclass TO hub_user_4559;

-- 기본 권한 설정 (향후 테이블 자동 권한 부여)
ALTER DEFAULT PRIVILEGES IN SCHEMA common GRANT ALL ON TABLES TO hub_user_4559;
ALTER DEFAULT PRIVILEGES IN SCHEMA hub GRANT ALL ON TABLES TO hub_user_4559;
ALTER DEFAULT PRIVILEGES IN SCHEMA susi GRANT ALL ON TABLES TO hub_user_4559;
ALTER DEFAULT PRIVILEGES IN SCHEMA jungsi GRANT ALL ON TABLES TO hub_user_4559;
ALTER DEFAULT PRIVILEGES IN SCHEMA examhub GRANT ALL ON TABLES TO hub_user_4559;
ALTER DEFAULT PRIVILEGES IN SCHEMA myclass GRANT ALL ON TABLES TO hub_user_4559;
```

### 1.3 실행
```bash
cd Hub-Backend
docker exec -i geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev < scripts/create-schemas.sql
```

---

## 🔧 Phase 2: TypeORM 설정 변경 (2-3일)

### 2.1 환경 변수 업데이트
```bash
# .env.development
DB_NAME=geobukschool_dev  # hub_dev → geobukschool_dev
DB_SYNCHRONIZE=false       # 스키마 변경 시 안전을 위해 false
```

### 2.2 TypeORM 스키마 지원 설정

#### Option A: 엔티티별 스키마 지정 (권장)
```typescript
// src/database/entities/core/university.entity.ts
@Entity({ schema: 'common', name: 'ss_university' })
export class UniversityEntity {
  // ...
}

// src/database/entities/members/member.entity.ts
@Entity({ schema: 'hub', name: 'auth_member' })
export class MemberEntity {
  // ...
}

// src/database/entities/jungsi/js-admission.entity.ts
@Entity({ schema: 'jungsi', name: 'js_admission' })
export class JsAdmissionEntity {
  // ...
}
```

#### Option B: 멀티 DataSource 설정
```typescript
// src/database/typeorm-config.service.ts
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      // ... 기존 설정

      // 스키마 검색 경로 설정
      schema: 'public',  // 기본 스키마
      extra: {
        // 멀티 스키마 지원
        searchPath: 'common,hub,susi,jungsi,examhub,myclass,public',
      },
    };
  }
}
```

### 2.3 마이그레이션 생성 전략

#### 전략 1: 수동 마이그레이션 (안전, 권장)
```typescript
// src/migrations/1706000000000-CreateSchemas.ts
export class CreateSchemas1706000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 스키마 생성
    await queryRunner.createSchema('common', true);
    await queryRunner.createSchema('hub', true);
    await queryRunner.createSchema('susi', true);
    await queryRunner.createSchema('jungsi', true);
    await queryRunner.createSchema('examhub', true);
    await queryRunner.createSchema('myclass', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백 시 스키마 삭제
    await queryRunner.dropSchema('myclass', true);
    await queryRunner.dropSchema('examhub', true);
    await queryRunner.dropSchema('jungsi', true);
    await queryRunner.dropSchema('susi', true);
    await queryRunner.dropSchema('hub', true);
    await queryRunner.dropSchema('common', true);
  }
}
```

```typescript
// src/migrations/1706000001000-MoveCommonTables.ts
export class MoveCommonTables1706000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // public 스키마에서 common 스키마로 테이블 이동
    await queryRunner.query(`ALTER TABLE public.ss_university SET SCHEMA common`);
    await queryRunner.query(`ALTER TABLE public.ss_admission SET SCHEMA common`);
    await queryRunner.query(`ALTER TABLE public.ss_recruitment_unit SET SCHEMA common`);
    // ... 나머지 공통 테이블
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백: common 스키마에서 public으로 복원
    await queryRunner.query(`ALTER TABLE common.ss_university SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE common.ss_admission SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE common.ss_recruitment_unit SET SCHEMA public`);
    // ... 나머지
  }
}
```

#### 전략 2: pg_dump + 스키마 변경 스크립트
```bash
# 기존 데이터 백업
docker exec geobuk-postgres pg_dump -U hub_user_4559 hub_dev > backup_hub_dev.sql

# 스키마 변경 스크립트 생성
cat > scripts/migrate-schemas.sql << 'EOF'
-- Common 테이블 이동
ALTER TABLE public.ss_university SET SCHEMA common;
ALTER TABLE public.ss_admission SET SCHEMA common;
-- ... (모든 테이블 나열)

-- Hub 테이블 이동
ALTER TABLE public.auth_member SET SCHEMA hub;
ALTER TABLE public.oauth_clients SET SCHEMA hub;
-- ...

-- Jungsi 테이블 이동
ALTER TABLE public.js_admission SET SCHEMA jungsi;
-- ...
EOF

# 실행
docker exec -i geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev < scripts/migrate-schemas.sql
```

---

## 🚀 Phase 3: 데이터 마이그레이션 (3-5일)

### 3.1 마이그레이션 순서

#### Step 1: 개발 환경에서 테스트
```bash
# 1. 현재 hub_dev 백업
docker exec geobuk-postgres pg_dump -U hub_user_4559 hub_dev > backup_hub_dev_$(date +%Y%m%d).sql

# 2. 새 DB 생성 및 스키마 생성
docker exec geobuk-postgres psql -U hub_user_4559 -c "CREATE DATABASE geobukschool_dev;"
docker exec -i geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev < scripts/create-schemas.sql

# 3. 기존 데이터 복원 (public 스키마로)
docker exec -i geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev < backup_hub_dev_$(date +%Y%m%d).sql

# 4. 스키마 마이그레이션 실행
docker exec -i geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev < scripts/migrate-schemas.sql

# 5. 검증
docker exec geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev -c "\dn"  # 스키마 목록
docker exec geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev -c "\dt common.*"  # common 스키마 테이블
docker exec geobuk-postgres psql -U hub_user_4559 -d geobukschool_dev -c "\dt hub.*"     # hub 스키마 테이블
```

#### Step 2: 엔티티 파일 업데이트
```bash
# 각 엔티티에 schema 속성 추가
# 예: src/database/entities/core/*.entity.ts
#     @Entity({ schema: 'common', name: 'table_name' })
```

#### Step 3: 애플리케이션 재시작 및 테스트
```bash
# .env.development 업데이트
DB_NAME=geobukschool_dev

# 서버 재시작
yarn start:dev

# API 테스트
curl http://localhost:4000/api/health
curl http://localhost:4000/api/core/universities
```

### 3.2 롤백 계획
```bash
# 문제 발생 시 즉시 롤백
docker exec geobuk-postgres psql -U hub_user_4559 -c "DROP DATABASE IF EXISTS geobukschool_dev;"

# .env.development 복원
DB_NAME=hub_dev

# 서버 재시작
yarn start:dev
```

---

## ✅ Phase 4: 검증 및 테스트 (2-3일)

### 4.1 데이터 무결성 검증
```sql
-- 테이블 수 비교
SELECT
  'public' as schema_name,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
UNION ALL
SELECT 'common', COUNT(*) FROM information_schema.tables WHERE table_schema = 'common'
UNION ALL
SELECT 'hub', COUNT(*) FROM information_schema.tables WHERE table_schema = 'hub'
UNION ALL
SELECT 'jungsi', COUNT(*) FROM information_schema.tables WHERE table_schema = 'jungsi';

-- 레코드 수 비교 (샘플)
SELECT COUNT(*) FROM common.ss_university;  -- 기존 public.ss_university와 비교
SELECT COUNT(*) FROM hub.auth_member;       -- 기존 public.auth_member와 비교
```

### 4.2 애플리케이션 테스트
```bash
# 1. 유닛 테스트
yarn test

# 2. E2E 테스트
yarn test:e2e

# 3. 수동 API 테스트
# - 대학 조회 (common 스키마)
# - 회원 인증 (hub 스키마)
# - 수시/정시 조회 (susi/jungsi 스키마)
```

### 4.3 성능 테스트
```sql
-- 쿼리 실행 계획 확인
EXPLAIN ANALYZE SELECT * FROM common.ss_university WHERE id = 1;
EXPLAIN ANALYZE SELECT * FROM hub.auth_member WHERE email = 'test@example.com';
```

---

## 📊 Phase 5: 모니터링 및 최적화 (진행 중)

### 5.1 인덱스 최적화
```sql
-- 스키마별 인덱스 재생성
REINDEX SCHEMA common;
REINDEX SCHEMA hub;
REINDEX SCHEMA jungsi;
```

### 5.2 통계 업데이트
```sql
-- 쿼리 플래너를 위한 통계 수집
ANALYZE common.ss_university;
ANALYZE hub.auth_member;
-- ... 모든 주요 테이블
```

### 5.3 모니터링 쿼리
```sql
-- 스키마별 테이블 크기
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname IN ('common', 'hub', 'susi', 'jungsi', 'examhub', 'myclass')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔐 Phase 6: 접근 제어 및 보안 (1-2일)

### 6.1 스키마별 역할 생성 (선택사항)
```sql
-- 읽기 전용 사용자 (분석, 리포팅)
CREATE ROLE hub_readonly;
GRANT USAGE ON SCHEMA common, hub, susi, jungsi TO hub_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA common, hub, susi, jungsi TO hub_readonly;

-- Susi 전용 사용자
CREATE ROLE susi_user WITH LOGIN PASSWORD 'susi_password';
GRANT USAGE ON SCHEMA common, susi TO susi_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA susi TO susi_user;
GRANT SELECT ON ALL TABLES IN SCHEMA common TO susi_user;

-- Jungsi 전용 사용자
CREATE ROLE jungsi_user WITH LOGIN PASSWORD 'jungsi_password';
GRANT USAGE ON SCHEMA common, jungsi TO jungsi_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA jungsi TO jungsi_user;
GRANT SELECT ON ALL TABLES IN SCHEMA common TO jungsi_user;
```

### 6.2 Row Level Security (선택사항)
```sql
-- 멀티 테넌시 지원을 위한 RLS 설정
ALTER TABLE hub.auth_member ENABLE ROW LEVEL SECURITY;

CREATE POLICY hub_member_isolation ON hub.auth_member
  USING (organization_id = current_setting('app.current_organization_id')::INTEGER);
```

---

## 📁 마이그레이션 파일 구조

```
Hub-Backend/
├── scripts/
│   ├── create-schemas.sql              # 스키마 생성
│   ├── migrate-schemas.sql             # 테이블 이동
│   ├── validate-migration.sql          # 검증 쿼리
│   └── rollback-migration.sql          # 롤백 스크립트
├── src/
│   ├── migrations/
│   │   ├── 1706000000000-CreateSchemas.ts
│   │   ├── 1706000001000-MoveCommonTables.ts
│   │   ├── 1706000002000-MoveHubTables.ts
│   │   ├── 1706000003000-MoveJungsiTables.ts
│   │   └── 1706000004000-MoveSusiTables.ts
│   └── database/
│       └── entities/
│           ├── core/              # schema: 'common'
│           ├── members/           # schema: 'hub'
│           ├── jungsi/            # schema: 'jungsi'
│           └── susi/              # schema: 'susi'
└── SCHEMA_MIGRATION_PLAN.md       # 이 문서
```

---

## ⚠️ 주의사항

### 1. 외래 키 제약 조건
- 스키마 간 외래 키는 가능하지만 성능 영향 고려
- 예: `hub.auth_member` ← `jungsi.js_user_scores`

```sql
-- 크로스 스키마 외래 키
ALTER TABLE jungsi.js_user_scores
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES hub.auth_member(id);
```

### 2. 기존 쿼리 수정
- 하드코딩된 테이블명 → 스키마 포함 참조로 변경
- Raw SQL 쿼리 업데이트 필요

```typescript
// Before
await queryRunner.query(`SELECT * FROM auth_member WHERE id = $1`, [id]);

// After
await queryRunner.query(`SELECT * FROM hub.auth_member WHERE id = $1`, [id]);
```

### 3. TypeORM Relation 업데이트
```typescript
// 크로스 스키마 관계 설정
@Entity({ schema: 'jungsi', name: 'js_user_scores' })
export class JsUserScoresEntity {
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'user_id' })
  user: MemberEntity;  // hub.auth_member와의 관계
}
```

---

## 📅 예상 일정

| Phase | 작업 | 소요 시간 | 담당 | 상태 |
|-------|------|-----------|------|------|
| 0 | 현재 상황 분석 | 0.5일 | Dev | ⏳ 진행 중 |
| 1 | DB 및 스키마 생성 | 1일 | Dev | 📋 대기 |
| 2 | TypeORM 설정 변경 | 2일 | Dev | 📋 대기 |
| 3 | 데이터 마이그레이션 | 3일 | Dev | 📋 대기 |
| 4 | 검증 및 테스트 | 2일 | QA | 📋 대기 |
| 5 | 모니터링 설정 | 1일 | DevOps | 📋 대기 |
| 6 | 접근 제어 설정 | 1일 | Dev | 📋 대기 |
| **합계** | | **10-11일** | | |

---

## 🎯 성공 기준

- [ ] 모든 테이블이 적절한 스키마로 이동
- [ ] 기존 데이터 무결성 유지 (레코드 수 일치)
- [ ] 모든 API 엔드포인트 정상 작동
- [ ] 유닛 테스트 및 E2E 테스트 통과
- [ ] 성능 저하 없음 (응답 시간 ±10% 이내)
- [ ] 롤백 절차 문서화 및 테스트 완료

---

## 📚 참고 자료

- [TypeORM Schema Documentation](https://typeorm.io/entity-options#schema)
- [PostgreSQL Schema Documentation](https://www.postgresql.org/docs/14/ddl-schemas.html)
- [PostgreSQL ALTER TABLE SET SCHEMA](https://www.postgresql.org/docs/14/sql-altertable.html)

---

## 🤝 Next Steps

1. ✅ 이 계획 검토 및 승인
2. 📋 Phase 1 실행: 스키마 생성 스크립트 작성
3. 📋 Phase 2 실행: TypeORM 엔티티 업데이트
4. 📋 Phase 3 실행: 데이터 마이그레이션
5. 📋 Phase 4 실행: 테스트 및 검증

---

**작성일**: 2026-01-23
**최종 수정일**: 2026-01-23
**버전**: 1.0
