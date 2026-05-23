@echo off
echo Restarting Laravel Backend...
cd backend
php artisan optimize:clear
php artisan serve
