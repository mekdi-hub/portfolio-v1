# Admin Panel Guide

## Quick Start

### Windows Users
Simply double-click `start-admin.bat` to start both backend and frontend servers.

### Manual Start

1. **Start Backend** (Terminal 1):
```bash
cd backend
php artisan serve
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

3. **Access Admin Panel**:
- Open browser: `http://localhost:5173/admin`
- Or click "Admin Panel" link in the footer of main site

## Features

### 1. Projects Management
- **Add New Project**: Click "+ Add Project" button
- **Edit Project**: Click "Edit" on any project row
- **Delete Project**: Click "Delete" on any project row
- **Fields**:
  - Title (required)
  - Description (required)
  - Tech Stack (required, comma-separated)
  - Image URL (optional)
  - Demo Link (optional)

### 2. Messages Management
- View all contact form submissions
- Delete messages
- See sender name, email, message content, and date
- Messages are read-only (cannot be edited)

### 3. Demo Orders Management
- **Add New Order**: Click "+ Add Order" button
- **Edit Order**: Click "Edit" on any order row
- **Delete Order**: Click "Delete" on any order row
- **Fields**:
  - Status (required): pending, in_progress, completed, cancelled
  - Assigned Rider (optional)

## API Endpoints

The admin panel uses these REST API endpoints:

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Messages
- `GET /api/messages` - List all messages
- `DELETE /api/messages/{id}` - Delete message

### Demo Orders
- `GET /api/demo-orders` - List all orders
- `POST /api/demo-orders` - Create new order
- `PUT /api/demo-orders/{id}` - Update order
- `DELETE /api/demo-orders/{id}` - Delete order

## Troubleshooting

### CORS Issues
If you see CORS errors in browser console:
1. CORS middleware is configured in `backend/app/Http/Middleware/Cors.php`
2. Ensure `php artisan serve` is running
3. Clear browser cache and restart servers

### 404 Errors on Admin Route
The admin route uses client-side routing:
1. Access via dev server (not opening index.html directly)
2. Navigate from main site using footer link
3. Manually go to `http://localhost:5173/admin`

### API Connection Issues
1. Verify backend is running on `http://localhost:8000`
2. Check browser console for error messages
3. Test API endpoints using curl or Postman:
```bash
curl http://localhost:8000/api/projects
```

### Database Issues
If you get database errors:
```bash
cd backend
php artisan migrate:fresh
php artisan db:seed
```

## Security Notes

⚠️ **Important**: This admin panel has NO authentication. For production:

1. **Add Authentication**
   - Use Laravel Sanctum or Passport
   - Implement login/logout functionality
   - Add session management

2. **Protect Routes**
   - Add auth middleware to API routes
   - Implement role-based access control (RBAC)
   - Add CSRF protection

3. **Environment Configuration**
   - Use environment variables for API URLs
   - Never commit `.env` files
   - Use different configs for dev/prod

4. **Input Validation**
   - Already implemented in controllers
   - Add client-side validation
   - Sanitize user inputs

## File Structure

```
frontend/src/
├── components/
│   ├── Admin.jsx          # Main admin component
│   └── Admin.css          # Admin styles
├── AdminApp.jsx           # Admin app wrapper
└── main.jsx               # Router logic

backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── ProjectController.php
│   │   │   ├── MessageController.php
│   │   │   └── DemoOrderController.php
│   │   └── Middleware/
│   │       └── Cors.php   # CORS configuration
│   └── Models/
│       ├── Project.php
│       ├── Message.php
│       └── DemoOrder.php
└── routes/
    └── api.php            # API routes
```

## Future Enhancements

Consider adding:
- ✅ User authentication (Laravel Sanctum)
- ✅ Image upload functionality
- ✅ Bulk operations (delete multiple items)
- ✅ Search and filtering
- ✅ Pagination for large datasets
- ✅ Export data (CSV/JSON)
- ✅ Activity logs
- ✅ Dashboard with statistics
- ✅ Rich text editor for descriptions
- ✅ Drag-and-drop image upload
- ✅ Real-time notifications

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check Laravel logs: `backend/storage/logs/laravel.log`
4. Verify all dependencies are installed

## License

This admin panel is part of the portfolio project and follows the same license.
