# ======================================
# 1. Base image (PHP 8.3 + Apache)
# ======================================
FROM php:8.3-apache

# ======================================
# 2. Install system dependencies
# ======================================
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# ======================================
# 3. Enable Apache rewrite module
# ======================================
RUN a2enmod rewrite

# ======================================
# 4. Set working directory
# ======================================
WORKDIR /var/www/html

# ======================================
# 5. Copy project files
# ======================================
COPY . .

# ======================================
# 6. Fix Apache to use Laravel /public
# ======================================
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf

RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# ======================================
# 7. TEMP FIX (CRITICAL FOR YOUR ERROR)
# ======================================
ENV TMPDIR=/tmp
ENV TEMP=/tmp
ENV TMP=/tmp

RUN mkdir -p /tmp/laravel && chmod -R 777 /tmp

# ======================================
# 8. Session + cache fix
# ======================================
RUN echo "session.save_path=/tmp" >> /usr/local/etc/php/conf.d/sessions.ini

# ======================================
# 9. Permissions fix
# ======================================
RUN chmod -R 777 storage bootstrap/cache

# ======================================
# 10. Install Composer
# ======================================
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ======================================
# 11. Install Laravel dependencies
# ======================================
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# ======================================
# 12. Clear Laravel caches (VERY IMPORTANT)
# ======================================
RUN php artisan optimize:clear || true

# ======================================
# 13. Expose port
# ======================================
EXPOSE 80

# ======================================
# 14. Start Apache
# ======================================
CMD ["apache2-foreground"]