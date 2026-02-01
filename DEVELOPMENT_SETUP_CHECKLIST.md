# 개발 환경 설정 체크리스트

## 최초 설정 (한 번만 실행)

### 1. Docker 컨테이너 생성

이미 생성되어 있다면 건너뛰세요.

```bash
# PostgreSQL
docker run --name geobuk-postgres \
  -e POSTGRES_PASSWORD=tsuser1234 \
  -e POSTGRES_USER=tsuser \
  -e POSTGRES_DB=geobukschool_dev \
  -p 5432:5432 -d postgres:14

# Redis
docker run --name geobuk-redis \
  -p 6379:6379 -d redis:7
```

### 2. 의존성 설치

```bash
# Backend
cd Hub-Backend
yarn install

# Frontend
cd Hub-Frontend
npm install
```

### 3. 환경 변수 설정

```bash
# Backend - 이미 .env.development 파일이 있으면 건너뛰기
cd Hub-Backend
cp .env.example .env.development
# 필요시 .env.development 파일 편집

# Frontend - 이미 .env 파일이 있으면 건너뛰기
cd Hub-Frontend
cp .env.example .env.local
# 필요시 .env.local 파일 편집
```

### 4. 데이터베이스 마이그레이션

```bash
cd Hub-Backend
yarn typeorm:run
```

### 5. 초기 빌드

```bash
cd Hub-Backend
yarn build
```

---

## 일일 개발 시작

### 빠른 시작 (30초 - 권장)

```bash
# 프로젝트 루트에서
start-dev-improved.bat
```

이 스크립트는:
- ✅ Docker 컨테이너 자동 확인/시작
- ✅ 의존성 자동 설치 (없을 경우)
- ✅ 빌드 자동 확인/실행 (없을 경우)
- ✅ 포트 충돌 확인
- ✅ 서버 시작 대기 및 상태 확인
- ✅ 브라우저 자동 오픈

### 수동 시작 (개발 모드)

```bash
# 1. Docker 컨테이너 시작
docker start geobuk-postgres geobuk-redis

# 2. Backend 시작 (새 터미널)
cd Hub-Backend
yarn start:dev

# 3. Frontend 시작 (새 터미널)
cd Hub-Frontend
npm run dev
```

---

## 서버 중지

### 자동 중지 (권장)

```bash
stop-dev-improved.bat
```

### 수동 중지

```bash
# Windows
# Backend 종료
netstat -ano | findstr :4000
taskkill /F /PID [PID번호]

# Frontend 종료
netstat -ano | findstr :3000
taskkill /F /PID [PID번호]

# Docker 중지 (선택)
docker stop geobuk-postgres geobuk-redis
```

---

## 사전 검증 스크립트

서버를 시작하기 전에 환경을 확인하려면:

```bash
check-dev-env.bat
```

이 스크립트는 자동으로:
- Docker 컨테이너 상태 확인
- 의존성 설치 여부 확인 (없으면 자동 설치)
- 빌드 상태 확인 (없으면 자동 빌드)
- 포트 사용 확인

---

## 트러블슈팅

### "Cannot find module dist/main.js"

```bash
cd Hub-Backend
npx tsc && npx tsc-alias
```

또는 빌드 체크 스크립트 실행:
```bash
node scripts/check-build.js
```

### "Port 4000 already in use"

```bash
# 자동 중지
stop-dev-improved.bat

# 또는 수동으로 포트 확인 후 종료
netstat -ano | findstr :4000
taskkill /F /PID [PID번호]
```

### "Module dependencies not resolved"

완전 초기화:
```bash
cd Hub-Backend
rm -rf dist node_modules
yarn install
yarn build
```

### Docker 컨테이너 접근 불가

```bash
# 컨테이너 재시작
docker restart geobuk-postgres geobuk-redis

# 컨테이너 상태 확인
docker ps -a | findstr geobuk

# 컨테이너 로그 확인
docker logs geobuk-postgres
docker logs geobuk-redis
```

### Frontend 빌드 오류

```bash
cd Hub-Frontend
rm -rf node_modules .vite
npm install
npm run dev
```

### Backend 모듈 의존성 오류

NestJS 모듈 의존성 문제가 발생하면:
1. 에러 메시지에서 필요한 모듈 확인
2. 해당 모듈을 imports 배열에 추가
3. 예: `imports: [JwtModule, MembersModule]`

---

## 포트 정보

| 서비스 | 포트 | URL |
|--------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 4000 | http://localhost:4000 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

---

## 유용한 명령어

### Backend

```bash
# 개발 모드 (watch)
yarn start:dev

# 프로덕션 빌드
yarn build

# 테스트
yarn test

# 마이그레이션 생성
yarn typeorm:generate -n MigrationName

# 마이그레이션 실행
yarn typeorm:run
```

### Frontend

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# Lint 검사
npm run lint
```

### Docker

```bash
# 컨테이너 목록
docker ps -a

# 컨테이너 시작
docker start geobuk-postgres geobuk-redis

# 컨테이너 중지
docker stop geobuk-postgres geobuk-redis

# 컨테이너 로그
docker logs -f geobuk-postgres

# PostgreSQL 접속
docker exec -it geobuk-postgres psql -U tsuser -d geobukschool_dev
```

---

## 성능 팁

1. **Docker Desktop 설정**
   - Resources → Memory: 최소 4GB 할당
   - Resources → CPU: 최소 2 cores 할당

2. **VSCode 설정**
   - TypeScript IntelliSense 자동 빌드 비활성화
   - `"typescript.tsserver.experimental.enableProjectDiagnostics": false`

3. **빌드 캐시**
   - `Hub-Backend/dist` 폴더는 gitignore되어 있지만 로컬에서는 유지
   - 매번 재빌드하지 않도록 `deleteOutDir: false` 설정됨

4. **Hot Reload**
   - Backend: NestJS watch 모드 자동 활성화
   - Frontend: Vite HMR 자동 활성화

---

## 다음 단계

개발 환경이 정상적으로 실행되면:

1. 브라우저에서 http://localhost:3000 열기
2. 회원가입 또는 로그인 테스트
3. Backend Swagger 문서 확인: http://localhost:4000/swagger

문제가 있다면 `SERVER_STARTUP_ISSUES_ANALYSIS.md` 문서를 참고하세요.
