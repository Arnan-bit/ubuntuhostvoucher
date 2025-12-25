# 📋 HOSTVOUCHER - ENVIRONMENT SETUP GUIDE

## 🎯 QUICK START (3 LANGKAH MUDAH)

### Step 1: Copy Template File
```bash
# Copy file template ke file aktif
cp .env.example .env.local
```

### Step 2: Isi Bagian WAJIB (Database + Firebase + JWT)
Edit `.env.local` dan isi hanya bagian yang ditandai **[WAJIB]**

### Step 3: Restart aplikasi
```bash
npm run dev
```

---

## 📌 UNDERSTANDING THE ARCHITECTURE

### Sebelumnya (MASALAH):
```
❌ Banyak .env files (.env.local, .env.production, .env.development)
❌ Hardcoded config di banyak files (firebase-client.ts, db.ts, route.ts, dll)
❌ Jika ubah 1 config, harus ubah di 10 tempat
❌ Credential tersebar, sulit di-manage
❌ Rawan data bocor karena tidak centralized
```

### Sekarang (SOLUSI):
```
✅ SATU file .env.local sebagai source of truth
✅ File src/config/environment.ts import dari .env.local
✅ Semua files import dari environment.ts
✅ Ganti di satu tempat, otomatis ke semua files
✅ Type-safe & secure - validated pada startup
```

### Diagram Flow:
```
.env.local (master config)
    ↓
src/config/environment.ts (parse & validate)
    ↓
Frontend Files        Backend Routes        Database Files
├── admin/page.tsx    ├── api/auth/route.ts ├── lib/db.ts
├── settings/page.tsx └── api/data/route.ts └── lib/db-admin.ts
└── components/*
```

---

## 🔧 DETAILED FIELD EXPLANATION & SETUP

### 1️⃣ DATABASE CONFIGURATION [WAJIB]

#### DB_HOST
**Apa ini?** Alamat server MySQL
- **Development:** `localhost` atau `127.0.0.1`
- **Production:** `mysql.yourhosting.com` atau IP address
- **Contoh:** `64.225.64.110` (DigitalOcean), `mysql.domainesia.com` (DomaiNesia)

**Cara dapat:**
- Development: Default `localhost` jika MySQL local
- Hosting: Cek email hosting atau Panel cPanel → Databases

#### DB_USER
**Apa ini?** Username untuk login ke MySQL database
- **Development:** `root` (default)
- **Production:** Username yang Anda buat di hosting

**Cara dapat:**
- Development: Default `root`
- Hosting: Cek email hosting atau Panel cPanel → MySQL Users

#### DB_PASSWORD
**Apa ini?** Password MySQL user
- **CRITICAL:** Ini password database - simpan dengan SANGAT aman
- Jangan gunakan password yang mudah
- Development bisa kosong atau simple, production HARUS strong

**Contoh password yang BAIK:**
```
XmK9@2pLqR#8vNjW$5xZyT!7aBcD
```

**Cara dapat:**
- Development: Sesuai saat install MySQL
- Hosting: Cek email hosting atau Panel cPanel

#### DB_NAME
**Apa ini?** Nama database MySQL
- Biasanya: `hostvoucher_db` atau sesuai yang dibuat

**Cara dapat:**
- Development: Cek MySQL list databases: `SHOW DATABASES;`
- Hosting: Cek email hosting atau Panel cPanel

#### DB_PORT
**Apa ini?** Port MySQL server
- Default: `3306` (jangan ubah kecuali hosting punya port custom)
- Hosting memberikan port non-standard: gunakan port tersebut

**Cara dapat:**
- Hosting: Email hosting atau Panel cPanel

---

### 2️⃣ FIREBASE CONFIGURATION [WAJIB]

**Sumber semua Firebase values:** Firebase Console

#### Cara Dapat Firebase Values:

1. Buka https://console.firebase.google.com
2. Pilih project Anda
3. Click Settings icon (⚙️) di kiri atas → **Project Settings**
4. Scroll down ke section "Your apps" → pilih Web App Anda
5. Copy values berikut:

```
NEXT_PUBLIC_FIREBASE_API_KEY = apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID = projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID = appId
```

