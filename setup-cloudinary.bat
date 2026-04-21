@echo off
echo ========================================
echo   Cloudinary Setup Helper
echo ========================================
echo.

echo This script will help you configure Cloudinary for image uploads.
echo.
echo Before continuing, make sure you have:
echo   1. Created a Cloudinary account at https://cloudinary.com
echo   2. Created an unsigned upload preset in your dashboard
echo   3. Have your Cloud Name, API Key, and API Secret ready
echo.
pause

echo.
echo Opening Cloudinary setup guide...
start "" "backend\CLOUDINARY_SETUP.md"

echo.
echo Opening your .env file...
timeout /t 2 >nul
notepad backend\.env

echo.
echo ========================================
echo   Configuration Steps:
echo ========================================
echo.
echo Add these lines to your backend\.env file:
echo.
echo CLOUDINARY_CLOUD_NAME=your_cloud_name_here
echo CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
echo CLOUDINARY_API_KEY=your_api_key_here
echo CLOUDINARY_API_SECRET=your_api_secret_here
echo.
echo Replace the placeholder values with your actual credentials.
echo.
echo ========================================
echo   Testing the Configuration
echo ========================================
echo.
echo After saving your .env file:
echo   1. Restart your Laravel server
echo   2. Go to the Admin panel
echo   3. Try uploading an image
echo.
echo If you see "Cloudinary configuration missing", make sure:
echo   - All 4 variables are set in .env
echo   - You restarted the Laravel server
echo   - There are no typos in the variable names
echo.
pause
