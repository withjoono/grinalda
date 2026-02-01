@echo off
echo ==========================================
echo   Stopping Hub Development Servers
echo ==========================================
echo.

REM [1/3] Backend 프로세스 종료
echo [1/3] Stopping Backend (port 4000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do (
    echo    Killing process %%a
    taskkill /F /PID %%a > nul 2>&1
)
echo    Y Backend stopped
echo.

REM [2/3] Frontend 프로세스 종료
echo [2/3] Stopping Frontend (port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo    Killing process %%a
    taskkill /F /PID %%a > nul 2>&1
)
echo    Y Frontend stopped
echo.

REM [3/3] Docker 컨테이너 중지 (선택사항)
echo [3/3] Docker containers status...
docker-compose ps 2>nul | findstr "Up" > nul 2>&1
if not errorlevel 1 (
    echo    Docker Compose services running
    echo    To stop: docker-compose down
) else (
    echo    Docker services not managed by compose
    echo    To stop: docker stop geobuk-postgres geobuk-redis
)
echo    (Kept running for quick restart)
echo.

REM 명령창 제목으로 프로세스 종료 (추가)
echo Closing server windows...
taskkill /FI "WINDOWTITLE eq Hub Backend*" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Hub Frontend*" /F > nul 2>&1
echo.

echo ==========================================
echo   Y All servers stopped
echo ==========================================
echo.
pause
