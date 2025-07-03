@echo off
echo ========================================
echo Clothes E-commerce Project Setup
echo ========================================

echo.
echo Setting up Backend...
cd backend
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env file from .env.example
)

echo Initializing database...
call npm run init-db
if %errorlevel% neq 0 (
    echo Error initializing database
    pause
    exit /b 1
)

echo Backend setup completed!
echo.
echo Setting up Frontend...
cd ../frontend
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo Frontend setup completed!
echo.
echo Setting up Admin...
cd ../admin
echo Installing admin dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing admin dependencies
    pause
    exit /b 1
)

echo Admin setup completed!
echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To run the project:
echo 1. Start backend: cd backend && npm run dev
echo 2. Start frontend: cd frontend && npm run dev
echo 3. Start admin: cd admin && npm run dev
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:3000
echo Admin will run on: http://localhost:3011
echo.
pause 