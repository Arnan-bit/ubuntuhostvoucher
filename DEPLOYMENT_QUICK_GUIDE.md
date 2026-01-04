# 🚀 DEPLOYMENT GUIDE - GET WEBSITE ONLINE NOW

## ✅ WHAT'S BEEN FIXED

**4 Critical Issues Causing 502 Bad Gateway:**

1. ✅ Firebase service account validation removed
2. ✅ MySQL connection pool configuration fixed  
3. ✅ Firebase admin endpoint disabled gracefully
4. ✅ Error handling in database queries fixed

**All changes committed to GitHub** ✅

---

## 🎯 DEPLOYMENT INSTRUCTIONS (5 minutes)

### Step 1: SSH to Your Server
```bash
ssh your-username@hostvocher.com
# or
ssh your-username@your-server-ip
```

### Step 2: Navigate to Project
```bash
cd /path/to/your/website
# Usually something like:
# cd /var/www/hostvocher
# cd /home/user/hostvocher
```

### Step 3: Pull Latest Code
```bash
git pull origin main
```

**Expected Output:**
```
remote: Enumerating objects...
...
Updating dda0f5e..f1e7514
Fast-forward
 src/config/environment.ts | 25 +++
 src/lib/db.ts | 10 +++
 src/app/api/auth/firebase-login/route.ts | 45 +-----
 FIX_502_BAD_GATEWAY_COMPLETE.md | 258 ++++
 4 files changed...
```

### Step 4: Install Dependencies (if needed)
```bash
npm install
```

### Step 5: Rebuild Application
```bash
npm run build
```

**Expected Output:** Build completes successfully with no errors
```
✓ Compiled successfully
✓ Production build ready
```

### Step 6: Restart Application

**If using PM2:**
```bash
pm2 restart app
pm2 restart api
pm2 save
```

**If using systemd:**
```bash
systemctl restart website
systemctl restart api
# or check what services you have:
systemctl list-units --type=service | grep website
```

**If using manual Node.js:**
```bash
# Kill old process
pkill -f "node"
# Start new one
nohup npm run start > logs/app.log 2>&1 &
```

### Step 7: Verify It Works
```bash
# Check if server is running
curl http://localhost:3000
# Should return HTML (not error)

# Check with your domain
curl https://hostvoucher.com
# Should return 200 OK (not 502 Bad Gateway)

# Check API
curl https://hostvoucher.com/api/core/data?type=deals
# Should return JSON data
```

### Step 8: Check Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
tail -100 /var/log/nginx/error.log
tail -100 /var/log/nginx/access.log

# Application logs
tail -100 /var/log/website/app.log
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Git pull successful
- [ ] npm install completed
- [ ] npm run build completed without errors
- [ ] Application restarted without errors
- [ ] https://hostvoucher.com loads (no 502 error)
- [ ] API endpoint responds with data
- [ ] Logs show no error messages
- [ ] Database test passes: `node test-mysql-aws.js`

---

## 🔍 IF STILL GETTING 502 ERROR

### 1. Check What Process is Running
```bash
ps aux | grep node
ps aux | grep npm
```

### 2. Check Nginx Configuration
```bash
nginx -t
# Should say "test is successful"

sudo systemctl restart nginx
```

### 3. Check Logs Directly
```bash
# Show last 50 lines of error log
tail -50 /var/log/nginx/error.log

# Show real-time logs
tail -f /var/log/nginx/error.log
```

### 4. Test Database Connection on Server
```bash
node test-mysql-aws.js
```

**Expected:** All tests pass
```
✅ Connection successful!
✅ Found 30 tables
✅ INSERT successful
✅ SELECT successful
✅ UPDATE successful
✅ DELETE successful
```

### 5. Test Build Locally on Server
```bash
npm run build
npm run start
# Should start on port 3000 without errors
# Ctrl+C to stop
```

---

## 🆘 EMERGENCY ROLLBACK (if needed)

If something goes very wrong:

```bash
# Go back to previous commit
git reset --hard HEAD~1
git pull origin main

# Rebuild and restart
npm run build
pm2 restart app

# OR manually check what was changed
git log --oneline
# You'll see: "fix: Fix 4 critical 502 Bad Gateway issues..."
# Previous should be: "feat: Complete MySQL consolidation..."

git checkout HEAD~1
npm run build
pm2 restart app
```

---

## 📊 CURRENT DEPLOYMENT STATUS

| Component | Status |
|-----------|--------|
| Code | ✅ Committed to GitHub |
| Tests | ✅ Build passes locally |
| Database | ✅ Verified working |
| Configuration | ✅ Firebase disabled, MySQL enabled |
| Documentation | ✅ Complete |

---

## 📞 SUPPORT

**If deployment fails:**

1. Share nginx error log:
```bash
cat /var/log/nginx/error.log
```

2. Share application logs:
```bash
pm2 logs
```

3. Share git status:
```bash
git status
git log --oneline -3
```

4. Test database:
```bash
node test-mysql-aws.js
```

---

## ⏱️ ESTIMATED TIME

- SSH + git pull: 1 minute
- npm install (if needed): 2 minutes
- npm build: 3-5 minutes
- Restart: 30 seconds
- **Total: 7-10 minutes**

---

**Status:** ✅ Ready for deployment
**Last Update:** January 4, 2026
**Changes:** 4 critical fixes committed to GitHub
