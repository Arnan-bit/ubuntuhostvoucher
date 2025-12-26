# ✅ DEPLOYMENT SAFETY CHECKLIST - JANGAN ADA YANG TERLEWAT!

> **FILE INI HARUS DIBACA SEBELUM DEPLOYMENT!**
> Dokumen ini memastikan NOT ADA ERROR saat deploy!

---

## 🎯 **PRINSIP KEAMANAN UTAMA**

```
┌────────────────────────────────────────────────────────────┐
│ GOLDEN RULE #1: .md Files ≠ Program                       │
├────────────────────────────────────────────────────────────┤
│ ✓ Program HANYA baca dari .env ACTUAL file                │
│ ✓ Program TIDAK peduli dengan nilai di .md files          │
│ ✓ .md files HANYA untuk panduan manual deployment         │
│ ✗ Jangan pernah copy-paste nilai .md langsung ke code     │
└────────────────────────────────────────────────────────────┘
```

---

## 📋 **CHECKLIST PRE-DEPLOYMENT (URUTAN PENTING)**

### **FASE 1: PERSIAPAN LOKAL (Di komputer Anda)**

```
☐ 1. Clone repository dari GitHub
     Command: git clone https://github.com/YOUR_USERNAME/ubuntuhostvoucher.git
     
☐ 2. Baca DEPLOYMENT_GUIDE_COMPLETE.md
     File: DEPLOYMENT_GUIDE_COMPLETE.md
     
☐ 3. Verifikasi .env sudah di .gitignore
     Command: cat .gitignore | grep .env
     Output harus: .env*
     
☐ 4. Jangan commit .env ke Git!
     ⚠️ CRITICAL: .env hanya LOKAL, tidak di GitHub
     
☐ 5. Pastikan Node.js v18+ terinstall
     Command: node --version
     Harus: v18.x atau lebih tinggi
     
☐ 6. Run npm install untuk memverifikasi dependencies
     Command: npm install
```

---

### **FASE 2: SETUP HOSTING/SERVER**

```
☐ 1. Login ke server/VPS
     SSH: ssh user@41.216.185.84 (atau IP Anda)
     
☐ 2. Install Node.js di server
     Command: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
             sudo apt-get install -y nodejs
     
☐ 3. Install PM2 globally
     Command: sudo npm install -g pm2
     
☐ 4. Clone repository ke server
     Command: git clone https://github.com/YOUR_USERNAME/ubuntuhostvoucher.git
     
☐ 5. Masuk ke folder project
     Command: cd ubuntuhostvoucher
```

---

### **FASE 3: KONFIGURASI DATABASE (CRITICAL!)**

```
☐ 1. Login ke MySQL
     Command: mysql -u root -p
     Enter password: [password root MySQL]
     
☐ 2. Create database hostvoucher_db
     SQL: CREATE DATABASE hostvoucher_db CHARACTER SET utf8mb4;
     
☐ 3. Create user dan set privileges
     SQL: CREATE USER 'hostvoch_webar'@'%' IDENTIFIED BY 'Wizard@231191493';
          GRANT ALL PRIVILEGES ON hostvoucher_db.* TO 'hostvoch_webar'@'%';
          FLUSH PRIVILEGES;
     
     ⚠️ NOTE: Ganti password dengan yang lebih aman untuk production!
     
☐ 4. Import database.sql
     SQL: USE hostvoucher_db;
          SOURCE database.sql;
     
     ⚠️ File database.sql harus sudah ada di root project
     
☐ 5. Verifikasi database dan tables
     SQL: SHOW TABLES;
     Harus ada: users, products, orders, etc.
```

---

### **FASE 4: SETUP FILE .env (PALING PENTING!)**

```
☐ 1. Buat file .env di root project
     Command: nano .env
     
☐ 2. Masukkan konfigurasi ACTUAL (BUKAN placeholder!)
     
     # Database Configuration
     DB_HOST=41.216.185.84           ← ACTUAL server IP
     DB_USER=hostvoch_webar          ← ACTUAL username
     DB_PASSWORD=Wizard@231191493    ← ACTUAL password
     DB_DATABASE=hostvoucher_db      ← Database name
     DB_PORT=3306
     
     # Server Configuration
     PORT=5000
     NODE_ENV=production              ← HARUS 'production' untuk live!
     
     # JWT Configuration
     JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6... ← 64 char random
     JWT_EXPIRES_IN=24h
     
     # Firebase Configuration (copy dari .env lokal Anda)
     NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hostvoucher-d79e2.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=hostvoucher-d79e2
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hostvoucher-d79e2.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=16602032646
     NEXT_PUBLIC_FIREBASE_APP_ID=1:16602032646:web:487ee0bb...
     
     # API Configuration
     NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
     NEXT_PUBLIC_BASE_URL=https://your-domain.com
     
     # Upload Configuration
     NEXT_PUBLIC_UPLOADS_URL=https://your-domain.com/uploads/images
     
     # Simpan file: Ctrl+X, Y, Enter
     
☐ 3. Verifikasi .env tersimpan
     Command: cat .env
     
☐ 4. Jangan pernah commit .env!
     Verifikasi: grep .env .gitignore
     Harus menunjukkan: .env*
```

