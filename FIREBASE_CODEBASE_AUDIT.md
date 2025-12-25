# Firebase Codebase Audit Report
**Date:** December 20, 2025
**Status:** Comprehensive Firebase Usage Analysis

---

## Executive Summary

The codebase has **3 main files** actively using Firebase. Most of the application has already been migrated to MySQL backend APIs. Firebase is primarily used for:
1. **Authentication** - Admin panel login
2. **Firestore** - Click event tracking (secondary, now using MySQL in production)
3. **Storage** - Initialized but not actively used

---

## 1. Files Using Firebase

### A. Core Firebase Configuration
**File:** [src/lib/firebase-client.ts](src/lib/firebase-client.ts)
- **Lines:** 1-35
- **Purpose:** Firebase initialization and export
- **Services Initialized:**
  - Firebase App (core)
  - Firebase Auth (`auth`)
  - Firebase Storage (`storage`)
  - Firebase Firestore (`db`)
- **Operations:** Singleton pattern initialization

**Status:** ✅ **MUST REMOVE** - Only needed by the files below

---

### B. Admin Panel Authentication
**File:** [src/app/admin/page.tsx](src/app/admin/page.tsx)
- **Lines Using Firebase:**
  - Line 12: `import type { User } from 'firebase/auth';`
  - Line 13: `import { app, auth } from '@/lib/firebase-client';`
  - Line 17: `import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';`
  - Lines 962-1002: Auth lifecycle and login/logout handlers

**Operations Performed:**
- `onAuthStateChanged()` - Line 962: Monitor auth state changes
- `signInWithEmailAndPassword()` - Line 996: User login
- `signOut()` - Lines 973, 1002: User logout

**Authorized Users:** 
- hostvouchercom@gmail.com
- garudandne87@gmail.com

**Status:** ⚠️ **NEEDS MIGRATION** to MySQL-based authentication

---

### C. Admin Settings/Panel
**File:** [src/app/admin/settings/page.tsx](src/app/admin/settings/page.tsx)
- **Lines Using Firebase:**
  - Line 13: `import type { User } from 'firebase/auth';`
  - Line 14: `import { app, auth } from '@/lib/firebase-client';`
  - Line 35: `import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';`
  - Lines 745-765: Auth lifecycle and login/logout handlers

**Operations Performed:**
- `onAuthStateChanged()` - Line 745: Monitor auth state
- `signInWithEmailAndPassword()` - Line 759: Admin login
- `signOut()` - Lines 749, 765: Admin logout

**Status:** ⚠️ **NEEDS MIGRATION** to MySQL-based authentication

---

### D. Click Event Tracking (Firestore)
**File:** [src/components/hostvoucher/UIComponents.tsx](src/components/hostvoucher/UIComponents.tsx)
- **Lines Using Firebase:**
  - Line 25: `import { addDoc, collection, serverTimestamp } from 'firebase/firestore';`
  - Line 26: `import { db } from '@/lib/firebase-client';`
  - Lines 180-195: Click event logging

**Firestore Operations:**
- `collection()` - Line 185: Reference to `artifacts/{appId}/public/data/click_events`
- `addDoc()` - Line 185: Write click event document
- `serverTimestamp()` - Line 189: Server-side timestamp

**Data Logged:**
```
- productId
- productName
- productType
- timestamp (serverTimestamp)
- referrer
- userAgent
- ipAddress
- country
- city
```

**Firestore Path:** `artifacts/HostVoucher-ai-tracking-stable/public/data/click_events`

**Status:** ⚠️ **PARTIALLY MIGRATED** - Already has MySQL fallback in API routes (see line 350 of [src/app/api/core/[...slug]/route.ts](src/app/api/core/[...slug]/route.ts))

---

## 2. Firebase Services Used

| Service | Used | Where | Purpose |
|---------|------|-------|---------|
| **Firebase Auth** | ✅ Yes | Admin pages | Email/password authentication |
| **Firestore** | ⚠️ Partial | UIComponents | Click event analytics |
| **Firebase Storage** | ❌ No | Initialized but unused | Not currently used |
| **Firebase Realtime DB** | ❌ No | N/A | Not used |

---

## 3. Detailed Firebase Operations

### 3.1 Authentication Operations

#### In [src/app/admin/page.tsx](src/app/admin/page.tsx)

**onAuthStateChanged (Line 962)**
```typescript
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (!mounted) return;
    try {
        if (currentUser && AUTHORIZED_EMAILS.includes(currentUser.email!)) {
            setUser(currentUser);
            setIsAuthorized(true);
        } else {
            setUser(null);
            setIsAuthorized(false);
            if (currentUser) {
                signOut(auth).catch(console.error);
            }
        }
    } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        setIsAuthorized(false);
    }
});
```

