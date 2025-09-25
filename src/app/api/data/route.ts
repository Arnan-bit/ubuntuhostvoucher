
// src/app/api/data/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// This function ensures all data, especially Timestamps, is in a format
// that can be sent from the server to the client without errors.
const makeSerializable = (data: any): any => {
    if (data === null || data === undefined) {
        return data;
    }
    if (data instanceof Date) {
        return data.toISOString();
    }
    // Firestore Timestamps (fallback, just in case)
    if (data && typeof data.toDate === 'function') {
        return data.toDate().toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(makeSerializable);
    }
    if (typeof data === 'object') {
        // This handles RowDataPacket objects from mysql2
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            if(Object.prototype.hasOwnProperty.call(data, key)) {
                newObj[key] = makeSerializable(data[key]);
            }
        }
        return newObj;
    }
    return data;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let data;
    // Each case now has its own try/catch block.
    // If a table doesn't exist, it will return an empty array instead of crashing.
    switch (type) {
      case 'deals':
        try {
            const results = await query({ query: 'SELECT * FROM products ORDER BY catalog_number DESC' });
            // Parse JSON fields and ensure rating/num_reviews are numbers
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
        } catch (e) { console.error(`API Error (deals):`, e); data = []; }
        break;
      case 'click_events':
        try {
            data = await query({ query: 'SELECT * FROM click_events ORDER BY timestamp DESC' });
        } catch (e) { console.error(`API Error (click_events):`, e); data = []; }
        break;
      case 'submitted_vouchers':
        try {
            data = await query({ query: 'SELECT * FROM submitted_vouchers ORDER BY submitted_at DESC' });
        } catch (e) { console.error(`API Error (submitted_vouchers):`, e); data = []; }
        break;
      case 'deal_requests':
        try {
            data = await query({ query: 'SELECT * FROM deal_requests ORDER BY submitted_at DESC' });
        } catch (e) { console.error(`API Error (deal_requests):`, e); data = []; }
        break;
      case 'testimonials':
        try {
            data = await query({ query: 'SELECT * FROM testimonials ORDER BY created_at DESC' });
        } catch (e) { console.error(`API Error (testimonials):`, e); data = []; }
        break;
      case 'blog_posts':
         try {
            data = await query({ query: 'SELECT * FROM blog_posts ORDER BY created_at DESC' });
        } catch (e) { console.error(`API Error (blog_posts):`, e); data = []; }
        break;
      case 'mining_tasks':
        try {
            data = await query({ query: 'SELECT * FROM mining_tasks ORDER BY points DESC' });
        } catch (e) { console.error(`API Error (mining_tasks):`, e); data = []; }
        break;
      case 'gamification_users':
        try {
            data = await query({ query: 'SELECT * FROM gamification_users ORDER BY last_active DESC' });
        } catch (e) { console.error(`API Error (gamification_users):`, e); data = []; }
        break;
      case 'newsletter_subscriptions':
        try {
            data = await query({ query: 'SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC' });
        } catch (e) { console.error(`API Error (newsletter_subscriptions):`, e); data = []; }
        break;
      case 'achievements':
        try {
            const result: any = await query({ query: 'SELECT * FROM achievements WHERE id = ?', values: ['records']});
            data = result.length > 0 ? result[0] : {};
        } catch (e) { console.error(`API Error (achievements):`, e); data = {}; }
        break;
      case 'hostvoucher_testimonials':
        try {
            data = await query({ query: 'SELECT * FROM hostvoucher_testimonials ORDER BY submitted_at DESC' });
        } catch (e) { console.error(`API Error (hostvoucher_testimonials):`, e); data = []; }
        break;
      case 'nft_showcase':
         try {
            data = await query({ query: 'SELECT * FROM nft_showcase ORDER BY submitted_at DESC' });
        } catch (e) { console.error(`API Error (nft_showcase):`, e); data = []; }
        break;
      case 'nft_redemption_requests':
        try {
            data = await query({
                query: `SELECT
                    id,
                    full_name,
                    whatsapp_number,
                    provider,
                    domain,
                    purchase_date,
                    screenshot_url,
                    user_email,
                    status,
                    points_awarded,
                    admin_notes,
                    approved_by,
                    approved_at,
                    submitted_at,
                    updated_at
                FROM nft_redemption_requests
                ORDER BY submitted_at DESC`
            });
        } catch (e: any) {
            if (e.code === 'ER_NO_SUCH_TABLE') {
                // Table doesn't exist, return empty array silently
                data = [];
            } else {
                console.error(`API Error (nft_redemption_requests):`, e);
                data = [];
            }
        }
        break;
      case 'siteSettings':
        try {
            // Settings are special, there's only one row with a specific ID
            const settingsResult: any = await query({ query: 'SELECT * FROM settings WHERE id = ?', values: ['main_settings'] });
            data = settingsResult.length > 0 ? settingsResult[0] : {};
             if(data.page_banners && typeof data.page_banners === 'string') data.page_banners = JSON.parse(data.page_banners);
             if(data.popup_modal && typeof data.popup_modal === 'string') data.popup_modal = JSON.parse(data.popup_modal);
             if(data.site_appearance && typeof data.site_appearance === 'string') data.site_appearance = JSON.parse(data.site_appearance);
             if(data.currency_rates && typeof data.currency_rates === 'string') data.currency_rates = JSON.parse(data.currency_rates);
             if(data.gamification_points && typeof data.gamification_points === 'string') data.gamification_points = JSON.parse(data.gamification_points);
             if(data.idle_sound && typeof data.idle_sound === 'string') data.idle_sound = JSON.parse(data.idle_sound);
             if(data.pagination_settings && typeof data.pagination_settings === 'string') data.pagination_settings = JSON.parse(data.pagination_settings);
        } catch (e) { console.error(`API Error (siteSettings):`, e); data = {}; }
        break;
      case 'banners':
        try {
            const settingsResult: any = await query({ query: 'SELECT page_banners FROM settings WHERE id = ?', values: ['main_settings'] });
            const banners = settingsResult.length > 0 && settingsResult[0].page_banners
                ? JSON.parse(settingsResult[0].page_banners)
                : [];
            data = banners;
        } catch (e) { console.error(`API Error (banners):`, e); data = []; }
        break;
      case 'visitor_analytics':
        try {
            data = await query({ query: 'SELECT * FROM visitor_analytics ORDER BY visited_at DESC LIMIT 1000' });
        } catch (e) { console.error(`API Error (visitor_analytics):`, e); data = []; }
        break;
      case 'analytics_summary':
        try {
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const [totalVisitors, todayVisitors, weekVisitors, topCountries, topBrowsers, deviceStats] = await Promise.all([
                query({ query: 'SELECT COUNT(*) as count FROM visitor_analytics' }),
                query({ query: `SELECT COUNT(*) as count FROM visitor_analytics WHERE DATE(visited_at) = ?`, values: [today] }),
                query({ query: `SELECT COUNT(*) as count FROM visitor_analytics WHERE visited_at >= ?`, values: [weekAgo] }),
                query({ query: 'SELECT country, country_code, COUNT(*) as count FROM visitor_analytics WHERE country IS NOT NULL GROUP BY country, country_code ORDER BY count DESC LIMIT 10' }),
                query({ query: 'SELECT browser, COUNT(*) as count FROM visitor_analytics WHERE browser IS NOT NULL GROUP BY browser ORDER BY count DESC LIMIT 5' }),
                query({ query: 'SELECT device_type, COUNT(*) as count FROM visitor_analytics WHERE device_type IS NOT NULL GROUP BY device_type ORDER BY count DESC' })
            ]);

            data = {
                total_visitors: totalVisitors[0]?.count || 0,
                today_visitors: todayVisitors[0]?.count || 0,
                week_visitors: weekVisitors[0]?.count || 0,
                top_countries: topCountries || [],
                top_browsers: topBrowsers || [],
                device_stats: deviceStats || []
            };
        } catch (e) { console.error(`API Error (analytics_summary):`, e); data = {}; }
        break;
      case 'realtime_visitors':
        try {
            data = await query({
                query: `SELECT country, country_code, city, browser, device_type, landing_page, visited_at, is_mobile
                       FROM visitor_analytics
                       WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
                       ORDER BY visited_at DESC LIMIT 50`
            });
        } catch (e) { console.error(`API Error (realtime_visitors):`, e); data = []; }
        break;
      default:
        return NextResponse.json({ error: 'Invalid data type requested.' }, { status: 400 });
    }
    // The final data is serialized and sent to the client.
    return NextResponse.json({ data: makeSerializable(data) });
  } catch (error: any) {
    // This is a fallback for any other unexpected errors.
    console.error(`General API Error fetching ${type}:`, error);
    const errorMessage = `A general error occurred while fetching ${type}.`;
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}
