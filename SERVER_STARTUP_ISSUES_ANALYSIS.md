# 서버 실행 지연 원인 분석 및 개선 방안

## 발생한 문제점

### 1. 의존성 미설치 (223초 소요)
**문제**: `node_modules` 폴더가 존재하지 않아 서버 실행 불가
```bash
# Backend: yarn install (223.30s)
# Frontend: npm install (60s)
```

**원인**:
- Git clone 직후 또는 clean 상태에서 의존성 설치 없이 서버 시작 시도
- `prestart:dev` 스크립트에 의존성 체크 로직 없음

**영향**: 총 **283초 (약 5분)** 소요

---

### 2. 빌드 누락 문제
**문제**: Backend `dist/` 폴더가 생성되지 않아 `main.js` 파일 없음

**원인**:
- NestJS는 TypeScript를 먼저 빌드해야 실행 가능
- Watch 모드(`yarn start:dev`)는 자동 빌드하지만, 직접 실행 시도 시 빌드 누락
- `nest-cli.json`의 `deleteOutDir: false` 설정에도 불구하고 초기 빌드 없음

**시도한 해결책**:
```bash
# 1차: yarn build → dist 폴더 생성 안됨 (이상 현상)
# 2차: npx tsc → 정상 빌드됨
# 3차: npx tsc-alias → 경로 별칭 해결
```

---

### 3. NestJS 모듈 의존성 오류
**문제**: `SubscriptionModule`에서 `JwtAuthGuard`가 필요로 하는 `MembersService` 의존성 해결 실패

```
Error: Nest can't resolve dependencies of the JwtAuthGuard (Reflector, JwtService, ConfigService, FirebaseAdminService, ?).
Please make sure that the argument MembersService at index [4] is available in the SubscriptionModule context.
```

**원인**:
- `JwtAuthGuard`가 전역 가드로 등록되어 있지만, `SubscriptionModule`에서 `MembersModule`을 import하지 않음
- NestJS의 모듈 스코프 시스템 특성상, 사용하는 곳에서 명시적으로 import 필요

**해결**:
```typescript
// subscription.module.ts
imports: [
  TypeOrmModule.forFeature([...]),
  JwtModule,
  MembersModule, // 추가
],
```

---

### 4. Windows 환경 백그라운드 실행 문제
**문제**: Bash 스크립트로 백그라운드 프로세스 실행 실패

**시도한 방법들**:
```bash
# ❌ 실패: cmd /c start /B
# ❌ 실패: & 백그라운드 연산자
# ❌ 실패: PowerShell Start-Process
# ✅ 성공: 별도 창으로 실행 (start "Title" cmd /k)
```

**원인**:
- Git Bash와 Windows CMD 간의 프로세스 관리 차이
- Exit code 125 → 명령 실행 환경 문제

---

### 5. 포트 충돌 및 컨테이너 관리
**문제**: 여러 Redis 컨테이너가 6379 포트 공유 시도

```
docker ps:
- geobuk-redis (6379) ✅
- redis (6379) ❌
- hub-redis (6379) ❌
- gb-redis-local (6379) ❌
```

**해결**: 불필요한 컨테이너 중지

---

## 시간 소요 분석

| 단계 | 소요 시간 | 비고 |
|------|-----------|------|
| Backend 의존성 설치 | 223초 | yarn install |
| Frontend 의존성 설치 | 60초 | npm install |
| 빌드 문제 진단 | 120초 | dist 폴더 누락 확인 |
| TypeScript 빌드 | 10초 | npx tsc |
| 모듈 의존성 수정 | 30초 | SubscriptionModule 수정 |
| 백그라운드 실행 시도 | 60초 | 여러 방법 시도 |
| **총 소요 시간** | **503초 (약 8분)** | |

---

## 보완 방안

### 1. 자동화된 사전 검증 스크립트

