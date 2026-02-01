@echo off
echo ==========================================
echo   Stopping Hub Docker Services
echo ==========================================
echo.

echo Stopping services...
docker-compose down

echo.
echo ==========================================
echo   Y Docker Services Stopped
echo ==========================================
echo.
echo Data is preserved in Docker volumes
echo To remove volumes: docker-compose down -v
echo.
pause
