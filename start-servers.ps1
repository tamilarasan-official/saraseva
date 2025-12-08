# SaralSeva AI - Start All Servers (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SaralSeva AI - Starting Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
Set-Location -Path "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor Yellow
Set-Location -Path "..\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx http-server . -p 8000 -c-1" -WindowStyle Normal
Start-Sleep -Seconds 3

# Return to root
Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servers Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "Frontend: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Landing Page: http://localhost:8000/pages/index.html" -ForegroundColor Cyan
Write-Host "Login Page:   http://localhost:8000/pages/login-new.html" -ForegroundColor Cyan
Write-Host "Register:     http://localhost:8000/pages/register-new.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening application in browser..." -ForegroundColor Yellow

Start-Sleep -Seconds 2
Start-Process "http://localhost:8000/pages/index.html"

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
