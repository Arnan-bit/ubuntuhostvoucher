# 🚀 PANDUAN LENGKAP DEPLOYMENT HOSTVOUCHER

## 📋 **CHECKLIST PRE-DEPLOYMENT**

### ✅ **1. PERSIAPAN FILE KONFIGURASI**

#### **Frontend (.env.local)**
```env
# Database Configuration
NEXT_PUBLIC_DB_HOST=your-database-host.com
NEXT_PUBLIC_DB_USER=your-database-username
NEXT_PUBLIC_DB_PASSWORD=your-database-password
NEXT_PUBLIC_DB_DATABASE=your-database-name

# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Payment Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
NEXT_PUBLIC_CRYPTO_WALLET_ADDRESS=your-crypto-wallet-address

# Email Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-emailjs-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

#### **Backend API (.env)**
```env
# Database Configuration
DB_HOST=your-database-host.com
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_DATABASE=your-database-name
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Upload Configuration
UPLOAD_PATH=/var/www/html/uploads
MAX_FILE_SIZE=10485760

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp Configuration
WHATSAPP_NUMBER=08875023202
WHATSAPP_API_TOKEN=your-whatsapp-api-token
```

### ✅ **2. KONFIGURASI DATABASE**

#### **MySQL Database Setup**
```sql
-- Buat database
CREATE DATABASE hostvoucher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Gunakan database
USE hostvoucher_db;

-- Import struktur database
SOURCE database.sql;

-- Buat user khusus (opsional tapi direkomendasikan)
CREATE USER 'hostvoucher_user'@'%' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON hostvoucher_db.* TO 'hostvoucher_user'@'%';
FLUSH PRIVILEGES;
```

### ✅ **3. KONFIGURASI HOSTING**

#### **Shared Hosting (cPanel)**
```bash
# 1. Upload files ke public_html
# 2. Buat subdomain untuk API: api.your-domain.com
# 3. Upload folder 'api' ke subdomain
# 4. Install Node.js di cPanel
# 5. Setup Node.js app dengan entry point: index.js
```

#### **VPS/Dedicated Server**
```bash
# Install Node.js dan npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
sudo npm install -g pm2

# Clone repository
git clone your-repository-url
cd hostvoucher

# Install dependencies
npm install
cd api && npm install && cd ..

# Build frontend
npm run build

# Start services dengan PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### ✅ **4. KONFIGURASI NGINX (VPS)**

#### **nginx.conf**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads/ {
        alias /var/www/html/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### ✅ **5. KONFIGURASI PM2 (ecosystem.config.js)**

```javascript
module.exports = {
  apps: [
    {
      name: 'hostvoucher-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/html/hostvoucher',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'hostvoucher-api',
      script: 'index.js',
      cwd: '/var/www/html/hostvoucher/api',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

## 🔧 **PERBAIKAN KONFIGURASI YANG DIPERLUKAN**

### ✅ **1. Update next.config.ts**
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Untuk deployment
  images: {
    domains: ['your-domain.com', 'localhost'],
    unoptimized: true // Untuk shared hosting
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://api.your-domain.com/:path*'
          : 'http://localhost:5000/:path*'
      }
    ];
  }
};

export default nextConfig;
```

### ✅ **2. Update package.json scripts**
```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "export": "next export",
    "deploy": "npm run build && npm run export"
  }
}
```

## 🌐 **REKOMENDASI HOSTING**

### **🥇 Pilihan Terbaik: VPS/Cloud Server**
- **DigitalOcean Droplet**: $5-10/bulan
- **Vultr Cloud Compute**: $3.50-6/bulan  
- **Linode Nanode**: $5/bulan
- **AWS EC2 t3.micro**: Free tier available

### **🥈 Alternatif: Shared Hosting dengan Node.js**
- **Hostinger**: Node.js support, $2.99/bulan
- **A2 Hosting**: Node.js support, $3.92/bulan
- **InMotion Hosting**: Node.js support, $6.39/bulan

### **🥉 Deployment Platform**
- **Vercel**: Frontend deployment (Free tier)
- **Railway**: Full-stack deployment ($5/bulan)
- **Render**: Full-stack deployment (Free tier)

## 📱 **KONFIGURASI DOMAIN & SSL**

### **Setup Domain**
```bash
# A Record
@ -> your-server-ip
www -> your-server-ip
api -> your-server-ip

# CNAME Record (jika menggunakan subdomain)
api -> your-domain.com
```

### **SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 **KEAMANAN & OPTIMASI**

### **Firewall Configuration**
```bash
# UFW Setup
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### **Performance Optimization**
```bash
# Enable Gzip compression
# Add to nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

## 📊 **MONITORING & MAINTENANCE**

### **Log Monitoring**
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System monitoring
htop
df -h
free -m
```

### **Backup Strategy**
```bash
# Database backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Files backup
tar -czf backup_files_$(date +%Y%m%d).tar.gz /var/www/html/hostvoucher
```

## 🚀 **LANGKAH DEPLOYMENT**

1. **Persiapan Server**
2. **Upload & Install Dependencies**
3. **Konfigurasi Database**
4. **Setup Environment Variables**
5. **Build & Start Applications**
6. **Configure Nginx/Apache**
7. **Setup SSL Certificate**
8. **Test All Features**
9. **Monitor & Optimize**

---

## ⚡ **QUICK DEPLOYMENT COMMANDS**

```bash
# Full deployment script
#!/bin/bash
git pull origin main
npm install
cd api && npm install && cd ..
npm run build
pm2 restart all
sudo systemctl reload nginx
```

Simpan script ini sebagai `deploy.sh` dan jalankan setiap kali ada update!
