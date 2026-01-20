@echo off
REM ========================================
REM Hub 프로젝트 통합 개발 서버 시작 스크립트
REM 포트: Frontend 3000, Backend 4000, PostgreSQL 5432
REM ========================================

echo.
echo ========================================
echo   Hub Development Server Starter
echo   Frontend: 3000 / Backend: 4000
echo ========================================
echo.

REM 1. Docker Desktop 실행 확인
echo [1/5] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo [OK] Docker is running

REM 2. PostgreSQL 시작
echo.
echo [2/5] Starting PostgreSQL...
docker start geobuk-postgres >nul 2>&1
if errorlevel 1 (
    echo [INFO] PostgreSQL container not found. Creating...
    docker run --name geobuk-postgres ^
        -e POSTGRES_PASSWORD=tsuser1234 ^
        -e POSTGRES_USER=tsuser ^
        -e POSTGRES_DB=geobukschool_dev ^
        -p 5432:5432 -d postgres:14
    if errorlevel 1 (
        echo [ERROR] Failed to create PostgreSQL container
        pause
        exit /b 1
    )
    echo [OK] PostgreSQL container created and started
) else (
    echo [OK] PostgreSQL started
)

REM 3. Redis 시작
echo.
echo [3/5] Starting Redis...
docker start geobuk-redis >nul 2>&1
if errorlevel 1 (
    echo [INFO] Redis container not found. Creating...
    docker run --name geobuk-redis -p 6379:6379 -d redis:7-alpine
    if errorlevel 1 (
        echo [ERROR] Failed to create Redis container
        pause
        exit /b 1
    )
    echo [OK] Redis container created and started
) else (
    echo [OK] Redis started
)

REM 4. 포트 확인 및 자동 종료
echo.
echo [4/5] Checking and clearing ports...

REM 포트 3000 확인 및 종료
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING"') do (
    echo [INFO] Stopping process on port 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

REM 포트 4000 확인 및 종료
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000.*LISTENING"') do (
    echo [INFO] Stopping process on port 4000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul
echo [OK] Ports are ready

REM 4.5 환경 변수 파일 확인
echo.
echo [4.5/5] Checking environment files...
if not exist "Hub-Backend\.env.development" (
    echo [INFO] Creating Hub-Backend\.env.development...
    (
        echo NODE_ENV=development
        echo PORT=4000
        echo DB_TYPE=postgres
        echo DB_HOST=127.0.0.1
        echo DB_PORT=5432
        echo DB_USER=tsuser
        echo DB_PASSWORD=tsuser1234
        echo DB_NAME=geobukschool_dev
        echo DB_SYNCHRONIZE=false
        echo REDIS_HOST=localhost
        echo REDIS_PORT=6379
        echo AUTH_JWT_SECRET=dev-jwt-secret-key
        echo AUTH_REFRESH_SECRET=dev-refresh-secret-key
        echo IMP_KEY=dev-imp-key
        echo IMP_SECRET=dev-imp-secret
        echo IMP_STORE_CODE=dev-store-code
        echo ENCRYPTION_KEY=dev-encryption-key
        echo APP_API_KEY=dev-app-api-key
        echo APP_SECRET=dev-app-secret
    ) > Hub-Backend\.env.development
    echo [OK] Environment file created
) else (
    echo [OK] Environment file exists
)

REM 5. 서버 시작
echo.
echo [5/5] Starting servers...
echo.
echo ========================================
echo   Servers are starting...
echo ========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000
echo   Swagger:  http://localhost:4000/swagger
echo.
echo Press Ctrl+C to stop all servers
echo ========================================
echo.

REM 백엔드와 프론트엔드를 새 터미널에서 시작
start "Hub Backend (Port 4000)" cmd /k "cd Hub-Backend && yarn start:dev"
timeout /t 3 /nobreak >nul
start "Hub Frontend (Port 3000)" cmd /k "cd Hub-Frontend && npm run dev"

echo.
echo [OK] Servers started in separate windows
echo.
echo To stop servers:
echo   - Close the terminal windows, or
echo   - Press Ctrl+C in each window
echo.
pause
