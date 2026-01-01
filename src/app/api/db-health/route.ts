import { testDatabaseConnection, getDatabaseStatus } from '@/lib/db-connection';
import { NextResponse } from 'next/server';

/**
 * Database Health Check API
 * GET /api/db-health
 * 
 * Returns database connection status
 */
export async function GET(request: Request) {
  try {
    const status = await getDatabaseStatus();
    
    if (status.status === 'connected') {
      return NextResponse.json(
        {
          status: 'ok',
          message: 'Database connection successful',
          details: status
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          error: status.error,
          details: status
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error.message
      },
      { status: 500 }
    );
  }
}
