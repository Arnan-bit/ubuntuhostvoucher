# 🚀 HOSTING SETUP GUIDE - HostVoucher Website (MySQL Only)

## 📋 **PRE-HOSTING CHECKLIST**

### ✅ **1. DATABASE CONFIGURATION**

#### **A. Environment Variables (.env.local / .env.production)**
```bash
# ==================== DATABASE (MYSQL) ====================
DB_HOST=your-production-host.com
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=your_production_database
DB_PORT=3306

# ==================== SITE CONFIGURATION ====================
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api

# ==================== JWT AUTHENTICATION ====================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long

# ==================== IP API (Optional - for geo-location) ====================
# No key needed, uses free tier from ipapi.co
```

#### **B. Database Connection**
- `api/utils/db.js` - Uses MySQL connection pooling ✅
- All API routes connected to MySQL ✅
- No Firebase dependencies ✅

### ✅ **2. NEXT.JS CONFIGURATION**

#### **A. Update next.config.ts**
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Vercel/traditional hosting
  
  images: {
    domains: [
      'yourdomain.com',
      'placehold.co',
      'api.example.com'
    ],
  },
  
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

module.exports = nextConfig;
```

### ✅ **3. VERCEL DEPLOYMENT (RECOMMENDED)**

#### **Step 1: Connect Repository**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select root directory: `./` (or where package.json is)

#### **Step 2: Set Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:

```
DB_HOST = your-production-host.com
DB_USER = production_user
DB_PASSWORD = ••••••••••
DB_NAME = production_database
DB_PORT = 3306

JWT_SECRET = your-super-secret-key-here

NEXT_PUBLIC_SITE_URL = https://yourdomain.vercel.app
NEXT_PUBLIC_API_BASE_URL = https://yourdomain.vercel.app/api
```

**🔒 Security Note:**
- DB_PASSWORD, JWT_SECRET are **NOT exposed** to frontend
- Prefix with `NEXT_PUBLIC_` only for client-side vars
- All sensitive data stays server-side

#### **Step 3: Deploy**
1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Test endpoints: `https://yourdomain.vercel.app/api/status`

### ✅ **4. CUSTOM DOMAIN SETUP**

#### **Option A: With Vercel**
1. In Vercel Dashboard → Settings → Domains
2. Add your domain name
3. Update DNS records (Vercel provides instructions)
4. SSL certificate auto-issued ✅

#### **Option B: Traditional Hosting (VPS/cPanel)**
1. Update DNS to point to your server IP
2. Copy project to server
3. Install Node.js + PM2:
   ```bash
   npm install -g pm2
   npm run build
   pm2 start "npm run start" --name hostvoucher
   pm2 save
   ```
4. Setup Nginx reverse proxy (port 3000 → 80/443)
5. Configure SSL with Let's Encrypt

### ✅ **5. DATABASE BACKUP STRATEGY**

#### **Automated Backups**
```bash
# Daily backup (add to cron)
0 2 * * * mysqldump -u user -p password database > /backups/backup-$(date +\%Y\%m\%d).sql
```

#### **Cloud Backup Options**
- AWS RDS (managed MySQL)
- Google Cloud SQL
- DigitalOcean Managed Databases
- PlanetScale (MySQL-compatible)

### ✅ **6. MONITORING & SECURITY**

#### **A. Database Security**
- ✅ Use strong password (min 16 chars)
- ✅ Restrict DB access by IP whitelist
- ✅ Enable SSL for DB connections
- ✅ Regular security updates

#### **B. Application Security**
- ✅ Environment variables for secrets
- ✅ CORS configured for your domain
- ✅ JWT token expiration (24 hours)
- ✅ Rate limiting on auth endpoints

#### **C. Monitoring**
```bash
# Check API health
curl https://yourdomain.com/api/status

# Monitor logs
pm2 logs hostvoucher

# Memory usage
pm2 monit
```

### ✅ **7. TESTING CHECKLIST**

- [ ] Homepage loads: `https://yourdomain.com`
- [ ] Admin login works: `https://yourdomain.com/admin`
- [ ] Database queries succeed
- [ ] Images load correctly
- [ ] API endpoints respond: `/api/data`, `/api/products`
- [ ] No Firebase errors in console
- [ ] JWT tokens working

### ✅ **8. POST-DEPLOYMENT**

#### **A. Performance Optimization**
```bash
# Enable gzip compression
# Enable browser caching
# Optimize database indexes
```

#### **B. Analytics Setup**
- Google Analytics (recommended)
- Server logs monitoring
- Error tracking (optional)

#### **C. Regular Maintenance**
- Weekly database backups ✅
- Monthly security updates
- Quarterly performance review

## 🚀 **QUICK DEPLOYMENT COMMANDS**

### For Vercel:
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Vercel (automatic with git push)
git push origin main
```

### For Traditional Hosting:
```bash
# Build
npm run build

# Start with PM2
pm2 start "npm run start" --name hostvoucher

# View logs
pm2 logs hostvoucher

# Restart
pm2 restart hostvoucher
```

## ⚠️ **COMMON ISSUES & SOLUTIONS**

### Issue 1: "Database Connection Error"
**Cause:** DB credentials wrong or host not whitelisted
```bash
# Verify connection
mysql -h your-host -u user -p -D database
```

### Issue 2: "API Requests Failing"
**Cause:** CORS not configured or wrong API_BASE_URL
```bash
# Check .env variables
cat .env.local | grep NEXT_PUBLIC_API_BASE_URL
```

### Issue 3: "Images Not Loading"
**Cause:** Missing image domain in next.config.ts
```typescript
// Add to images.domains
images: {
  domains: ['yourdomain.com', 'your-cdn.com']
}
```

### Issue 4: "JWT Token Expired"
**Cause:** Token expiration or clock skew
```bash
# Clear browser storage and login again
localStorage.clear()
```

## 📞 **SUPPORT RESOURCES**

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **MySQL Docs**: https://dev.mysql.com/doc/
- **JWT Info**: https://jwt.io/

## ✅ **YOU'RE READY TO DEPLOY!**

Your application is now configured for MySQL-only hosting with:
- ✅ No Firebase dependencies
- ✅ JWT authentication
- ✅ MySQL database backend
- ✅ Vercel-ready (or any Node.js host)
- ✅ Production-grade security
