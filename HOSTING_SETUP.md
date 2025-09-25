# 🚀 HOSTING SETUP GUIDE - HostVoucher Website

## 📋 **CHECKLIST SEBELUM HOSTING**

### ✅ **1. DATABASE CONFIGURATION**

**File yang perlu diubah untuk production:**

#### **A. Environment Variables (.env.local)**
```bash
# DATABASE PRODUCTION
DB_HOST=your-production-host.com
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=your_production_database
DB_PORT=3306

# FIREBASE PRODUCTION
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id

# SITE URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

#### **B. Database Connection Files**
- `src/lib/db.ts` - Sudah menggunakan environment variables ✅
- `src/lib/hostvoucher-data.ts` - Sudah menggunakan environment variables ✅

### ✅ **2. NEXT.JS CONFIGURATION**

#### **A. Update next.config.ts**
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Untuk hosting yang mendukung
  // atau
  // output: 'export', // Untuk static hosting
  
  images: {
    domains: [
      'yourdomain.com',
      'firebasestorage.googleapis.com',
      'placehold.co'
    ],
  },
  
  // Remove deprecated swcMinify
  experimental: {
    serverComponentsExternalPackages: ['mysql2']
  }
}

module.exports = nextConfig
```

#### **B. Package.json Scripts**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "export": "next build && next export"
  }
}
```

### ✅ **3. HOSTING PROVIDERS RECOMMENDATIONS**

#### **🔥 RECOMMENDED: Vercel (Easiest)**
1. **Setup:**
   - Connect GitHub repository
   - Auto-deploy on push
   - Environment variables di dashboard

2. **Database Options:**
   - **PlanetScale** (MySQL compatible)
   - **Railway** (MySQL)
   - **AWS RDS** (MySQL)

#### **🚀 ALTERNATIVE: Netlify**
1. **Setup:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Environment variables di dashboard

#### **💪 VPS/DEDICATED: DigitalOcean, AWS, etc.**
1. **Requirements:**
   - Node.js 18+
   - MySQL 8.0+
   - PM2 for process management

### ✅ **4. DATABASE MIGRATION**

#### **A. Export Current Database**
```bash
# Export structure and data
mysqldump -u root -p hostvoucher_db > hostvoucher_backup.sql
```

#### **B. Import to Production**
```bash
# Import to production database
mysql -u production_user -p production_db < hostvoucher_backup.sql
```

### ✅ **5. DOMAIN & DNS SETUP**

#### **A. Domain Configuration**
- **A Record**: Point to server IP
- **CNAME**: www.yourdomain.com → yourdomain.com
- **SSL Certificate**: Let's Encrypt (auto with Vercel/Netlify)

#### **B. Subdomain for Admin**
- **Option 1**: admin.yourdomain.com
- **Option 2**: yourdomain.com/admin (current setup)

### ✅ **6. SECURITY CHECKLIST**

#### **A. Environment Variables**
- ❌ Never commit .env files
- ✅ Use hosting provider's environment variables
- ✅ Different credentials for production

#### **B. Database Security**
- ✅ Strong passwords
- ✅ Limited user permissions
- ✅ SSL connections
- ✅ Regular backups

#### **C. Firebase Security**
- ✅ Production Firebase project
- ✅ Proper security rules
- ✅ Domain restrictions

### ✅ **7. PERFORMANCE OPTIMIZATION**

#### **A. Build Optimization**
```bash
# Production build
npm run build

# Check bundle size
npm run analyze
```

#### **B. Image Optimization**
- ✅ Next.js Image component (already implemented)
- ✅ WebP format support
- ✅ Lazy loading

### ✅ **8. MONITORING & ANALYTICS**

#### **A. Error Tracking**
- **Sentry** for error monitoring
- **LogRocket** for user sessions

#### **B. Analytics**
- **Google Analytics 4**
- **Vercel Analytics** (if using Vercel)

---

## 🚀 **QUICK DEPLOYMENT STEPS**

### **VERCEL (RECOMMENDED)**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### **MANUAL VPS DEPLOYMENT**
1. Setup MySQL database
2. Clone repository
3. Install dependencies: `npm install`
4. Build project: `npm run build`
5. Start with PM2: `pm2 start npm --name "hostvoucher" -- start`

---

## 📞 **SUPPORT CONTACTS**

- **Vercel Support**: https://vercel.com/support
- **PlanetScale**: https://planetscale.com/support
- **Firebase**: https://firebase.google.com/support

---

**🎯 NEXT STEPS:**
1. Choose hosting provider
2. Setup production database
3. Configure environment variables
4. Deploy and test
5. Setup domain and SSL
