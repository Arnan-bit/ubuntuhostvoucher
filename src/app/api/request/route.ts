import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function getDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

// Handle request submission
export async function POST(request: Request) {
    console.log('🔄 Request submission API called');

    try {
        const formData = await request.formData();
        
        // Extract form fields
        const fullName = formData.get('fullName') as string;
        const whatsappNumber = formData.get('whatsappNumber') as string;
        const provider = formData.get('provider') as string;
        const domain = formData.get('domain') as string;
        const purchaseDate = formData.get('purchaseDate') as string;
        const userEmail = formData.get('userEmail') as string;
        const screenshot = formData.get('screenshot') as File;

        console.log('📝 Form data received:', {
            fullName,
            whatsappNumber,
            provider,
            domain,
            purchaseDate,
            userEmail,
            hasScreenshot: !!screenshot
        });

        // Validate required fields
        if (!fullName || !whatsappNumber || !provider || !purchaseDate || !userEmail || !screenshot) {
            return NextResponse.json({
                success: false,
                error: 'All required fields must be filled'
            }, { status: 400 });
        }

        // Validate file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(screenshot.type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            }, { status: 400 });
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (screenshot.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'File too large. Maximum size is 10MB.'
            }, { status: 400 });
        }

        // Generate unique filename for screenshot
        const timestamp = Date.now();
        const originalName = screenshot.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filename = `${timestamp}_${originalName}`;

        // Convert file to buffer
        const arrayBuffer = await screenshot.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Define upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'requests');
        
        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const screenshotUrl = `/uploads/requests/${filename}`;

        // Save to database
        const connection = await getDbConnection();
        
        try {
            // Insert request into database
            const [result] = await connection.execute(
                `INSERT INTO purchase_requests 
                (full_name, whatsapp_number, provider, domain, purchase_date, user_email, screenshot_url, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
                [fullName, whatsappNumber, provider, domain, purchaseDate, userEmail, screenshotUrl]
            );

            // Award points to user (50,000,000 points)
            const pointsToAward = 50000000;
            
            // Check if user exists in gamification table
            const [existingUser] = await connection.execute(
                'SELECT * FROM user_gamification WHERE email = ?',
                [userEmail]
            );

            if ((existingUser as any[]).length > 0) {
                // Update existing user points
                await connection.execute(
                    'UPDATE user_gamification SET points = points + ?, updated_at = NOW() WHERE email = ?',
                    [pointsToAward, userEmail]
                );
            } else {
                // Create new user gamification record
                await connection.execute(
                    `INSERT INTO user_gamification 
                    (email, full_name, points, level, badges, achievements, created_at, updated_at) 
                    VALUES (?, ?, ?, 1, '[]', '[]', NOW(), NOW())`,
                    [userEmail, fullName, pointsToAward]
                );
            }

            console.log('✅ Request saved successfully with ID:', (result as any).insertId);
            console.log('🎯 Points awarded:', pointsToAward);

            return NextResponse.json({
                success: true,
                message: 'Request submitted successfully! You have been awarded 50,000,000 points.',
                requestId: (result as any).insertId,
                pointsAwarded: pointsToAward,
                screenshotUrl: screenshotUrl
            });

        } finally {
            await connection.end();
        }

    } catch (error: any) {
        console.error('❌ Request submission error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to submit request',
            details: error.message
        }, { status: 500 });
    }
}

// Get all requests (for admin)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'all';
        
        const connection = await getDbConnection();
        
        try {
            let query = 'SELECT * FROM purchase_requests ORDER BY created_at DESC';
            let params: any[] = [];
            
            if (status !== 'all') {
                query = 'SELECT * FROM purchase_requests WHERE status = ? ORDER BY created_at DESC';
                params = [status];
            }
            
            const [rows] = await connection.execute(query, params);
            
            return NextResponse.json({
                success: true,
                requests: rows
            });
            
        } finally {
            await connection.end();
        }
        
    } catch (error: any) {
        console.error('❌ Get requests error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch requests',
            details: error.message
        }, { status: 500 });
    }
}
