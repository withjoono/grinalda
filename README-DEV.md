# Hub 개발 환경 빠른 시작 가이드

## 🚀 빠른 시작 (권장)

### 한 번에 모든 서버 실행
```bash
start-dev.bat
```

이 스크립트는 다음을 자동으로 수행합니다:
1. ✅ Docker 실행 확인
2. ✅ PostgreSQL 시작 (없으면 자동 생성)
3. ✅ Redis 시작 (없으면 자동 생성)
4. ✅ 포트 확인 (3000, 4000)
5. ✅ 프론트엔드 & 백엔드 시작

## 🔍 실행 전 상태 확인

```bash
check-dependencies.bat
```

모든 의존성이 정상인지 확인합니다:
- Docker Desktop 실행 상태
- PostgreSQL 컨테이너
- Redis 컨테이너
- 포트 사용 가능 여부
- Node.js/Yarn 설치

## 🛑 서버 중지

```bash
stop-dev.bat
```

모든 개발 서버를 안전하게 종료합니다.

## 📦 필수 의존성

### Docker 컨테이너
| 서비스 | 포트 | 컨테이너명 |
|--------|------|-----------|
| PostgreSQL | 5432 | geobuk-postgres |
| Redis | 6379 | geobuk-redis |

### 서버
| 서비스 | 포트 | URL |
|--------|------|-----|
| Frontend (Vite) | 3000 | http://localhost:3000 |
| Backend (NestJS) | 4000 | http://localhost:4000 |
| Swagger API Docs | 4000 | http://localhost:4000/swagger |

## 🔧 수동 실행 (고급)

### 1단계: Docker 서비스 시작
```bash
# PostgreSQL + Redis 시작
docker start geobuk-postgres geobuk-redis

# 또는 처음 생성
docker run --name geobuk-postgres \
  -e POSTGRES_PASSWORD=tsuser1234 \
  -e POSTGRES_USER=tsuser \
  -e POSTGRES_DB=geobukschool_dev \
  -p 5432:5432 -d postgres:14

docker run --name geobuk-redis \
  -p 6379:6379 -d redis:7-alpine
```

### 2단계: 백엔드 시작
```bash
cd Hub-Backend
yarn start:dev
```

### 3단계: 프론트엔드 시작
```bash
cd Hub-Frontend
npm run dev
```

## ⚠️ 일반적인 문제 해결

### Redis 연결 오류
```
Redis Connection Error: ECONNREFUSED 127.0.0.1:6379
```

**해결:**
```bash
docker start geobuk-redis
```

### PostgreSQL 연결 오류
```
ECONNREFUSED 127.0.0.1:5432
```

**해결:**
```bash
docker start geobuk-postgres
```

### 포트 충돌
```
Port 3000/4000 is already in use
```

**해결:**
```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr ":3000 :4000"

# 또는 stop-dev.bat 실행
stop-dev.bat
```

## 📊 성능 최적화 팁

### 첫 실행
- 예상 시간: 3-4분 (TypeScript 컴파일 + 의존성 번들링)
- 정상적인 범위입니다

### 두 번째 실행부터
- Watch 모드 활성화로 **10초 이내** 재시작
- 변경된 파일만 증분 컴파일

### 더 빠른 시작
1. **Docker Desktop 항상 실행 유지**
2. **컨테이너를 중지하지 말고 유지**
3. **IDE 터미널에서 watch 모드 유지**

## 📁 프로젝트 구조

```
Hub/
├── Hub-Frontend/          # React + Vite (Port 3000)
├── Hub-Backend/           # NestJS (Port 4000)
├── start-dev.bat          # 🚀 통합 시작 스크립트
├── stop-dev.bat           # 🛑 서버 중지 스크립트
├── check-dependencies.bat # ✅ 의존성 체크
└── README-DEV.md          # 이 문서
```

## 🎯 다음 단계

1. **서버 시작**: `start-dev.bat` 실행
2. **브라우저 열기**: http://localhost:3000
3. **API 테스트**: http://localhost:4000/swagger
4. **개발 시작**: 코드 변경 시 자동 새로고침

## 📚 추가 문서

- 상세 분석: `SERVER_STARTUP_ANALYSIS.md`
- 프론트엔드: `Hub-Frontend/CLAUDE.md`
- 백엔드: `Hub-Backend/CLAUDE.md`
