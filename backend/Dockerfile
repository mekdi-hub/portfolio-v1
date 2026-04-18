FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 🔥 STEP 1: copy project FIRST
COPY . .

# 🔥 STEP 2: check composer version (debug)
RUN composer --version

# 🔥 STEP 3: install dependencies safely
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Permissions
RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data /var/www/html

# Apache config
RUN a2enmod rewrite

EXPOSE 80

CMD ["apache2-foreground"]