---

### **FASE 5: INSTALL DEPENDENCIES DAN BUILD**

```
☐ 1. Install npm dependencies
     Command: npm install
     Status: Harus finish dengan "added X packages"
     
☐ 2. Verify dependencies berhasil
     Command: npm list (cek apakah ada warning)
     
☐ 3. Build aplikasi
     Command: npm run build
     Status: Harus selesai dengan "✓ Complete (X pages, Y API routes)"
     
     ⚠️ Jika error di sini, fix error dulu sebelum lanjut!
     
☐ 4. Verifikasi build output
     Command: ls .next/
     Harus ada: server, standalone, static folders
```

---

### **FASE 6: SETUP PM2 UNTUK AUTO-START**

```
☐ 1. Start aplikasi dengan PM2
     Command: pm2 start ecosystem.config.js
     
☐ 2. Verifikasi aplikasi berjalan
     Command: pm2 status
     
     Output harus:
     ┌─────┬────────────────────────┬──────┬──────┬───────────┐
     │ id  │ name                   │ mode │ ↺    │ status    │
     ├─────┼────────────────────────┼──────┼──────┼───────────┤
     │ 0   │ hostvoucher-frontend   │ fork │ 0    │ online ✓  │
     │ 1   │ hostvoucher-api        │ fork │ 0    │ online ✓  │
     └─────┴────────────────────────┴──────┴──────┴───────────┘
     
     Jika status: "stopped" atau "errored", cek logs!
     
☐ 3. Cek log untuk error
     Command: pm2 logs
     
     Tidak boleh ada error messages seperti:
     ✗ Database connection failed
     ✗ Cannot find module
     ✗ Firebase config error
     
☐ 4. Setup PM2 auto-start on reboot
     Command: pm2 startup
             pm2 save
     
☐ 5. Verifikasi aplikasi berjalan di ports yang benar
     Command: sudo netstat -tlnp | grep -E '5000|9002'
     
     Output harus:
     tcp 0 0 0.0.0.0:5000  LISTEN  (API Backend)
     tcp 0 0 0.0.0.0:9002  LISTEN  (Frontend)
```

---

### **FASE 7: SETUP NGINX (CRITICAL!)**

```
☐ 1. Install Nginx
     Command: sudo apt-get install -y nginx
     
☐ 2. Create nginx config file
     Command: sudo nano /etc/nginx/sites-available/hostvoucher
     
     ⚠️ Paste konfigurasi dari DEPLOYMENT_GUIDE_COMPLETE.md
     ⚠️ Jangan lupa ganti your-domain.com dengan domain ACTUAL!
     
☐ 3. Enable site configuration
     Command: sudo ln -s /etc/nginx/sites-available/hostvoucher \
             /etc/nginx/sites-enabled/hostvoucher
     
☐ 4. Test nginx configuration
     Command: sudo nginx -t
     Output: nginx: the configuration file syntax is ok
     
     ⚠️ Jika ada error, baca error message dan fix!
     
☐ 5. Restart nginx
     Command: sudo systemctl restart nginx
     
☐ 6. Verify nginx running
     Command: sudo systemctl status nginx
     Status: harus "active (running)"
```

---

### **FASE 8: SETUP SSL CERTIFICATE (HTTPS)**

```
☐ 1. Install Certbot
     Command: sudo apt-get install -y certbot python3-certbot-nginx
     
☐ 2. Generate SSL certificate
     Command: sudo certbot --nginx -d your-domain.com -d www.your-domain.com
     
     ⚠️ Ganti your-domain.com dengan domain ACTUAL!
     ⚠️ Masukkan email untuk notifikasi renewal
     
☐ 3. Verifikasi SSL certificate
     Command: sudo certbot certificates
     
     Output harus menunjukkan certificate yang valid
     
☐ 4. Setup auto-renewal
     Command: sudo systemctl enable certbot.timer
             sudo systemctl start certbot.timer
     
     Ini akan auto-renew certificate sebelum expired
```

---

### **FASE 9: VERIFIKASI APLIKASI BERJALAN**