**signInWithEmailAndPassword (Line 996)**
```typescript
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!AUTHORIZED_EMAILS.includes(email)) {
        setAuthError("This email is not authorized for admin access.");
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        setAuthError("Login failed. Please check your email and password.");
    }
};
```

**signOut (Line 1002)**
```typescript
const handleLogout = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        setUser(null);
        setIsAuthorized(false);
        setEmail('');
        setPassword('');
    } catch (error) {
        setAuthError("Failed to log out.");
    }
};
```

#### In [src/app/admin/settings/page.tsx](src/app/admin/settings/page.tsx)

Similar operations at:
- Line 745: `onAuthStateChanged(auth, ...)`
- Line 759: `signInWithEmailAndPassword(auth, ...)`
- Line 765: `signOut(auth)`

---

### 3.2 Firestore Operations

#### Click Event Analytics [src/components/hostvoucher/UIComponents.tsx](src/components/hostvoucher/UIComponents.tsx#L185)

**addDoc with serverTimestamp (Lines 185-195)**
```typescript
await addDoc(collection(db, `artifacts/${appId}/public/data/click_events`), {
    productId: product.id,
    productName: product.name || product.title,
    productType: product.type || 'N/A',
    timestamp: serverTimestamp(),
    referrer: document.referrer || 'Direct',
    userAgent: navigator.userAgent,
    ipAddress: geoData.ip || '0.0.0.0',
    country: geoData.country_name || 'Unknown',
    city: geoData.city || 'Unknown',
});
```

**Firestore Collection Path:** 
- Root: `artifacts/`
- AppId: `HostVoucher-ai-tracking-stable`
- SubPath: `/public/data/click_events`
- Full Path: `artifacts/HostVoucher-ai-tracking-stable/public/data/click_events`

---

## 4. Files Needing Migration to SQL

### Priority 1 - CRITICAL (Authentication)

| File | Operation | Current Approach | Target |
|------|-----------|------------------|--------|
| [src/app/admin/page.tsx](src/app/admin/page.tsx) | `onAuthStateChanged`, `signInWithEmailAndPassword`, `signOut` | Firebase Auth | SQL-based User/Auth table |
| [src/app/admin/settings/page.tsx](src/app/admin/settings/page.tsx) | `onAuthStateChanged`, `signInWithEmailAndPassword`, `signOut` | Firebase Auth | SQL-based User/Auth table |

**Migration Steps:**
1. Create `admin_users` table in MySQL
2. Implement JWT-based session management
3. Create API endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/verify`
4. Replace Firebase Auth calls with API calls
5. Update auth state management to use JWT tokens

---

### Priority 2 - HIGH (Analytics)

| File | Operation | Current Approach | Target |
|------|-----------|------------------|--------|
| [src/components/hostvoucher/UIComponents.tsx](src/components/hostvoucher/UIComponents.tsx) | `addDoc`, `collection`, `serverTimestamp` | Firestore | MySQL `click_events` table |

**Status:** ⚠️ **Already Partially Migrated**
- API route [src/app/api/core/[...slug]/route.ts](src/app/api/core/[...slug]/route.ts#L350) already has MySQL INSERT for `click_events`
- Only need to: Remove Firestore call OR make it a fallback

**Migration Steps:**
1. Replace `addDoc()` call with API POST to `/api/click-events`
2. Let MySQL table handle the storage
3. Keep Firestore call as optional fallback

---

### Priority 3 - OPTIONAL (Storage)

**Status:** ✅ **NOT IN USE** - Storage is initialized but never called
- Can be completely removed from `firebase-client.ts`
- File uploads use Next.js API route `/api/upload` instead

---

## 5. Firestore Security Rules

**File:** [firestore.rules](firestore.rules)
- **Lines:** 13-22
- **Current Rules:**
```
match /artifacts/{appId}/{dataType}/{subCollection}/{document=**} {
    // Allow read access to click_events
    // Allow write from specific app instances
}
```

**Status:** ⚠️ **CAN BE REMOVED** - Once migration to MySQL complete

---

## 6. Environment Variables

**File:** [.env.local](.env.local) (Lines 29-36)

**Current Status:** ✅ **DISABLED**
```
# --- 5. FIREBASE (DISABLED - Using MySQL only) ---
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Action:** ✅ **KEEP COMMENTED** - Can remove entirely once code is migrated

---

## 7. Current Fallback/Existing MySQL Support

The application already has MySQL support in place:

