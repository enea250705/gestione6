#!/bin/bash

# Install dependencies
echo "Installing main dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install
cd ..

# Setup environment
echo "Creating environment files..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env file. Please update with your actual values in Replit Secrets."
fi

# Build instructions
echo "Setup complete. To run the project:"
echo "1. Update environment variables in Replit Secrets"
echo "2. Run the project with 'npm run dev'" 