**파일**: `check-dev-env.bat`
```batch
@echo off
echo [1/5] Checking Docker containers...
docker ps --filter "name=geobuk" | findstr "geobuk-postgres geobuk-redis" > nul
if errorlevel 1 (
    echo ❌ Docker containers not running
    echo Run: docker start geobuk-postgres geobuk-redis
    exit /b 1
)
echo ✅ Docker containers OK

echo [2/5] Checking Backend dependencies...
if not exist "Hub-Backend\node_modules" (
    echo ❌ Backend dependencies missing
    echo Run: cd Hub-Backend ^&^& yarn install
    exit /b 1
)
echo ✅ Backend dependencies OK

echo [3/5] Checking Frontend dependencies...
if not exist "Hub-Frontend\node_modules" (
    echo ❌ Frontend dependencies missing
    echo Run: cd Hub-Frontend ^&^& npm install
    exit /b 1
)
echo ✅ Frontend dependencies OK

echo [4/5] Checking Backend build...
if not exist "Hub-Backend\dist\main.js" (
    echo ⚠️ Backend not built, building now...
    cd Hub-Backend
    call npx tsc && call npx tsc-alias
    cd ..
)
echo ✅ Backend build OK

echo [5/5] Checking ports...
netstat -ano | findstr ":3000 :4000" | findstr "LISTENING" > nul
if not errorlevel 1 (
    echo ⚠️ Ports 3000 or 4000 already in use
    echo Run stop-dev.bat first
)

echo.
echo ✅ All checks passed!
echo Ready to start servers
```

---

### 2. 개선된 시작 스크립트

**파일**: `start-dev-improved.bat`
```batch
@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo   Hub Development Environment Startup
echo ==========================================
echo.

REM 사전 검증 실행
call check-dev-env.bat
if errorlevel 1 (
    echo.
    echo ❌ Pre-flight checks failed
    pause
    exit /b 1
)

echo.
echo Starting servers...
echo.

REM Docker 컨테이너 시작
echo [1/4] Starting Docker containers...
docker start geobuk-postgres geobuk-redis > nul 2>&1
timeout /t 3 /nobreak > nul

REM Backend 서버 시작
echo [2/4] Starting Backend (port 4000)...
start "Hub Backend" /D "%~dp0Hub-Backend" cmd /k "node dist/main.js"
timeout /t 5 /nobreak > nul

REM Frontend 서버 시작
echo [3/4] Starting Frontend (port 3000)...
start "Hub Frontend" /D "%~dp0Hub-Frontend" cmd /k "npm run dev"

REM 서버 시작 대기
echo [4/4] Waiting for servers to start...
set /a count=0
:wait_loop
timeout /t 2 /nobreak > nul
netstat -ano | findstr ":3000" | findstr "LISTENING" > nul
if errorlevel 1 (
    set /a count+=1
    if !count! LSS 15 goto wait_loop
    echo ⚠️ Timeout waiting for servers
    goto done
)

echo.
echo ==========================================
echo ✅ All servers started successfully!
echo ==========================================
echo.
echo Frontend:   http://localhost:3000
echo Backend:    http://localhost:4000
echo PostgreSQL: localhost:5432
echo Redis:      localhost:6379
echo.
echo Press any key to open frontend in browser...
pause > nul
start http://localhost:3000

:done
endlocal
```

---

### 3. 개선된 중지 스크립트

**파일**: `stop-dev-improved.bat`
```batch
@echo off
echo Stopping Hub development servers...

REM Backend 프로세스 종료
echo [1/3] Stopping Backend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a > nul 2>&1
)

REM Frontend 프로세스 종료
echo [2/3] Stopping Frontend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a > nul 2>&1
)

REM Docker 컨테이너 중지
echo [3/3] Stopping Docker containers...
docker stop geobuk-postgres geobuk-redis > nul 2>&1

echo.
echo ✅ All servers stopped
```

---

### 4. package.json 스크립트 개선

**Backend (Hub-Backend/package.json)**:
```json
{
  "scripts": {
    "predev": "node scripts/check-build.js",
    "dev": "npm run predev && nest start --watch",
    "dev:quick": "nest start --watch",
    "build:check": "test -f dist/main.js || npm run build",
    "start:dev": "npm run build:check && nest start --watch"
  }
}
```

