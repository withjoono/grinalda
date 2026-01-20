@echo off
REM ========================================
REM Hub 프로젝트 의존성 체크 스크립트
REM ========================================

echo.
echo ========================================
echo   Hub Dependencies Health Check
echo ========================================
echo.

set ERROR_COUNT=0

REM 1. Docker Desktop 확인
echo [1/6] Checking Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Docker Desktop is not running
    set /a ERROR_COUNT+=1
) else (
    echo [PASS] Docker Desktop is running
)

REM 2. PostgreSQL 확인
echo.
echo [2/6] Checking PostgreSQL...
docker ps --filter "name=geobuk-postgres" --filter "status=running" | findstr "geobuk-postgres" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] PostgreSQL container is not running
    set /a ERROR_COUNT+=1
) else (
    echo [PASS] PostgreSQL is running on port 5432
)

REM 3. Redis 확인
echo.
echo [3/6] Checking Redis...
docker ps --filter "name=geobuk-redis" --filter "status=running" | findstr "geobuk-redis" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Redis container is not running
    set /a ERROR_COUNT+=1
) else (
    echo [PASS] Redis is running on port 6379
)

REM 4. 포트 3000 확인
echo.
echo [4/6] Checking port 3000...
netstat -an | findstr ":3000.*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [WARN] Port 3000 is already in use
    set /a ERROR_COUNT+=1
) else (
    echo [PASS] Port 3000 is available
)

REM 5. 포트 4000 확인
echo.
echo [5/6] Checking port 4000...
netstat -an | findstr ":4000.*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [WARN] Port 4000 is already in use
    set /a ERROR_COUNT+=1
) else (
    echo [PASS] Port 4000 is available
)

REM 6. Node.js 및 Yarn 확인
echo.
echo [6/6] Checking Node.js and Yarn...
node --version >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Node.js is not installed
    set /a ERROR_COUNT+=1
) else (
    echo [PASS] Node.js: & node --version
)

yarn --version >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Yarn is not installed
    set /a ERROR_COUNT+=1
) else (
    echo [PASS] Yarn: & yarn --version
)

REM 결과 요약
echo.
echo ========================================
if %ERROR_COUNT% EQU 0 (
    echo   Status: READY TO START
    echo.
    echo   All dependencies are ready!
    echo   Run 'start-dev.bat' to start servers.
) else (
    echo   Status: ISSUES FOUND (%ERROR_COUNT%)
    echo.
    echo   Please fix the issues above before starting.
    echo.
    echo   Quick fixes:
    echo   - Start Docker Desktop
    echo   - Run: docker start geobuk-postgres geobuk-redis
    echo   - Close apps using ports 3000 or 4000
)
echo ========================================
echo.

pause
exit /b %ERROR_COUNT%
