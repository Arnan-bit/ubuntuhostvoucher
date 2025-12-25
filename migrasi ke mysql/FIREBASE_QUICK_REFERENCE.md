# Firebase Usage - Quick Reference

## 📊 Summary Statistics
- **Total Files Using Firebase:** 3
- **Firebase Operations Found:** 6 major operations
- **Services Used:** Auth (2), Firestore (1), Storage (initialized only)
- **Migration Status:** 50% done (click_events already in MySQL)

---

## 🔴 CRITICAL - Must Migrate Immediately

### 1. **Admin Authentication** 
**Files:** 
- `src/app/admin/page.tsx`
- `src/app/admin/settings/page.tsx`

**Operations:**
| Operation | Lines | Impact |
|-----------|-------|--------|
| `onAuthStateChanged()` | 962, 745 | Monitors login status |
| `signInWithEmailAndPassword()` | 996, 759 | Handles admin login |
| `signOut()` | 973/1002, 749/765 | Handles admin logout |

**Authorized Users:**
- hostvouchercom@gmail.com
- garudandne87@gmail.com

**Replacement:** JWT-based auth + SQL `admin_users` table

---

## 🟡 HIGH PRIORITY - Partial Migration Needed

### 2. **Click Event Analytics**
**File:** `src/components/hostvoucher/UIComponents.tsx` (lines 25, 26, 180-195)

**Current Operation:**
```typescript
addDoc(collection(db, `artifacts/HostVoucher-ai-tracking-stable/public/data/click_events`), {
    productId, productName, productType, timestamp, referrer, userAgent, ipAddress, country, city
})
```

**Status:** ⚠️ Firestore write exists BUT MySQL fallback already implemented in API
**Action Needed:** Disable Firestore call or keep as optional backup

**Firestore Collection Path:**
```
artifacts/HostVoucher-ai-tracking-stable/public/data/click_events
```

---

## ✅ OPTIONAL - Can Be Removed

### 3. **Firebase Storage** (Unused)
- Initialized in `src/lib/firebase-client.ts`
- Never called in code
- **Action:** Remove from config

---

## 📁 All Files Using Firebase

| File | Type | Usage |
|------|------|-------|
| `src/lib/firebase-client.ts` | Config | Initializes Auth, Firestore, Storage |
| `src/app/admin/page.tsx` | Component | ✅ Auth operations |
| `src/app/admin/settings/page.tsx` | Component | ✅ Auth operations |
| `src/components/hostvoucher/UIComponents.tsx` | Component | ⚠️ Firestore writes |
| `firestore.rules` | Config | Security rules |
| `firebase.json` | Config | Hosting config |
| `.env.local` | Env | Firebase variables (disabled) |

---

## 🔧 Quick Migration Checklist

### Phase 1: Foundation
- [ ] Create `admin_users` table in MySQL
- [ ] Create JWT authentication middleware
- [ ] Create `/api/auth/login` endpoint
- [ ] Create `/api/auth/logout` endpoint
- [ ] Create `/api/auth/verify` endpoint

### Phase 2: Admin Pages
- [ ] Replace Firebase Auth in `src/app/admin/page.tsx`
- [ ] Replace Firebase Auth in `src/app/admin/settings/page.tsx`
- [ ] Test admin login/logout
- [ ] Verify JWT token handling

### Phase 3: Analytics
- [ ] Disable/remove Firestore call from UIComponents.tsx
- [ ] Verify MySQL click_events table stores data
- [ ] Test analytics dashboard

### Phase 4: Cleanup
- [ ] Remove Firebase imports
- [ ] Delete `src/lib/firebase-client.ts`
- [ ] Remove Firebase from `package.json`
- [ ] Clean up env variables
- [ ] (Optional) Remove `firestore.rules` and `firebase.json`

---

## 📊 Database Schema Ready

### MySQL `click_events` Table
```sql
CREATE TABLE click_events (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    product_type VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_product_id (product_id),
    INDEX idx_timestamp (timestamp)
);
```

✅ **Status:** Already exists and has API endpoint support at `src/app/api/core/[...slug]/route.ts:350`

---

## 🎯 Migration Impact Assessment

| Aspect | Risk | Effort | Time |
|--------|------|--------|------|
| Admin Auth | Low* | Medium | 1 day |
| Click Events | Low** | Low | 2 hours |
| Cleanup | Low | Low | 1 hour |

*Low risk because auth logic is straightforward and MySQL infrastructure exists
**Low risk because MySQL fallback already exists

---

## 📝 Important Notes

1. **Firebase NOT completely disabled** - `.env.local` shows it's commented out but code still imports it
2. **Click events partially migrated** - Firestore writes still happen but MySQL table exists
3. **Storage configured but unused** - Safe to remove
4. **Auth middleware not yet implemented** - Needs to be built from scratch
5. **Database ready** - All required MySQL tables already exist

---

## 🚀 Next Steps

1. Review this audit with team
2. Create `FIREBASE_MIGRATION_PLAN.md` with detailed steps
3. Start Phase 1 (JWT authentication)
4. Test each phase before moving to next
5. Deploy to staging first
6. Verify all admin operations work
7. Monitor analytics data integrity
