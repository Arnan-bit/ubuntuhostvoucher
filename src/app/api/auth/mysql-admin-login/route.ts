import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { env } from '@/config/environment';

// Authorized admin emails
const AUTHORIZED_EMAILS = [
  "hostvouchercom@gmail.com",
  "garudandne87@gmail.com"
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if email is authorized
    if (!AUTHORIZED_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: 'This email is not authorized for admin access' },
        { status: 403 }
      );
    }

    // Check if admin user exists in database
    const adminUsers = await query({
      query: 'SELECT id, email, password_hash, is_active FROM admin_users WHERE email = ?',
      values: [email]
    }) as any[];

    if (adminUsers.length === 0) {
      // Create default admin user if not exists
      const hashedPassword = await bcrypt.hash(password, 12);

      await query({
        query: 'INSERT INTO admin_users (email, password_hash, is_active, created_at) VALUES (?, ?, 1, NOW())',
        values: [email, hashedPassword]
      });

      console.log(`✅ Created new admin user: ${email}`);
    } else {
      // Verify password for existing user
      const adminUser = adminUsers[0];

      if (!adminUser.is_active) {
        return NextResponse.json(
          { error: 'Admin account is disabled' },
          { status: 403 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    // Generate JWT token
    const jwtSecret = env.jwt.secret || process.env.JWT_SECRET || 'fallback-secret-key';
    const jwtExpiresIn = env.jwt.expiresIn || '24h';

    const token = jwt.sign(
      {
        email: email,
        role: 'admin',
        type: 'mysql-admin'
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    // Update last login
    await query({
      query: 'UPDATE admin_users SET last_login = NOW() WHERE email = ?',
      values: [email]
    });

    console.log(`✅ Admin login successful: ${email}`);

    return NextResponse.json({
      success: true,
      token: token,
      email: email,
      message: 'Login successful'
    });

  } catch (error: any) {
    console.error('❌ Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create admin_users table if it doesn't exist
export async function GET() {
  try {
    await query({
      query: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP NULL,
          INDEX idx_email (email),
          INDEX idx_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Admin users table created/verified'
    });
  } catch (error: any) {
    console.error('❌ Error creating admin table:', error);
    return NextResponse.json(
      { error: 'Failed to create admin table' },
      { status: 500 }
    );
  }
}
