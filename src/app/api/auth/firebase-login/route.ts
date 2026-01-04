// API Route: POST /api/auth/firebase-login
// ❌ DISABLED - Firebase authentication not used
// Application uses MySQL-only authentication instead
// This endpoint returns 503 Service Unavailable

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    return NextResponse.json(
        { 
            error: 'Firebase authentication is disabled',
            message: 'This application uses MySQL-only authentication. Firebase endpoints are not available.',
            status: 'disabled'
        },
        { status: 503 }
    );
}

