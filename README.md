# Workforce Manager

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/enea250705/gestione6)

A full-stack application for workforce management with a Node.js/Express backend and Next.js frontend.

## Project Structure

- `/server`: Backend code (Express.js, Node.js)
- `/client`: Frontend code (Next.js)
- `/shared`: Shared code between frontend and backend

## Setup Instructions for Replit

### 1. Import from GitHub

1. Create a new Repl
2. Choose "Import from GitHub"
3. Enter the repository URL: `https://github.com/enea250705/gestione6.git`

### 2. Configure Environment Variables

Add the following secrets in the Replit Secrets tab:

- `DATABASE_URL`: Your database connection string
- `NODE_ENV`: `production`
- `PORT`: `3000`
- `FRONTEND_URL`: The URL of your frontend deployment

### 3. Install Dependencies

Run the following commands:

```bash
npm install
cd client && npm install
```

### 4. Configure .replit file

Create a `.replit` file with:

```
run = "npm run dev"
```

### 5. Deployment

For production:

- Backend: Deploy to Render using the provided `render.yaml` configuration
- Frontend: Deploy to Vercel using the configuration in `client/vercel.json`

## Local Development

1. Clone the repository
2. Install dependencies: `npm install && cd client && npm install`
3. Create `.env` file with required environment variables
4. Run the development server: `npm run dev`

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