# Workforce Manager

A comprehensive workforce management system for scheduling, time-off requests, and employee management.

## Deployment Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Linux server (Ubuntu/Debian recommended)

### Deployment Steps

1. **Clone the repository**

```bash
git clone <your-repository-url>
cd workforce-manager
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your actual configuration values
nano .env
```

3. **Run the deployment script**

```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
- Install dependencies
- Build the application
- Set up PM2 for process management
- Start the application

4. **Set up Nginx (recommended)**

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Copy the Nginx configuration
sudo cp nginx.conf.example /etc/nginx/sites-available/workforce-manager

# Edit the configuration with your domain
sudo nano /etc/nginx/sites-available/workforce-manager

# Enable the site
sudo ln -s /etc/nginx/sites-available/workforce-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Set up SSL with Let's Encrypt (recommended)**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Updating the Application

To update the application after changes:

```bash
git pull
npm install
npm run build
pm2 restart workforce-manager
```

## Development

To run the application in development mode:

```bash
# Start the server
npm run dev

# In a separate terminal, start the client
cd client
npm run dev
```

## Environment Variables

See `.env.example` for required environment variables. 