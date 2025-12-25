# Firebase Code Locations - Detailed Reference

## File: src/lib/firebase-client.ts
**Status:** Configuration file - All Firebase services initialized

### Lines 1-35: Full File Content
```typescript
'use client';
// This file is intended for client-side use only.
// It initializes Firebase with a client-safe configuration using a singleton pattern.
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';          // Line 5
import { getAuth, Auth } from 'firebase/auth';                                       // Line 6
import { getStorage, FirebaseStorage } from 'firebase/storage';                      // Line 7
import { getFirestore, Firestore } from 'firebase/firestore';                        // Line 8

const firebaseConfig = {                                                              // Line 11
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const appId = "HostVoucher-ai-tracking-stable";                                      // Line 20

function initializeFirebase() {                                                       // Line 22
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeFirebase();                                        // Line 29
const auth: Auth = getAuth(app);                                                      // Line 30
const storage: FirebaseStorage = getStorage(app);                                     // Line 31
const db: Firestore = getFirestore(app);                                              // Line 32

export { auth, storage, db, app, appId };                                             // Line 34
```

**Usage in Codebase:**
- Imported by: `src/app/admin/page.tsx` (lines 13)
- Imported by: `src/app/admin/settings/page.tsx` (line 14)
- Imported by: `src/components/hostvoucher/UIComponents.tsx` (line 26)

---

## File: src/app/admin/page.tsx
**Status:** Admin panel - Uses Firebase Auth for login/logout

### Line 12 - Firebase Auth Type Import
```typescript
import type { User } from 'firebase/auth';
```

### Line 13 - Firebase Client Import
```typescript
import { app, auth } from '@/lib/firebase-client';
```

### Line 17 - Firebase Auth Operations Import
```typescript
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
```

### Lines 962-985 - onAuthStateChanged Implementation
**Purpose:** Monitor auth state changes and validate admin access

```typescript
962: const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
963:     if (!mounted) return;
964:
965:     try {
966:         if (currentUser && AUTHORIZED_EMAILS.includes(currentUser.email!)) {
967:             setUser(currentUser);
968:             setIsAuthorized(true);
969:         } else {
970:             setUser(null);
971:             setIsAuthorized(false);
972:             if (currentUser) {
973:                 signOut(auth).catch(console.error);
974:             }
975:         }
976:     } catch (error) {
977:         console.error('Auth state change error:', error);
978:         setUser(null);
979:         setIsAuthorized(false);
980:     } finally {
981:         setLoadingAuthState(false);
982:         clearTimeout(timeoutId);
983:     }
984: });
```

### Line 996 - signInWithEmailAndPassword Implementation
**Purpose:** Handle admin login

```typescript
996: try { await signInWithEmailAndPassword(auth, email, password); }
```
**Full handler (lines 994-999):**
```typescript
994: const handleLogin = async (e: React.FormEvent) => {
995:     e.preventDefault(); setAuthError(null);
996:     if (!AUTHORIZED_EMAILS.includes(email)) { setAuthError("This email is not authorized for admin access."); return; }
997:     try { await signInWithEmailAndPassword(auth, email, password); } 
998:     catch (err: any) { setAuthError("Login failed. Please check your email and password."); }
999: };
```

### Lines 1001-1003 - signOut Implementation
**Purpose:** Handle admin logout

```typescript
1001: const handleLogout = async () => {
1002:     if (!auth) return;
1003:     try { await signOut(auth); setUser(null); setIsAuthorized(false); setEmail(''); setPassword(''); } 
1004:     catch (error) { setAuthError("Failed to log out."); }
1005: };
```

### Authorization Constants
**Authorized admins (location: near top of component):**
```typescript
AUTHORIZED_EMAILS = ["hostvouchercom@gmail.com", "garudandne87@gmail.com"];
```

---

## File: src/app/admin/settings/page.tsx
**Status:** Admin settings page - Uses Firebase Auth (identical to admin/page.tsx)

### Line 13 - Firebase Auth Type Import
```typescript
import type { User } from 'firebase/auth';
```

### Line 14 - Firebase Client Import
```typescript
import { app, auth } from '@/lib/firebase-client';
```

### Line 35 - Firebase Auth Operations Import
```typescript
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
```

