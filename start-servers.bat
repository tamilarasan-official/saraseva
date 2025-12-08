@echo off
REM SaralSeva AI - Start All Servers

echo ========================================
echo   SaralSeva AI - Starting Servers
echo ========================================
echo.

REM Start Backend
echo [1/2] Starting Backend Server...
cd backend
start "SaralSeva Backend" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend Server...
cd ..\frontend
start "SaralSeva Frontend" cmd /k "npx http-server . -p 8000 -c-1"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8000
echo.
echo Landing Page: http://localhost:8000/pages/index.html
echo Login Page:   http://localhost:8000/pages/login-new.html
echo Register:     http://localhost:8000/pages/register-new.html
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:8000/pages/index.html
