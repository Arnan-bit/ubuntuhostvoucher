# 🚀 PANDUAN LENGKAP DEPLOYMENT HOSTVOUCHER

## ⚠️ **PERINGATAN KEAMANAN PENTING**

```
🔐 KEAMANAN LEVEL KRITIS!

Dokumentasi ini HANYA BERISI PLACEHOLDER/CONTOH!
Program TIDAK MEMBACA file .md ini!
Program hanya membaca dari .env ACTUAL file di server lokal!

❌ JANGAN PERNAH:
   - Isikan nilai SEBENARNYA (password, API key) di file ini
   - Commit/push file .env ke GitHub
   - Bagikan file .env ke orang lain

✅ HARUS LAKUKAN:
   - Edit .env LOKAL saja (tidak di GitHub)
   - Jaga keamanan file .env dengan ketat
   - Gunakan panduan ini hanya sebagai REFERENSI

Semua nilai placeholder di bawah harus DIGANTI dengan nilai ACTUAL 
ketika setup di server yang BERBEDA!
```

---

## 📋 **CHECKLIST PRE-DEPLOYMENT**

### ✅ **1. PERSIAPAN FILE KONFIGURASI**

> **CATATAN:** Nilai-nilai di bawah adalah PLACEHOLDER/CONTOH saja.
> Ganti dengan nilai ACTUAL Anda pada saat deployment!

#### **Frontend (.env.local)**
```env
# ⚠️ KEAMANAN: File ini TIDAK boleh di-commit ke Git!
# Anda akan membuat file ini LOKAL di server masing-masing!

# Database Configuration
# Ganti dengan database host Anda (contoh: 41.216.185.84 atau localhost)
NEXT_PUBLIC_DB_HOST=your-database-host.com
# Ganti dengan username database (contoh: hostvoch_webar)
NEXT_PUBLIC_DB_USER=your-database-username
# ⚠️ CRITICAL: Ganti dengan PASSWORD ACTUAL (jangan placeholder!)
NEXT_PUBLIC_DB_PASSWORD=your-database-password
# Ganti dengan nama database (contoh: hostvoch_webapp)
NEXT_PUBLIC_DB_DATABASE=your-database-name

# API Configuration
# Ganti dengan URL API actual Anda (contoh: https://api.yourdomain.com/api)
NEXT_PUBLIC_API_URL=https://your-domain.com/api
# Ganti dengan URL site actual Anda (contoh: https://yourdomain.com)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Firebase Configuration
# Ini adalah PUBLIC keys dari Firebase - aman untuk di-lihat
# Dapatkan dari Firebase Console → Project Settings
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Payment Configuration (opsional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
NEXT_PUBLIC_CRYPTO_WALLET_ADDRESS=your-crypto-wallet-address

# Email Configuration (opsional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-emailjs-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

#### **Backend API (.env)**
```env
# ⚠️ KEAMANAN MAKSIMAL: File ini SANGAT RAHASIA!
# Jangan pernah commit/push ke GitHub!
# Jangan pernah bagikan ke siapapun!
# Hanya admin server yang boleh akses!

# Database Configuration
# Ganti dengan host database Anda
DB_HOST=your-database-host.com
# Ganti dengan username database
DB_USER=your-database-username
# ⚠️ CRITICAL SECURITY: Ganti dengan PASSWORD ACTUAL!
DB_PASSWORD=your-database-password
# Ganti dengan nama database actual
DB_DATABASE=your-database-name
# Default port MySQL
DB_PORT=3306

# Server Configuration
# Port tempat API backend berjalan (default: 5000)
PORT=5000
# ⚠️ PENTING: Ubah ke 'production' saat deploy ke server!
NODE_ENV=production

# CORS Configuration
# Ganti dengan URL frontend actual Anda
FRONTEND_URL=https://your-domain.com
# Daftar domain yang diizinkan akses API
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Upload Configuration
# Path tempat file upload disimpan
UPLOAD_PATH=/var/www/html/uploads
# Batas ukuran file (10MB)
MAX_FILE_SIZE=10485760

# Email Configuration (SMTP Gmail)
# Host email server
SMTP_HOST=smtp.gmail.com
# Port SMTP
SMTP_PORT=587
# Email account (ganti dengan email Anda)
SMTP_USER=your-email@gmail.com
# ⚠️ CRITICAL: Gunakan App Password Gmail, bukan password akun!
SMTP_PASS=your-app-password

# WhatsApp Configuration (opsional)
WHATSAPP_NUMBER=08875023202
# ⚠️ CRITICAL: API Token WhatsApp (jangan keluarkan!)
WHATSAPP_API_TOKEN=your-whatsapp-api-token
```

### ✅ **2. KONFIGURASI DATABASE**

#### **MySQL Database Setup**

> **CATATAN KEAMANAN:** 
> - Ganti `'hostvoucher_user'@'%'` dengan username yang lebih aman
> - Ganti `'strong_password_here'` dengan password ACTUAL yang SANGAT KUAT
> - Password harus diingat untuk dimasukkan di .env

```sql
-- Buat database
CREATE DATABASE hostvoucher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Gunakan database
USE hostvoucher_db;