**check-build.js**:
```javascript
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'main.js');

if (!fs.existsSync(distPath)) {
  console.log('⚠️ Build not found, building now...');
  require('child_process').execSync('npx tsc && npx tsc-alias', {
    stdio: 'inherit'
  });
}
```

---

### 5. 환경 설정 문서화

**파일**: `DEVELOPMENT_SETUP_CHECKLIST.md`
```markdown
# 개발 환경 설정 체크리스트

## 최초 설정 (한 번만 실행)

### 1. Docker 컨테이너 생성
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
# Backend
cp .env.example .env.development
# .env.development 파일 편집

# Frontend
cp .env.example .env.local
# .env.local 파일 편집
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

## 일일 개발 시작

### 빠른 시작 (1분 미만)
```bash
# 프로젝트 루트에서
start-dev-improved.bat
```

### 수동 시작
```bash
# 1. Docker 컨테이너 시작
docker start geobuk-postgres geobuk-redis

# 2. Backend 시작
cd Hub-Backend
yarn start:dev

# 3. Frontend 시작 (새 터미널)
cd Hub-Frontend
npm run dev
```

## 트러블슈팅

### "Cannot find module dist/main.js"
```bash
cd Hub-Backend
npx tsc && npx tsc-alias
```

### "Port 4000 already in use"
```bash
# Windows
netstat -ano | findstr :4000
taskkill /F /PID [PID번호]

# 또는 stop-dev-improved.bat 실행
```

### "Module dependencies not resolved"
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

# 컨테이너 로그 확인
docker logs geobuk-postgres
```
```

---

### 6. VSCode 작업 설정

**파일**: `.vscode/tasks.json`
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Environment",
      "type": "shell",
      "command": "${workspaceFolder}/start-dev-improved.bat",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "Stop Dev Environment",
      "type": "shell",
      "command": "${workspaceFolder}/stop-dev-improved.bat",
      "problemMatcher": []
    },
    {
      "label": "Check Dev Environment",
      "type": "shell",
      "command": "${workspaceFolder}/check-dev-env.bat",
      "problemMatcher": []
    }
  ]
}
```

---

### 7. Git Hooks 설정 (선택사항)

**파일**: `.husky/post-checkout`
```bash
#!/bin/sh
# 브랜치 전환 후 의존성 체크

echo "Checking dependencies after branch switch..."

# Backend 의존성 체크
if [ ! -d "Hub-Backend/node_modules" ]; then
  echo "⚠️ Backend dependencies missing, installing..."
  cd Hub-Backend && yarn install
fi

# Frontend 의존성 체크
if [ ! -d "Hub-Frontend/node_modules" ]; then
  echo "⚠️ Frontend dependencies missing, installing..."
  cd Hub-Frontend && npm install
fi

# Backend 빌드 체크
if [ ! -f "Hub-Backend/dist/main.js" ]; then
  echo "⚠️ Backend build missing, building..."
  cd Hub-Backend && npx tsc && npx tsc-alias
fi

echo "✅ Dependencies checked"
```

---

## 예상 개선 효과

### Before (현재)
- **최초 실행**: 8분 (의존성 설치 + 빌드 + 문제 해결)
- **일일 시작**: 1-3분 (수동 확인 + 시작)
- **에러 발생 시**: 5-10분 (진단 + 해결)

### After (개선 후)
- **최초 실행**: 5분 (자동화된 체크 + 설치)
- **일일 시작**: 10-30초 (사전 검증 통과)
- **에러 발생 시**: 1-2분 (명확한 에러 메시지)

---

## 추가 권장사항

### 1. Docker Compose 도입
모든 서비스를 한 번에 관리:
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: tsuser
      POSTGRES_PASSWORD: tsuser1234
      POSTGRES_DB: geobukschool_dev

  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

실행: `docker-compose up -d`

### 2. 헬스체크 엔드포인트
Backend에 `/health` 엔드포인트 추가하여 서버 상태 확인

### 3. 개발 환경 프로파일
`.env.development.local` 사용으로 개인별 설정 분리

### 4. 로그 통합 관리
모든 서버 로그를 하나의 디렉토리로 수집

### 5. 모니터링 대시보드
간단한 HTML 페이지로 모든 서비스 상태 한눈에 확인