### Lines 745-752 - onAuthStateChanged Implementation
```typescript
745: const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
746:     if (currentUser && AUTHORIZED_EMAILS.includes(currentUser.email!)) {
747:         setUser(currentUser); setIsAuthorized(true);
748:     } else {
749:         setUser(null); setIsAuthorized(false); if (currentUser) { signOut(auth); }
750:     }
751:     setLoadingAuthState(false);
752: });
753: return () => unsubscribe();
```

### Line 759 - signInWithEmailAndPassword Implementation
```typescript
759: try { await signInWithEmailAndPassword(auth, email, password); }
```
**Full handler (lines 757-761):**
```typescript
757: const handleLogin = async (e: React.FormEvent) => {
758:     e.preventDefault(); setAuthError(null);
759:     if (!AUTHORIZED_EMAILS.includes(email)) { setAuthError("This email is not authorized for admin access."); return; }
760:     try { await signInWithEmailAndPassword(auth, email, password); } 
761:     catch (err: any) { setAuthError("Login failed. Please check your email and password."); }
762: };
```

### Lines 764-766 - signOut Implementation
```typescript
764: const handleLogout = async () => {
765:     if (!auth) return;
766:     try { await signOut(auth); setUser(null); setIsAuthorized(false); setEmail(''); setPassword(''); } 
767:     catch (error) { setAuthError("Failed to log out."); }
768: };
```

---

## File: src/components/hostvoucher/UIComponents.tsx
**Status:** Public component - Uses Firestore for analytics

### Line 25 - Firestore Operations Import
```typescript
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
```

### Line 26 - Firestore Instance Import
```typescript
import { db } from '@/lib/firebase-client';
```

### Lines 180-195 - Click Event Logging
**Purpose:** Log user clicks on products to Firestore

```typescript
180:     const logClickEvent = async (product: any) => {
181:         try {
182:             // Get geolocation data
183:             const res = await fetch('https://ipapi.co/json/');
184:             const geoData = await res.json();
185:             
186:             await addDoc(collection(db, `artifacts/${appId}/public/data/click_events`), {
187:                 productId: product.id,
188:                 productName: product.name || product.title,
189:                 productType: product.type || 'N/A',
190:                 timestamp: serverTimestamp(),
191:                 referrer: document.referrer || 'Direct',
192:                 userAgent: navigator.userAgent,
193:                 ipAddress: geoData.ip || '0.0.0.0',
194:                 country: geoData.country_name || 'Unknown',
195:                 city: geoData.city || 'Unknown',
196:             });
197:         } catch (error) {
198:             console.error("Error logging click event:", error);
199:         }
200:     };
```

**Firestore Path Details:**
- **Collection Path:** `artifacts/HostVoucher-ai-tracking-stable/public/data/click_events`
- **appId Value:** `HostVoucher-ai-tracking-stable` (from firebase-client.ts line 20)
- **Document Fields:**
  - `productId` - string
  - `productName` - string
  - `productType` - string
  - `timestamp` - Firestore serverTimestamp()
  - `referrer` - string
  - `userAgent` - string
  - `ipAddress` - string
  - `country` - string
  - `city` - string

### Line 648 - Usage in Admin Panel
**Reference in admin/page.tsx:**
```typescript
648: dataApi.fetchData('click_events'),
```
This fetches click events data from MySQL API (fallback to database).

---

## File: firestore.rules
**Status:** Firestore security rules (can be removed once migrated)

### Lines 13-22 - Click Events Collection Rules
```
13:   match /artifacts/{appId}/{dataType}/{subCollection}/{document=**} {
14:       // Collection rules for tracking data
15:       // These rules govern access to the click_events collection
16:       // and other analytics data
17:       allow read: if true;
18:       allow write: if request.auth != null;
19:   }
```

---

## File: firebase.json
**Status:** Firebase hosting configuration (optional, can be removed)

Contains Firebase Hosting and Firestore deployment configuration.

---

## File: .env.local
**Status:** Environment variables (currently disabled)

