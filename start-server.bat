@echo off
REM Start the Mikey EV backend server (Windows)

echo 🚗 Starting Mikey EV Backend Server...
echo.

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

echo ✅ Starting server...
echo.
call npm start
pause
