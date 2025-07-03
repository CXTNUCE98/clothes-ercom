@echo off
echo ========================================
echo Starting Admin Dashboard
echo ========================================
echo.
echo Admin will be available at: http://localhost:3011
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start the admin dashboard
call npm run dev
pause 