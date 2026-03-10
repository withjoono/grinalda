# GB-Back-Nest-Original: Complete Architecture Documentation

> 거북스쿨(Turtle School) 백엔드 시스템 완전 분석 문서
>
> **작성일**: 2025-11-21
> **프레임워크**: NestJS + TypeORM
> **데이터베이스**: MySQL
> **언어**: TypeScript

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [전체 프로젝트 구조](#2-전체-프로젝트-구조)
3. [핵심 모듈 아키텍처](#3-핵심-모듈-아키텍처)
4. [데이터베이스 엔티티 관계도](#4-데이터베이스-엔티티-관계도)
5. [글로벌 파이프라인 & 미들웨어](#5-글로벌-파이프라인--미들웨어)
6. [코드 패턴 및 컨벤션](#6-코드-패턴-및-컨벤션)
7. [설정 파일 & 환경변수](#7-설정-파일--환경변수)
8. [API 엔드포인트 요약](#8-api-엔드포인트-요약)
9. [코드 흐름 예시](#9-코드-흐름-예시)
10. [데이터베이스 테이블 목록](#10-데이터베이스-테이블-목록)
11. [주요 아키텍처 결정사항](#11-주요-아키텍처-결정사항)
12. [개발 환경 설정](#12-개발-환경-설정)
13. [핵심 파일 위치](#13-핵심-파일-위치)

---

## 1. 프로젝트 개요

### 기본 정보
- **프로젝트명**: Turtle School (거북스쿨) Backend
- **프레임워크**: NestJS with TypeORM
- **언어**: TypeScript
- **포트**: 3000 (default) / 4000 (configured)
- **데이터베이스**: MySQL 2 with TypeORM

### 주요 기능
- 🔐 회원 인증/인가 (JWT)
- 🎓 대학 입시 정보 제공 (수시/정시)
- 📊 모의고사 성적 관리
- 📝 생활기록부 관리
- 💰 결제 시스템 (IamPort)
- 📱 SMS 인증 (Aligo)
- 👨‍💼 입학사정관 평가 시스템
- 💬 커뮤니티 게시판

### 핵심 의존성
```json
{
  "@nestjs/common": "^10.x",
  "@nestjs/typeorm": "^10.x",
  "typeorm": "^0.3.x",
  "passport-jwt": "JWT 인증",
  "bcrypt": "비밀번호 해싱",
  "axios": "HTTP 클라이언트",
  "@aws-sdk/client-s3": "파일 업로드",
  "@sentry/node": "에러 트래킹",
  "winston": "로깅",
  "xlsx": "엑셀 처리"
}
```

---

## 2. 전체 프로젝트 구조

```
src/
├── admin/                          # 관리자 대시보드
│   ├── controllers/                # 8개 관리자 컨트롤러
│   ├── services/                   # 8개 관리자 서비스
│   ├── dtos/                       # 응답 DTO
│   └── excel-mapper/               # 엑셀 임포트/익스포트 매핑
│
├── auth/                           # 인증 모듈
│   ├── auth.controller.ts         # 로그인/회원가입 엔드포인트
│   ├── auth.service.ts            # 인증 비즈니스 로직
│   ├── auth.module.ts             # 인증 모듈 정의
│   ├── config/                    # JWT/인증 설정
│   ├── decorators/                # @Public(), @CurrentMemberId(), @Roles()
│   ├── dtos/                      # 로그인, 회원가입, 토큰 갱신 DTO
│   ├── guards/                    # JwtAuthGuard, RolesGuard
│   ├── strategies/                # JWT 전략
│   └── types/                     # 인증 응답 타입
│
├── aws-upload/                     # AWS S3 파일 업로드
│   ├── aws-upload.service.ts
│   ├── controllers/
│   └── config/
│
├── common/                         # 공통 유틸리티
│   ├── bcrypt/                    # Bcrypt 서비스 (Spring 호환)
│   ├── jwt/                       # JWT 서비스 (Spring 호환)
│   ├── dtos/                      # 공통 응답 DTO
│   ├── filters/                   # HttpExceptionFilter
│   ├── interceptors/              # SuccessResponseInterceptor, SentryInterceptor
│   └── utils/                     # Winston 로거 설정
│
├── config/                         # 앱 전역 설정
│   ├── app-config.ts              # 포트, 노드 환경
│   ├── config.type.ts             # 설정 타입 정의
│   └── app-config.type.ts
│
├── database/                       # 데이터베이스 설정
│   ├── config/
│   │   └── database-config.ts     # TypeORM 설정
│   ├── entities/                   # 모든 데이터베이스 엔티티
│   │   ├── boards/                # 게시판, 포스트, 댓글
│   │   ├── common-code/           # 과목 코드
│   │   ├── core/                  # 대학, 전형, 모집단위 데이터
│   │   ├── essay/                 # 논술 데이터
│   │   ├── member/                # 회원 및 관계
│   │   ├── mock-exam/             # 모의고사 성적 및 일정
│   │   ├── officer-evaluation/    # 입학사정관 평가 데이터
│   │   ├── pay/                   # 결제 주문, 쿠폰, 계약
│   │   ├── schoolrecord/          # 생활기록부 데이터
│   │   └── susi/                  # 수시 전형 데이터
│   └── typeorm-config.service.ts  # TypeORM 초기화
│
├── modules/                        # 기능 모듈
│   ├── board/                     # 게시판, 포스트, 댓글 관리
│   ├── common-code/               # 정적 코드 데이터
│   ├── core/                      # 대학, 전형, 모집단위
│   ├── essay/                     # 논술 관리
│   ├── exploration/               # 대학 탐색/검색
│   ├── members/                   # 사용자 프로필 및 선호도
│   ├── mock-exam/                 # 모의고사 관리
│   ├── officer/                   # 입학사정관 평가
│   ├── pay/                       # 결제 처리 (IamPort)
│   ├── schoolrecord/              # 생활기록부
│   ├── sms/                       # SMS 발송 (Aligo)
│   ├── static-data/               # 정적 데이터 로딩
│   ├── store/                     # 상품 스토어
│   └── susi/                      # 수시 전형 관리
│
├── app.controller.ts              # 루트 컨트롤러
├── app.module.ts                  # 루트 모듈 (모든 모듈 임포트)
├── app.service.ts                 # 루트 서비스
└── main.ts                        # 애플리케이션 부트스트랩
```

---

## 3. 핵심 모듈 아키텍처

### 3.1 Authentication Module (`/auth`)

**책임**: 사용자 로그인, 회원가입, JWT 토큰 관리

#### 주요 컴포넌트

**AuthController**
- `POST /auth/login/email`: 이메일 로그인
- `POST /auth/register/email`: 이메일 회원가입
- `POST /auth/login/social`: 소셜 로그인
- `POST /auth/register/social`: 소셜 회원가입
- `POST /auth/refresh`: 토큰 갱신
- `POST /auth/send-signup-code`: SMS 인증 코드 발송
- `POST /auth/verify-code`: SMS 코드 검증
- `GET /auth/me`: 현재 사용자 정보
- `GET /auth/me/active`: 활성 서비스 조회

**AuthService**
- 핵심 인증 로직 및 토큰 생성
- bcrypt를 사용한 비밀번호 검증
- JWT 토큰 생성 및 검증

**Guards**
- `JwtAuthGuard`: 모든 요청에서 JWT 토큰 검증 (@Public() 제외)
- `RolesGuard`: @Roles() 데코레이터와 함께 사용자 역할 검증

**Decorators**
- `@Public()`: 인증 스킵
- `@CurrentMemberId()`: 현재 사용자 ID 주입
- `@Roles(['ROLE_ADMIN'])`: 특정 역할 요구

#### 인증 흐름

```
1. 클라이언트가 POST /auth/login/email로 자격증명 전송
   ↓
2. AuthService가 bcrypt로 자격증명 검증
   ↓
3. JWT 토큰 생성 및 반환
   ↓
4. 이후 요청은 Authorization 헤더에 토큰 포함
   ↓
5. JwtAuthGuard가 토큰 검증 및 memberId 추출
   ↓
6. @Roles()가 있으면 RolesGuard가 권한 확인
```

---

### 3.2 Members Module (`/modules/members`)

**책임**: 사용자 프로필 관리, 관심사, 조합

#### 관리되는 엔티티

- `MemberEntity`: 핵심 사용자 계정
- `MemberInterestsEntity`: 저장된 관심사 (수시 교과, 수시 학종, 논술)
- `MemberRecruitmentUnitCombinationEntity`: 저장된 모집단위 조합
- `MemberRegularInterestsEntity`: 정시 관심사
- `MemberRegularCombinationEntity`: 정시 조합
- `MemberUploadFileListEntity`: 사용자 업로드 파일

#### 컨트롤러

- `MembersController`: 프로필 CRUD, 생활기록부
- `MemberInterestsController`: 관심사 관리
- `MemberCombinationController`: 모집단위 조합
- `MemberRegularCombinationController`: 정시 조합
- `MemberSchoolRecordController`: 생활기록부 접근

#### 주요 서비스

- `MembersService`: 사용자 CRUD, 프로필 편집
- `MemberInterestsService`: 관심사 목록 관리
- `MemberRecruitmentUnitCombinationService`: 조합 로직
- `MemberRegularCombinationService`: 정시 조합 로직

---

### 3.3 Core & Susi Modules (대학 데이터)

#### Core Module (`/modules/core`)

**책임**: 대학, 전형, 모집단위 마스터 데이터

**주요 엔티티 (마스터 데이터)**

대학 관련:
- `UniversityEntity`: 대학 정보

전형 관련:
- `AdmissionEntity`: 전형 유형
- `AdmissionCategoryEntity`: 중심전형분류 (학생부교과, 학생부학종)
- `AdmissionSubtypeEntity`: 전형 세부유형 (농어촌, 특기자)
- `AdmissionMethodEntity`: 전형방법 및 성적 비율

계열 관련:
- `GeneralFieldEntity`: 기본 계열 (자연, 인문, 예체능, 의치한약수)
- `MajorFieldEntity`: 대계열 (예: 공학)
- `MidFieldEntity`: 중계열 (예: 기계공학)
- `MinorFieldEntity`: 소계열 (예: 기계공학과)

모집단위 관련:
- `RecruitmentUnitEntity`: 모집단위
- `RecruitmentUnitScoreEntity`: 성적 컷라인 및 위험도
- `RecruitmentUnitInterviewEntity`: 면접 정보
- `RecruitmentUnitMinimumGradeEntity`: 최저등급 요구사항
- `RecruitmentUnitPreviousResultEntity`: 과거 입시결과
- `RecruitmentUnitPassFailRecordsEntity`: 합불 데이터

정시 관련:
- `RegularAdmissionEntity`: 정시 전형 데이터
- `RegularAdmissionPreviousResultEntity`: 정시 과거 결과

**컨트롤러**

- `CoreUniversityController`: 대학 검색/필터
- `CoreAdmissionController`: 전형 유형
- `CoreAdmissionCategoryController`: 전형 카테고리
- `CoreAdmissionSubtypeController`: 전형 세부유형
- `CoreFieldsController`: 계열 계층구조
- `CoreRecruitmentController`: 모집단위 상세
- `CoreRegularAdmissionController`: 정시 전형

---

#### Susi Module (`/modules/susi`)

**책임**: 수시 전형 데이터 관리

**엔티티**

- `SuSiSubjectEntity`: 수시 교과 전형
- `SusiComprehensiveEntity`: 수시 학종 전형
- `SusiPassRecordEntity`: 합불 사례
- `RecruitmentUnitPassFailRecordsEntity`: 모집단위별 합불

**컨트롤러**

- `SusiSubjectController`: 5단계 교과 선택 흐름
- `SusiComprehensiveController`: 학종 전형 데이터
- `SusiPassRecordController`: 합불 사례 데이터

**5단계 흐름 (수시 교과)**

```
Step 1: 연도 및 전형 유형 선택
   ↓
Step 2: 최저등급 요구사항 조회
   ↓
Step 3: 비교과 데이터 조회
   ↓
Step 4: 모집단위 데이터 조회
   ↓
Step 5: 최종 모집단위/성적 데이터
```

---

### 3.4 Payment Module (`/modules/pay`)

**책임**: IamPort를 통한 결제 처리

#### 엔티티

- `PayOrderEntity`: 결제 주문
- `PayServiceEntity`: 상품 제공
- `PayCouponEntity`: 할인 쿠폰
- `PayContractEntity`: 구독 계약
- `PayCancelLogEntity`: 취소 로그

#### 서비스

- `PaymentService`: 주문 생성, 검증
- `CouponService`: 쿠폰 로직
- `ContractService`: 구독 관리
- `IamPortService`: IamPort API 연동

#### 결제 흐름

```
1. 클라이언트가 상품 정보 요청
   ↓
2. PayOrder 생성 (금액 포함)
   ↓
3. 클라이언트가 IamPort를 통해 결제 처리
   ↓
4. 서버가 IamPort로 결제 검증
   ↓
5. 해당되는 경우 구독 생성
```

---

### 3.5 Mock Exam Module (`/modules/mock-exam`)

**책임**: 모의고사 성적 관리

**엔티티**
- `MockexamScheduleEntity`: 모의고사 일정
- `MockexamRawScoreEntity`: 사용자 원점수
- `MockexamRawToStandardEntity`: 원점수-표준점수 변환
- `MockexamStandardScoreEntity`: 사용자 표준점수
- `MockexamScoreEntity`: 레거시 성적 엔티티

---

### 3.6 School Record Module (`/modules/schoolrecord`)

**책임**: 생활기록부 데이터 관리

**엔티티**
- `SchoolRecordAttendanceDetailEntity`: 출결 사항
- `SchoolRecordSelectSubjectEntity`: 선택 과목
- `SchoolRecordSubjectLearningEntity`: 핵심 과목
- `SchoolRecordVolunteerEntity`: 봉사활동
- `SchoolrecordSportsArtEntity`: 체육/예술 활동

---

### 3.7 Officer Evaluation Module (`/modules/officer`)

**책임**: 입학사정관 평가 시스템

**엔티티**
- `OfficerEvaluationEntity`: 평가 기록
- `OfficerEvaluationSurveyEntity`: 평가 질문
- `OfficerEvaluationCommentEntity`: 사전 설정 코멘트
- `OfficerEvaluationScoreEntity`: 질문별 점수
- `OfficerListEntity`: 입학사정관 정보
- `OfficerTicketEntity`: 평가 세션 티켓

---

### 3.8 Essay Module (`/modules/essay`)

**책임**: 논술 전형 데이터

**엔티티**
- `EssayListEntity`: 논술 전형 프로그램
- `EssayLowestGradeListEntity`: 최저등급 요구사항

---

### 3.9 Board Module (`/modules/board`)

**책임**: 커뮤니티 게시판/포럼

**엔티티**
- `BoardEntity`: 게시판 설정
- `PostEntity`: 포럼 게시글
- `CommentEntity`: 게시글 댓글

---

### 3.10 SMS Module (`/modules/sms`)

**책임**: Aligo를 통한 SMS 발송

**서비스**
- `SmsService`: 인증 코드 발송, 알림

---

### 3.11 Static Data & Exploration Modules

**Static Data Module**: 정적 참조 데이터 로드 및 캐싱
**Exploration Module**: 대학 검색/필터링 기능

---

## 4. 데이터베이스 엔티티 관계도

```
Member (회원)
├─ MemberInterests (관심사)
├─ MemberRecruitmentUnitCombination (모집단위 조합)
│  ├─ RecruitmentUnit (모집단위)
│  │  ├─ University (대학)
│  │  ├─ AdmissionCategory (전형분류)
│  │  ├─ Admission (전형)
│  │  ├─ MinorField (소계열)
│  │  │  └─ MidField (중계열)
│  │  │     └─ MajorField (대계열)
│  │  ├─ RecruitmentUnitScore (성적)
│  │  ├─ RecruitmentUnitInterview (면접)
│  │  ├─ RecruitmentUnitMinimumGrade (최저등급)
│  │  └─ RecruitmentUnitPreviousResult (과거결과)
│  └─ SuSiSubject (수시교과)
├─ MemberRegularCombination (정시조합)
│  └─ RegularAdmission (정시전형)
│     └─ University (대학)
├─ SchoolRecord (생활기록부: 출결, 과목, 봉사, 체육/예술)
├─ MockexamScore (모의고사)
├─ Post (게시글)
└─ Comment (댓글)

University (대학)
├─ AdmissionMethod (전형방법)
├─ Admission (전형, AdmissionSubtype 포함)
├─ RecruitmentUnit (모집단위)
│  ├─ MinorField (소계열)
│  ├─ Admission (전형)
│  ├─ RecruitmentUnitScore (성적)
│  ├─ RecruitmentUnitInterview (면접)
│  ├─ RecruitmentUnitMinimumGrade (최저등급)
│  └─ RecruitmentUnitPassFailRecords (합불기록)
└─ RegularAdmission (정시전형)

계열 계층구조:
GeneralField (기본계열) → MajorField (대계열) → MidField (중계열) → MinorField (소계열)

OfficerEvaluation (입학사정관 평가)
├─ OfficerList (사정관 목록)
├─ OfficerEvaluationSurvey (평가 설문)
├─ OfficerEvaluationScore (평가 점수)
└─ OfficerEvaluationComment (평가 코멘트)

Payment (결제)
PayOrder → PayService, PayCoupon
PayContract → PayService
```

---

## 5. 글로벌 파이프라인 & 미들웨어

### 5.1 애플리케이션 부트스트랩 (`main.ts`)

```typescript
흐름:
1. NestFactory로 앱 생성
2. ConfigService 로드
3. ValidationPipe 적용 (whitelist, forbidUnknown, transform)
4. ClassSerializerInterceptor 적용 (@Expose/@Exclude용)
5. SentryInterceptor 적용 (에러 트래킹)
6. Swagger 문서화 설정
7. 설정된 도메인에 대해 CORS 활성화
8. Sentry 에러 트래킹 초기화
9. 설정된 포트에서 Listen
```

### 5.2 요청 생명주기

```
Request (요청)
  ↓
CORS Middleware
  ↓
Validation Pipe → DTO 검증 & 변환
  ↓
JwtAuthGuard → 토큰 검증 (@Public() 제외)
  ↓
RolesGuard → 역할 인가 (@Roles() 있는 경우)
  ↓
Controller Route Handler (컨트롤러 라우트 핸들러)
  ↓
Service Logic (서비스 로직)
  ↓
Database Queries (TypeORM) (데이터베이스 쿼리)
  ↓
SuccessResponseInterceptor → {success: true, data: ...}로 래핑
  ↓
Response (응답)
```

### 5.3 에러 처리

```
Exception (예외)
  ↓
HttpExceptionFilter → 에러 응답 포맷
  ↓
SentryInterceptor → Sentry에 로그
  ↓
Response: {success: false, statusCode, message, timestamp, path}
```

---

## 6. 코드 패턴 및 컨벤션

### 6.1 모듈 패턴

각 기능 모듈은 다음을 따름:
- `.module.ts`: 컨트롤러, 프로바이더, 임포트 내보내기
- `.controller.ts`: HTTP 엔드포인트
- `.service.ts`: 비즈니스 로직
- `dtos/`: 요청/응답 DTO
- 필요한 경우 설정 파일

### 6.2 서비스 레이어 패턴

```typescript
Service (Injectable)
├─ 생성자 주입 (Repository, 다른 Services)
├─ 유스케이스별 메서드
├─ 레포지토리 및 외부 서비스 호출
├─ 원본 또는 포맷된 데이터 반환
└─ 에러 시 HttpException 발생
```

### 6.3 컨트롤러 패턴

```typescript
Controller('route')
├─ 생성자 주입 (Services)
├─ 엔드포인트별 라우트 핸들러
├─ 데코레이터: @Get, @Post, @Param, @Query, @Body, @CurrentMemberId
├─ class-validator를 통한 DTO 검증
├─ 서비스 메서드 호출
└─ 데이터 반환 (SuccessResponseInterceptor로 래핑됨)
```

### 6.4 DTO 패턴

- **요청 DTO**: `class-validator`로 입력 검증
- **응답 DTO**: 출력 포맷, `@Expose()`, `@Exclude()`, `@Transform()` 사용
- **직렬화 그룹**: `@SerializeOptions({ groups: ['me', 'admin'] })`

### 6.5 인증 패턴

```typescript
@Public() 있는 라우트 → JWT 검증 스킵
@Public() 없는 라우트 → JWT 검증 (필수)
@Roles(['ROLE_ADMIN']) 있는 라우트 → 역할도 확인
```

---

## 7. 설정 파일 & 환경변수

### 7.1 설정 구조

**app-config.ts:**
- `NODE_ENV`: development | production
- `SERVER_PORT`: 애플리케이션 포트
- `APP_NAME`: 애플리케이션 이름

**database-config.ts:**
- `DB_TYPE`: mysql
- `DB_HOST`: 데이터베이스 호스트
- `DB_PORT`: 데이터베이스 포트 (기본 3306)
- `DB_USER`: 데이터베이스 사용자
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `DB_NAME`: 데이터베이스 이름
- `DB_SYNCHRONIZE`: false (의도치 않은 동기화 방지)

**auth-config.ts:**
- `JWT_SECRET`: 토큰 서명용 비밀 키
- `JWT_EXPIRATION`: 토큰 수명

**pay-config.ts:**
- `IAMPORT_REST_API_KEY`
- `IAMPORT_REST_API_SECRET`

**sms-config.ts:**
- `SMS_API_KEY`: Aligo SMS 서비스 키

**aws-upload-config.ts:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_REGION`

---

## 8. API 엔드포인트 요약

### 인증 (Authentication)
```
POST   /auth/login/email              # 이메일 로그인
POST   /auth/register/email           # 이메일 회원가입
POST   /auth/login/social             # 소셜 로그인
POST   /auth/register/social          # 소셜 회원가입
POST   /auth/refresh                  # 토큰 갱신
POST   /auth/send-signup-code         # SMS 인증 코드 발송
POST   /auth/verify-code              # SMS 코드 검증
GET    /auth/me                       # 현재 사용자 정보
GET    /auth/me/active                # 활성 서비스 조회
```

### 회원 (Members)
```
PATCH  /members/profile                # 프로필 업데이트
PATCH  /members/life-record            # 생활기록부 업데이트
GET    /members/interests              # 저장된 관심사 조회
POST   /members/interests              # 관심사 추가
DELETE /members/interests/:id          # 관심사 제거
POST   /members/combinations           # 조합 저장
```

### 수시 전형 (Susi - Early Admission)
```
GET    /susi/subject/step-1            # 1단계: 연도/전형 유형 선택
GET    /susi/subject/step-2            # 2단계: 최저등급 요구사항
GET    /susi/subject/step-3            # 3단계: 비교과 데이터
GET    /susi/subject/step-4            # 4단계: 모집단위
GET    /susi/subject/step-5            # 5단계: 최종 모집단위/성적
GET    /susi/comprehensive/*           # 학종 전형 데이터
GET    /susi/pass-record/*             # 합불 사례
```

### 대학 & 전형 (Core - Universities & Admissions)
```
GET    /core/universities              # 대학 목록/검색
GET    /core/admissions                # 전형 유형
GET    /core/recruitment-units         # 모집단위 상세
GET    /core/regular-admissions        # 정시 전형
```

### 결제 (Payment)
```
POST   /pay/orders                     # 결제 주문 생성
GET    /pay/orders/:id                 # 주문 상세 조회
POST   /pay/validate                   # 결제 검증
POST   /pay/cancel                     # 결제 취소
GET    /pay/services                   # 상품 조회
```

### 게시판 (Board)
```
GET    /board                          # 게시판 목록
GET    /board/:id/posts                # 게시글 목록
POST   /board/:id/posts                # 게시글 작성
PATCH  /board/posts/:id                # 게시글 수정
DELETE /board/posts/:id                # 게시글 삭제
POST   /board/posts/:id/comments       # 댓글 추가
```

### 관리자 (Admin)
```
GET    /admin/members                  # 회원 목록
GET    /admin/statistics               # 통계
POST   /admin/susi-subject/upload      # 수시 교과 데이터 업로드 (Excel)
POST   /admin/susi-comprehensive/upload # 수시 학종 데이터 업로드
```

---

## 9. 코드 흐름 예시

### 사용자 회원가입 흐름

```
1. 클라이언트: POST /auth/register/email
   Body: { email, password, name, ... }

2. Controller: AuthController.registerWithEmail()
   - RegisterWithEmailDto 검증

3. Service: AuthService.registerWithEmail()
   - 이메일 존재 여부 확인
   - bcrypt로 비밀번호 해싱
   - MemberEntity 생성

4. Repository: member_tb에 INSERT

5. Service: JWT 토큰 생성

6. Response:
   {
     success: true,
     data: {
       token: "eyJhbGc...",
       memberId: 123,
       email: "user@example.com",
       ...
     }
   }
```

### 수시 교과 5단계 조회 흐름

```
Step 1: GET /susi/subject/step-1?year=2025
  → 연도별 전형 목록 반환

Step 2: GET /susi/subject/step-2?admissionId=5
  → 최저등급 요구사항 반환

Step 3: GET /susi/subject/step-3?admissionId=5
  → 비교과 데이터 반환

Step 4: GET /susi/subject/step-4?admissionId=5&fieldId=10
  → 모집단위 목록 반환

Step 5: GET /susi/subject/step-5?recruitmentUnitId=100
  → 최종 모집단위 상세 데이터 및 성적 정보 반환
```

### 결제 처리 흐름

```
1. 클라이언트: GET /pay/services
   → 상품 목록 조회

2. 클라이언트: POST /pay/orders
   Body: { serviceId, couponId? }
   → 서버가 PayOrder 생성 및 merchant_uid 반환

3. 클라이언트: IamPort SDK를 통해 결제 진행
   → IamPort가 결제 처리

4. 클라이언트: POST /pay/validate
   Body: { imp_uid, merchant_uid }
   → 서버가 IamPort API로 결제 검증

5. 서버: PayContract 생성 (구독 상품인 경우)

6. Response:
   {
     success: true,
     data: {
       orderId: 123,
       status: "paid",
       ...
     }
   }
```

---

## 10. 데이터베이스 테이블 목록

**총 57개 테이블**

### 회원 관련 (6개)
- `member_tb`
- `member_interests`
- `member_file`
- `member_recruitment_unit_combination`
- `member_regular_interests`
- `member_regular_combination`

### 학업 데이터 (11개)
- `susi_subject`
- `susi_comprehensive`
- `susi_pass_record`
- `essay`
- `essay_lowest_grade`
- `mockexam_*` (모의고사 관련)
- `schoolrecord_*` (생활기록부 관련)

### 대학 데이터 (18개)
- `university`
- `admission*` (전형 관련)
- `admission_method`
- `admission_subtype`
- `general_field`, `major_field`, `mid_field`, `minor_field` (계열)
- `recruitment_unit*` (모집단위 관련)
- `regular_admission*` (정시 관련)

### 입학사정관 평가 (6개)
- `officer`
- `officer_evaluation*`
- `officer_ticket`

### 결제 (5개)
- `pay_service`
- `pay_coupon`
- `pay_contract`
- `pay_order`
- `pay_cancel_log`

### 게시판 (3개)
- `board`
- `post`
- `comment`

### 공통 (2개)
- `subject_code_list`
- `mockexam_schedule`

---

## 11. 주요 아키텍처 결정사항

1. **모놀리식 구조**: 모든 기능을 제공하는 단일 백엔드
2. **역할 기반 접근 제어**: @Roles() 가드를 통한 관리자/사용자 분리
3. **Spring 호환성**: JWT 및 bcrypt가 Spring 호환 포맷 사용
4. **글로벌 인터셉터**: 모든 엔드포인트에서 일관된 응답 포맷
5. **설정 관리**: @nestjs/config를 통한 중앙집중식 설정
6. **ORM 선택**: 타입 안전한 데이터베이스 접근을 위한 TypeORM
7. **결제 연동**: 신용카드 처리를 위한 IamPort
8. **SMS 게이트웨이**: SMS 인증을 위한 Aligo
9. **파일 저장소**: 사용자 업로드를 위한 AWS S3
10. **에러 트래킹**: 프로덕션 모니터링을 위한 Sentry

---

## 12. 개발 환경 설정

### 환경 파일
- `.env.development`: 개발 데이터베이스 및 시크릿
- `.env.production`: 프로덕션 설정

### 스크립트
```bash
yarn start:dev   # Watch 모드 (HMR 포함)
yarn start:prod  # PM2로 프로덕션 실행
yarn build       # TypeScript 컴파일
yarn lint        # 코드 스타일 체크
yarn test        # 테스트 실행
```

### 주요 명령어
```bash
# 개발 서버 시작 (핫 리로드)
yarn start:dev

# 서버가 http://localhost:3000에서 시작됨
```

---

## 13. 핵심 파일 위치

| 파일 경로 | 목적 |
|-----------|------|
| `/src/app.module.ts` | 루트 모듈, 모든 기능 임포트 |
| `/src/main.ts` | 부트스트랩 및 앱 설정 |
| `/src/database/typeorm-config.service.ts` | 데이터베이스 초기화 |
| `/src/auth/auth.guard.ts` | JWT 검증 |
| `/src/common/interceptors/success-response.interceptor.ts` | 응답 래핑 |
| `/src/common/filters/http-exception-filter.ts` | 에러 처리 |
| `/src/database/entities/*` | 모든 데이터베이스 스키마 |

---

## 요약

이 문서는 GB-Back-Nest-Original 프로젝트의 아키텍처, 모듈, 데이터베이스 설계, API 엔드포인트, 코드 흐름 패턴에 대한 완전한 가시성을 제공합니다.

이 프로젝트는 대학 입시 데이터 관리를 위해 잘 구조화된 NestJS 애플리케이션으로, 사용자 프로필, 결제 처리, 관리자 기능을 포함하고 있습니다.

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-11-21
**분석 대상**: GB-Back-Nest-Original (E:\Dev\github\GB-Back-Nest-Original)
