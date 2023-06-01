# Using the official PHP 7.4 image as a parent image
FROM php:7.4-apache

# Set the working directory in the container
WORKDIR /var/www/html

# Install curl and other necessary dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the application files to the container
COPY . .

# Expose the port that the web server will listen on
EXPOSE 80

# Define the command to run the web server
CMD ["apache2-foreground"]
