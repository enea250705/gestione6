#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null
then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Please edit .env file with your actual configuration values."
    else
        echo "Error: .env.example not found. Please create a .env file manually."
        exit 1
    fi
fi

# Start the application with PM2
echo "Starting application with PM2..."
pm2 start npm --name "workforce-manager" -- start

# Set PM2 to start on system boot
echo "Setting up PM2 to start on system boot..."
pm2 startup
pm2 save

echo "Deployment completed successfully!"
echo "Your application should now be running."
echo "To check status, run: pm2 status"
echo ""
echo "Next steps:"
echo "1. Set up Nginx as a reverse proxy (recommended)"
echo "2. Configure SSL with Let's Encrypt (recommended)"
echo "3. Update your .env file with production values if needed" 