**Contoh:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hostvoucher-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hostvoucher-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hostvoucher-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdefg1234567
```

#### FIREBASE_SERVICE_ACCOUNT_JSON [CRITICAL ⚠️]

**Apa ini?** Private key untuk backend auth Firebase

**SECURITY WARNING:**
- ⚠️ JANGAN pernah expose file ini
- ⚠️ JANGAN commit ke git
- ⚠️ JANGAN share dengan siapa pun
- Jika bocor, regenerate di Firebase Console

**Cara dapat:**

1. Firebase Console → Project Settings → **Service Accounts** tab
2. Pilih **Node.js** di language selector
3. Click **Generate Private Key** button
4. Download JSON file (auto-download)
5. Open JSON file dengan text editor
6. **Copy SELURUH isi file** (dari `{` sampai `}`)
7. Paste di `.env.local` seperti ini:

```env
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"xxx"...rest of json...}'
```

**PENTING:** Jangan split ke multiple lines, harus dalam satu baris!

---

### 3️⃣ JWT SECURITY [WAJIB]

#### JWT_SECRET

**Apa ini?** Secret key untuk sign/verify JWT tokens pada backend

**Security Requirements:**
- Minimum 32 characters
- Mix of: uppercase, lowercase, numbers, symbols
- Random (bukan kata dictionary)
- Different per environment

**Cara generate:**

**Option 1: Node.js (REKOMENDASI)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy hasil (64 character hex string)

**Option 2: OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online tool:**
Jika harus online, pakai: https://randomkeygen.com/ (CodeIgniter Encryption Keys)

**Contoh hasil yang baik:**
```
a7f3c9e2b8d1f4a6c5e8b2d9f1a4c7e0b3d6f9a2c5e8b1d4f7a0c3e6b9d2f
```

**Paste di .env.local:**
```env
JWT_SECRET=a7f3c9e2b8d1f4a6c5e8b2d9f1a4c7e0b3d6f9a2c5e8b1d4f7a0c3e6b9d2f
```

#### JWT_EXPIRES_IN

**Apa ini?** Berapa lama JWT token valid

**Opsi:**
- `1h` = 1 jam
- `24h` = 24 jam (RECOMMENDED)
- `7d` = 7 hari
- `30d` = 30 hari

**Default: `24h` (sudah bagus)**

---

### 4️⃣ APPLICATION URLs [WAJIB]

#### NEXT_PUBLIC_SITE_URL
**Apa ini?** URL tempat site di-akses user

- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`

**Contoh:**
```
NEXT_PUBLIC_SITE_URL=https://hostvoucher.com
```

#### NEXT_PUBLIC_API_URL
**Apa ini?** URL API endpoint

- **Development:** `http://localhost:3000/api`
- **Production:** `https://yourdomain.com/api`

**Contoh:**
```
NEXT_PUBLIC_API_URL=https://hostvoucher.com/api
```

---

## 📝 COMPLETE SETUP CHECKLIST

### Development Setup

```bash
# 1. Copy template
cp .env.example .env.local

# 2. Edit .env.local dengan editor
nano .env.local

# 3. Isi bagian WAJIB:
# ✓ DB_HOST = localhost
# ✓ DB_USER = root
# ✓ DB_PASSWORD = (isi password MySQL Anda)
# ✓ DB_NAME = hostvoucher_db
# ✓ Firebase values (dari Firebase Console)
# ✓ JWT_SECRET (generate dengan command di atas)
# ✓ NEXT_PUBLIC_SITE_URL = http://localhost:3000
# ✓ NEXT_PUBLIC_API_URL = http://localhost:3000/api

# 4. Start aplikasi
npm run dev

# 5. Test: buka http://localhost:3000
```

### Production Setup

```bash
# 1. Di server hosting, buat .env.local
nano .env.local

# 2. Isi semua WAJIB fields dengan production values
# ✓ DB_HOST = production host
# ✓ DB_PASSWORD = strong password
# ✓ FIREBASE_SERVICE_ACCOUNT_JSON = download & paste
# ✓ JWT_SECRET = generate secret baru (berbeda dari dev)
# ✓ NODE_ENV = production
# ✓ URLs = domain production Anda

# 3. Set secure permissions
chmod 600 .env.local

# 4. Restart Next.js
pm2 restart all
```

---

## 🔍 VERIFICATION & TESTING

### Check apakah config sudah benar:

#### 1. Database Connection Test
```bash
# Buka terminal di project root
npm run dev

# Output yang benar:
✓ ▲ Next.js 15.5.4
✓ Connected to database
```

#### 2. Firebase Auth Test
```
Di admin page: login dengan hostvouchercom@gmail.com
Cek browser console (F12) - tidak ada Firebase error
```

