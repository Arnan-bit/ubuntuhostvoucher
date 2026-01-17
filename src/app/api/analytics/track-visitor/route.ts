import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

/**
 * API endpoint: POST /api/analytics/track-visitor
 * Track visitor analytics untuk realtime_visitors table
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      visitor_id,
      page_path = '/',
      referrer = null,
      user_agent = null,
      ip_address = null,
      device_type = 'desktop',
      session_id = null
    } = body;

    // If visitor_id not provided by client, generate one server-side
    const visitorId = visitor_id || randomUUID();

    try {
      // Insert atau update visitor analytics
      const result = await query({
        query: `
          INSERT INTO realtime_visitors (
            visitor_id, page_path, referrer, user_agent, 
            ip_address, device_type, session_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            last_activity = NOW(),
            page_path = VALUES(page_path),
            referrer = COALESCE(referrer, VALUES(referrer))
        `,
        values: [
          visitorId,
          page_path,
          referrer,
          user_agent,
          ip_address,
          device_type,
          session_id
        ]
      });

      return NextResponse.json({
        success: true,
        message: 'Visitor tracked successfully',
        visitor_id: visitorId
      }, { status: 200 });

    } catch (dbError: any) {
      // Jika table tidak ada, log error tapi jangan crash
      if (dbError.message.includes('realtime_visitors')) {
        console.warn('realtime_visitors table tidak ada, tracking disabled');
        return NextResponse.json({
          success: true,
          message: 'Visitor tracking not available (table not found)',
          visitor_id: visitor_id
        }, { status: 200 });
      }
      throw dbError;
    }

  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to track visitor',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get analytics summary
    const result = await query({
      query: 'SELECT COUNT(*) as total_visitors FROM realtime_visitors'
    });

    const total = Array.isArray(result) ? (result[0] as any)?.total_visitors : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        total_visitors: total
      }
    });
  } catch (error: any) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({
      success: true,
      analytics: {
        total_visitors: 0
      }
    }, { status: 200 });
  }
}
