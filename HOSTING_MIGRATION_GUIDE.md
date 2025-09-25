# 🚀 HostVoucher - Complete Hosting Migration Guide

## 📋 **FILES TO UPLOAD TO HOSTING**

### **1. Core Application Files**
```
📁 Root Directory Files:
├── package.json                    # Dependencies configuration
├── package-lock.json              # Lock file for exact versions
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── components.json                # UI components configuration
├── .env.local                     # Environment variables (IMPORTANT!)
└── README.md                      # Documentation

📁 src/ Directory (Complete):
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Global styles
│   ├── admin/                     # Admin panel
│   ├── request/                   # Request submission page
│   ├── api/                       # API routes
│   └── [all other pages]          # All page directories
├── components/                    # React components
├── lib/                          # Utility libraries
└── hooks/                        # Custom React hooks

📁 public/ Directory:
├── uploads/                      # User uploaded files
├── images/                       # Static images
├── icons/                        # Icon files
└── [all static assets]           # All public assets

📁 api/ Directory (Backend Scripts):
├── node_modules/                 # API dependencies
├── package.json                  # API package config
├── *.cjs files                   # Database setup scripts
└── utils/                        # API utilities
```

### **2. Environment Variables (.env.local)**
```env
# Database Configuration
DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=hostvoucher_db
DB_PORT=3306

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production

# Optional: External API Keys
OPENAI_API_KEY=your-openai-key (if using AI features)
```

### **3. Database Setup Commands**
```bash
# Run these commands on your hosting MySQL database:

# 1. Create all required tables
node api/create-all-missing-tables.cjs

# 2. Setup gamification system
node api/fix-gamification-table.cjs

# 3. Create purchase requests table
node api/create-purchase-requests-table.cjs

# 4. Create point adjustments table
node api/create-point-adjustments-table.cjs

# 5. Add sample data (optional)
node api/add-sample-data.cjs
```

## 🔧 **HOSTING SETUP STEPS**

### **Step 1: Upload Files**
1. **Upload all files** from your local directory to hosting root
2. **Preserve directory structure** exactly as shown above
3. **Set correct permissions**:
   - Files: 644
   - Directories: 755
   - uploads/ directory: 777 (for file uploads)

### **Step 2: Install Dependencies**
```bash
# In hosting terminal/SSH:
npm install
cd api && npm install
```

### **Step 3: Configure Environment**
1. Create `.env.local` file in root directory
2. Add all environment variables listed above
3. Update database credentials for your hosting MySQL
4. Update NEXT_PUBLIC_BASE_URL to your domain

### **Step 4: Setup Database**
1. Create MySQL database on your hosting
2. Run database setup scripts:
```bash
node api/create-all-missing-tables.cjs
node api/fix-gamification-table.cjs
node api/add-sample-data.cjs
```

### **Step 5: Build & Deploy**
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🌐 **HOSTING PROVIDER SPECIFIC INSTRUCTIONS**

### **For cPanel Hosting:**
1. Upload files via File Manager or FTP
2. Use Terminal in cPanel to run npm commands
3. Set Node.js version to 18+ in cPanel
4. Configure MySQL database in cPanel

### **For VPS/Cloud Hosting:**
1. Use SSH to access server
2. Clone/upload files to `/var/www/html/` or similar
3. Install Node.js 18+ and npm
4. Setup MySQL database
5. Configure reverse proxy (Nginx/Apache)

### **For Vercel/Netlify:**
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
   - Node.js version: 18+

## 🔐 **SECURITY CHECKLIST**

- [ ] Update all default passwords
- [ ] Secure database credentials
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set proper file permissions
- [ ] Update admin email addresses in code
- [ ] Test all API endpoints
- [ ] Verify file upload functionality

## 🧪 **POST-DEPLOYMENT TESTING**

### **Test These Features:**
1. **Homepage**: Loads without errors
2. **Admin Panel**: Login and all sections work
3. **Request Page**: Form submission works
4. **File Uploads**: Images upload successfully
5. **Database**: All CRUD operations work
6. **Gamification**: Points system functions
7. **ETH Addresses**: Can be managed in admin
8. **Testimonials**: Display and management work

### **Test URLs:**
- `https://your-domain.com/` - Homepage
- `https://your-domain.com/admin` - Admin panel
- `https://your-domain.com/request` - Request page
- `https://your-domain.com/api/data` - API test

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: "Module not found" errors**
**Solution**: Run `npm install` in both root and api directories

### **Issue 2: Database connection failed**
**Solution**: Check .env.local database credentials

### **Issue 3: File upload errors**
**Solution**: Set uploads directory permissions to 777

### **Issue 4: Admin panel not loading**
**Solution**: Check Firebase configuration in .env.local

### **Issue 5: API routes not working**
**Solution**: Ensure Next.js is running in production mode

## 📞 **SUPPORT**

If you encounter issues during migration:
1. Check server logs for specific errors
2. Verify all environment variables are set
3. Test database connection separately
4. Ensure Node.js version is 18+
5. Contact hosting support if needed

## ✅ **MIGRATION CHECKLIST**

- [ ] All files uploaded to hosting
- [ ] Dependencies installed (npm install)
- [ ] Environment variables configured
- [ ] Database created and tables setup
- [ ] Sample data added (optional)
- [ ] Application built (npm run build)
- [ ] Production server started
- [ ] All features tested and working
- [ ] SSL certificate configured
- [ ] Domain DNS pointed to hosting

**🎉 Your HostVoucher website is now live and fully functional!**
