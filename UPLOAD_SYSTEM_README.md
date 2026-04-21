# Image Upload System Documentation

## Overview

The portfolio now has a complete image upload system with two options:

1. **Cloudinary Upload** (Recommended for production)
2. **Local Storage Upload** (Already working)

## Current Status

✅ **Local Storage Upload** - Fully functional
- Upload endpoint: `POST /api/projects/upload-image`
- Images stored in: `storage/app/public/projects/`
- Accessible via: `/storage/projects/filename.jpg`

🔧 **Cloudinary Upload** - Ready to configure
- Upload endpoint: `POST /api/upload/image`
- Delete endpoint: `POST /api/upload/delete`
- Requires Cloudinary credentials

## How to Use

### Admin Panel

1. Navigate to the Admin panel
2. Click "Add Project"
3. Fill in the project details
4. For the image, you have two options:
   - **Upload from file**: Click "📁 Choose Image File" and select an image
   - **Use URL**: Enter an image URL directly

### Image Upload Options

#### Option 1: File Upload (Local Storage)
```javascript
// Currently uses: /api/projects/upload-image
// Stores files locally in storage/app/public/projects/
```

#### Option 2: File Upload (Cloudinary)
```javascript
// Uses: /api/upload/image
// Requires Cloudinary configuration (see CLOUDINARY_SETUP.md)
```

#### Option 3: Direct URL
```javascript
// Simply paste an image URL
// No upload needed
```

## API Endpoints

### Local Storage Upload
```
POST /api/projects/upload-image
Content-Type: multipart/form-data

Body:
- image: File (required)

Response:
{
  "success": true,
  "url": "http://localhost:8000/storage/projects/1234567890_image.jpg",
  "path": "projects/1234567890_image.jpg",
  "filename": "1234567890_image.jpg"
}
```

### Cloudinary Upload
```
POST /api/upload/image
Content-Type: multipart/form-data

Body:
- image: File (required)

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/portfolio/image.jpg",
  "public_id": "portfolio/image",
  "width": 1920,
  "height": 1080,
  "format": "jpg"
}
```

### Cloudinary Delete
```
POST /api/upload/delete
Content-Type: application/json

Body:
{
  "public_id": "portfolio/image"
}

Response:
{
  "success": true,
  "result": "deleted"
}
```

## Configuration

### Local Storage (Already Working)

1. Ensure storage link exists:
```bash
cd backend
php artisan storage:link
```

2. Check permissions:
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Cloudinary Setup

See [CLOUDINARY_SETUP.md](backend/CLOUDINARY_SETUP.md) for detailed instructions.

Quick setup:
1. Create account at https://cloudinary.com
2. Get your credentials from dashboard
3. Create an unsigned upload preset
4. Add to `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_preset_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## File Structure

```
backend/
├── app/
│   └── Http/
│       └── Controllers/
│           └── Api/
│               ├── ProjectController.php    # Has uploadImage() for local storage
│               └── UploadController.php     # Has uploadImage() for Cloudinary
├── routes/
│   └── api.php                              # Upload routes defined here
└── storage/
    └── app/
        └── public/
            └── projects/                    # Local uploads stored here

frontend/
└── src/
    └── components/
        ├── Admin.jsx                        # Upload UI
        └── Admin.css                        # Upload styling
```

## Features

### Validation
- Supported formats: JPEG, PNG, JPG, GIF, WEBP, SVG
- Max file size: 20MB (local), 5MB (Cloudinary)
- Automatic filename sanitization
- Upload error handling

### UI Features
- File preview before upload
- Upload progress indication
- Error and success messages
- Option to use URL instead of file
- Responsive design

### Security
- File type validation
- Size limits
- Sanitized filenames
- CORS configured

## Troubleshooting

### Local Upload Issues

**"Failed to store file on server"**
- Check storage permissions: `chmod -R 775 storage`
- Verify storage link: `php artisan storage:link`
- Check disk space

**Images not displaying**
- Verify storage link exists: `ls -la public/storage`
- Check file exists: `ls -la storage/app/public/projects/`
- Verify APP_URL in .env matches your domain

### Cloudinary Issues

**"Cloudinary configuration missing"**
- Check all 4 env variables are set
- Restart Laravel server after updating .env

**"Upload preset not found"**
- Verify preset exists in Cloudinary dashboard
- Check preset name is correct (case-sensitive)
- Ensure preset is "Unsigned"

### Frontend Issues

**"Image upload failed"**
- Check browser console for errors
- Verify API endpoint is accessible
- Check CORS configuration
- Verify file size is within limits

## Testing

### Test Local Upload
```bash
curl -X POST http://localhost:8000/api/projects/upload-image \
  -F "image=@/path/to/test-image.jpg"
```

### Test Cloudinary Upload
```bash
curl -X POST http://localhost:8000/api/upload/image \
  -F "image=@/path/to/test-image.jpg"
```

## Production Deployment

### Using Local Storage
1. Ensure storage is writable
2. Run `php artisan storage:link` on server
3. Configure web server to serve storage files
4. Consider using a CDN for better performance

### Using Cloudinary (Recommended)
1. Set up Cloudinary account
2. Add credentials to production .env
3. Images automatically served via Cloudinary CDN
4. No storage management needed
5. Automatic image optimization

## Performance Tips

1. **Use Cloudinary for production** - Better performance, CDN, automatic optimization
2. **Compress images before upload** - Reduces upload time and storage
3. **Use appropriate image formats** - WebP for modern browsers, JPEG for photos
4. **Set reasonable size limits** - Balance quality vs. file size

## Next Steps

1. ✅ Local storage upload working
2. 🔧 Configure Cloudinary (optional but recommended)
3. 🎨 Test upload in Admin panel
4. 🚀 Deploy to production

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Laravel logs: `storage/logs/laravel.log`
3. Check browser console for frontend errors
4. Verify API responses using browser DevTools
