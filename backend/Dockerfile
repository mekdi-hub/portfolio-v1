# ===============================
# 1. PHP + Apache base image
# ===============================
FROM php:8.3-apache

# ===============================
# 2. Install system dependencies
# ===============================
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# ===============================
# 3. Enable Apache rewrite module
# ===============================
RUN a2enmod rewrite

# ===============================
# 4. Set working directory
# ===============================
WORKDIR /var/www/html

# ===============================
# 5. Copy project files
# ===============================
COPY . .

# ===============================
# 6. Fix Apache document root (IMPORTANT)
# ===============================
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf

RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# ===============================
# 7. Fix temp directory issue (IMPORTANT)
# ===============================
ENV TMPDIR=/tmp

# ===============================
# 8. Permissions fix (VERY IMPORTANT for Laravel)
# ===============================
RUN chmod -R 775 storage bootstrap/cache

# ===============================
# 9. Install Composer
# ===============================
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ===============================
# 10. Install PHP dependencies
# ===============================
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# ===============================
# 11. Clear Laravel caches (CRITICAL FIX)
# ===============================
RUN php artisan optimize:clear || true

# ===============================
# 12. Expose port for Render
# ===============================
EXPOSE 80

# ===============================
# 13. Start Apache
# ===============================
CMD ["apache2-foreground"]