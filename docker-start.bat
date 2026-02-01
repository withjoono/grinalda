@echo off
echo ==========================================
echo   Starting Hub Docker Services
echo ==========================================
echo.

REM Docker Compose로 서비스 시작
echo Starting PostgreSQL and Redis...
docker-compose up -d

REM 서비스 시작 대기
echo.
echo Waiting for services to be ready...
timeout /t 5 /nobreak > nul

REM 서비스 상태 확인
echo.
echo Checking service health...
docker-compose ps

REM 헬스체크 대기
echo.
echo Waiting for health checks...
set /a count=0
:healthcheck_loop
timeout /t 2 /nobreak > nul
docker-compose ps | findstr "healthy" > nul 2>&1
if errorlevel 1 (
    set /a count+=1
    if !count! LSS 15 (
        echo    Waiting... (!count!/15^)
        goto healthcheck_loop
    )
    echo.
    echo ! Services might not be fully ready
    echo   Check with: docker-compose logs
    goto show_status
)

:show_status
echo.
echo ==========================================
echo   Y Docker Services Running!
echo ==========================================
echo.
echo PostgreSQL: localhost:5432
echo   User: tsuser
echo   Password: tsuser1234
echo   Database: geobukschool_dev
echo.
echo Redis: localhost:6379
echo.
echo Commands:
echo   View logs:    docker-compose logs -f
echo   Stop:         docker-compose down
echo   Restart:      docker-compose restart
echo.
pause
