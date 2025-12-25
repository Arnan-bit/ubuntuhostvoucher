# 🚀 PANDUAN DEPLOYMENT HOSTVOUCHER WEBSITE

## 📋 CHECKLIST PRE-DEPLOYMENT

### ✅ **1. PERSIAPAN KODE**
- [ ] Semua error sudah diperbaiki
- [ ] Build berhasil tanpa error: `npm run build`
- [ ] Test semua fitur utama
- [ ] Database schema sudah diupdate
- [ ] Environment variables sudah dikonfigurasi

### ✅ **2. KONFIGURASI DATABASE**
File yang perlu diedit untuk database:
- `src/lib/db.ts` - Konfigurasi database utama
- `api/utils/db.js` - Konfigurasi database API
- `.env.local` - Environment variables

**Contoh konfigurasi database:**
```javascript
// src/lib/db.ts
const dbConfig = {
  host: 'your-hosting-mysql-host.com',
  user: 'your_database_username',
  password: 'your_database_password',
  database: 'your_database_name',
  port: 3306,
  ssl: { rejectUnauthorized: false } // Untuk hosting yang memerlukan SSL
};
```

### ✅ **3. ENVIRONMENT VARIABLES**
Edit file `.env.local`:
```env
# Database Configuration
DB_HOST=your-hosting-mysql-host.com
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Upload Configuration
NEXT_PUBLIC_UPLOADS_URL=https://yourdomain.com/uploads

# FTP Configuration (jika menggunakan FTP upload)
FTP_HOST=your-ftp-host.com
FTP_USER=your_ftp_username
FTP_PASSWORD=your_ftp_password
```

## 🌐 **LANGKAH DEPLOYMENT**

### **STEP 1: BUILD APLIKASI**
```bash
# Install dependencies
npm install

# Build aplikasi
npm run build

# Test build locally (optional)
npm start
```

### **STEP 2: FOLDER YANG HARUS DIUPLOAD**
Upload folder/file berikut ke hosting:
```
📁 Root Directory/
├── 📁 .next/                 # ✅ WAJIB - Build output
├── 📁 public/                # ✅ WAJIB - Static files
├── 📁 api/                   # ✅ WAJIB - Backend API
├── 📄 package.json           # ✅ WAJIB - Dependencies
├── 📄 package-lock.json      # ✅ WAJIB - Lock file
├── 📄 next.config.ts         # ✅ WAJIB - Next.js config
├── 📄 .env.local             # ✅ WAJIB - Environment variables
└── 📄 database.sql           # ✅ WAJIB - Database schema
```

### **STEP 3: KONFIGURASI HOSTING**

#### **A. Shared Hosting (cPanel)**
1. **Upload Files:**
   - Upload semua file ke `public_html/`
   - Pastikan `.next` folder terupload lengkap

2. **Node.js Setup:**
   - Aktifkan Node.js di cPanel
   - Set Node.js version: 18.x atau 20.x
   - Set startup file: `server.js` atau `next start`
   - Set application root: `/public_html`

3. **Database Setup:**
   - Import `database.sql` ke MySQL database
   - Update connection string di `.env.local`

#### **B. VPS/Cloud Hosting**
1. **Install Dependencies:**
   ```bash
   npm install --production
   ```

2. **Setup PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "hostvoucher" -- start
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## ⚙️ **KONFIGURASI KHUSUS**

### **1. Homepage & Server Configuration**
Edit `package.json`:
```json
{
  "name": "hostvoucher-website",
  "homepage": "https://yourdomain.com",
  "scripts": {
    "start": "next start -p 3000",
    "build": "next build"
  }
}
```

### **2. Next.js Configuration**
Edit `next.config.ts`:
```typescript
const nextConfig = {
  output: 'standalone', // Untuk hosting yang mendukung
  basePath: '', // Kosongkan jika di root domain
  assetPrefix: '', // Kosongkan jika di root domain
  
  // Untuk subdirectory deployment
  // basePath: '/hostvoucher',
  // assetPrefix: '/hostvoucher',
  
  images: {
    domains: ['yourdomain.com', 'localhost'],
    unoptimized: true // Untuk shared hosting
  }
};
```