### Click Events Table
**File:** [database.sql](database.sql) (Lines 45-55)
```sql
CREATE TABLE IF NOT EXISTS click_events (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255),
    product_type VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_click_events_product_id (product_id),
    INDEX idx_click_events_timestamp (`timestamp`)
);
```

### API Route Support
**File:** [src/app/api/core/[...slug]/route.ts](src/app/api/core/[...slug]/route.ts)
- Line 350: Already has INSERT query for `click_events`
- Handles click event logging via MySQL

**Status:** ✅ **READY** - Can switch to API-only approach

---

## 8. Migration Summary

### What to Remove
1. **firebase-client.ts** - Remove entire file or keep as stub
2. **Firebase imports** from admin pages
3. **addDoc/Firestore calls** from UIComponents
4. **Firebase environment variables** (already commented out)

### What to Create
1. **SQL Schema for admin_users** - Authentication table
2. **JWT authentication middleware** - Session management
3. **API endpoints:**
   - `/api/auth/login` - POST email/password
   - `/api/auth/logout` - POST to invalidate session
   - `/api/auth/verify` - GET to verify JWT token
   - `/api/click-events` - POST to log clicks (replace Firestore)

### What to Update
1. [src/app/admin/page.tsx](src/app/admin/page.tsx) - Replace Firebase Auth
2. [src/app/admin/settings/page.tsx](src/app/admin/settings/page.tsx) - Replace Firebase Auth
3. [src/components/hostvoucher/UIComponents.tsx](src/components/hostvoucher/UIComponents.tsx) - Replace Firestore addDoc

---

## 9. Dependency Check

**Firebase Packages Currently Used:**
- `firebase` - Core library
- `firebase/app` - App initialization
- `firebase/auth` - Authentication
- `firebase/firestore` - Firestore
- `firebase/storage` - Storage

**Status:** Can be removed from `package.json` once migration complete

---

## Recommendations

### Immediate (Phase 1)
- [x] Identify all Firebase usage ✅ DONE
- [ ] Create admin_users MySQL table
- [ ] Implement JWT authentication
- [ ] Create auth API endpoints

### Short-term (Phase 2)
- [ ] Remove Firebase Auth from [src/app/admin/page.tsx](src/app/admin/page.tsx)
- [ ] Remove Firebase Auth from [src/app/admin/settings/page.tsx](src/app/admin/settings/page.tsx)
- [ ] Switch click_events to API-only (remove Firestore)

### Long-term (Phase 3)
- [ ] Remove `firebase-client.ts` 
- [ ] Delete Firebase environment variables
- [ ] Remove Firebase from package.json
- [ ] Clean up firestore.rules and firebase.json if not using Firebase Hosting

---

## Files Reference Summary

| Component | File | Lines | Firebase Usage | Priority |
|-----------|------|-------|---|---|
| Core Config | [src/lib/firebase-client.ts](src/lib/firebase-client.ts) | 1-35 | App, Auth, Storage, Firestore init | CRITICAL |
| Admin Panel | [src/app/admin/page.tsx](src/app/admin/page.tsx) | 12-17, 962-1002 | Auth (onAuthStateChanged, signIn, signOut) | CRITICAL |
| Admin Settings | [src/app/admin/settings/page.tsx](src/app/admin/settings/page.tsx) | 13-14, 35, 745-765 | Auth (onAuthStateChanged, signIn, signOut) | CRITICAL |
| Click Tracking | [src/components/hostvoucher/UIComponents.tsx](src/components/hostvoucher/UIComponents.tsx) | 25-26, 180-195 | Firestore (addDoc, collection, serverTimestamp) | HIGH |
| Security Rules | [firestore.rules](firestore.rules) | 13-22 | Security rules | OPTIONAL |
| Config | [firebase.json](firebase.json) | - | Firebase hosting config | OPTIONAL |
| Config | [.env.local](.env.local) | 29-36 | Firebase env vars (disabled) | OPTIONAL |
| DB Schema | [database.sql](database.sql) | 45-55, 310-311 | click_events table (MySQL ready) | READY |
| API Route | [src/app/api/core/[...slug]/route.ts](src/app/api/core/[...slug]/route.ts) | 350 | Click events INSERT (MySQL ready) | READY |

---

## Conclusion

The application has **3 active Firebase usages**, all of which can be migrated to MySQL:

1. **Admin Authentication** (2 files) - Replace with JWT + SQL
2. **Click Analytics** (1 file) - Already has MySQL fallback, just switch the UI call
3. **Storage** (configured but unused) - Can be removed

**Total Effort:** Medium (2-3 days for full migration)
**Risk Level:** Low (MySQL infrastructure already in place)
