# 🎯 API CONSOLIDATION PLAN - TEPAT 12 FUNCTIONS

## 📊 CURRENT STATE (9 Functions)

| # | Path | Status | Keterangan |
|---|------|--------|------------|
| 1 | `/api/action` | ✅ Keep | Admin actions (save settings, etc.) |
| 2 | `/api/actions` | ✅ Keep | **UNIFIED** (track-click, request, gamification) |
| 3 | `/api/data` | ✅ Keep | Data fetching (deals, blog, testimonials, etc.) |
| 4 | `/api/gamification` | ❌ DELETE | Sudah ada di `/api/actions?type=gamification` |
| 5 | `/api/image-proxy` | ✅ Keep | Image proxy untuk external images |
| 6 | `/api/images/[...path]` | ✅ Keep | Image serving dari storage |
| 7 | `/api/request` | ❌ DELETE | Sudah ada di `/api/actions?type=request` |
| 8 | `/api/track-click` | ❌ DELETE | Sudah ada di `/api/actions?type=track-click` |
| 9 | `/api/upload` | ✅ Keep | File upload |

**Setelah Cleanup: 6 Functions**

---

## 🚀 TARGET STATE (12 Functions)

### Functions yang Dipertahankan (6):

1. ✅ `/api/action` - Admin actions
2. ✅ `/api/actions` - Unified endpoint
3. ✅ `/api/data` - Data fetching
4. ✅ `/api/image-proxy` - Image proxy
5. ✅ `/api/images/[...path]` - Image serving
6. ✅ `/api/upload` - File upload

### Functions Baru yang Ditambahkan (6):

7. 🆕 `/api/analytics/track-visitor` - Visitor tracking
8. 🆕 `/api/analytics/track-pageview` - Pageview tracking
9. 🆕 `/api/analytics/summary` - Analytics summary
10. 🆕 `/api/admin/catalog-order` - Update catalog order
11. 🆕 `/api/admin/settings` - Admin settings management
12. 🆕 `/api/webhooks/[provider]` - Webhook handlers (payment, etc.)

**Total: TEPAT 12 Functions** ✅

---

## 📝 LANGKAH IMPLEMENTASI CEPAT

### Step 1: Hapus API Routes yang Sudah Digabung (3 files)

```bash
# Hapus folder-folder ini:
rm -rf src/app/api/gamification
rm -rf src/app/api/request
rm -rf src/app/api/track-click
```

**Alasan:** Fungsi mereka sudah ada di `/api/actions`

### Step 2: Buat API Routes Baru (6 files)

#### 2.1 Analytics Routes (3 files)

**File:** `src/app/api/analytics/track-visitor/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { country, city, browser, device_type, landing_page } = body;
        
        await query({
            query: `INSERT INTO visitor_analytics 
                (country, city, browser, device_type, landing_page, visited_at) 
                VALUES (?, ?, ?, ?, ?, NOW())`,
            values: [country, city, browser, device_type, landing_page]
        });
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Track visitor error:', error);
        return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 });
    }
}
```

**File:** `src/app/api/analytics/track-pageview/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { page, referrer, user_id } = body;
        
        await query({
            query: `INSERT INTO pageviews (page, referrer, user_id, viewed_at) 
                VALUES (?, ?, ?, NOW())`,
            values: [page, referrer, user_id]
        });
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Track pageview error:', error);
        return NextResponse.json({ error: 'Failed to track pageview' }, { status: 500 });
    }
}
```

**File:** `src/app/api/analytics/summary/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const [totalVisitors, todayVisitors, weekVisitors] = await Promise.all([
            query({ query: 'SELECT COUNT(*) as count FROM visitor_analytics' }),
            query({ query: `SELECT COUNT(*) as count FROM visitor_analytics WHERE DATE(visited_at) = ?`, values: [today] }),
            query({ query: `SELECT COUNT(*) as count FROM visitor_analytics WHERE visited_at >= ?`, values: [weekAgo] })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                total: totalVisitors[0]?.count || 0,
                today: todayVisitors[0]?.count || 0,
                week: weekVisitors[0]?.count || 0
            }
        });
    } catch (error: any) {
        console.error('Analytics summary error:', error);
        return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
    }
}
```

