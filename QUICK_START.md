# Quick Start Guide

## First Time Setup

### Windows
1. Double-click `setup.bat`
2. Wait for installation to complete
3. Double-click `start-admin.bat`
4. Open browser to http://localhost:5173

### Manual Setup
```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed

# Frontend
cd frontend
npm install
```

## Daily Usage

### Start Servers
**Windows:** Double-click `start-admin.bat`

**Manual:**
```bash
# Terminal 1
cd backend
php artisan serve

# Terminal 2
cd frontend
npm run dev
```

## Access Points

| Service | URL |
|---------|-----|
| Main Site | http://localhost:5173 |
| Admin Panel | http://localhost:5173/admin |
| Backend API | http://localhost:8000/api |

## Admin Panel Features

### Projects
- ➕ Add new projects
- ✏️ Edit existing projects
- 🗑️ Delete projects
- 📋 View all projects

### Messages
- 📬 View contact form submissions
- 🗑️ Delete messages
- 📧 See sender details

### Demo Orders
- ➕ Create orders
- ✏️ Update order status
- 👤 Assign riders
- 🗑️ Delete orders

## Common Commands

### Backend
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Reset database
php artisan migrate:fresh --seed

# View routes
php artisan route:list

# Run tests
php artisan test
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Troubleshooting

### Backend not starting
```bash
cd backend
php artisan serve --port=8001
```

### Frontend not starting
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database issues
```bash
cd backend
php artisan migrate:fresh --seed
```

### CORS errors
1. Restart backend server
2. Clear browser cache
3. Check `backend/app/Http/Middleware/Cors.php`

## File Locations

### Configuration
- Backend: `backend/.env`
- Frontend: `frontend/vite.config.js`

### Database
- SQLite: `backend/database/database.sqlite`

### Logs
- Laravel: `backend/storage/logs/laravel.log`

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🔧 Admin guide: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- 🐛 Check logs in `backend/storage/logs/`
- 🌐 Browser console (F12) for frontend errors

## Tips

1. **Always start backend first** before frontend
2. **Use Chrome DevTools** (F12) to debug frontend issues
3. **Check Laravel logs** for backend errors
4. **Clear cache** if you see stale data
5. **Use sample data** from seeders for testing

## Sample Data

After running `php artisan db:seed`, you'll have:
- 3 sample projects
- 2 sample messages
- 3 sample demo orders
- 1 test user

## Production Deployment

⚠️ Before deploying to production:
1. Add authentication to admin panel
2. Change `APP_ENV=production` in `.env`
3. Set `APP_DEBUG=false`
4. Update API URLs
5. Enable HTTPS
6. Add rate limiting

See [README.md](README.md) for detailed deployment instructions.
