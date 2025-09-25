#!/bin/bash

# ========================================
# HOSTVOUCHER DEPLOYMENT SCRIPT
# ========================================

echo "🚀 Starting HostVoucher Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. Consider using a non-root user for security."
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js installed successfully"
else
    print_success "Node.js is already installed ($(node --version))"
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
    print_success "PM2 installed successfully"
else
    print_success "PM2 is already installed"
fi

# Create application directory
APP_DIR="/var/www/html/hostvoucher"
if [ ! -d "$APP_DIR" ]; then
    print_status "Creating application directory..."
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
fi

# Navigate to application directory
cd $APP_DIR

# Pull latest changes from git
print_status "Pulling latest changes from repository..."
if [ -d ".git" ]; then
    git pull origin main
else
    print_error "Git repository not found. Please clone the repository first."
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Install API dependencies
print_status "Installing API dependencies..."
cd api
npm install
if [ $? -eq 0 ]; then
    print_success "API dependencies installed"
else
    print_error "Failed to install API dependencies"
    exit 1
fi
cd ..

# Build frontend
print_status "Building frontend application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Failed to build frontend"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Create uploads directory with proper permissions
sudo mkdir -p /var/www/html/uploads
sudo chown -R www-data:www-data /var/www/html/uploads
sudo chmod -R 755 /var/www/html/uploads

# Setup environment files
print_status "Setting up environment files..."
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Please create it with your configuration."
fi

if [ ! -f "api/.env" ]; then
    print_warning "api/.env not found. Please create it with your configuration."
fi

# Start/Restart applications with PM2
print_status "Starting applications with PM2..."
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Install and configure Nginx if not installed
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install -y nginx
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/hostvoucher > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads/ {
        alias /var/www/html/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/hostvoucher /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and restart Nginx
    sudo nginx -t && sudo systemctl restart nginx
    print_success "Nginx configured and started"
else
    print_success "Nginx is already installed"
    sudo systemctl reload nginx
fi

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Display status
print_status "Checking application status..."
pm2 status

print_success "🎉 Deployment completed successfully!"
print_status "Your application should be running on:"
print_status "Frontend: http://your-domain.com"
print_status "API: http://your-domain.com/api"

print_warning "Don't forget to:"
print_warning "1. Update your domain in Nginx configuration"
print_warning "2. Setup SSL certificate with Let's Encrypt"
print_warning "3. Configure your .env files"
print_warning "4. Test all functionality"

echo ""
echo "🔧 Useful commands:"
echo "pm2 status          - Check application status"
echo "pm2 logs            - View application logs"
echo "pm2 restart all     - Restart all applications"
echo "sudo nginx -t       - Test Nginx configuration"
echo "sudo systemctl reload nginx - Reload Nginx"
