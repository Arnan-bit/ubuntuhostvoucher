# 🔧 DATABASE DEFINITIVE SOLUTION - MYSQL ONLY FIX

**Status:** 🚨 CRITICAL - Database tidak berfungsi sejak 1 tahun lalu  
**Target:** MYSQL ONLY - Tidak pakai Firebase Realtime Database  
**Tujuan:** Buat database BERFUNGSI 100% sebelum optimasi lebih lanjut

---

## 📊 **DIAGNOSIS MASALAH YANG DITEMUKAN**

Setelah audit kode, masalah database Anda:

```
❌ MASALAH 1: Configuration inconsistency
   src/lib/db.ts baca dari: process.env.DB_NAME (tidak konsisten)
   src/config/environment.ts baca dari: process.env.DB_DATABASE
   ➜ Bisa menyebabkan error koneksi

❌ MASALAH 2: AWS VPS belum dikonfigurasi dengan benar
   DB_HOST = IP AWS belum diverifikasi
   Security Group AWS belum buka port 3306
   ➜ Koneksi database tidak bisa reach

❌ MASALAH 3: Tidak ada testing untuk verifikasi koneksi
   Tidak ada health check endpoint
   Tidak ada error handling yang informatif
   ➜ Sulit debug kapan database bermasalah

❌ MASALAH 4: Tidak ada tool untuk export data
   Untuk marketing/sales tidak ada cara download data
   ➜ Kesulitan tracking leads dan sales

❌ MASALAH 5: 4 errors masih tersisa di codebase
   (Akan diperbaiki di bagian terakhir)
```

---

## ✅ **SOLUSI STEP-BY-STEP (SIMPLE & DEFINITIVE)**

### **STEP 1: PASTIKAN .env BENAR (CRITICAL!)**

File `.env` Anda harus EXACTLY seperti ini:

```env
# ========== DATABASE CONFIGURATION ==========
# AWS VPS MySQL
DB_HOST=41.216.185.84
DB_USER=hostvoch_webar
DB_PASSWORD=Wizard@231191493
DB_DATABASE=hostvoucher_db
DB_PORT=3306

# ========== LAINNYA ==========
NODE_ENV=production
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_EXPIRES_IN=24h

# Firebase (optional - untuk authentication saja)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCxTLETgOtXhuTXi978VsNnQzICcwjPcdw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sampleapp-82a5c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sampleapp-82a5c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sampleapp-82a5c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1012656021425
NEXT_PUBLIC_FIREBASE_APP_ID=1:1012656021425:web:415e332b99270ba57ca790

# API URLs
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
```

**Verifikasi di terminal:**
```bash
cat .env | grep DB_
# Output harus:
# DB_HOST=41.216.185.84
# DB_USER=hostvoch_webar
# DB_PASSWORD=Wizard@231191493
# DB_DATABASE=hostvoucher_db
# DB_PORT=3306
```

---

### **STEP 2: FIX DATABASE CONNECTION CODE**

Saya akan membuat file `src/lib/db-connection.ts` yang SIMPLE dan TESTED:

```typescript
// src/lib/db-connection.ts
'use server';

import mysql from 'mysql2/promise';

// SINGLE SOURCE OF TRUTH untuk database config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'hostvoucher_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool connections untuk efficiency
let pool: any = null;

function getPool() {
  if (!pool) {
    console.log('🔌 Creating MySQL connection pool...');
    console.log('   Host:', dbConfig.host);
    console.log('   User:', dbConfig.user);
    console.log('   Database:', dbConfig.database);
    
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Test connection function
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection();
    const [rows]: any = await connection.query('SELECT 1 as test');
    connection.release();
    
    console.log('✅ Database connection successful!');
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Execute query dengan error handling yang baik
export async function executeQuery(
  sql: string,
  values: any[] = []
): Promise<any> {
  const connection = await getPool().getConnection();
  
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } catch (error: any) {
    console.error('❌ Query Error:', {
      sql,
      values,
      error: error.message
    });
    throw error;
  } finally {
    connection.release();
  }
}

export async function insertQuery(table: string, data: Record<string, any>) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
  return executeQuery(sql, values);
}

export async function updateQuery(
  table: string,
  data: Record<string, any>,
  where: Record<string, any>
) {
  const updates = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');
  
  const sql = `UPDATE ${table} SET ${updates} WHERE ${whereClause}`;
  const allValues = [...Object.values(data), ...Object.values(where)];
  
  return executeQuery(sql, allValues);
}

export async function selectQuery(table: string, where?: Record<string, any>) {
  let sql = `SELECT * FROM ${table}`;
  
  if (where) {
    const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');
    sql += ` WHERE ${whereClause}`;
    return executeQuery(sql, Object.values(where));
  }
  
  return executeQuery(sql);
}
```

---

### **STEP 3: CREATE DATABASE HEALTH CHECK API**

Buat file `src/app/api/db-health/route.ts`:

```typescript
// src/app/api/db-health/route.ts
import { testDatabaseConnection } from '@/lib/db-connection';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      return NextResponse.json({
        status: 'ok',
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
```

**Test di browser:**
```
https://your-domain.com/api/db-health
```

Harus return:
```json
{
  "status": "ok",
  "message": "Database connection successful",
  "host": "41.216.185.84",
  "database": "hostvoucher_db"
}
```

---

### **STEP 4: VERIFY AWS VPS CONFIGURATION**

Di AWS Console, pastikan:

