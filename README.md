# Portfolio Website with Admin Panel

A modern, full-stack portfolio website built with React (frontend) and Laravel (backend), featuring a complete admin panel for content management.

## Features

### Frontend
- 🎨 Modern, animated UI with custom cursor
- 🌟 Particle and star background effects
- 📱 Fully responsive design
- 🎯 Smooth section navigation
- 📊 Skills showcase with animations
- 💼 Projects gallery
- 📧 Contact form
- 🔄 Rotating triangle animations

### Backend
- 🚀 Laravel REST API
- 💾 SQLite database
- 🔌 RESTful endpoints
- ✅ Input validation
- 🌐 CORS enabled

### Admin Panel
- 📝 Projects CRUD operations
- 📬 Message management
- 📦 Demo orders management
- 🎨 Beautiful, intuitive interface
- ⚡ Real-time updates

## Tech Stack

### Frontend
- React 19
- Vite
- Three.js (for 3D effects)
- Lenis (smooth scrolling)
- CSS3 animations

### Backend
- Laravel 11
- PHP 8.2+
- SQLite
- RESTful API

## Quick Start

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd portfolio
```

2. **Backend Setup**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

#### Option 1: Quick Start (Windows)
Double-click `start-admin.bat` to start both servers automatically.

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access Points
- **Main Site**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **API**: http://localhost:8000/api

## Project Structure

```
portfolio/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Admin.jsx    # Admin panel
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── ContactForm.jsx
│   │   ├── App.jsx          # Main app
│   │   ├── AdminApp.jsx     # Admin wrapper
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── backend/                  # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── ProjectController.php
│   │   │   │   ├── MessageController.php
│   │   │   │   └── DemoOrderController.php
│   │   │   └── Middleware/
│   │   │       └── Cors.php
│   │   └── Models/
│   │       ├── Project.php
│   │       ├── Message.php
│   │       └── DemoOrder.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── composer.json
│
├── start-admin.bat          # Quick start script
├── ADMIN_GUIDE.md          # Admin panel documentation
└── README.md               # This file
```

## API Documentation

### Projects
```
GET    /api/projects        # List all projects
POST   /api/projects        # Create project
GET    /api/projects/{id}   # Get single project
PUT    /api/projects/{id}   # Update project
DELETE /api/projects/{id}   # Delete project
```

### Messages
```
GET    /api/messages        # List all messages
POST   /api/messages        # Create message
GET    /api/messages/{id}   # Get single message
DELETE /api/messages/{id}   # Delete message
```

### Demo Orders
```
GET    /api/demo-orders        # List all orders
POST   /api/demo-orders        # Create order
GET    /api/demo-orders/{id}   # Get single order
PUT    /api/demo-orders/{id}   # Update order
DELETE /api/demo-orders/{id}   # Delete order
```

## Database Schema

### Projects Table
- `id` - Primary key
- `title` - Project title
- `description` - Project description
- `tech_stack` - Technologies used
- `image` - Image URL
- `demo_link` - Live demo URL
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Messages Table
- `id` - Primary key
- `name` - Sender name
- `email` - Sender email
- `message` - Message content
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Demo Orders Table
- `id` - Primary key
- `status` - Order status
- `assigned_rider` - Assigned rider name
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Development

### Adding New Features

1. **Backend (Laravel)**
   - Create model: `php artisan make:model ModelName -m`
   - Create controller: `php artisan make:controller Api/ControllerName --api`
   - Add routes in `routes/api.php`
   - Run migration: `php artisan migrate`

2. **Frontend (React)**
   - Create component in `frontend/src/components/`
   - Import and use in `App.jsx` or `Admin.jsx`
   - Add styles in corresponding `.css` file

### Testing

**Backend:**
```bash
cd backend
php artisan test
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Backend
1. Set `APP_ENV=production` in `.env`
2. Run `php artisan config:cache`
3. Run `php artisan route:cache`
4. Run `php artisan view:cache`

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Update API URL in production

### Backend (Any PHP hosting)
1. Upload Laravel files
2. Point web root to `public` folder
3. Set up environment variables
4. Run migrations
5. Configure CORS for production domain

## Security Considerations

⚠️ **Important**: The admin panel currently has NO authentication.

For production deployment:
1. Implement authentication (Laravel Sanctum/Passport)
2. Add middleware protection to admin routes
3. Use environment-specific API URLs
4. Enable HTTPS
5. Add rate limiting
6. Implement CSRF protection
7. Add input sanitization
8. Use secure session handling

## Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure backend is running
- Check `backend/app/Http/Middleware/Cors.php`
- Clear browser cache

**Database Errors:**
```bash
cd backend
php artisan migrate:fresh --seed
```

**Port Already in Use:**
```bash
# Backend (use different port)
php artisan serve --port=8001

# Frontend (Vite will auto-select)
npm run dev
```

**Dependencies Issues:**
```bash
# Backend
cd backend
composer install
composer update

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For detailed admin panel documentation, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

## Acknowledgments

- React team for the amazing framework
- Laravel team for the robust backend framework
- Three.js for 3D graphics capabilities
- All open-source contributors

---

Made with ❤️ by [Your Name]
