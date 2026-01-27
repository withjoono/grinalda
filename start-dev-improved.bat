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
    echo X Pre-flight checks failed
    echo Please fix the issues above before starting
    pause
    exit /b 1
)

echo Starting servers...
echo.

REM [1/3] Docker 서비스 확인
echo [1/3] Ensuring Docker services are ready...
docker-compose ps 2>nul | findstr "Up" > nul 2>&1
if errorlevel 1 (
    echo    Starting Docker Compose services...
    docker-compose up -d
    timeout /t 5 /nobreak > nul
)
echo    Y Docker services ready
echo.

REM [2/3] Backend 서버 시작
echo [2/3] Starting Backend (port 4000)...
start "Hub Backend - Port 4000" /D "%~dp0Hub-Backend" cmd /k "node dist/main.js"
echo    Backend starting in new window...
timeout /t 7 /nobreak > nul
echo.

REM [3/3] Frontend 서버 시작
echo [3/3] Starting Frontend (port 3000)...
start "Hub Frontend - Port 3000" /D "%~dp0Hub-Frontend" cmd /k "npm run dev"
echo    Frontend starting in new window...
echo.

REM 서버 시작 대기
echo Waiting for servers to start...
set /a count=0
:wait_loop
timeout /t 2 /nobreak > nul
netstat -ano | findstr ":4000" | findstr "LISTENING" > nul 2>&1
if errorlevel 1 (
    set /a count+=1
    if !count! LSS 15 (
        echo    Waiting... (!count!/15^)
        goto wait_loop
    )
    echo.
    echo ! Timeout waiting for Backend
    echo   Check "Hub Backend - Port 4000" window for errors
    goto show_status
)

echo    Y Backend ready
echo.

REM Frontend 대기
set /a count=0
:wait_frontend
timeout /t 2 /nobreak > nul
netstat -ano | findstr ":3000" | findstr "LISTENING" > nul 2>&1
if errorlevel 1 (
    set /a count+=1
    if !count! LSS 15 (
        echo    Waiting for Frontend... (!count!/15^)
        goto wait_frontend
    )
    echo.
    echo ! Timeout waiting for Frontend
    echo   Check "Hub Frontend - Port 3000" window for errors
    goto show_status
)

echo    Y Frontend ready
echo.

:show_status
echo ==========================================
echo   Y Servers Started!
echo ==========================================
echo.
echo Frontend:   http://localhost:3000
echo Backend:    http://localhost:4000
echo PostgreSQL: localhost:5432
echo Redis:      localhost:6379
echo.
echo Server windows are running in background
echo Close command windows to stop servers
echo Or run: stop-dev-improved.bat
echo.
echo Press any key to open frontend in browser...
pause > nul
start http://localhost:3000

endlocal
