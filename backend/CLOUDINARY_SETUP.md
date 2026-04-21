# Cloudinary Setup Guide

This project uses Cloudinary for image uploads. Follow these steps to configure it:

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. After signing in, you'll see your dashboard

## 2. Get Your Credentials

From your Cloudinary dashboard, you'll find:

- **Cloud Name**: Found at the top of your dashboard
- **API Key**: Found in the "Account Details" section
- **API Secret**: Found in the "Account Details" section (click "Show" to reveal)

## 3. Create an Upload Preset

1. Go to Settings → Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Set the following:
   - **Preset name**: Choose a name (e.g., `portfolio_uploads`)
   - **Signing Mode**: Select "Unsigned" (for easier frontend uploads)
   - **Folder**: Optional, you can set a default folder like `portfolio`
5. Save the preset

## 4. Configure Your .env File

Add these lines to your `backend/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the placeholder values with your actual Cloudinary credentials.

## 5. Test the Upload

1. Start your Laravel backend: `php artisan serve`
2. Go to the Admin panel
3. Try uploading an image when creating a new project
4. The image should upload to Cloudinary and return a URL

## Alternative: Local Storage (No Cloudinary)

If you don't want to use Cloudinary, the system also supports local file uploads:

1. Make sure the storage link is created:
   ```bash
   php artisan storage:link
   ```

2. Images will be stored in `storage/app/public/projects/`
3. They'll be accessible via `/storage/projects/filename.jpg`

## Troubleshooting

### "Cloudinary configuration missing" error
- Check that all four environment variables are set in `.env`
- Restart your Laravel server after updating `.env`

### "Upload preset not found" error
- Make sure the upload preset exists in your Cloudinary dashboard
- Verify the preset name matches exactly (case-sensitive)
- Ensure the preset is set to "Unsigned" mode

### Images not displaying
- Check the browser console for CORS errors
- Verify the returned URL is accessible
- Make sure your Cloudinary account is active

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 transformations per month

This is more than enough for a portfolio website!
