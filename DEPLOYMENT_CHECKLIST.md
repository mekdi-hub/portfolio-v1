# Deployment Checklist

## Pre-Deployment Checklist

### 🔒 Security (CRITICAL)

- [ ] **Add Authentication**
  - [ ] Install Laravel Sanctum or Passport
  - [ ] Create login/register pages
  - [ ] Add auth middleware to admin routes
  - [ ] Implement logout functionality
  - [ ] Add password reset feature

- [ ] **Environment Configuration**
  - [ ] Set `APP_ENV=production` in `.env`
  - [ ] Set `APP_DEBUG=false` in `.env`
  - [ ] Generate new `APP_KEY`
  - [ ] Update `APP_URL` to production domain
  - [ ] Configure proper database (MySQL/PostgreSQL)

- [ ] **API Security**
  - [ ] Update CORS allowed origins (no wildcards)
  - [ ] Add rate limiting to API routes
  - [ ] Implement CSRF protection
  - [ ] Add API authentication
  - [ ] Validate all inputs

- [ ] **HTTPS**
  - [ ] Obtain SSL certificate
  - [ ] Configure HTTPS on server
  - [ ] Force HTTPS redirects
  - [ ] Update all URLs to HTTPS

### 🗄️ Database

- [ ] **Production Database**
  - [ ] Set up production database (MySQL/PostgreSQL)
  - [ ] Update database credentials in `.env`
  - [ ] Run migrations on production
  - [ ] Backup database regularly
  - [ ] Set up automated backups

- [ ] **Data Migration**
  - [ ] Export data from SQLite (if needed)
  - [ ] Import data to production database
  - [ ] Verify data integrity
  - [ ] Test all CRUD operations

### 🎨 Frontend

- [ ] **Build Configuration**
  - [ ] Update API URL to production endpoint
  - [ ] Build frontend: `npm run build`
  - [ ] Test production build locally
  - [ ] Optimize images and assets
  - [ ] Enable gzip compression

- [ ] **Performance**
  - [ ] Minify CSS and JavaScript
  - [ ] Optimize images
  - [ ] Enable caching headers
  - [ ] Add CDN for static assets
  - [ ] Test page load speed

- [ ] **SEO**
  - [ ] Add meta tags
  - [ ] Create sitemap.xml
  - [ ] Add robots.txt
  - [ ] Configure Open Graph tags
  - [ ] Add Google Analytics (optional)

### 🔧 Backend

- [ ] **Laravel Optimization**
  - [ ] Run `php artisan config:cache`
  - [ ] Run `php artisan route:cache`
  - [ ] Run `php artisan view:cache`
  - [ ] Run `composer install --optimize-autoloader --no-dev`
  - [ ] Set up queue workers (if using queues)

- [ ] **Server Configuration**
  - [ ] Point web root to `public` folder
  - [ ] Configure PHP version (8.2+)
  - [ ] Set proper file permissions
  - [ ] Configure `.htaccess` or nginx config
  - [ ] Enable OPcache

- [ ] **Logging & Monitoring**
  - [ ] Configure error logging
  - [ ] Set up log rotation
  - [ ] Add monitoring (optional)
  - [ ] Configure email for errors
  - [ ] Test error handling

### 🧪 Testing

- [ ] **Functionality Testing**
  - [ ] Test all admin CRUD operations
  - [ ] Test contact form submission
  - [ ] Test API endpoints
  - [ ] Test on different browsers
  - [ ] Test on mobile devices

- [ ] **Security Testing**
  - [ ] Test authentication flows
  - [ ] Test authorization (who can access what)
  - [ ] Test input validation
  - [ ] Test SQL injection prevention
  - [ ] Test XSS prevention

- [ ] **Performance Testing**
  - [ ] Test page load times
  - [ ] Test API response times
  - [ ] Test under load (optional)
  - [ ] Check memory usage
  - [ ] Monitor database queries

## Deployment Steps

### Option 1: Frontend (Vercel/Netlify)

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

**Configuration:**
- Build Command: `npm run build`
- Publish Directory: `dist`

### Option 2: Backend (Shared Hosting)

1. **Upload Files**
   ```bash
   # Upload all files except:
   - node_modules/
   - .git/
   - .env (create new on server)
   ```

