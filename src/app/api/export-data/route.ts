import { executeQuery } from '@/lib/db-connection';
import { NextResponse } from 'next/server';

/**
 * Data Export API
 * GET /api/export-data?table=products&format=json
 * 
 * Export data untuk marketing, sales, leads tracking
 * Supported formats: json, csv
 * Supported tables: products, orders, customers, admin_users
 */

const ALLOWED_TABLES = ['products', 'orders', 'customers', 'admin_users', 'blog_posts', 'settings'];

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Escape values untuk CSV
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table') || 'products';
    const format = url.searchParams.get('format') || 'json';
    const limit = parseInt(url.searchParams.get('limit') || '10000', 10);

    // Validate table name
    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json(
        {
          error: 'Invalid table',
          allowed_tables: ALLOWED_TABLES
        },
        { status: 400 }
      );
    }

    // Validate format
    if (!['json', 'csv'].includes(format)) {
      return NextResponse.json(
        {
          error: 'Invalid format. Use json or csv'
        },
        { status: 400 }
      );
    }

    console.log(`[Export] Fetching data from ${table} (limit: ${limit})`);

    // Fetch data
    const data = await executeQuery(
      `SELECT * FROM ${table} LIMIT ?`,
      [limit]
    );

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          table,
          count: 0,
          data: [],
          message: 'No data found',
          exported_at: new Date().toISOString()
        },
        { status: 200 }
      );
    }

    // Return as JSON
    if (format === 'json') {
      return NextResponse.json(
        {
          table,
          count: data.length,
          data,
          exported_at: new Date().toISOString()
        },
        { status: 200 }
      );
    }

    // Return as CSV
    const csv = convertToCSV(data);
    const filename = `${table}_${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error: any) {
    console.error('[Export] Error:', error);
    return NextResponse.json(
      {
        error: 'Export failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * Usage Examples:
 * 
 * 1. Get products as JSON:
 *    GET /api/export-data?table=products&format=json
 * 
 * 2. Download products as CSV (for Excel):
 *    GET /api/export-data?table=products&format=csv
 * 
 * 3. Export customers (for CRM/marketing):
 *    GET /api/export-data?table=customers&format=csv
 * 
 * 4. Export orders (for sales tracking):
 *    GET /api/export-data?table=orders&format=json
 */
