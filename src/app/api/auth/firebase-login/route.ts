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

        // Find or create admin user in MySQL
        const user = await getOrCreateAdminByEmail(email, firebaseUid);

        if (!user) {
            return NextResponse.json(
                { error: 'Email not authorized as admin' },
                { status: 403 }
            );
        }

        // Generate server JWT (for MySQL API access)
        // ✅ Use JWT config loaded from environment.ts (from .env file)
        if (!jwtConfig.secret) {
            return NextResponse.json(
                { error: 'Server misconfigured: JWT_SECRET not configured in .env' },
                { status: 500 }
            );
        }

        const payload = {
            userId: user.id,
            email: user.email,
            firebaseUid: firebaseUid,
            role: user.role || 'admin'
        };

        // ✅ Sign with secret from environment.ts config
        const signOptions: SignOptions = {
            expiresIn: '24h'
        };
        
        const token = jwt.sign(payload, jwtConfig.secret as string, signOptions);

        console.log(`[firebase-login] User ${email} logged in successfully`);

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || email.split('@')[0]
            }
        });
    } catch (error: any) {
        console.error('[firebase-login] Error:', error.message);

        // Distinguish between Firebase errors and other errors
        if (error.code?.startsWith('auth/')) {
            return NextResponse.json(
                { error: 'Invalid or expired Firebase token' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Authentication failed' },
            { status: 500 }
        );
    }
}
