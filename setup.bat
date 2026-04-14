@echo off
echo ========================================
echo Portfolio Setup Script
echo ========================================
echo.

echo [1/5] Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
) else (
    echo .env file already exists, skipping...
)

echo Installing Composer dependencies...
call composer install

echo Generating application key...
php artisan key:generate

echo Running database migrations...
php artisan migrate

echo Seeding database with sample data...
php artisan db:seed

cd ..

echo.
echo [2/5] Setting up Frontend...
cd frontend

echo Installing npm dependencies...
call npm install

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Double-click 'start-admin.bat'
echo    OR
echo 2. Run manually:
echo    - Terminal 1: cd backend ^&^& php artisan serve
echo    - Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Access points:
echo - Main Site: http://localhost:5173
echo - Admin Panel: http://localhost:5173/admin
echo - API: http://localhost:8000/api
echo.
echo See README.md for more information.
echo ========================================
echo.
pause