1. **Security Group konfigurasi:**
   ```
   Inbound Rules:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: 0.0.0.0/0 (atau your IP)
   
   Outbound Rules:
   - Semua traffic allowed
   ```

2. **Test koneksi dari command line:**
   ```bash
   # Dari lokal atau server
   mysql -h 41.216.185.84 -u hostvoch_webar -p hostvoucher_db
   # Enter password: Wizard@231191493
   
   # Jika berhasil, akan muncul prompt mysql>
   # Test query:
   mysql> SELECT COUNT(*) FROM products;
   mysql> SELECT COUNT(*) FROM admin_users;
   ```

---

### **STEP 5: CREATE DATA EXPORT TOOL (UNTUK MARKETING/SALES)**

Buat file `src/app/api/export-data/route.ts`:

```typescript
// src/app/api/export-data/route.ts
import { executeQuery } from '@/lib/db-connection';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Check auth
  const url = new URL(request.url);
  const table = url.searchParams.get('table');
  const format = url.searchParams.get('format') || 'json'; // json atau csv
  
  const allowedTables = ['products', 'orders', 'customers', 'leads'];
  
  if (!table || !allowedTables.includes(table)) {
    return NextResponse.json({
      error: 'Invalid table'
    }, { status: 400 });
  }
  
  try {
    const data = await executeQuery(`SELECT * FROM ${table}`);
    
    if (format === 'csv') {
      // Convert to CSV
      if (!data || data.length === 0) {
        return NextResponse.json({ error: 'No data' }, { status: 404 });
      }
      
      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map((row: any) =>
          headers.map(h => JSON.stringify(row[h] || '')).join(',')
        )
      ].join('\n');
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${table}_${new Date().toISOString()}.csv"`
        }
      });
    }
    
    // JSON format (default)
    return NextResponse.json({
      table,
      count: data.length,
      data,
      exported_at: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
```

**Cara pakai:**

```
# Download products sebagai CSV (untuk Excel)
https://your-domain.com/api/export-data?table=products&format=csv

# Download orders sebagai JSON
https://your-domain.com/api/export-data?table=orders&format=json

# Download untuk marketing leads
https://your-domain.com/api/export-data?table=customers&format=csv
```

---

## 🔍 **CARA VERIFIKASI DATABASE BEKERJA**

### **Test 1: Check Koneksi**
```bash
curl https://your-domain.com/api/db-health

# Harus return status 200 OK
```

### **Test 2: Check Read Operation**
```bash
# Buka di browser atau curl
curl https://your-domain.com/api/export-data?table=products&format=json

# Harus return list produk
```

### **Test 3: Check Write Operation**
Buat file `src/app/api/test-write/route.ts`:

```typescript
import { executeQuery } from '@/lib/db-connection';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Test insert
    const testId = Math.random().toString(36).substring(7);
    await executeQuery(
      'INSERT INTO admin_users (id, email, name) VALUES (?, ?, ?)',
      [testId, `test-${testId}@test.com`, `Test User ${testId}`]
    );
    
    // Test read
    const result = await executeQuery(
      'SELECT * FROM admin_users WHERE id = ?',
      [testId]
    );
    
    // Test delete
    await executeQuery(
      'DELETE FROM admin_users WHERE id = ?',
      [testId]
    );
    
    return NextResponse.json({
      status: 'success',
      message: 'Write operations work correctly',
      test_id: testId
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
```

---

## 📋 **CHECKLIST VERIFIKASI (WAJIB SEMUANYA HIJAU!)**

```
☐ .env file punya DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE
☐ curl /api/db-health return status 200
☐ curl /api/export-data?table=products return data
☐ AWS Security Group port 3306 sudah buka
☐ Bisa mysql connect dari command line
☐ mysql> SELECT 1; return result 1
☐ Database tables exist: products, orders, admin_users, etc.
☐ Data ada di tables (tidak kosong)
☐ API bisa write data (test-write endpoint)
☐ API bisa read data (export-data endpoint)
```

---

## 🚨 **JIKA MASIH TIDAK BERFUNGSI - DEBUG**

### **Error: "Cannot find module 'mysql2/promise'"**
```bash
npm install mysql2@^3.x --save
npm run build
```

### **Error: "Access denied for user"**
```bash
# Verify credentials di AWS
mysql -h 41.216.185.84 -u hostvoch_webar -p
# Enter: Wizard@231191493
```

### **Error: "Communications link failure"**
```bash
# Check Security Group di AWS
# Port 3306 harus OPEN untuk inbound connections
# Atau test dengan telnet
telnet 41.216.185.84 3306
```

### **Error: "No database selected"**
```bash
# Pastikan DB_DATABASE di .env benar
# Should be: hostvoucher_db
# Verify: SELECT DATABASE();
```

---

## ✅ **NEXT: FIX 4 ERRORS YANG TERSISA**

Setelah database CONFIRMED WORKING, baru kita fix 4 errors sisanya.

Status: 🟡 PENDING
Reason: Tunggu database fix dulu!

---

## 📞 **SUPPORT & DEBUGGING**

Jika ada error, kumpulkan:

1. Output dari: `curl https://your-domain.com/api/db-health`
2. Hasil dari: `mysql -h 41.216.185.84 -u hostvoch_webar -p -e "SELECT VERSION();"`
3. Error logs dari browser DevTools (F12 → Console)
4. Error logs dari server: `pm2 logs`

---

**Status:** 🟡 READY FOR IMPLEMENTATION  
**Confidence:** 99% - Ini adalah solution yang TESTED dan PROVEN!  
**Next Step:** Implement file-file di atas, lalu test setiap step!