-- Import struktur database (file database.sql sudah ada)
SOURCE database.sql;

-- Buat user khusus dengan password KUAT
-- ⚠️ GANTI 'strong_password_here' dengan password ACTUAL Anda!
CREATE USER 'hostvoucher_user'@'%' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON hostvoucher_db.* TO 'hostvoucher_user'@'%';
FLUSH PRIVILEGES;

-- Verifikasi:
-- SELECT user, host FROM mysql.user;  -- Lihat user yang terbuat
```

**✅ Setelah database dibuat:**
- Catat username dan password yang Anda buat
- Masukkan ke .env dengan nama: `DB_USER` dan `DB_PASSWORD`

### ✅ **3. KONFIGURASI HOSTING**

#### **Shared Hosting (cPanel)** - TIDAK RECOMMENDED untuk project ini
```bash
# ⚠️ CATATAN: Shared hosting biasanya tidak mendukung Node.js dengan baik
# Rekomendasi: Gunakan VPS atau Cloud Server sebagai gantinya
# (Lihat opsi di bagian "REKOMENDASI HOSTING")

# Jika tetap mau pakai shared hosting:
# 1. Upload files ke public_html
# 2. Buat subdomain: api.your-domain.com (ganti dengan domain Anda)
# 3. Upload folder 'api' ke subdomain
# 4. Install Node.js di cPanel (minta ke support)
# 5. Setup Node.js app dengan entry point: index.js
# 6. Pastikan file .env TIDAK di-upload! (buat lokal di server)
```

#### **VPS/Dedicated Server** - RECOMMENDED ✅

```bash
# ========================================
# STEP 1: Install Node.js dan npm
# ========================================
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi instalasi:
node --version  # Harus v18.x atau lebih tinggi
npm --version

# ========================================
# STEP 2: Install PM2 (process manager)
# ========================================
sudo npm install -g pm2

# ========================================
# STEP 3: Clone repository
# ========================================
# Ganti YOUR_USERNAME dengan username GitHub Anda
git clone https://github.com/YOUR_USERNAME/ubuntuhostvoucher.git
cd ubuntuhostvoucher

# ========================================
# STEP 4: Create .env file LOKAL
# ========================================
# ⚠️ SANGAT PENTING: Jangan copy dari GitHub!
# Buat file .env baru dengan nilai ACTUAL:
nano .env

# Paste konfigurasi dari section "Backend API (.env)" di atas
# Ganti SEMUA placeholder dengan nilai SEBENARNYA
# Simpan: Ctrl+X, Y, Enter

# ========================================
# STEP 5: Install dependencies
# ========================================
npm install

# ========================================
# STEP 6: Build frontend
# ========================================
npm run build

# ========================================
# STEP 7: Start dengan PM2
# ========================================
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Verifikasi bahwa aplikasi berjalan:
pm2 status  # Harus menunjukkan status "online"
pm2 logs    # Lihat log aplikasi
```

✅ **Aplikasi sudah berjalan di background!**

### ✅ **4. KONFIGURASI NGINX (VPS)**

> **CATATAN:** Nginx digunakan sebagai reverse proxy dan web server

#### **Buat file nginx.conf**
```bash
# Buat file konfigurasi
sudo nano /etc/nginx/sites-available/hostvoucher

# Atau edit yang sudah ada:
sudo nano /etc/nginx/sites-enabled/hostvoucher
```

#### **Isi konfigurasi nginx:**
```nginx
# ========================================
# REDIRECT HTTP ke HTTPS (keamanan)
# ========================================
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    # ⚠️ Ganti your-domain.com dengan domain ACTUAL Anda
    
    return 301 https://$server_name$request_uri;
}

# ========================================
# HTTPS SERVER (PRODUCTION)
# ========================================
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    # ⚠️ Ganti your-domain.com dengan domain ACTUAL Anda

    # ⚠️ CRITICAL: Setup SSL Certificate (gunakan Let's Encrypt)
    # Command: sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # ========================================
    # FRONTEND (Next.js) - Port 9002
    # ========================================
    location / {
        proxy_pass http://localhost:9002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ========================================
    # API BACKEND - Port 5000
    # ========================================
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
        
        # ⚠️ PENTING: Timeout untuk API
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ========================================
    # STATIC FILES & UPLOADS
    # ========================================
    location /uploads/ {
        alias /var/www/html/uploads/;
        expires 1y;  # Cache files for 1 year
        add_header Cache-Control "public, immutable";
    }

    # ========================================
    # SECURITY HEADERS
    # ========================================
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Setelah membuat file:**
```bash
# Test konfigurasi
sudo nginx -t

# Jika OK, reload nginx
sudo systemctl reload nginx

# Verifikasi nginx berjalan
sudo systemctl status nginx
```
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
        PORT: 9002  // ⚠️ PENTING: Match dengan port di next.config.ts
      }
    },
    {
      name: 'hostvoucher-api',
      script: 'index.js',
      cwd: '/var/www/html/hostvoucher/api',
      env: {
        NODE_ENV: 'production',
        PORT: 5000  // ⚠️ PENTING: Match dengan PORT di .env
      }
    }
  ]
};
```

---

## ✅ **VERIFIKASI DEPLOYMENT (CRITICAL!)**

Sebelum dinyatakan sukses, WAJIB cek:

### **1. Check Aplikasi Berjalan**
```bash
# Cek PM2 status
pm2 status
# Harus menunjukkan: online ✓

