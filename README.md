# Portfolio Website with Admin Panel

A modern, full-stack portfolio website built with React (frontend) and Laravel (backend), featuring professional animations, glassmorphism design, and comprehensive admin functionality.

## ✨ Features

### Frontend
- 🎨 **Modern UI Design** - Professional glassmorphism effects and smooth animations
- 🌟 **Interactive Backgrounds** - Particle systems and star effects
- 📱 **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- 🎯 **Smooth Navigation** - Seamless page transitions
- 💫 **Custom Cursor** - Interactive cursor with smooth tracking
- 📊 **Skills Showcase** - Animated cards with technology icons
- 💼 **Projects Gallery** - Overlapping scroll effect with professional styling
- 📧 **Contact Page** - Social links and contact information with glassmorphism
- 🎭 **About Me** - Three-tab layout with timeline and animated statistics
- 🌓 **Theme Support** - Dark and light theme options

### Backend
- 🚀 **Laravel 13 REST API** - Modern PHP framework
- 💾 **Flexible Database** - SQLite (development) / PostgreSQL (production)
- 🖼️ **Cloudinary Integration** - Cloud-based image hosting
- 🔌 **RESTful Endpoints** - Complete CRUD operations
- ✅ **Input Validation** - Secure data handling
- 🌐 **CORS Enabled** - Cross-origin resource sharing configured
- 🔐 **Admin Panel** - Full content management system

### Admin Panel
- ✏️ **Project Management** - Create, read, update, delete projects
- 🖼️ **Image Upload** - Direct file upload to Cloudinary
- 📝 **Form Validation** - Client and server-side validation
- 🎨 **Professional UI** - Clean, intuitive interface

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite (Build tool)
- React Router DOM
- Axios (API calls)
- CSS3 (Custom animations)
- Framer Motion (Animations)

### Backend
- Laravel 13
- PHP 8.3+
- SQLite (Development)
- PostgreSQL (Production)
- Cloudinary (Image hosting)

## 🚀 Quick Start

### Prerequisites
- PHP 8.3 or higher
- Composer
- Node.js 18+ and npm
- Git

### Installation

#### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/mekdi-hub/portfolio.git
cd portfolio

# Run setup script
setup.bat
```

#### Option 2: Manual Setup
```bash
# Clone the repository
git clone https://github.com/mekdi-hub/portfolio.git
cd portfolio

# Frontend setup
cd frontend
npm install
cd ..

# Backend setup
cd backend
composer install
php artisan migrate
cd ..
```

### Development

```bash
# Terminal 1 - Start Frontend
cd frontend
npm run dev
# Access at: http://localhost:5173

# Terminal 2 - Start Backend
cd backend
php artisan serve
# Access at: http://localhost:8000
```

### Access Admin Panel
```bash
# Option 1: Use the script
start-admin.bat

# Option 2: Navigate manually
# Open browser to: http://localhost:5173/admin
```

## 📁 Project Structure

```
portfolio/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── themes.js      # Theme configuration
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── backend/               # Laravel application
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/Api/  # API controllers
│   │   └── Models/        # Database models
│   ├── database/
│   │   ├── migrations/    # Database migrations
│   │   └── database.sqlite # SQLite database
│   ├── routes/
│   │   └── api.php        # API routes
│   └── .env               # Environment configuration
│
├── DATABASE_SETUP.md      # Database configuration guide
├── CLOUDINARY_SETUP.md    # Image upload setup guide
├── PROJECT_STATUS.md      # Complete project status
├── QUICK_REFERENCE.md     # Quick command reference
└── README.md              # This file
```

## 📚 Documentation

- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database configuration and troubleshooting
- **[CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)** - Image upload system setup
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Complete project status and features
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference

## 🎨 Pages

1. **Hero** - Landing page with glitch effects and particle background
2. **About Me** - Three-tab layout with timeline and statistics
3. **Skills** - Technology showcase with animated cards
4. **Projects** - Portfolio projects with overlapping scroll effect
5. **Contact** - Social links and contact information
6. **Admin** - Content management panel

## 🔧 Configuration

### Database
The project uses **SQLite** for local development (no setup required) and **PostgreSQL** for production.

```bash
# Current configuration (SQLite)
DB_CONNECTION=sqlite

# For production (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed configuration.

### Cloudinary
Configure image upload in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_UPLOAD_PRESET=your-upload-preset
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

See [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) for setup instructions.

## 🎯 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get single project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Messages
- `POST /api/messages` - Submit contact form
- `GET /api/messages` - List all messages

### Upload
- `POST /api/upload` - Upload image to Cloudinary
- `DELETE /api/upload/{publicId}` - Delete image

See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for complete API documentation.

## 🐛 Troubleshooting

### Common Issues

**Frontend not loading:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend errors:**
```bash
cd backend
php artisan config:clear
php artisan cache:clear
php artisan migrate
```

**Database connection error:**
The project uses SQLite by default, which requires no configuration. If you see database errors, ensure `DB_CONNECTION=sqlite` in `backend/.env`.

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed troubleshooting.

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `VITE_API_URL=https://your-backend-url/api`
4. Deploy

### Backend (Render.com)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables (see `.env.example`)
4. Deploy

## 🎨 Customization

### Colors
Edit `frontend/src/themes.js`:
```javascript
export const darkTheme = {
  primary: '#22D3EE',      // Cyan
  secondary: '#3B82F6',    // Blue
  accent: '#8B5CF6',       // Purple
  // ... more colors
};
```

### Content
Use the admin panel at `/admin` to manage:
- Projects
- Images
- Settings

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Mekdi**
- GitHub: [@mekdi-hub](https://github.com/mekdi-hub)
- Email: mekdimeki8@gmail.com
- Telegram: [@Rosinadd](https://t.me/Rosinadd)
- Twitter: [@mekdimeki](https://twitter.com/mekdimeki)

## 🙏 Acknowledgments

- React team for the amazing framework
- Laravel team for the powerful backend framework
- Cloudinary for image hosting
- All open-source contributors

---

Made with ❤️ by [mekdi-hub](https://github.com/mekdi-hub)
