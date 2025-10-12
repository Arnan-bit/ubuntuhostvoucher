// CORE API ROUTE - Menggabungkan: action, data, gamification, request, track-click, actions
// Reduces 6 separate functions into 1 unified function

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Helper to make data JSON-serializable
const makeSerializable = (data: any): any => {
    if (data === null || data === undefined) return data;
    if (data instanceof Date) return data.toISOString();
    if (data && typeof data.toDate === 'function') return data.toDate().toISOString();
    if (Array.isArray(data)) return data.map(makeSerializable);
    if (typeof data === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newObj[key] = makeSerializable(data[key]);
            }
        }
        return newObj;
    }
    return data;
};

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    const [endpoint, ...rest] = params.slug || [];
    
    try {
        switch (endpoint) {
            case 'data':
                return await handleDataGet(request);
            
            case 'actions':
                return await handleActionsGet(request);
            
            case 'health':
                return NextResponse.json({ 
                    status: 'ok', 
                    endpoint: 'core',
                    timestamp: new Date().toISOString()
                });
            
            default:
                return NextResponse.json({ 
                    error: 'Endpoint not found',
                    available: ['data', 'actions', 'health']
                }, { status: 404 });
        }
    } catch (error: any) {
        console.error(`Core API GET Error [${endpoint}]:`, error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    const [endpoint, ...rest] = params.slug || [];
    
    try {
        switch (endpoint) {
            case 'action':
                return await handleAction(request);
            
            case 'gamification':
                return await handleGamification(request);
            
            case 'request':
                return await handleRequest(request);
            
            case 'track-click':
                return await handleTrackClick(request);
            
            case 'actions':
                return await handleActionsPost(request);
            
            default:
                return NextResponse.json({ 
                    error: 'Endpoint not found',
                    available: ['action', 'gamification', 'request', 'track-click', 'actions']
                }, { status: 404 });
        }
    } catch (error: any) {
        console.error(`Core API POST Error [${endpoint}]:`, error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

// ==================== DATA HANDLER ====================
async function handleDataGet(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        let data;
        
        switch (type) {
            case 'deals':
                const results = await query({ query: 'SELECT * FROM products ORDER BY catalog_number DESC' });
                data = results.map((product: any) => ({
                    ...product,
                    features: product.features ? JSON.parse(product.features) : [],
                    rating: product.rating ? parseFloat(product.rating) : 0,
                    num_reviews: product.num_reviews ? parseInt(product.num_reviews) : 0,
                    price: product.price ? parseFloat(product.price) : 0,
                    original_price: product.original_price ? parseFloat(product.original_price) : null,
                    clicks: product.clicks ? parseInt(product.clicks) : 0,
                    show_on_landing: product.show_on_landing ? Boolean(product.show_on_landing) : true,
                    display_style: product.display_style || 'vertical',
                    is_featured: product.is_featured ? Boolean(product.is_featured) : false
                }));
                break;

            case 'blog_posts':
                data = await query({ query: 'SELECT * FROM blog_posts ORDER BY created_at DESC' });
                break;

            case 'testimonials':
                data = await query({ query: 'SELECT * FROM testimonials ORDER BY created_at DESC' });
                break;

            case 'mining_tasks':
                data = await query({ query: 'SELECT * FROM mining_tasks ORDER BY points DESC' });
                break;

            case 'siteSettings':
                const settingsResult: any = await query({ query: 'SELECT * FROM settings WHERE id = ?', values: ['main_settings'] });
                data = settingsResult.length > 0 ? settingsResult[0] : {};
                
                if (data.page_banners && typeof data.page_banners === 'string') data.page_banners = JSON.parse(data.page_banners);
                if (data.popup_modal && typeof data.popup_modal === 'string') data.popup_modal = JSON.parse(data.popup_modal);
                if (data.site_appearance && typeof data.site_appearance === 'string') data.site_appearance = JSON.parse(data.site_appearance);
                if (data.currency_rates && typeof data.currency_rates === 'string') data.currency_rates = JSON.parse(data.currency_rates);
                if (data.gamification_points && typeof data.gamification_points === 'string') data.gamification_points = JSON.parse(data.gamification_points);
                break;

            case 'banners':
                const bannersResult: any = await query({ query: 'SELECT page_banners FROM settings WHERE id = ?', values: ['main_settings'] });
                data = bannersResult.length > 0 && bannersResult[0].page_banners ? JSON.parse(bannersResult[0].page_banners) : [];
                break;

            default:
                return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
        }

        return NextResponse.json({ data: makeSerializable(data) });
    } catch (error: any) {
        console.error(`Data fetch error [${type}]:`, error);
        return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
    }
}

// ==================== ACTION HANDLER ====================
async function handleAction(request: NextRequest) {
    try {
        const { type, payload } = await request.json();

        switch (type) {
            case 'saveProduct':
                return await saveProduct(payload);
            case 'saveSettings':
                return await saveSettings(payload);
            case 'saveTestimonial':
                return await saveTestimonial(payload);
            case 'deleteItem':
                return await deleteItem(payload);
            case 'submitVoucher':
                return await submitVoucher(payload);
            case 'submitDealRequest':
                return await submitDealRequest(payload);
            case 'subscribeToNewsletter':
                return await subscribeToNewsletter(payload);
            default:
                return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Action error:', error);
        return NextResponse.json({ error: 'Action failed', details: error.message }, { status: 500 });
    }
}

async function saveProduct(productData: any) {
    const { id, ...data } = productData;
    if (id) {
        const updateQuery = 'UPDATE products SET name=?, provider=?, type=?, price=?, original_price=?, discount=?, features=?, target_url=?, image=?, rating=?, num_reviews=?, is_featured=?, show_on_landing=? WHERE id=?';
        const values = [data.name, data.provider, data.type, data.price, data.original_price, data.discount, JSON.stringify(data.features), data.target_url, data.image, data.rating, data.num_reviews, data.is_featured, data.show_on_landing, id];
        await query({ query: updateQuery, values });
        return NextResponse.json({ data: { id } });
    } else {
        const newId = uuidv4();
        const catalogNumberResult: any = await query({ query: 'SELECT MAX(catalog_number) as maxNum FROM products' });
        const newCatalogNumber = (catalogNumberResult[0]?.maxNum || 0) + 1;
        
        const insertQuery = 'INSERT INTO products (id, name, provider, type, price, original_price, discount, features, target_url, image, rating, num_reviews, catalog_number, is_featured, show_on_landing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [newId, data.name, data.provider, data.type, data.price, data.original_price, data.discount, JSON.stringify(data.features), data.target_url, data.image, data.rating, data.num_reviews, newCatalogNumber, data.is_featured, data.show_on_landing];
        await query({ query: insertQuery, values });
        return NextResponse.json({ data: { id: newId } });
    }
}

async function saveSettings(settingsData: any) {
    const settingsId = 'main_settings';
    const { id, ...data } = settingsData;

    const siteAppearance = JSON.stringify(data.site_appearance || {});
    const pageBanners = JSON.stringify(data.page_banners || {});
    const popupModal = JSON.stringify(data.popup_modal || {});

    const updateQuery = 'UPDATE settings SET site_appearance = ?, page_banners = ?, popup_modal = ? WHERE id = ?';
    await query({ query: updateQuery, values: [siteAppearance, pageBanners, popupModal, settingsId] });

    return NextResponse.json({ success: true, data: { id: settingsId } });
}

async function saveTestimonial(testimonialData: any) {
    const { id, ...data } = testimonialData;
    if (id) {
        const updateQuery = 'UPDATE testimonials SET name=?, role=?, review=?, image_url=?, rating=? WHERE id=?';
        await query({ query: updateQuery, values: [data.name, data.role, data.review, data.image_url, data.rating, id] });
        return NextResponse.json({ data: { id } });
    } else {
        const newId = uuidv4();
        const insertQuery = 'INSERT INTO testimonials (id, name, role, review, image_url, rating) VALUES (?, ?, ?, ?, ?, ?)';
        await query({ query: insertQuery, values: [newId, data.name, data.role, data.review, data.image_url, data.rating] });
        return NextResponse.json({ data: { id: newId } });
    }
}

async function deleteItem({ itemType, itemId }: { itemType: string; itemId: string }) {
    if (!/^[a-zA-Z_]+$/.test(itemType)) {
        throw new Error('Invalid item type');
    }
    await query({ query: `DELETE FROM ${itemType} WHERE id = ?`, values: [itemId] });
    return NextResponse.json({ data: { success: true } });
}

async function submitVoucher(payload: any) {
    const { provider, voucherCode, description, link, userEmail } = payload;
    const newId = uuidv4();
    await query({ 
        query: 'INSERT INTO submitted_vouchers (id, provider, voucher_code, description, link, user_email) VALUES (?, ?, ?, ?, ?, ?)',
        values: [newId, provider, voucherCode, description, link, userEmail]
    });
    return NextResponse.json({ data: { success: true, id: newId } });
}

async function submitDealRequest(payload: any) {
    const { serviceType, providerName, userEmail, additionalNotes } = payload;
    const newId = uuidv4();
    await query({ 
        query: 'INSERT INTO deal_requests (id, user_email, service_type, provider_name, additional_notes) VALUES (?, ?, ?, ?, ?)',
        values: [newId, userEmail, serviceType, providerName, additionalNotes]
    });
    return NextResponse.json({ data: { success: true, id: newId } });
}

async function subscribeToNewsletter(payload: any) {
    const { email } = payload;
    const existing: any = await query({ query: 'SELECT id FROM newsletter_subscriptions WHERE email = ?', values: [email] });
    if (existing.length > 0) {
        return NextResponse.json({ data: { success: true, message: 'Already subscribed' } });
    }
    const newId = uuidv4();
    await query({ query: 'INSERT INTO newsletter_subscriptions (id, email) VALUES (?, ?)', values: [newId, email] });
    return NextResponse.json({ data: { success: true, id: newId } });
}

// ==================== GAMIFICATION HANDLER ====================
async function handleGamification(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, email, points, badge } = body;

        switch (action) {
            case 'award_points':
                await query({ query: 'UPDATE user_gamification SET points = points + ? WHERE email = ?', values: [points, email] });
                return NextResponse.json({ success: true, pointsAwarded: points });

            case 'award_badge':
                const user: any = await query({ query: 'SELECT badges FROM user_gamification WHERE email = ?', values: [email] });
                if (user.length > 0) {
                    const badges = JSON.parse(user[0].badges || '[]');
                    badges.push(badge);
                    await query({ query: 'UPDATE user_gamification SET badges = ? WHERE email = ?', values: [JSON.stringify(badges), email] });
                }
                return NextResponse.json({ success: true, badgeAwarded: badge });

            default:
                return NextResponse.json({ error: 'Invalid gamification action' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Gamification error:', error);
        return NextResponse.json({ error: 'Gamification failed', details: error.message }, { status: 500 });
    }
}

// ==================== REQUEST HANDLER ====================
async function handleRequest(request: NextRequest) {
    try {
        const formData = await request.formData();
        
        const fullName = formData.get('fullName') as string;
        const whatsappNumber = formData.get('whatsappNumber') as string;
        const provider = formData.get('provider') as string;
        const userEmail = formData.get('userEmail') as string;

        if (!fullName || !whatsappNumber || !provider || !userEmail) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const newId = uuidv4();
        await query({
            query: 'INSERT INTO purchase_requests (id, full_name, whatsapp_number, provider, user_email, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            values: [newId, fullName, whatsappNumber, provider, userEmail, 'pending']
        });

        return NextResponse.json({ success: true, requestId: newId, message: 'Request submitted successfully' });
    } catch (error: any) {
        console.error('Request error:', error);
        return NextResponse.json({ success: false, error: 'Request failed', details: error.message }, { status: 500 });
    }
}

// ==================== TRACK CLICK HANDLER ====================
async function handleTrackClick(request: NextRequest) {
    try {
        const { productId, productName, productType } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const clickEventId = uuidv4();
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        await query({
            query: 'INSERT INTO click_events (id, product_id, product_name, product_type, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
            values: [clickEventId, productId, productName, productType, ip, userAgent]
        });

        await query({ query: 'UPDATE products SET clicks = clicks + 1 WHERE id = ?', values: [productId] });

        return NextResponse.json({ success: true, clickId: clickEventId });
    } catch (error: any) {
        console.error('Track click error:', error);
        return NextResponse.json({ error: 'Track click failed', details: error.message }, { status: 500 });
    }
}

// ==================== ACTIONS HANDLER (Unified) ====================
async function handleActionsPost(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
        case 'track-click':
            return await handleTrackClick(request);
        case 'request':
            return await handleRequest(request);
        case 'gamification':
            return await handleGamification(request);
        default:
            return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }
}

async function handleActionsGet(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'requests') {
        const status = searchParams.get('status') || 'all';
        let queryStr = 'SELECT * FROM purchase_requests ORDER BY created_at DESC';
        let params: any[] = [];
        
        if (status !== 'all') {
            queryStr = 'SELECT * FROM purchase_requests WHERE status = ? ORDER BY created_at DESC';
            params = [status];
        }
        
        const rows = await query({ query: queryStr, values: params });
        return NextResponse.json({ success: true, requests: rows });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
}