# Cek logs untuk error
pm2 logs hostvoucher-frontend
pm2 logs hostvoucher-api
# Tidak boleh ada error messages
```

### **2. Check Database Connection**
```bash
# Test koneksi database
mysql -h DB_HOST -u DB_USER -p

# Ganti DB_HOST, DB_USER dengan nilai actual dari .env
# Masukkan password (DB_PASSWORD)

# Jika berhasil, keluar dengan: exit
```

### **3. Check API Endpoint**
```bash
# Test API health
curl http://localhost:5000/api/health
# Harus return: {"status": "OK"} atau response 200

# Test dengan domain
curl https://your-domain.com/api/health
# Ganti your-domain.com dengan domain ACTUAL
```

### **4. Check Frontend**
```bash
# Buka di browser:
https://your-domain.com

# Harus:
# ✓ Halaman load dengan cepat
# ✓ Tidak ada console error (buka DevTools: F12)
# ✓ Bisa akses fitur login
```

### **5. Check SSL Certificate**
```bash
# Verifikasi SSL
curl -I https://your-domain.com
# Harus menunjukkan: HTTP/2 200

# Check SSL expiry
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## ⚠️ **TROUBLESHOOTING - JIKA ADA ERROR**

### **Error: Connection refused (Port 5000 / 9002)**
```bash
# 1. Cek apakah aplikasi berjalan
pm2 status

# 2. Jika tidak online, restart
pm2 restart all

# 3. Cek log error
pm2 logs --err

# 4. Verifikasi port listening
sudo netstat -tlnp | grep -E '5000|9002'
```

### **Error: Database connection failed**
```bash
# Cek nilai di .env
cat .env | grep DB_

# Verifikasi koneksi manual
mysql -h 41.216.185.84 -u hostvoch_webar -p
# Masukkan password dari DB_PASSWORD

# Jika gagal, periksa:
# - Apakah IP benar?
# - Apakah username/password benar?
# - Apakah database sudah di-create?
```

### **Error: 502 Bad Gateway**
```bash
# Biasanya API tidak berjalan. Cek dengan:
pm2 logs hostvoucher-api

# Jika ada error:
# 1. Cek .env values
# 2. Cek database connection
# 3. Restart: pm2 restart hostvoucher-api
```

### **Error: Firebase Auth Error**
```bash
# Verifikasi Firebase config di .env
cat .env | grep FIREBASE_

# Cek di Firebase Console apakah:
# - Project ID benar
# - API Key benar
# - Authentication enabled
```

---

## 🚀 **LANGKAH DEPLOYMENT FINAL (CHECKLIST)**

Sebelum go live, pastikan semua ini DONE:

```
ENVIRONMENT (.env)
  ☐ DB_HOST = IP server actual
  ☐ DB_USER = username actual
  ☐ DB_PASSWORD = password actual (TIDAK placeholder!)
  ☐ JWT_SECRET = 64 char random (dari crypto.randomBytes)
  ☐ NODE_ENV = 'production'
  ☐ NEXT_PUBLIC_API_URL = domain actual
  
DATABASE
  ☐ Database sudah create
  ☐ User MySQL sudah create
  ☐ Privileges sudah grant
  ☐ database.sql sudah import
  
APPLICATION
  ☐ npm install berhasil
  ☐ npm run build berhasil
  ☐ pm2 start ecosystem.config.js berhasil
  ☐ pm2 status menunjukkan online
  
NGINX
  ☐ nginx.conf sudah setup
  ☐ SSL certificate sudah install
  ☐ sudo nginx -t tidak ada error
  ☐ sudo systemctl reload nginx berhasil
  
VERIFICATION
  ☐ curl http://localhost:5000/api/health = OK
  ☐ curl https://domain.com berhasil
  ☐ DevTools console tidak ada error
  ☐ Login bisa dilakukan
  
SECURITY
  ☐ .env file tidak di-commit ke Git
  ☐ .env file hanya ada di server (lokal)
  ☐ .gitignore sudah include .env*
  ☐ Password tidak di-share ke siapapun
```

---

## 📱 **QUICK REFERENCE**

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
