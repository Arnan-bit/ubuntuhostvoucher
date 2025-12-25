// Middleware: Verify JWT token for protected API routes
// Validates JWT signature and expiry, extracts user info

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { jwt as jwtConfig } from '@/config/environment';

export interface JwtPayload {
    userId: string;
    email: string;
    firebaseUid?: string;
    role?: string;
    iat?: number;
    exp?: number;
}

export function verifyJwt(token: string): JwtPayload | null {
    try {
        // ✅ Use JWT secret from environment.ts config (loaded from .env)
        const secret = jwtConfig.secret;
        if (!secret) {
            throw new Error('❌ JWT_SECRET not configured in .env - Add: JWT_SECRET=your-long-secret-key-min-32-chars');
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error: any) {
        console.error('[verifyJwt] Error:', error.message);
        return null;
    }
}

export function withAuth(handler: (req: NextRequest, payload: JwtPayload) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        try {
            // Get Authorization header
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return NextResponse.json(
                    { error: 'No authorization header' },
                    { status: 401 }
                );
            }

            // Extract Bearer token
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
                return NextResponse.json(
                    { error: 'Invalid authorization header format' },
                    { status: 401 }
                );
            }

            const token = parts[1];

            // Verify JWT
            const payload = verifyJwt(token);
            if (!payload) {
                return NextResponse.json(
                    { error: 'Invalid or expired token' },
                    { status: 401 }
                );
            }

            // Call handler with verified payload
            return handler(req, payload);
        } catch (error: any) {
            console.error('[withAuth] Error:', error);
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: 500 }
            );
        }
    };
}