#### 2.2 Admin Routes (2 files)

**File:** `src/app/api/admin/catalog-order/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { items } = await request.json();
        
        for (const item of items) {
            await query({
                query: 'UPDATE products SET display_order = ? WHERE id = ?',
                values: [item.order, item.id]
            });
        }
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update catalog order error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
```

**File:** `src/app/api/admin/settings/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const settings: any = await query({
            query: 'SELECT * FROM settings WHERE id = ?',
            values: ['main_settings']
        });
        
        return NextResponse.json({ success: true, data: settings[0] || {} });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        await query({
            query: 'UPDATE settings SET data = ? WHERE id = ?',
            values: [JSON.stringify(body), 'main_settings']
        });
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
```

#### 2.3 Webhook Route (1 file)

**File:** `src/app/api/webhooks/[provider]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { provider: string } }
) {
    try {
        const provider = params.provider;
        const body = await request.json();
        
        // Handle different webhook providers
        switch (provider) {
            case 'stripe':
                // Handle Stripe webhook
                console.log('Stripe webhook:', body);
                break;
            case 'paypal':
                // Handle PayPal webhook
                console.log('PayPal webhook:', body);
                break;
            default:
                return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
        }
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
```

---

## 🗂��� STRUKTUR FOLDER FINAL

```
src/app/api/
├── action/
│   └── route.ts                    # 1. Admin actions
├── actions/
│   └── route.ts                    # 2. Unified (track-click, request, gamification)
├── data/
│   └── route.ts                    # 3. Data fetching
├── image-proxy/
│   └── route.ts                    # 4. Image proxy
├── images/
│   └── [...path]/
│       └── route.ts                # 5. Image serving
├── upload/
│   └── route.ts                    # 6. File upload
├── analytics/
│   ├── track-visitor/
│   │   └── route.ts                # 7. Track visitor
│   ├── track-pageview/
│   │   └── route.ts                # 8. Track pageview
│   └── summary/
│       └── route.ts                # 9. Analytics summary
├── admin/
│   ├── catalog-order/
│   │   └── route.ts                # 10. Catalog order
│   └── settings/
│       └── route.ts                # 11. Admin settings
└── webhooks/
    └── [provider]/
        └── route.ts                # 12. Webhooks
```

**Total: TEPAT 12 Serverless Functions** ✅

---

## ⚡ QUICK IMPLEMENTATION SCRIPT

Jalankan script ini untuk implementasi cepat:

```bash
# Step 1: Hapus API routes yang sudah digabung
rm -rf "src/app/api/gamification"
rm -rf "src/app/api/request"
rm -rf "src/app/api/track-click"

# Step 2: Buat folder baru
mkdir -p "src/app/api/analytics/track-visitor"
mkdir -p "src/app/api/analytics/track-pageview"
mkdir -p "src/app/api/analytics/summary"
mkdir -p "src/app/api/admin/catalog-order"
mkdir -p "src/app/api/admin/settings"
mkdir -p "src/app/api/webhooks/[provider]"

# Step 3: Copy template files (akan dibuat di step berikutnya)
```

---

## ✅ VERIFICATION CHECKLIST

Setelah implementasi, verify:

- [ ] Total API routes = 12
- [ ] Build berhasil tanpa error
- [ ] Semua endpoint lama masih berfungsi via `/api/actions`
- [ ] Analytics tracking berfungsi
- [ ] Admin panel berfungsi
- [ ] Webhook ready untuk integrasi payment

---

## 📊 COMPARISON

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Total Functions | 9 | 12 | ✅ Target tercapai |
| Redundant APIs | 3 | 0 | ✅ Cleaned up |
| New Features | 0 | 6 | ✅ Added |
| Vercel Limit | 12 | 12 | ✅ Perfect fit |

---

**Status:** 🟢 READY TO IMPLEMENT
**Estimated Time:** 15-20 minutes
**Complexity:** ⭐⭐ (Easy)
