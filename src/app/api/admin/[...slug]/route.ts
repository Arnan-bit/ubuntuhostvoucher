// ADMIN API ROUTE - Menggabungkan: analytics, settings, webhooks, catalog-order
// Reduces multiple admin functions into 1 unified function

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    const [category, endpoint, ...rest] = params.slug || [];
    
    try {
        if (category === 'analytics') {
            return await handleAnalyticsGet(endpoint, request);
        } else if (category === 'settings') {
            return await handleSettingsGet(request);
        } else if (category === 'catalog-order') {
            return await handleCatalogOrderGet(request);
        } else if (category === 'webhooks') {
            return await handleWebhookGet(endpoint, request);
        } else if (category === 'health') {
            return NextResponse.json({ 
                status: 'ok', 
                endpoint: 'admin',
                timestamp: new Date().toISOString()
            });
        }
        
        return NextResponse.json({ 
            error: 'Endpoint not found',
            available: ['analytics', 'settings', 'catalog-order', 'webhooks', 'health']
        }, { status: 404 });
    } catch (error: any) {
        console.error(`Admin API GET Error [${category}/${endpoint}]:`, error);
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
    const [category, endpoint, ...rest] = params.slug || [];
    
    try {
        if (category === 'analytics') {
            return await handleAnalyticsPost(endpoint, request);
        } else if (category === 'settings') {
            return await handleSettingsPost(request);
        } else if (category === 'catalog-order') {
            return await handleCatalogOrderPost(request);
        } else if (category === 'webhooks') {
            return await handleWebhookPost(endpoint, request);
        }
        
        return NextResponse.json({ 
            error: 'Endpoint not found',
            available: ['analytics', 'settings', 'catalog-order', 'webhooks']
        }, { status: 404 });
    } catch (error: any) {
        console.error(`Admin API POST Error [${category}/${endpoint}]:`, error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    const [category, endpoint, ...rest] = params.slug || [];
    
    try {
        if (category === 'settings') {
            return await handleSettingsPut(request);
        }
        
        return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    } catch (error: any) {
        console.error(`Admin API PUT Error [${category}/${endpoint}]:`, error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error.message 
        }, { status: 500 });
    }
}

// ==================== ANALYTICS HANDLERS ====================
async function handleAnalyticsGet(endpoint: string, request: NextRequest) {
    switch (endpoint) {
        case 'track-visitor':
            const recentVisitors = await query({
                query: `SELECT country, country_code, city, browser, device_type, landing_page, visited_at, is_mobile
                       FROM visitor_analytics
                       WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
                       ORDER BY visited_at DESC LIMIT 50`
            });
            return NextResponse.json({ success: true, data: recentVisitors });

        case 'track-pageview':
            const { searchParams } = new URL(request.url);
            const page = searchParams.get('page');
            const limit = parseInt(searchParams.get('limit') || '100');
            
            let queryStr = 'SELECT * FROM pageviews ORDER BY viewed_at DESC LIMIT ?';
            let params: any[] = [limit];
            
            if (page) {
                queryStr = 'SELECT * FROM pageviews WHERE page = ? ORDER BY viewed_at DESC LIMIT ?';
                params = [page, limit];
            }
            
            const pageviews = await query({ query: queryStr, values: params });
            return NextResponse.json({ success: true, data: pageviews });

        case 'summary':
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const [totalVisitors, todayVisitors, weekVisitors, monthVisitors, topCountries, topBrowsers, deviceStats] = await Promise.all([
                query({ query: 'SELECT COUNT(*) as count FROM visitor_analytics' }),
                query({ query: `SELECT COUNT(*) as count FROM visitor_analytics WHERE DATE(visited_at) = ?`, values: [today] }),
                query({ query: `SELECT COUNT(*) as count FROM visitor_analytics WHERE visited_at >= ?`, values: [weekAgo] }),
                query({ query: `SELECT COUNT(*) as count FROM visitor_analytics WHERE visited_at >= ?`, values: [monthAgo] }),
                query({ query: `SELECT country, country_code, COUNT(*) as count FROM visitor_analytics WHERE country IS NOT NULL GROUP BY country, country_code ORDER BY count DESC LIMIT 10` }),
                query({ query: `SELECT browser, COUNT(*) as count FROM visitor_analytics WHERE browser IS NOT NULL GROUP BY browser ORDER BY count DESC LIMIT 5` }),
                query({ query: `SELECT device_type, COUNT(*) as count FROM visitor_analytics WHERE device_type IS NOT NULL GROUP BY device_type ORDER BY count DESC` })
            ]);

            return NextResponse.json({
                success: true,
                data: {
                    visitors: {
                        total: totalVisitors[0]?.count || 0,
                        today: todayVisitors[0]?.count || 0,
                        week: weekVisitors[0]?.count || 0,
                        month: monthVisitors[0]?.count || 0
                    },
                    topCountries: topCountries || [],
                    topBrowsers: topBrowsers || [],
                    deviceStats: deviceStats || []
                }
            });

        default:
            return NextResponse.json({ error: 'Invalid analytics endpoint' }, { status: 404 });
    }
}

async function handleAnalyticsPost(endpoint: string, request: NextRequest) {
    const body = await request.json();

    switch (endpoint) {
        case 'track-visitor':
            const { country, country_code, city, browser, device_type, landing_page, is_mobile, ip_address } = body;
            const visitorId = uuidv4();
            
            await query({
                query: `INSERT INTO visitor_analytics (id, country, country_code, city, browser, device_type, landing_page, is_mobile, ip_address, visited_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                values: [visitorId, country, country_code, city, browser, device_type, landing_page, is_mobile || false, ip_address]
            });
            
            return NextResponse.json({ success: true, visitorId });

        case 'track-pageview':
            const { page, referrer, user_id, session_id } = body;
            const pageviewId = uuidv4();
            
            await query({
                query: `INSERT INTO pageviews (id, page, referrer, user_id, session_id, viewed_at) VALUES (?, ?, ?, ?, ?, NOW())`,
                values: [pageviewId, page, referrer, user_id, session_id]
            });
            
            return NextResponse.json({ success: true, pageviewId });

        case 'summary':
            const { startDate, endDate, groupBy } = body;
            let queryStr = `SELECT DATE(visited_at) as date, COUNT(*) as count FROM visitor_analytics WHERE visited_at BETWEEN ? AND ? GROUP BY DATE(visited_at) ORDER BY date DESC`;
            
            if (groupBy === 'country') {
                queryStr = `SELECT country, COUNT(*) as count FROM visitor_analytics WHERE visited_at BETWEEN ? AND ? GROUP BY country ORDER BY count DESC`;
            } else if (groupBy === 'browser') {
                queryStr = `SELECT browser, COUNT(*) as count FROM visitor_analytics WHERE visited_at BETWEEN ? AND ? GROUP BY browser ORDER BY count DESC`;
            }
            
            const results = await query({ query: queryStr, values: [startDate, endDate] });
            return NextResponse.json({ success: true, data: results });

        default:
            return NextResponse.json({ error: 'Invalid analytics endpoint' }, { status: 404 });
    }
}

// ==================== SETTINGS HANDLERS ====================
async function handleSettingsGet(request: NextRequest) {
    const settings: any = await query({ query: 'SELECT * FROM settings WHERE id = ?', values: ['main_settings'] });
    
    if (settings.length === 0) {
        return NextResponse.json({ success: true, data: {} });
    }
    
    const settingsData = settings[0];
    
    if (settingsData.page_banners && typeof settingsData.page_banners === 'string') {
        settingsData.page_banners = JSON.parse(settingsData.page_banners);
    }
    if (settingsData.popup_modal && typeof settingsData.popup_modal === 'string') {
        settingsData.popup_modal = JSON.parse(settingsData.popup_modal);
    }
    if (settingsData.site_appearance && typeof settingsData.site_appearance === 'string') {
        settingsData.site_appearance = JSON.parse(settingsData.site_appearance);
    }
    
    return NextResponse.json({ success: true, data: settingsData });
}

async function handleSettingsPost(request: NextRequest) {
    const body = await request.json();
    const { section, data } = body;
    
    const currentSettings: any = await query({ query: 'SELECT * FROM settings WHERE id = ?', values: ['main_settings'] });
    
    if (currentSettings.length === 0) {
        await query({
            query: `INSERT INTO settings (id, ${section}, updated_at) VALUES (?, ?, NOW())`,
            values: ['main_settings', JSON.stringify(data)]
        });
    } else {
        await query({
            query: `UPDATE settings SET ${section} = ?, updated_at = NOW() WHERE id = ?`,
            values: [JSON.stringify(data), 'main_settings']
        });
    }
    
    return NextResponse.json({ success: true, message: 'Settings updated' });
}

async function handleSettingsPut(request: NextRequest) {
    const body = await request.json();
    
    await query({
        query: 'UPDATE settings SET data = ?, updated_at = NOW() WHERE id = ?',
        values: [JSON.stringify(body), 'main_settings']
    });
    
    return NextResponse.json({ success: true, message: 'Settings updated' });
}

// ==================== CATALOG ORDER HANDLERS ====================
async function handleCatalogOrderGet(request: NextRequest) {
    const catalog = await query({
        query: 'SELECT id, name, display_order, catalog_number FROM products ORDER BY display_order ASC, catalog_number DESC'
    });
    
    return NextResponse.json({ success: true, data: catalog });
}

async function handleCatalogOrderPost(request: NextRequest) {
    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
        return NextResponse.json({ success: false, error: 'Items must be an array' }, { status: 400 });
    }
    
    for (const item of items) {
        await query({
            query: 'UPDATE products SET display_order = ?, updated_at = NOW() WHERE id = ?',
            values: [item.order || item.display_order, item.id]
        });
    }
    
    return NextResponse.json({ success: true, message: `Updated ${items.length} items` });
}

// ==================== WEBHOOK HANDLERS ====================
async function handleWebhookGet(provider: string, request: NextRequest) {
    return NextResponse.json({ 
        success: true,
        provider: provider,
        message: 'Webhook endpoint is active',
        timestamp: new Date().toISOString()
    });
}

async function handleWebhookPost(provider: string, request: NextRequest) {
    const body = await request.json();
    
    console.log(`Webhook received from ${provider}:`, body);
    
    // Log webhook for audit
    const webhookId = uuidv4();
    await query({
        query: `INSERT INTO webhook_logs (id, provider, payload, received_at) VALUES (?, ?, ?, NOW())`,
        values: [webhookId, provider, JSON.stringify(body)]
    }).catch(err => {
        console.warn('Failed to log webhook:', err.message);
    });
    
    // Handle different providers
    switch (provider.toLowerCase()) {
        case 'stripe':
            console.log('Stripe webhook:', body.type);
            break;
        case 'paypal':
            console.log('PayPal webhook:', body.event_type);
            break;
        case 'midtrans':
            console.log('Midtrans webhook:', body.transaction_status);
            break;
        default:
            console.log(`Unknown provider: ${provider}`);
    }
    
    return NextResponse.json({ success: true, received: true });
}
