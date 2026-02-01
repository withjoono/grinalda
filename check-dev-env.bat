@echo off
echo ==========================================
echo   Development Environment Check
echo ==========================================
echo.

REM [1/5] Docker 컨테이너 확인
echo [1/5] Checking Docker containers...

REM Docker Compose 우선 확인
docker-compose ps 2>nul | findstr "hub-postgres" > nul 2>&1
if not errorlevel 1 (
    docker-compose ps 2>nul | findstr "Up" > nul 2>&1
    if not errorlevel 1 (
        echo    Y Docker Compose services running
        echo      PostgreSQL: hub-postgres
        echo      Redis: hub-redis
        goto docker_ok
    )
)

REM 레거시 컨테이너 확인
docker ps --filter "name=geobuk-postgres" --format "{{.Names}}" | findstr "geobuk-postgres" > nul 2>&1
if errorlevel 1 (
    echo    X Docker services not running
    echo      Starting with Docker Compose...
    docker-compose up -d
    timeout /t 5 /nobreak > nul
) else (
    echo    Y Legacy containers running
    echo      (Consider migrating to docker-compose up)
)

:docker_ok
echo.

REM [2/5] Backend 의존성 확인
echo [2/5] Checking Backend dependencies...
if not exist "Hub-Backend\node_modules" (
    echo    X Backend dependencies missing
    echo      Installing dependencies...
    cd Hub-Backend
    call yarn install
    cd ..
) else (
    echo    Y Backend dependencies OK
)
echo.

REM [3/5] Frontend 의존성 확인
echo [3/5] Checking Frontend dependencies...
if not exist "Hub-Frontend\node_modules" (
    echo    X Frontend dependencies missing
    echo      Installing dependencies...
    cd Hub-Frontend
    call npm install
    cd ..
) else (
    echo    Y Frontend dependencies OK
)
echo.

REM [4/5] Backend 빌드 확인
echo [4/5] Checking Backend build...
if not exist "Hub-Backend\dist\main.js" (
    echo    X Backend not built
    echo      Building now...
    cd Hub-Backend
    call npx tsc
    call npx tsc-alias
    cd ..
    echo    Y Backend build complete
) else (
    echo    Y Backend build OK
)
echo.

REM [5/5] 포트 확인
echo [5/5] Checking ports...
netstat -ano | findstr ":3000" | findstr "LISTENING" > nul 2>&1
if not errorlevel 1 (
    echo    ! Port 3000 already in use
    set PORT_WARN=1
)

netstat -ano | findstr ":4000" | findstr "LISTENING" > nul 2>&1
if not errorlevel 1 (
    echo    ! Port 4000 already in use
    set PORT_WARN=1
)

if not defined PORT_WARN (
    echo    Y Ports 3000, 4000 available
)
echo.

echo ==========================================
echo   Y All checks passed!
echo ==========================================
echo.

if defined PORT_WARN (
    echo Note: Some ports are in use
    echo Run stop-dev-improved.bat to stop existing servers
    echo.
)

exit /b 0
