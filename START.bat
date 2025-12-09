@echo off
echo ========================================
echo   SaralSeva AI - Starting Application
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Installing Backend Dependencies...
cd backend
if not exist "node_modules" (
    call npm install
)

echo.
echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
if not exist "node_modules" (
    call npm install
)

echo.
echo [3/4] Starting Backend Server...
cd ..\backend
start "SaralSeva Backend" cmd /k "node server.js"
timeout /t 3 >nul

echo.
echo [4/4] Starting Frontend Server...
cd ..\frontend
start "SaralSeva Frontend" cmd /k "npx http-server -p 8000"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo   Frontend: http://localhost:8000
echo   Backend:  http://localhost:3000
echo.
echo   Press Ctrl+C in each window to stop
echo ========================================
pause
