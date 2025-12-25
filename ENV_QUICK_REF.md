# ⚡ QUICK REFERENCE - SATU FILE .env

## 📌 YANG PERLU TAHU

| Yang | Jawaban |
|-----|---------|
| **Berapa file .env?** | **1 file: `.env`** (copy dari `.env.template`) |
| **Dimana edit?** | **Hanya di `.env`**, tidak ada file lain |
| **Setiap kali update?** | Ubah `.env` → Restart `npm run dev` → Done |
| **Untuk dev vs prod?** | Ubah line pertama `NODE_ENV=development` atau `NODE_ENV=production` |
| **Semua files otomatis dapat value?** | **YES!** `src/config/environment.ts` handle semua |

---

## 🚀 SETUP (4 LANGKAH)

```bash
# 1. Copy template
cp .env.template .env

# 2. Edit .env - pilih:
#    NODE_ENV=development  (untuk dev)
#    NODE_ENV=production   (untuk prod)
# Lalu isi bagian DEV_* atau PROD_* sesuai pilihan

# 3. Simpan file

# 4. Restart aplikasi
npm run dev
```

---

## 🎯 ISI MINIMAL YANG DIBUTUHKAN

### Untuk Development:
```env
NODE_ENV=development

# Isi semua yang mulai dengan DEV_
DEV_DB_HOST=localhost
DEV_DB_USER=root
DEV_DB_PASSWORD=...
DEV_NEXT_PUBLIC_FIREBASE_API_KEY=...
DEV_JWT_SECRET=... (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

### Untuk Production:
```env
NODE_ENV=production

# Isi semua yang mulai dengan PROD_
PROD_DB_HOST=mysql.hosting.com
PROD_DB_USER=user
PROD_DB_PASSWORD=...
PROD_NEXT_PUBLIC_FIREBASE_API_KEY=...
PROD_JWT_SECRET=... (generate baru, berbeda dari dev)
```

---

## 🔄 BAGAIMANA OTOMATIS?

```
.env file
   ↓
environment.ts (baca NODE_ENV)
   ↓
Jika dev: ambil DEV_* | Jika prod: ambil PROD_*
   ↓
Semua code import dari environment.ts
   ↓
✅ Otomatis dapat nilai yang tepat!
```

---

## 📋 CHECKLIST

- [ ] Copy: `cp .env.template .env`
- [ ] Edit `.env` file
- [ ] Pilih NODE_ENV (development atau production)
- [ ] Isi bagian DEV_* atau PROD_*
- [ ] Run: `npm run dev`
- [ ] Test: http://localhost:3000/admin
- [ ] ✅ Done!

---

## ❌ JANGAN LAKUKAN

```javascript
// ❌ WRONG - process.env langsung
const host = process.env.DEV_DB_HOST;

// ✅ RIGHT - import dari environment.ts
import { env } from '@/config/environment';
const host = env.database.host;
```

---

## 🔐 SECURITY

- ✅ `.env` aman (credentials ada di sini)
- ❌ Jangan commit `.env` ke git
- ❌ Jangan share `.env` ke orang lain
- ✅ Use strong passwords di PROD_*

---

## 📞 JIKA ADA MASALAH

| Error | Solution |
|-------|----------|
| "Cannot find module" | Restart: `npm run dev` |
| "DB connection failed" | Check DEV_DB_* atau PROD_DB_* values di `.env` |
| "Firebase error" | Check FIREBASE_API_KEY dan SERVICE_ACCOUNT di `.env` |
| "Nilai tidak berubah" | Restart aplikasi, juga refresh browser (Ctrl+Shift+R) |

---

## 📖 DETAIL DOCUMENTATION

- [SETUP_UNTUK_PEMULA.md](SETUP_UNTUK_PEMULA.md) - Beginner guide
- [STRUKTUR_ENV_BARU.md](STRUKTUR_ENV_BARU.md) - How it works
- [.env.template](.env.template) - Actual file with comments

---

**TL;DR: Copy `.env.template` to `.env`, edit it, choose NODE_ENV, done!** ✅
