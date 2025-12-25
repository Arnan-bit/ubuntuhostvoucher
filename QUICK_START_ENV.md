# ⚡ QUICK START - ENVIRONMENT SETUP (5 MINUTES)

## 🚀 FASTEST PATH TO WORKING APP

### Step 1: Copy Template (30 seconds)
```bash
cp .env.example .env.local
```

### Step 2: Fill Required Fields (2 minutes)

Edit `.env.local` and fill these 5 sections:

#### Database (Get from hosting panel)
```env
DB_HOST=your-mysql-host.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=hostvoucher_db
DB_PORT=3306
```

#### Firebase (Get from Firebase Console)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

#### Service Account (Download from Firebase Console)
```env
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...paste entire JSON file here...}'
```

#### JWT Secret (Generate)
```bash
# Terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and paste:
JWT_SECRET=abc123xyz456...
```

#### URLs
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Step 3: Start App (30 seconds)
```bash
npm run dev
```

### Step 4: Verify (30 seconds)
- Open http://localhost:3000
- Go to admin page
- Login with hostvouchercom@gmail.com + Firebase password

---

## 🔑 WHERE TO GET EACH VALUE

| Field | Where | How Long |
|-------|-------|----------|
| **DB_HOST** | Hosting email / cPanel | 2 min |
| **DB_USER** | Hosting email / cPanel | 2 min |
| **DB_PASSWORD** | Hosting email / cPanel | 2 min |
| **DB_NAME** | Hosting email / cPanel | 2 min |
| **Firebase Values** | Firebase Console Settings | 3 min |
| **Service Account** | Firebase → Service Accounts → Generate Key | 2 min |
| **JWT_SECRET** | Generate with `node` command | 1 min |
| **URLs** | Your domain | 1 min |

---

## 📦 ALL FILES NOW IMPORT FROM ONE PLACE

```
.env.local (Master Config)
    ↓
src/config/environment.ts (Single Source of Truth)
    ↓
All Code:
├── src/lib/firebase-client.ts
├── src/lib/db-admin.ts
├── src/app/api/auth/firebase-login/route.ts
├── src/app/admin/page.tsx
└── Everything else
```

**Result:** Change `.env.local` once → All files use new value ✅

---

## ✅ SECURITY CHECKLIST

- [ ] `.env.local` exists and is git-ignored
- [ ] All database credentials filled
- [ ] JWT_SECRET is 32+ characters
- [ ] Firebase service account JSON properly formatted
- [ ] Never commit `.env.local` to git
- [ ] Only share `.env.local` via secure channel (1Pass, LastPass, etc)

---

## 🐛 IF SOMETHING DOESN'T WORK

### "Cannot connect to database"
→ Check DB credentials are correct in `.env.local`

### "Firebase authentication failed"  
→ Check NEXT_PUBLIC_FIREBASE_* values match Firebase Console exactly

### "JWT verification failed"
→ Ensure JWT_SECRET is strong (32+ chars) and same everywhere

### "Environment variable undefined"
→ Restart `npm run dev` after editing `.env.local`

---

## 📖 DETAILED GUIDE

See `ENVIRONMENT_SETUP_GUIDE.md` for complete instructions with examples.

See `ARCHITECTURE_CENTRALIZED_CONFIG.md` for technical deep-dive.

---

**Status: ✅ PRODUCTION READY**
