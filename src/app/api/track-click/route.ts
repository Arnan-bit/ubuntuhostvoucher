import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const { productId, productName, productType } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Get client IP and user agent
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const referrer = request.headers.get('referer') || 'direct';

        // Insert click event
        const clickEventId = uuidv4();
        await query({
            query: `INSERT INTO click_events (id, product_id, product_name, product_type, ip_address, user_agent, referrer) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
            values: [clickEventId, productId, productName, productType, ip, userAgent, referrer]
        });

        // Update product click count
        await query({
            query: 'UPDATE products SET clicks = clicks + 1 WHERE id = ?',
            values: [productId]
        });

        return NextResponse.json({ success: true, clickId: clickEventId });
    } catch (error: any) {
        console.error('Error tracking click:', error);
        return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
    }
}