2. **Server Setup**
   ```bash
   # SSH into server
   cd /path/to/project
   
   # Install dependencies
   composer install --optimize-autoloader --no-dev
   
   # Set up environment
   cp .env.example .env
   nano .env  # Edit with production values
   
   # Generate key
   php artisan key:generate
   
   # Run migrations
   php artisan migrate --force
   
   # Cache config
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   
   # Set permissions
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

3. **Web Server Configuration**

   **Apache (.htaccess in public folder):**
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteRule ^(.*)$ index.php [QSA,L]
   </IfModule>
   ```

   **Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /path/to/project/public;

       add_header X-Frame-Options "SAMEORIGIN";
       add_header X-Content-Type-Options "nosniff";

       index index.php;

       charset utf-8;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
           include fastcgi_params;
       }

       location ~ /\.(?!well-known).* {
           deny all;
       }
   }
   ```

### Option 3: VPS (DigitalOcean, AWS, etc.)

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install PHP 8.2
   sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl
   
   # Install Composer
   curl -sS https://getcomposer.org/installer | php
   sudo mv composer.phar /usr/local/bin/composer
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install Nginx
   sudo apt install nginx
   
   # Install MySQL
   sudo apt install mysql-server
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo> /var/www/portfolio
   cd /var/www/portfolio
   
   # Backend setup
   cd backend
   composer install --optimize-autoloader --no-dev
   cp .env.example .env
   # Edit .env with production values
   php artisan key:generate
   php artisan migrate --force
   php artisan config:cache
   
   # Frontend setup
   cd ../frontend
   npm install
   npm run build
   
   # Set permissions
   sudo chown -R www-data:www-data /var/www/portfolio
   sudo chmod -R 755 /var/www/portfolio/backend/storage
   ```

3. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/portfolio
   # Add configuration from above
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Post-Deployment Checklist

### ✅ Verification

- [ ] **Frontend**
  - [ ] Site loads correctly
  - [ ] All pages accessible
  - [ ] Images load properly
  - [ ] Forms work
  - [ ] Navigation works
  - [ ] Mobile responsive

- [ ] **Backend**
  - [ ] API endpoints respond
  - [ ] Database connections work
  - [ ] CRUD operations function
  - [ ] Error handling works
  - [ ] Logs are being written

- [ ] **Admin Panel**
  - [ ] Login works (if auth added)
  - [ ] Can create projects
  - [ ] Can edit projects
  - [ ] Can delete projects
  - [ ] Can view messages
  - [ ] Can manage orders

### 🔍 Monitoring

- [ ] **Set Up Monitoring**
  - [ ] Uptime monitoring
  - [ ] Error tracking (Sentry, Bugsnag)
  - [ ] Performance monitoring
  - [ ] Database monitoring
  - [ ] Disk space monitoring

- [ ] **Analytics**
  - [ ] Google Analytics installed
  - [ ] Conversion tracking set up
  - [ ] Goals configured
  - [ ] Custom events tracked

### 📧 Communication

- [ ] **Email Configuration**
  - [ ] SMTP configured
  - [ ] Test email sending
  - [ ] Contact form emails work
  - [ ] Error notification emails work

### 🔄 Maintenance

- [ ] **Backup Strategy**
  - [ ] Database backups scheduled
  - [ ] File backups scheduled
  - [ ] Backup restoration tested
  - [ ] Off-site backup storage

- [ ] **Update Plan**
  - [ ] Document update process
  - [ ] Schedule regular updates
  - [ ] Test updates in staging first
  - [ ] Keep dependencies updated

## Environment Variables

### Production .env (Backend)
```env
APP_NAME="Your Portfolio"
APP_ENV=production
APP_KEY=base64:... # Generate new
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Frontend Environment
Update API URL in `frontend/src/components/Admin.jsx`:
```javascript
const API_URL = 'https://api.yourdomain.com/api';
```

## Rollback Plan

If something goes wrong:

1. **Keep Previous Version**
   ```bash
   # Before deploying
   cp -r /var/www/portfolio /var/www/portfolio.backup
   ```

2. **Quick Rollback**
   ```bash
   # Restore previous version
   rm -rf /var/www/portfolio
   mv /var/www/portfolio.backup /var/www/portfolio
   sudo systemctl restart nginx
   ```

3. **Database Rollback**
   ```bash
   # Restore database backup
   mysql -u username -p database_name < backup.sql
   ```

## Support Contacts

- **Hosting Support**: [Your hosting provider]
- **Domain Registrar**: [Your domain provider]
- **SSL Certificate**: [Your SSL provider]
- **Email Service**: [Your email provider]

## Final Notes

- ⚠️ **Never deploy without authentication on admin panel**
- ⚠️ **Always test in staging environment first**
- ⚠️ **Keep backups of everything**
- ⚠️ **Monitor logs after deployment**
- ⚠️ **Have a rollback plan ready**

---

**Good luck with your deployment! 🚀**

Last Updated: April 10, 2026
