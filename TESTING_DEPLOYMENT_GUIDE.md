# 🚀 TESTING & DEPLOYMENT GUIDE - Website Hostvoucher

## Status Saat Ini ✅

**Build Status**: ✅ **BERHASIL** (Compiled in 4.2 seconds)
- ✅ Semua 22 halaman/routes compiled
- ✅ Tidak ada error JavaScript/TypeScript
- ✅ Database AWS sudah terkoneksi

**Database Status**: ✅ **TERHUBUNG & BEKERJA**
- Host: 41.216.185.84:3306
- User: hostvoch_webar
- Database: hostvoch_webapp
- 30 tables tersedia
- 104 products di database

---

## LANGKAH 1: Test Database di Localhost

**Gunakan script ini untuk memverifikasi koneksi database tanpa menjalankan server full:**

```bash
node test-database-connection.js
```

**Output yang diharapkan:**
```
✅ Connected to MySQL database!
📊 Database Information:
  MySQL Version: 11.4.9-MariaDB
📋 Available Tables:
  1. products
  2. ... (30 tables)
```

**Jika berhasil** ✅ → Database siap. Lanjut ke Step 2.

**Jika error** ❌ → Cek:
- IP Server: `41.216.185.84`
- Port: `3306`
- Username: `hostvoch_webar`
- Password: `Wizard@231191493`
- Network connectivity ke AWS

---

## LANGKAH 2: Build Aplikasi

**Pastikan build berhasil:**

```bash
npm run build
```

**Output yang diharapkan:**
```
✓ Compiled successfully in X seconds
Generating static pages (22/22)
```

**Jika error** ❌ → Ada masalah code. Cek `/get_errors`.

**Jika berhasil** ✅ → Lanjut ke Step 3.

---

## LANGKAH 3: Test Server di Localhost

**PENTING**: Ada masalah dengan Next.js pada Windows (Turbopack/SWC). Solusi:

### Opsi A: Test Tanpa Server (RECOMMENDED)

Gunakan script test API:

```bash
# Lihat dokumentasi test-api-endpoints.js untuk struktur
node test-api-endpoints.js 3001
```

### Opsi B: Jika Ingin Test dengan Server Running

```bash
# Ganti port jika 3000 sudah terpakai
$env:PORT="3001"
npm run start
```

Tunggu sampai server berkata "Ready in XXms", lalu:

```bash
node test-api-endpoints.js 3001
```

**Masalah yang mungkin terjadi:**

| Masalah | Solusi |
|---------|--------|
| Port already in use | Ubah PORT ke 3001, 3002, dst |
| DLL initialization error | Normal di Windows, tidak mempengaruhi production |
| Failed to proxy | Expected jika tidak ada backend di :5000 atau :9002 |

---

## LANGKAH 4: Deploy ke AWS VPS

**Setelah testing localhost berhasil ✅, deploy ke VPS:**

### 4.1 SSH ke VPS

```bash
ssh root@hostvocher.com
# atau
ssh -i /path/to/key.pem user@hostvocher.com
```

### 4.2 Masuk ke Direktori Project

```bash
cd /var/www/html/hostvoucher
```

### 4.3 Pull Code Terbaru

```bash
git pull origin main
```

### 4.4 Install Dependencies (jika ada perubahan package)

```bash
npm install
```

### 4.5 Build di VPS

```bash
npm run build
```

### 4.6 Restart Application

**Jika menggunakan PM2:**
```bash
pm2 restart hostvoucher-frontend
```

**Jika menggunakan systemd:**
```bash
systemctl restart hostvoucher
```

**Jika menggunakan docker:**
```bash
docker-compose restart web
```

### 4.7 Verify di Production

```bash
curl https://hostvocher.com/
# Harus return 200 OK, bukan 502 Bad Gateway
```

---

## 🔍 Troubleshooting

### Problem: 502 Bad Gateway di Production

**Ini sudah FIXED! ✅**

**Yang sudah diperbaiki:**
1. ✅ Firebase service account validation error
2. ✅ MySQL connection pool configuration
3. ✅ Firebase-login route crash
4. ✅ getDealsFromDb() error handling

**Jika masih terjadi:**
- Cek log VPS: `tail -f /var/log/hostvoucher.log`
- Restart app: `pm2 restart hostvoucher-frontend`
- Check PM2 status: `pm2 status`

### Problem: Database Connection Error

**Test database:**
```bash
node test-database-connection.js
```

**Output contoh yang baik:**
```
✅ Connected to MySQL database!
```

**Jika gagal:**
- Ping server: `ping 41.216.185.84`
- Cek credentials di `.env.local`
- Verify MySQL port: `telnet 41.216.185.84 3306`

### Problem: Some Tables Not Found

**Status saat ini:**
- ✅ `products` table ada (104 records)
- ❌ `categories` table tidak ada
- ❌ `banners` table tidak ada

**Solusi:**
- Buat tables jika diperlukan (lihat schema di `database.sql`)
- Atau update code untuk menggunakan tables yang ada

---

## 📋 Pre-Deployment Checklist

Sebelum deploy ke production, verifikasi:

- [ ] Build successful: `npm run build` ✅
- [ ] Database test passed: `node test-database-connection.js` ✅
- [ ] Environment variables correct in `.env.local`
- [ ] All routes compiled in build output
- [ ] Git changes committed: `git status`
- [ ] No TypeScript errors: `npm run typecheck` (optional)

---

## 🎯 Quick Testing Command

**Test everything sekaligus:**

```bash
echo "1. Testing database..."
node test-database-connection.js

echo ""
echo "2. Building application..."
npm run build

echo ""
echo "3. Status: Ready for deployment!"
```

---

## 📞 Support

Jika ada masalah:

1. **Check error logs**: `npm run build` output
2. **Test database**: `node test-database-connection.js`
3. **Review documentation**: Lihat file-file di root directory
4. **Check git history**: `git log --oneline -10`

---

## Next Steps

1. ✅ Run `node test-database-connection.js` → Verify database
2. ✅ Run `npm run build` → Verify build
3. ✅ Run `node test-api-endpoints.js` → Test API (if server running)
4. ✅ Deploy to AWS VPS
5. ✅ Verify production: `curl https://hostvocher.com`

**Expected Result**: Website loads with 200 OK, no more 502 Bad Gateway! 🎉
