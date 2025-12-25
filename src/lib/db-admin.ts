// Database utility: Get or create admin user by email
// Used by /api/auth/firebase-login to lookup admins

import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

const AUTHORIZED_ADMIN_EMAILS = [
    'hostvouchercom@gmail.com',
    'garudandne87@gmail.com'
];

export async function getOrCreateAdminByEmail(email: string, firebaseUid?: string) {
    // Check if email is authorized
    if (!AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase())) {
        console.warn(`[db-admin] Email not authorized: ${email}`);
        return null;
    }

    try {
        // Find existing admin
        const result = await query(
            'SELECT id, email, name, role, firebase_uid FROM admin_users WHERE email = ?',
            [email]
        );

        if (result && result.length > 0) {
            const admin = result[0];
            // Update firebase_uid if provided and not set
            if (firebaseUid && !admin.firebase_uid) {
                await query(
                    'UPDATE admin_users SET firebase_uid = ? WHERE id = ?',
                    [firebaseUid, admin.id]
                );
            }
            return admin;
        }

        // Create new admin if doesn't exist
        const adminId = randomUUID();
        const timestamp = new Date();

        await query(
            'INSERT INTO admin_users (id, email, name, firebase_uid, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [adminId, email, email.split('@')[0], firebaseUid || null, timestamp, timestamp]
        );

        console.log(`[db-admin] Created new admin: ${email}`);

        return {
            id: adminId,
            email: email,
            name: email.split('@')[0],
            role: 'admin',
            firebase_uid: firebaseUid || null
        };
    } catch (error) {
        console.error('[db-admin] Error getting/creating admin:', error);
        throw error;
    }
}

export async function getAdminByEmail(email: string) {
    try {
        const result = await query(
            'SELECT id, email, name, role FROM admin_users WHERE email = ?',
            [email]
        );
        return result && result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('[db-admin] Error getting admin:', error);
        throw error;
    }
}

export async function getAdminById(id: string) {
    try {
        const result = await query(
            'SELECT id, email, name, role FROM admin_users WHERE id = ?',
            [id]
        );
        return result && result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('[db-admin] Error getting admin by ID:', error);
        throw error;
    }
}
