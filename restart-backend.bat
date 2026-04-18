@echo off
echo Restarting Laravel backend server...
cd backend
echo.
echo Press Ctrl+C to stop the current server if running, then run this script again.
echo.
php artisan serve
