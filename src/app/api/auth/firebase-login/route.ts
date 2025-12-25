// API Route: POST /api/auth/firebase-login
// Verifikasi Firebase ID Token -> Issue JWT untuk MySQL access
// Hybrid flow: Firebase Auth + Server JWT
//
// 🎯 IMPORTANT: All credentials loaded from src/config/environment.ts
// which imports from .env.local - DO NOT hardcode values here

import admin from 'firebase-admin';
import jwt, { SignOptions } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { getOrCreateAdminByEmail } from '@/lib/db-admin';
import { firebase as firebaseConfig, jwt as jwtConfig } from '@/config/environment';

// Initialize Firebase Admin (once)
if (!admin.apps.length) {
    try {
        const getServiceAccount = typeof firebaseConfig.getFirebaseServiceAccount === 'function'
            ? firebaseConfig.getFirebaseServiceAccount
            : null;
        
        if (!getServiceAccount) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON not properly configured in .env');
        }
        
        const serviceAccount = getServiceAccount();
        if (!serviceAccount) {
            throw new Error('Could not parse FIREBASE_SERVICE_ACCOUNT_JSON from .env');
        }
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { idToken } = body;

        if (!idToken) {
            return NextResponse.json(
                { error: 'Missing idToken' },
                { status: 400 }
            );
        }

        // Verify Firebase ID Token
        const decoded = await admin.auth().verifyIdToken(idToken);
        const email = decoded.email;
        const firebaseUid = decoded.uid;

        if (!email) {
            return NextResponse.json(
                { error: 'No email in Firebase token' },
                { status: 401 }
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