#### 3. JWT Token Test
```bash
# Login → copy JWT dari localStorage
# Terminal:
node -e "const jwt = require('jsonwebtoken'); console.log(jwt.verify('PASTE_JWT_HERE', 'YOUR_JWT_SECRET'))"
# Harus output user data (email, etc)
```

---

## ⚠️ COMMON MISTAKES & SOLUTIONS

### Mistake 1: DB_PASSWORD tidak diisi
```
❌ Error: Access denied for user 'root'@'localhost'
✅ Solution: Isi DB_PASSWORD di .env.local
```

### Mistake 2: Firebase values salah
```
❌ Error: Firebase config is missing required key
✅ Solution: Pastikan semua 6 Firebase values terisi, copy exact dari Firebase Console
```

### Mistake 3: JWT_SECRET terlalu pendek
```
❌ Error: JWT_SECRET must be at least 32 characters
✅ Solution: Generate dengan crypto.randomBytes() command
```

### Mistake 4: FIREBASE_SERVICE_ACCOUNT_JSON invalid JSON
```
❌ Error: Invalid FIREBASE_SERVICE_ACCOUNT_JSON format
✅ Solution: Copy ENTIRE file content, dalam satu baris, dalam quotes
```

### Mistake 5: ENV variables tidak ter-load
```
❌ Error: process.env.DB_HOST undefined
✅ Solution: Restart npm run dev atau development server
```

---

## 🔐 SECURITY BEST PRACTICES

### DO's ✅
- ✅ Generate strong JWT_SECRET dengan crypto
- ✅ Use strong DB_PASSWORD (min 16 chars, symbols)
- ✅ Store .env.local in secure location
- ✅ Set file permissions: `chmod 600 .env.local`
- ✅ Never commit .env.local to git
- ✅ Use different secrets per environment (dev ≠ prod)
- ✅ Rotate JWT_SECRET periodically

### DON'Ts ❌
- ❌ Use simple passwords like "123456" atau "password"
- ❌ Share .env.local file dengan team via email/chat
- ❌ Hardcode credentials di source files
- ❌ Commit .env.local ke git
- ❌ Use same secret for dev dan production
- ❌ Expose FIREBASE_SERVICE_ACCOUNT_JSON
- ❌ Share Firebase service account file

---

## 📞 TROUBLESHOOTING

### "Cannot connect to database"
**Cause:** DB_HOST, DB_USER, atau DB_PASSWORD salah
**Fix:**
1. Verify DB credentials dengan cek di MySQL directly
2. Pastikan database running
3. Restart Next.js app

### "Firebase config is invalid"
**Cause:** Firebase values salah atau incomplete
**Fix:**
1. Double-check semua 6 NEXT_PUBLIC_FIREBASE_* values
2. Paste exact dari Firebase Console Settings
3. Restart app

### "JWT verification failed"
**Cause:** JWT_SECRET berbeda saat generate dan verify
**Fix:**
1. Ensure sama JWT_SECRET di development dan production
2. Jika ubah JWT_SECRET, semua token lama invalid
3. Restart backend

### "Environment variable undefined"
**Cause:** .env.local tidak ter-load
**Fix:**
1. Restart `npm run dev`
2. Check file exists: `.env.local` (bukan `.env`)
3. Check permissions: file readable

---

## 🎓 LEARNING RESOURCES

- [Firebase Setup Guide](https://firebase.google.com/docs/setup/web)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [JWT Authentication](https://jwt.io/)
- [MySQL Security](https://dev.mysql.com/doc/refman/8.0/en/security.html)

---

## ✨ SUMMARY

| Config | Required | Where to Get | Security Level |
|--------|----------|---------------|-----------------|
| DB_HOST | ✅ YES | Hosting Panel | Low |
| DB_USER | ✅ YES | Hosting Panel | Medium |
| DB_PASSWORD | ✅ YES | Hosting Panel | 🔴 CRITICAL |
| DB_NAME | ✅ YES | Hosting Panel | Low |
| Firebase Values | ✅ YES | Firebase Console | Medium |
| Service Account | ✅ YES | Firebase Console | 🔴 CRITICAL |
| JWT_SECRET | ✅ YES | Generate | 🔴 CRITICAL |
| URLs | ✅ YES | Your Domain | Low |

**REMINDER:** Jangan share .env.local dengan siapa pun! 🔒

---

**Last Updated:** December 2025
**Status:** ✅ PRODUCTION READY
