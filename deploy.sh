#!/bin/bash
# StudentOS Deployment Script for Ubuntu Server

echo "🚀 StudentOS Deployment Starting..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Clone or upload your code to /var/www/studentos
# sudo mkdir -p /var/www/studentos
# cd /var/www/studentos

# Backend setup
cd /var/www/studentos/server
npm install
npx prisma generate
npm run build

# Frontend setup
cd /var/www/studentos/client
npm install
npm run build

# Create .env for backend
cat > /var/www/studentos/server/.env << 'EOF'
DATABASE_URL="mongodb+srv://arnavaru62_db_user:Pass_word7@cluster0.2rlawbq.mongodb.net/studentos?retryWrites=true&w=majority"
ACCESS_TOKEN_SECRET="studentos-jwt-access-token-secret-key-indigo-violet-2026"
REFRESH_TOKEN_SECRET="studentos-jwt-refresh-token-secret-key-emerald-rose-2026"
GEMINI_API_KEY="AIzaSyAQ4oAhsj8V3m4meT4JuGvq3Q91h-7JQgI"
PORT=5001
NODE_ENV=production
EOF

# Start backend with PM2
cd /var/www/studentos/server
pm2 start dist/index.js --name studentos-api
pm2 save
pm2 startup

# Nginx config
sudo tee /etc/nginx/sites-available/studentos << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/studentos/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/studentos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL with Let's Encrypt (optional)
# sudo apt install certbot python3-certbot-nginx -y
# sudo certbot --nginx -d your-domain.com

echo "✅ Deployment Complete!"
echo "Frontend: http://your-domain.com"
echo "Backend: http://your-domain.com/api"
