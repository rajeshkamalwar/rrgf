@echo off
title Starting Website Servers
color 0A

echo ========================================
echo   Starting Website and Backend Servers
echo ========================================
echo.

REM Check if PHP is available
where php >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PHP is not found in PATH!
    echo Please make sure XAMPP PHP is in your PATH or use full path.
    pause
    exit /b 1
)

REM Start PHP Backend Server
echo [1/2] Starting PHP Backend API Server on port 8000...
start "PHP Backend API (Port 8000)" cmd /k "cd /d %~dp0php-backend && echo PHP Backend API Server && echo Port: 8000 && echo. && php -S localhost:8000"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Check if pnpm is available
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [2/2] pnpm not found, trying npm...
    where npm >nul 2>&1
    if %errorlevel% neq 0 (
        echo ERROR: Neither pnpm nor npm found!
        echo Please install Node.js first.
        pause
        exit /b 1
    )
    start "React Frontend (Vite)" cmd /k "cd /d %~dp0 && echo React Frontend Server && echo Port: 3000 && echo. && npm run dev"
) else (
    echo [2/2] Starting React Frontend Server...
    start "React Frontend (Vite)" cmd /k "cd /d %~dp0 && echo React Frontend Server && echo Port: 3000 && echo. && pnpm dev"
)

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo  Please wait 10-20 seconds for servers to start...
echo.
echo  Then visit:
echo    - Website:     http://localhost:3000
echo    - Admin Panel: http://localhost:3000/backend
echo.
echo  Backend API: http://localhost:8000/api
echo.
echo  Press any key to exit this window (servers will keep running)...
pause >nul