```
☐ 1. Test API endpoint (dari server)
     Command: curl http://localhost:5000/api/health
     
     ✓ Harus return JSON response
     ✗ Jika error: cek pm2 logs hostvoucher-api
     
☐ 2. Test frontend (dari server)
     Command: curl http://localhost:9002/
     
     ✓ Harus return HTML page
     ✗ Jika error: cek pm2 logs hostvoucher-frontend
     
☐ 3. Test via domain (dari luar server)
     Browser: https://your-domain.com
     
     ✓ Halaman load dengan cepat
     ✓ Buka DevTools (F12) → Console: tidak ada error
     ✓ Bisa akses menu login
     
☐ 4. Test API via domain
     Browser: https://your-domain.com/api/health
     
     ✓ Return JSON response
     ✗ Jika 502 Bad Gateway: API tidak running, restart PM2
     
☐ 5. Test login functionality
     ✓ Bisa login dengan akun authorized admin
     ✓ Firebase authentication bekerja
     ✓ JWT token diberikan
     ✓ API calls berhasil
```

---

## ⚠️ **COMMON ERRORS DAN SOLUSI**

### **Error 1: "npm: command not found"**
```bash
❌ Problem: Node.js tidak terinstall atau PATH salah

✅ Solution:
   1. Install Node.js: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                       sudo apt-get install -y nodejs
   2. Verify: node --version (harus v18.x+)
```

### **Error 2: "Database connection failed"**
```bash
❌ Problem: .env configuration salah atau MySQL tidak berjalan

✅ Solution:
   1. Verify MySQL running: sudo systemctl status mysql
   2. Check .env values: cat .env | grep DB_
   3. Test koneksi manual: mysql -h 41.216.185.84 -u hostvoch_webar -p
   4. Verify database exist: mysql -e "SHOW DATABASES;" -u root -p
```

### **Error 3: "502 Bad Gateway"**
```bash
❌ Problem: API backend tidak running

✅ Solution:
   1. Check PM2 status: pm2 status
   2. Check logs: pm2 logs hostvoucher-api
   3. Restart: pm2 restart hostvoucher-api
   4. Check port: sudo netstat -tlnp | grep 5000
```

### **Error 4: "Cannot find module 'jsonwebtoken'"**
```bash
❌ Problem: Dependencies tidak terinstall lengkap

✅ Solution:
   1. cd ke folder project: cd ubuntuhostvoucher
   2. Reinstall: npm install --force
   3. Rebuild: npm run build
   4. Restart: pm2 restart all
```

### **Error 5: "Firebase project error"**
```bash
❌ Problem: Firebase config di .env salah

✅ Solution:
   1. Verify .env: cat .env | grep FIREBASE_
   2. Check Firebase Console apakah config benar
   3. Update .env dengan nilai EXACT dari Firebase
   4. Restart: pm2 restart hostvoucher-api
```

---

## 🚀 **FINAL DEPLOYMENT COMMAND (ALL IN ONE)**

Setelah semua checklist di atas DONE, jalankan ini:

```bash
#!/bin/bash
# Complete deployment script

echo "🚀 Starting deployment..."

# 1. Verify environment
echo "1️⃣ Checking environment..."
node --version
npm --version
mysql --version

# 2. Install dependencies
echo "2️⃣ Installing dependencies..."
npm install

# 3. Build application
echo "3️⃣ Building application..."
npm run build

# 4. Start with PM2
echo "4️⃣ Starting with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 5. Verify services running
echo "5️⃣ Verifying services..."
pm2 status
sudo netstat -tlnp | grep -E '5000|9002'

# 6. Test endpoints
echo "6️⃣ Testing endpoints..."
curl http://localhost:5000/api/health
curl http://localhost:9002/

echo "✅ Deployment complete!"
echo "🌐 Access application at: https://your-domain.com"
echo "📊 Monitor logs: pm2 logs"
```

---

## 📞 **JIKA MASIH ADA ERROR**

**Sebelum menghubungi support, kumpulkan informasi ini:**

```bash
# 1. PM2 status dan logs
pm2 status > pm2_status.txt
pm2 logs --err > pm2_errors.txt

# 2. Environment check
node --version > system_info.txt
npm --version >> system_info.txt
mysql --version >> system_info.txt

# 3. Database connection
mysql -h 41.216.185.84 -u hostvoch_webar -p -e "SELECT VERSION();" > db_info.txt

# 4. Network check
sudo netstat -tlnp | grep -E '5000|9002' > network_info.txt
curl https://your-domain.com/api/health > api_test.txt

# Kirim file-file ini ke support dengan deskripsi error
```

---

## ✅ **DEPLOYMENT SUKSES JIKA:**

```
✓ pm2 status menunjukkan "online" untuk semua apps
✓ curl http://localhost:5000/api/health return 200
✓ https://your-domain.com membuka dengan cepat
✓ DevTools console (F12) tidak ada error
✓ Login bisa dilakukan
✓ Database query berjalan
✓ File uploads berfungsi
✓ API calls dari frontend berhasil
```

---

**🎉 SELAMAT! DEPLOYMENT SELESAI DENGAN AMAN!**

> Terakhir update: 26 December 2025
> Status: ✅ READY FOR PRODUCTION
