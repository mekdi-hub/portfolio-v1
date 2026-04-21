FROM php:8.3-apache

# =========================
# Install system dependencies
# =========================
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip gd

# =========================
# Configure PHP upload limits
# =========================
RUN echo "upload_max_filesize = 20M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 20M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/uploads.ini

# =========================
# Enable Apache rewrite
# =========================
RUN a2enmod rewrite

# =========================
# Set working directory
# =========================
WORKDIR /var/www/html

# =========================
# Copy project files
# =========================
COPY . .

# =========================
# Install Composer
# =========================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# =========================
# Install Laravel dependencies
# =========================
RUN composer install --no-dev --optimize-autoloader --no-interaction

# =========================
# Fix Laravel permissions
# =========================
RUN mkdir -p storage/logs bootstrap/cache storage/app/public/projects \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# =========================
# Set Apache document root to /public
# =========================
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

# =========================
# Final permissions
# =========================
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]