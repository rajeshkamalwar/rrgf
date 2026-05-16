@echo off
REM Start Both Servers - Website and Backend
REM This opens two windows - one for PHP backend, one for React frontend

echo ========================================
echo  Starting Website and Backend Servers
echo ========================================
echo.

REM Start PHP Backend Server
echo Starting PHP Backend API Server...
start "PHP Backend API (Port 8000)" cmd /k "cd /d %~dp0php-backend && php -S localhost:8000"
timeout /t 2 /nobreak >nul

REM Start React Frontend
echo Starting React Frontend...
start "React Frontend (Vite Dev Server)" cmd /k "cd /d %~dp0 && pnpm dev"

echo.
echo ========================================
echo  Servers Starting!
echo ========================================
echo.
echo  Backend API: http://localhost:8000/api
echo  Website:     http://localhost:5173 (or check the Vite window)
echo  Admin Panel: http://localhost:5173/backend
echo.
echo  Press any key to exit (servers will continue running)...
pause >nul