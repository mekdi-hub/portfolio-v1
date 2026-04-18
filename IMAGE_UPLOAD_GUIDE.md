# Image Upload Feature

## Overview
The Admin panel now supports uploading project images directly from your local files instead of using image URLs.

## How to Use

### Adding a New Project with Image
1. Navigate to the Admin panel (`/admin`)
2. Click "Add Project" button
3. Fill in the project details
4. Click "Choose File" in the image upload section
5. Select an image from your computer (JPEG, PNG, GIF, SVG, WebP)
6. Preview the image before saving
7. Click "Save Project"

### Editing Project Image
1. Click "Edit" on any existing project
2. The current image will be shown in the preview (if exists)
3. Click "Choose File" to select a new image
4. Click the "✕" button to remove the current image
5. Click "Update Project" to save changes

## Technical Details

### Frontend Changes
- **File Input**: Replaced text input with file upload input
- **Image Preview**: Shows selected image before upload
- **Remove Button**: Allows removing selected image
- **Upload Status**: Shows "Uploading image..." during upload

### Backend Changes
- **Upload Endpoint**: `POST /api/projects/upload-image`
- **Storage Location**: `storage/app/public/projects/`
- **Public Access**: Images accessible via `/storage/projects/filename`
- **File Validation**: 
  - Max size: 5MB
  - Allowed types: JPEG, PNG, GIF, SVG, WebP

### File Storage
- Images are stored in `backend/storage/app/public/projects/`
- Accessible via symbolic link at `backend/public/storage/`
- Filename format: `timestamp_originalname.ext`

## API Response
```json
{
  "success": true,
  "url": "http://localhost:8000/storage/projects/1234567890_image.jpg",
  "path": "projects/1234567890_image.jpg"
}
```

## Notes
- The storage link has been created automatically
- Old projects with URL-based images will continue to work
- You can still manually enter image URLs if needed
- Maximum file size is 5MB per image
