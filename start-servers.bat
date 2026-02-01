@echo off
echo Starting Hub Backend and Frontend servers...
echo.

REM Start Backend (port 4000)
echo Starting Backend on port 4000...
start "Hub Backend" /D "%~dp0Hub-Backend" cmd /k "yarn start:dev"

REM Wait a bit
timeout /t 5 /nobreak >nul

REM Start Frontend (port 3000)
echo Starting Frontend on port 3000...
start "Hub Frontend" /D "%~dp0Hub-Frontend" cmd /k "npm run dev"

echo.
echo Servers starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo PostgreSQL: localhost:5432
echo.
echo Press any key to exit this window (servers will continue running)
pause
