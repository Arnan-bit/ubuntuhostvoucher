# 🔧 HOSTVOUCHER TROUBLESHOOTING GUIDE

## 🚨 **ERROR YANG ANDA ALAMI: "Unexpected token 'section'"**

### ✅ **SOLUSI LANGSUNG:**

Error ini sudah diperbaiki! Masalahnya ada di struktur JSX di file `src/app/page.tsx`. Berikut langkah-langkah untuk memastikan tidak ada error lagi:

## 🔍 **LANGKAH-LANGKAH TROUBLESHOOTING**

### **1. Restart Development Server**
```bash
# Hentikan server yang sedang berjalan (Ctrl+C)
# Kemudian jalankan ulang:
npm run dev
```

### **2. Clear Next.js Cache**
```bash
# Hapus cache Next.js
rm -rf .next
npm run dev
```

### **3. Reinstall Dependencies**
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules
npm install
```

## 🐛 **COMMON ERRORS & SOLUTIONS**

### **Error 1: "Module not found"**
```bash
# Solusi:
npm install
cd api && npm install
```

### **Error 2: "Port already in use"**
```bash
# Cek port yang digunakan:
lsof -i :9002  # Frontend
lsof -i :5000  # API

# Kill process:
kill -9 <PID>
```

### **Error 3: "Database connection failed"**
```sql
-- Pastikan MySQL berjalan dan database exists:
CREATE DATABASE hostvoucher_db;
USE hostvoucher_db;
SOURCE database.sql;
```

### **Error 4: "Firebase configuration error"**
```javascript
// Update src/lib/firebase-client.ts dengan config yang benar
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  // ... config lainnya
};
```

### **Error 5: "Image loading failed"**
```bash
# Pastikan folder uploads ada:
mkdir -p api/uploads
mkdir -p public/uploads
chmod 755 api/uploads
chmod 755 public/uploads
```

## 🚀 **STARTUP CHECKLIST**

### **✅ Prerequisites:**
- [ ] Node.js 18+ installed
- [ ] MySQL server running
- [ ] Database `hostvoucher_db` created
- [ ] Environment files configured

### **✅ File Structure Check:**
```
hostvoucher/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── api/
│   ├── routes/
│   ├── utils/
│   └── uploads/
├── public/
│   └── uploads/
├── .env.local
├── package.json
└── next.config.ts
```

### **✅ Environment Files:**
1. **Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:9002
NEXT_PUBLIC_DB_HOST=localhost
NEXT_PUBLIC_DB_USER=root
NEXT_PUBLIC_DB_PASSWORD=your-password
NEXT_PUBLIC_DB_DATABASE=hostvoucher_db
```

2. **Backend (api/.env):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_DATABASE=hostvoucher_db
PORT=5000
NODE_ENV=development
```

## 🔧 **ADMIN PANEL TESTING**

### **Test Semua Fitur Admin:**

1. **Login ke Admin Panel:**
   - URL: `http://localhost:9002/admin/settings`
   - Login dengan Firebase Auth

2. **Test Fitur-Fitur:**
   - [ ] Blog Management
   - [ ] Newsletter System
   - [ ] Upload Manager
   - [ ] Site Appearance
   - [ ] Digital Strategy Images
   - [ ] Gamification Manager
   - [ ] Banner Rotation
   - [ ] Catalog Management
   - [ ] Landing Page Manager
   - [ ] Charitable Donation Settings

3. **Test Upload Functionality:**
   - Upload gambar ke berbagai section
   - Pastikan gambar muncul di frontend
   - Test drag & drop catalog ordering

4. **Test Database Integration:**
   - Simpan settings
   - Tambah/edit products
   - Test analytics tracking

## 🌐 **DEPLOYMENT PREPARATION**

### **1. Update Configuration Files:**

**next.config.ts:**
```typescript
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['your-domain.com', 'localhost']
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
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev -p 9002",
    "build": "next build",
    "start": "next start -p 9002",
    "export": "next export"
  }
}
```

### **2. Database Setup untuk Production:**
```sql
-- Buat database production
CREATE DATABASE hostvoucher_production;
USE hostvoucher_production;

-- Import struktur
SOURCE database.sql;

-- Buat user khusus
CREATE USER 'hostvoucher'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON hostvoucher_production.* TO 'hostvoucher'@'%';
FLUSH PRIVILEGES;
```

### **3. Server Requirements:**
- **Minimum:** 1GB RAM, 1 CPU Core, 20GB Storage
- **Recommended:** 2GB RAM, 2 CPU Cores, 50GB Storage
- **OS:** Ubuntu 20.04+ atau CentOS 8+
- **Software:** Node.js 18+, MySQL 8+, Nginx

## 🏗️ **HOSTING RECOMMENDATIONS**

### **🥇 VPS/Cloud (Recommended):**
1. **DigitalOcean Droplet** - $5-10/month
2. **Vultr Cloud Compute** - $3.50-6/month
3. **Linode Nanode** - $5/month
4. **AWS EC2 t3.micro** - Free tier

### **🥈 Shared Hosting dengan Node.js:**
1. **Hostinger** - $2.99/month
2. **A2 Hosting** - $3.92/month
3. **InMotion Hosting** - $6.39/month

### **🥉 Platform Deployment:**
1. **Vercel** - Frontend (Free)
2. **Railway** - Full-stack ($5/month)
3. **Render** - Full-stack (Free tier)

## 📋 **DEPLOYMENT STEPS**

### **1. Persiapan Server:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MySQL
sudo apt install mysql-server
```

### **2. Upload & Setup:**
```bash
# Clone repository
git clone your-repo-url /var/www/html/hostvoucher
cd /var/www/html/hostvoucher

# Install dependencies
npm install
cd api && npm install && cd ..

# Build application
npm run build

# Setup environment
cp .env.production.template .env.local
cp api/.env.production.template api/.env
# Edit files dengan konfigurasi production
```

### **3. Start Services:**
```bash
# Start dengan PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **4. Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **5. Setup SSL:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL
sudo certbot --nginx -d your-domain.com
```

## 🔍 **MONITORING & MAINTENANCE**

### **Log Monitoring:**
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

### **Backup Strategy:**
```bash
# Database backup
mysqldump -u username -p hostvoucher_db > backup_$(date +%Y%m%d).sql

# Files backup
tar -czf backup_files_$(date +%Y%m%d).tar.gz /var/www/html/hostvoucher
```

## 🆘 **EMERGENCY FIXES**

### **Website Down:**
```bash
# Check services
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Restart services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mysql
```

### **Database Issues:**
```bash
# Check MySQL
sudo mysql -u root -p
SHOW DATABASES;
USE hostvoucher_db;
SHOW TABLES;
```

### **File Permission Issues:**
```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/html/hostvoucher
sudo chmod -R 755 /var/www/html/hostvoucher
sudo chmod -R 777 /var/www/html/uploads
```

---

## 🎯 **QUICK START COMMANDS**

```bash
# Development
npm run dev                    # Start frontend
cd api && npm start           # Start backend

# Production
npm run build                 # Build for production
pm2 start ecosystem.config.js # Start with PM2

# Troubleshooting
rm -rf .next && npm run dev   # Clear cache
rm -rf node_modules && npm install # Reinstall deps
```

**🚀 Dengan panduan ini, website HostVoucher Anda akan berjalan sempurna!**
