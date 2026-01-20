# 서버 실행 지연 원인 분석 및 해결방안

## 📊 실행 소요 시간 분석

| 단계 | 소요 시간 | 상태 |
|------|-----------|------|
| 프론트엔드 (Vite) | ~1분 | ✅ 정상 |
| 백엔드 (NestJS) 1차 시도 | ~2분 | ❌ 실패 (컴파일만 완료) |
| Redis 연결 오류 발견 | +30초 | - |
| Redis 시작 | +10초 | - |
| 백엔드 2차 시도 | ~2분 | ✅ 성공 |
| **총 소요 시간** | **~6분** | - |

## 🔍 지연 원인 상세 분석

### 1. **Redis 미실행 (주요 원인)**

**문제**:
```
Redis Connection Error: ECONNREFUSED 127.0.0.1:6379
[Nest] ERROR [ExceptionHandler] AggregateError [ECONNREFUSED]
```

**원인**:
- 백엔드가 Redis를 **필수 의존성**으로 요구 (`@nestjs/cache-manager` + `cache-manager-redis-yet`)
- `package.json`의 `prestart:dev`가 PostgreSQL만 시작 (Redis 누락)
- Redis 연결 실패 시 NestJS 애플리케이션 전체가 부팅 중단

**영향**:
- 백엔드 TypeScript 컴파일 완료 후 서버 부팅 실패
- 사용자 개입 없이는 자동 복구 불가

### 2. **NestJS 컴파일 시간 (~2분)**

**원인**:
- TypeScript 파일 대량 컴파일 (70+ 모듈)
- 의존성 주입 메타데이터 생성
- TypeORM 엔티티 초기화

**정상 범위**: 첫 컴파일은 2-3분, 이후 watch 모드는 증분 컴파일

### 3. **Vite 빌드 시간 (~1분)**

**원인**:
- 대용량 의존성 사전 번들링 (React, Radix UI, TanStack 등)
- 66초 소요 (로그 기록)

**정상 범위**: Vite는 첫 빌드가 느리지만 HMR은 빠름

### 4. **시행착오 시간 (~2.5분)**

**원인**:
- Redis 문제 진단 및 해결
- 백엔드 재시작 대기

## ✅ 해결방안

### 즉시 적용 가능한 해결책

#### 1. **통합 시작 스크립트 사용** (권장)
```bash
# 모든 서비스 자동 시작
./start-dev.bat
```

#### 2. **Docker 서비스 사전 확인**
```bash
# PostgreSQL + Redis 동시 시작
docker start geobuk-postgres geobuk-redis
```

#### 3. **병렬 실행**
```bash
# 프론트엔드와 백엔드 동시 시작
npm run dev:all
```

### 장기 개선 방안

#### 1. **package.json prestart:dev 개선**
```json
{
  "prestart:dev": "npm run docker:start:all"
}
```

#### 2. **Redis 옵션화**
- Redis를 선택적 의존성으로 변경
- 연결 실패 시 경고만 출력하고 계속 진행

#### 3. **헬스체크 스크립트**
- 모든 의존성 상태 확인 후 서버 시작

## 🚀 다음 실행 시 권장 절차

### 방법 1: 자동화 스크립트 사용 (가장 간편)
```bash
# 프로젝트 루트에서
./start-dev.bat
```

### 방법 2: 수동 실행
```bash
# 1. Docker 서비스 시작 (백엔드 시작 전 필수)
docker start geobuk-postgres geobuk-redis

# 2. 프론트엔드 시작 (별도 터미널)
cd Hub-Frontend
npm run dev

# 3. 백엔드 시작 (별도 터미널)
cd Hub-Backend
yarn start:dev
```

### 방법 3: 상태 확인 후 실행
```bash
# 1. 의존성 확인
./check-dependencies.bat

# 2. 문제 없으면 서버 시작
./start-dev.bat
```

## 📋 필수 의존성 체크리스트

실행 전 확인:
- [ ] Docker Desktop 실행 중
- [ ] geobuk-postgres 컨테이너 실행 중
- [ ] geobuk-redis 컨테이너 실행 중
- [ ] 포트 3000, 4000, 5432, 6379 사용 가능

## 🔧 트러블슈팅

### Redis 연결 오류
```bash
# Redis 상태 확인
docker ps | grep redis

# Redis 시작
docker start geobuk-redis

# 없으면 생성
docker run --name geobuk-redis -p 6379:6379 -d redis:7-alpine
```

### PostgreSQL 연결 오류
```bash
# 상태 확인
docker ps | grep postgres

# 시작
docker start geobuk-postgres

# 없으면 setup-db.bat 실행
cd Hub-Backend
./setup-db.bat
```

### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr ":3000 :4000"

# 프로세스 종료 (PID 확인 후)
taskkill /F /PID <PID>
```

## 📈 성능 개선 예상

자동화 스크립트 적용 시:
- **기존**: ~6분 (시행착오 포함)
- **개선 후**: ~3분 (컴파일만)
- **개선율**: 50% 단축

두 번째 실행부터 (watch 모드):
- **기존**: ~6분 매번
- **개선 후**: ~10초 (증분 컴파일)
- **개선율**: 97% 단축