### **3. API Configuration**
Edit `api/index.js`:
```javascript
const PORT = process.env.PORT || 9002;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`🚀 API Server running on http://${HOST}:${PORT}`);
});
```

## 🗄️ **DATABASE SETUP**

### **1. Import Database Schema**
```sql
-- Import database.sql ke MySQL database Anda
-- Pastikan semua tabel terbuat dengan benar
```

### **2. Update Database Credentials**
File yang perlu diupdate:
- `src/lib/db.ts`
- `api/utils/db.js`
- `.env.local`

### **3. Test Database Connection**
```bash
# Test koneksi database
node -e "
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'your-host',
  user: 'your-user',
  password: 'your-password',
  database: 'your-database'
});
connection.connect((err) => {
  if (err) console.error('❌ Database connection failed:', err);
  else console.log('✅ Database connected successfully!');
  connection.end();
});
"
```

## 🔧 **TROUBLESHOOTING UMUM**

### **1. ChunkLoadError**
```javascript
// next.config.ts
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.publicPath = '/_next/';
    }
    return config;
  }
};
```

### **2. 404 Error pada API Routes**
- Pastikan folder `api/` terupload
- Check `.htaccess` configuration
- Verify server routing

### **3. Database Connection Error**
- Check database credentials
- Verify database server is running
- Check firewall/security groups

### **4. Upload Error**
- Check folder permissions (755 untuk folder, 644 untuk file)
- Verify upload directory exists
- Check file size limits

## 📱 **WHATSAPP SUPPORT CONFIGURATION**

Update nomor WhatsApp admin di:
```typescript
// src/components/support/UnifiedSupportChat.tsx
const whatsappUrl = `https://wa.me/6288750232020?text=${encodedMessage}`;
```

## 🎯 **POST-DEPLOYMENT CHECKLIST**

- [ ] Website dapat diakses dari domain
- [ ] Database connection berfungsi
- [ ] Upload file berfungsi
- [ ] WhatsApp support berfungsi
- [ ] Admin panel dapat diakses
- [ ] Semua form submission berfungsi
- [ ] Gamification system berfungsi
- [ ] SSL certificate aktif (jika ada)

## 📞 **SUPPORT**

Jika mengalami masalah deployment:
1. Check browser console untuk error
2. Check server logs
3. Verify database connection
4. Test API endpoints manually

**File penting untuk debugging:**
- Browser DevTools Console
- Server error logs
- Database query logs
- Network requests in DevTools

## 📁 **COMPLETE FILE LIST FOR DEPLOYMENT**

### **🗂️ CORE APPLICATION FILES**

#### **Root Directory Files:**
```
📄 package.json                    # Dependencies & scripts
📄 package-lock.json              # Lock file
📄 next.config.ts                 # Next.js configuration
📄 tailwind.config.ts             # Tailwind CSS config
📄 tsconfig.json                  # TypeScript config
📄 .env.local                     # Environment variables
📄 database.sql                   # Database schema
```

#### **📁 .next/ Directory (Build Output):**
```
📁 .next/                         # ✅ ENTIRE FOLDER REQUIRED
├── 📁 cache/                     # Build cache
├── 📁 server/                    # Server-side code
├── 📁 static/                    # Static assets
└── 📄 BUILD_ID                   # Build identifier
```

#### **📁 public/ Directory (Static Assets):**
```
📁 public/                        # ✅ ENTIRE FOLDER REQUIRED
├── 📁 images/                    # Website images
├── 📁 uploads/                   # User uploads
├── 📄 favicon.ico                # Site icon
├── 📄 robots.txt                 # SEO file
└── 📄 sitemap.xml               # SEO sitemap
```

#### **📁 api/ Directory (Backend API):**
```
📁 api/                           # ✅ ENTIRE FOLDER REQUIRED
├── 📄 index.js                   # Main API server
├── 📁 routes/                    # API routes
├── 📁 utils/                     # Utilities
│   ├── 📄 db.js                  # Database connection
│   └── 📄 helpers.js             # Helper functions
└── 📄 package.json               # API dependencies
```

### **🎯 SPECIFIC FILE LOCATIONS TO EDIT**

#### **Database Configuration Files:**
```
📍 EDIT THESE FILES FOR DATABASE:
├── 📄 src/lib/db.ts              # Main database config
├── 📄 api/utils/db.js            # API database config
├── 📄 .env.local                 # Environment variables
└── 📄 src/app/api/data/route.ts  # Data API endpoint
```

#### **WhatsApp Admin Configuration:**
```
📍 EDIT FOR WHATSAPP NUMBER:
├── 📄 src/components/support/UnifiedSupportChat.tsx
│   └── Line 113: whatsappUrl = `https://wa.me/6288750232020?text=${encodedMessage}`;
└── 📄 src/components/hostvoucher/LayoutComponents.tsx
    └── WhatsApp contact links
