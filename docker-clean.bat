@echo off
echo ==========================================
echo   Clean Hub Docker Environment
echo ==========================================
echo.
echo WARNING: This will remove all containers,
echo          volumes, and data!
echo.
echo Press Ctrl+C to cancel or
pause

echo.
echo Stopping and removing containers...
docker-compose down -v

echo.
echo Removing old containers (if any)...
docker rm -f geobuk-postgres geobuk-redis hub-redis redis gb-redis-local 2>nul

echo.
echo Removing unused volumes...
docker volume prune -f

echo.
echo ==========================================
echo   Y Environment Cleaned
echo ==========================================
echo.
echo Run docker-start.bat to start fresh
echo.
pause
