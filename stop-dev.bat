@echo off
REM ========================================
REM Hub 프로젝트 개발 서버 중지 스크립트
REM ========================================

echo.
echo ========================================
echo   Hub Development Server Stopper
echo ========================================
echo.

REM 1. 포트 3000 사용 프로세스 종료 (Frontend)
echo [1/2] Stopping Frontend (port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING"') do (
    echo Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] Frontend stopped

REM 2. 포트 4000 사용 프로세스 종료 (Backend)
echo.
echo [2/2] Stopping Backend (port 4000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000.*LISTENING"') do (
    echo Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] Backend stopped

echo.
echo ========================================
echo   All servers stopped
echo.
echo   Docker containers are still running.
echo   To stop Docker containers:
echo     docker stop geobuk-postgres geobuk-redis
echo ========================================
echo.

pause
