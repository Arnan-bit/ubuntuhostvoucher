import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * API endpoint: GET /api/data
 * Retrieve general data (products, stats, etc.) untuk dashboard atau frontend
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    // If caller requests a specific type, handle it. If no type provided,
    // return the default payload expected by the frontend: settings + products (deals)
    if (!type) {
      // Load settings (if available) and sample products
      let settings: any = {};
      try {
        const settingsRows = await query({ query: 'SELECT * FROM settings LIMIT 1' }) as any[];
        settings = settingsRows && settingsRows.length ? settingsRows[0] : {};
      } catch (e) {
        console.warn('Could not load settings from DB:', e.message || e);
        settings = {};
      }

      let products: any[] = [];
      try {
        products = await query({
          query: `SELECT
            id, name, title, provider, type, tier, price, original_price, discount,
            features, link, target_url, image, provider_logo, catalog_image,
            brand_logo, brand_logo_text, rating, num_reviews, clicks, code,
            color, button_color, is_featured, show_on_landing, display_style,
            display_order, show_on_home, shake_animation, shake_intensity
          FROM products ORDER BY catalog_number DESC LIMIT ?`,
          values: [limit]
        }) as any[];
      } catch (e) {
        console.warn('Could not load products from DB:', e.message || e);
        products = [];
      }

      return NextResponse.json({
        success: true,
        settings,
        products,
        count: products.length
      });
    }

    switch (type) {
      case 'products':
        const products = await query({
          query: 'SELECT id, name, price, rating, num_reviews FROM products LIMIT ?',
          values: [limit]
        });
        return NextResponse.json({
          success: true,
          type: 'products',
          data: products,
          count: Array.isArray(products) ? products.length : 0
        });

      case 'stats':
        // Get basic stats dari database
        const [productCount, orderCount, userCount] = await Promise.all([
          query({ query: 'SELECT COUNT(*) as count FROM products' }),
          query({ query: 'SELECT COUNT(*) as count FROM user_purchases' }),
          query({ query: 'SELECT COUNT(*) as count FROM admin_users' })
        ]);
        
        return NextResponse.json({
          success: true,
          type: 'stats',
          data: {
            products: Array.isArray(productCount) ? (productCount[0] as any)?.count : 0,
            orders: Array.isArray(orderCount) ? (orderCount[0] as any)?.count : 0,
            users: Array.isArray(userCount) ? (userCount[0] as any)?.count : 0
          }
        });

      default:
        return NextResponse.json({
          error: 'Invalid data type',
          supported_types: ['products', 'stats']
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API /data error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'test') {
      return NextResponse.json({
        success: true,
        message: 'Test endpoint works',
        received: data
      });
    }

    return NextResponse.json({
      error: 'Invalid request type'
    }, { status: 400 });
  } catch (error: any) {
    console.error('API /data POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