```

#### **Domain & URL Configuration:**
```
📍 EDIT FOR DOMAIN:
├── 📄 package.json
│   └── "homepage": "https://yourdomain.com"
├── 📄 next.config.ts
│   └── basePath & assetPrefix settings
└── 📄 .env.local
    └── NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### **⚙️ HOSTING-SPECIFIC CONFIGURATIONS**

#### **For Shared Hosting (cPanel):**
```
📁 Upload to public_html/:
├── 📁 .next/                     # Build output
├── 📁 public/                    # Static files
├── 📁 api/                       # Backend API
├── 📄 package.json               # Dependencies
├── 📄 next.config.ts             # Config
└── 📄 .env.local                 # Environment
```

#### **For VPS/Cloud Hosting:**
```
📁 Upload to /var/www/html/:
├── 📁 .next/                     # Build output
├── 📁 public/                    # Static files
├── 📁 api/                       # Backend API
├── 📄 package.json               # Dependencies
├── 📄 next.config.ts             # Config
├── 📄 .env.local                 # Environment
└── 📄 ecosystem.config.js        # PM2 config (create this)
```

### **🗄️ DATABASE SETUP FILES**

#### **SQL Files to Import:**
```
📄 database.sql                   # Main database schema
📄 sample_data.sql                # Sample data (optional)
```

#### **Database Tables Created:**
```sql
-- Core Tables
✅ deals                          # Product catalog
✅ testimonials                   # Customer reviews
✅ nft_redemption_requests        # Proof of purchase
✅ click_events                   # Analytics
✅ newsletter_subscriptions       # Email marketing
✅ mining_tasks                   # Gamification
✅ achievements                   # User achievements
✅ site_settings                  # Website configuration
✅ blog_posts                     # Content management
```

### **🔧 CONFIGURATION TEMPLATES**

#### **Database Connection (.env.local):**
```env
# Database Configuration
DB_HOST=your-mysql-host.com
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306

# Application URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Firebase (for admin)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Upload Configuration
UPLOAD_DIR=/public_html/uploads
MAX_FILE_SIZE=10485760
```

#### **Server Configuration (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'hostvoucher',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/html',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### **Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

    location /uploads/ {
        alias /var/www/html/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **📋 DEPLOYMENT CHECKLIST**

#### **Pre-Deployment:**
- [ ] Build completed successfully: `npm run build`
- [ ] Database credentials updated in `.env.local`
- [ ] WhatsApp admin number configured
- [ ] Domain/URL settings updated
- [ ] All required files present

#### **During Deployment:**
- [ ] Upload all files to hosting
- [ ] Import database.sql to MySQL
- [ ] Set correct file permissions (755 for folders, 644 for files)
- [ ] Install Node.js dependencies: `npm install --production`
- [ ] Start the application: `npm start` or PM2

#### **Post-Deployment:**
- [ ] Test website accessibility
- [ ] Verify database connection
- [ ] Test file upload functionality
- [ ] Check admin panel access
- [ ] Validate WhatsApp integration
- [ ] Test all forms and submissions

---

## 🎉 **SELAMAT!**

Website HostVoucher Anda sekarang sudah online dan siap digunakan! 🚀

**Features yang sudah aktif:**
- ✅ Unified Support Chat (HostVoucher AI, Coding Assistant, WhatsApp)
- ✅ Proof of Purchase Upload System
- ✅ Admin Panel Management
- ✅ Gamification & NFT System
- ✅ Rating & Review System
- ✅ Responsive Design
- ✅ Error Handling & Recovery
- ✅ English Language Interface
