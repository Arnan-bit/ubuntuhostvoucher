# 🎯 HOSTVOUCHER - SETUP UNTUK PEMULA (SATU FILE SAJA!)

## ✨ SEDERHANA BANGET

**Yang Anda perlu tahu:**
- Ada **SATU file: `.env`** - edit file ini saja!
- Pilih `NODE_ENV=development` atau `NODE_ENV=production`
- Isi sesuai pilihan Anda
- **Semua files code otomatis mendapat nilai yang benar!**

---

## 🚀 SETUP (3 LANGKAH MUDAH)

### Step 1: Copy File Template
```bash
cp .env.template .env
```

### Step 2: Edit `.env` - Pilih Lingkungan Anda

Buka file `.env` dan lihat bagian paling atas:

```env
NODE_ENV=development
```

**Pilih SATU:**
- Jika testing di laptop: `NODE_ENV=development` ✅
- Jika live di server: `NODE_ENV=production`

### Step 3: Isi Nilai Sesuai Pilihan

#### Jika `NODE_ENV=development`:

Isi bagian **DEVELOPMENT SECTION** (lihat di `.env`):
```env
DEV_DB_HOST=localhost
DEV_DB_USER=root
DEV_DB_PASSWORD=password_mysql_anda
DEV_DB_NAME=hostvoucher_db
DEV_DB_PORT=3306

DEV_NEXT_PUBLIC_FIREBASE_API_KEY=...
DEV_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
... (semua DEV_*)
```

#### Jika `NODE_ENV=production`:

Isi bagian **PRODUCTION SECTION** (lihat di `.env`):
```env
PROD_DB_HOST=mysql.hosting-anda.com
PROD_DB_USER=user_production
PROD_DB_PASSWORD=password_production
... (semua PROD_*)
```

### Step 4: Restart Aplikasi

```bash
npm run dev
```

**Selesai! Aplikasi otomatis pakai nilai dari `.env` sesuai NODE_ENV Anda!** ✅

---

## 📖 PENJELASAN SEDERHANA

### Bagaimana Caranya?

```
┌─────────────────┐
│   .env file     │  ← Edit hanya file ini!
│  (satu file!)   │
└────────┬────────┘
         │
         ↓ aplikasi baca
┌─────────────────────────────────┐
│ src/config/environment.ts       │ ← File ini auto-detect NODE_ENV
│                                 │   dan ambil nilai yang tepat
│ Jika NODE_ENV=development:      │
│   Ambil DEV_DB_HOST             │
│   Ambil DEV_FIREBASE_*          │
│                                 │
│ Jika NODE_ENV=production:       │
│   Ambil PROD_DB_HOST            │
│   Ambil PROD_FIREBASE_*         │
└────────┬────────────────────────┘
         │
         ↓ semua code pakai
┌──────────────────────┐
│ Semua files code     │
├──────────────────────┤
│ ✅ admin/page.tsx    │
│ ✅ api/route.ts      │
│ ✅ lib/db.ts         │
│ ✅ semua yang lain   │
└──────────────────────┘
```

**Hasil:** Ubah `.env` sekali → semua files otomatis dapat nilai yang tepat!

---

## 📋 CHECKLIST SETUP

Tandai ketika sudah selesai:

- [ ] Copy `.env.template` ke `.env`
- [ ] Buka `.env` dengan text editor
- [ ] Pilih NODE_ENV (development atau production)
- [ ] Isi bagian DEV_* atau PROD_* sesuai pilihan
  - [ ] Database info
  - [ ] Firebase values
  - [ ] Service Account JSON
  - [ ] JWT Secret
  - [ ] URLs
- [ ] Simpan `.env`
- [ ] Run `npm run dev`
- [ ] Buka http://localhost:3000/admin
- [ ] Login dengan Firebase credentials
- [ ] Verify semuanya jalan ✅

---

## 🔑 ISI YANG DIBUTUHKAN

### Untuk Development (DEV_*):

```
DATABASE:
  DEV_DB_HOST = localhost
  DEV_DB_USER = root
  DEV_DB_PASSWORD = password_mysql
  DEV_DB_NAME = hostvoucher_db
  
FIREBASE:
  DEV_NEXT_PUBLIC_FIREBASE_API_KEY = dari Firebase Console
  DEV_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = dari Firebase Console
  DEV_NEXT_PUBLIC_FIREBASE_PROJECT_ID = dari Firebase Console
  (dan 3 lagi)
  
SERVICE ACCOUNT:
  DEV_FIREBASE_SERVICE_ACCOUNT_JSON = download dari Firebase
  
JWT:
  DEV_JWT_SECRET = generate random string 32+ chars
  DEV_JWT_EXPIRES_IN = 24h
  
URLs:
  DEV_NEXT_PUBLIC_SITE_URL = http://localhost:3000
  DEV_NEXT_PUBLIC_API_URL = http://localhost:3000/api
```

### Untuk Production (PROD_*):

Sama dengan di atas, tapi ganti `DEV_` dengan `PROD_` dan isi dengan nilai production:
- Database dari hosting provider
- Firebase dari production project
- URLs dari domain Anda

---

## ❓ PERTANYAAN UMUM

### Q: Berapa banyak file .env yang harus saya buat?
**A:** Hanya 1 file: `.env` (copy dari `.env.template`)

### Q: Apakah saya perlu edit file lain selain .env?
**A:** TIDAK! Hanya edit `.env`, yang lain otomatis!

### Q: Bagaimana kalau saya ingin ubah dari development ke production?
**A:** Ubah line pertama: `NODE_ENV=production`, restart aplikasi, selesai!

### Q: Apakah .env file aman di share?
**A:** TIDAK! Berisi password dan secret. Jangan commit ke git, jangan share.

### Q: Bagaimana kalau salah ngisi nilai?
**A:** Lihat error message, cek `.env`, perbaiki, restart aplikasi.

---

## 🔒 SECURITY REMINDER

✅ Edit `.env` saja  
✅ Jangan commit `.env` ke git  
✅ Jangan share `.env` ke orang lain  
✅ Gunakan password yang kuat  
✅ Keep JWT_SECRET aman  

---

## 💡 TIPS

1. **Jika macet:** Restart dengan `npm run dev`
2. **Jika ada error:** Cek `.env`, pastikan semua field terisi
3. **Jika tidak ada perubahan:** Restart aplikasi, browser juga refresh (Ctrl+Shift+R)
4. **Untuk copy-paste JSON:** Pastikan dalam satu baris, dalam quotes

---

## 🎓 RINGKAS

```
DULU (RUMIT):
  Edit .env.local
  Edit .env.production
  Edit api/.env
  Ubah banyak files
  Confusing!

SEKARANG (MUDAH):
  Edit .env saja
  Pilih NODE_ENV
  Semua otomatis!
  ✅ DONE!
```

---

**Siap? Buka `.env.template`, copy ke `.env`, dan mulai!** 🚀

Pertanyaan? Setiap bagian di `.env` ada comment yang jelas!
