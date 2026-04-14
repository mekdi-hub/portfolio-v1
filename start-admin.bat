@echo off
echo Starting Portfolio Admin Panel...
echo.

echo [1/2] Starting Laravel Backend...
start "Laravel Backend" cmd /k "cd backend && php artisan serve"
timeout /t 3 /nobreak > nul

echo [2/2] Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Admin Panel is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo Admin Panel: http://1:5173/admin
echo ========================================
echo.
echo Press any key to open admin panel in browser...
pause > nul

start http://localhost:5173/admin