### Lines 29-36 - Firebase Configuration (DISABLED)
```
29: # --- 5. FIREBASE (DISABLED - Using MySQL only) ---
30: # NEXT_PUBLIC_FIREBASE_API_KEY=
31: # NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
32: # NEXT_PUBLIC_FIREBASE_PROJECT_ID=
33: # NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
34: # NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
35: # NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## File: src/app/api/core/[...slug]/route.ts
**Status:** API Route with MySQL fallback (READY for click events)

### Line 350 - Click Events MySQL Insert
**Purpose:** Alternative MySQL storage for click events

```typescript
350: query: 'INSERT INTO click_events (id, product_id, product_name, product_type, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
```

**Status:** ✅ Already implemented, just need to switch from Firestore to this endpoint

---

## File: database.sql
**Status:** MySQL Schema (ready)

### Lines 45-55 - click_events Table Definition
```sql
45: CREATE TABLE IF NOT EXISTS click_events (
46:     id VARCHAR(255) PRIMARY KEY,
47:     product_id VARCHAR(255) NOT NULL,
48:     product_name VARCHAR(255),
49:     product_type VARCHAR(255),
50:     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
51:     ip_address VARCHAR(45),
52:     user_agent TEXT,
53:     INDEX idx_click_events_product_id (product_id),
54:     INDEX idx_click_events_timestamp (`timestamp`)
55: );
```

### Lines 310-311 - Indexes
```sql
310: CREATE INDEX idx_click_events_product_id ON click_events(product_id);
311: CREATE INDEX idx_click_events_timestamp ON click_events(`timestamp`);
```

---

## Operations Summary

### Firebase Auth Operations
| Operation | Lines | Files | Purpose |
|-----------|-------|-------|---------|
| `onAuthStateChanged()` | 962/745 | admin/page.tsx, admin/settings/page.tsx | Monitor login status |
| `signInWithEmailAndPassword()` | 996/759 | admin/page.tsx, admin/settings/page.tsx | Login handler |
| `signOut()` | 973/1002/749/765 | admin/page.tsx, admin/settings/page.tsx | Logout handler |

### Firestore Operations
| Operation | Lines | Files | Purpose |
|-----------|-------|-------|---------|
| `collection()` | 186 | UIComponents.tsx | Reference Firestore collection |
| `addDoc()` | 186 | UIComponents.tsx | Write click event document |
| `serverTimestamp()` | 190 | UIComponents.tsx | Add server timestamp |

### Associated Data
| Element | Value | Usage |
|---------|-------|-------|
| Authorized Emails | hostvouchercom@gmail.com, garudandne87@gmail.com | Admin access control |
| App ID | HostVoucher-ai-tracking-stable | Firestore path segment |
| Firestore Path | artifacts/{appId}/public/data/click_events | Collection reference |
| MySQL Fallback | click_events table in MySQL | Already exists |

---

## Migration Priority by Complexity

### 1. Click Events (EASIEST) - 2 hours
- Current: Firestore write in UIComponents.tsx:186
- Target: API call to `/api/click-events`
- Status: MySQL table already exists
- Changes: Replace `addDoc()` call with `fetch()` API call

### 2. Admin Auth (MEDIUM) - 1 day
- Current: Firebase Auth in 2 files
- Target: JWT + SQL auth_users table
- Status: Requires new auth middleware
- Changes: 3 imports + 3 handlers per file

### 3. Cleanup (EASY) - 1 hour
- Remove firebase-client.ts
- Remove Firebase from package.json
- Remove/clean env variables
- Remove imports and unused code

---

## Dependency Chain

```
firebase-client.ts (core)
    ├── admin/page.tsx (imports: auth)
    ├── admin/settings/page.tsx (imports: auth)
    └── UIComponents.tsx (imports: db)

Migration Order:
1. Create auth endpoints first
2. Update admin pages (they depend on firebase-client)
3. Update UIComponents (click events)
4. Remove firebase-client.ts last
```

---

## Code Search Patterns

### Find all Firebase imports:
```
import.*firebase|from.*firebase
```

### Find auth operations:
```
onAuthStateChanged|signInWithEmailAndPassword|signOut
```

### Find Firestore operations:
```
addDoc|collection|serverTimestamp|getDocs|setDoc|updateDoc|deleteDoc
```

### Find usage of click_events:
```
click_events|artifacts
```
