import { NextResponse } from 'next/server';
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

// Get user gamification data
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        
        const connection = await getDbConnection();
        
        try {
            if (email) {
                // Get specific user
                const [rows] = await connection.execute(
                    'SELECT * FROM gamification_users WHERE email = ?',
                    [email]
                );
                
                return NextResponse.json({
                    success: true,
                    user: (rows as any[])[0] || null
                });
            } else {
                // Get all users
                const [rows] = await connection.execute(
                    'SELECT * FROM gamification_users ORDER BY points DESC, last_active DESC'
                );
                
                return NextResponse.json({
                    success: true,
                    users: rows
                });
            }
            
        } finally {
            await connection.end();
        }
        
    } catch (error: any) {
        console.error('❌ Get gamification data error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch gamification data',
            details: error.message
        }, { status: 500 });
    }
}

// Update user gamification data
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, email, data } = body;
        
        const connection = await getDbConnection();
        
        try {
            switch (action) {
                case 'update_points':
                    const { points, reason } = data;
                    
                    // Check if user exists
                    const [existingUser] = await connection.execute(
                        'SELECT * FROM gamification_users WHERE email = ?',
                        [email]
                    );
                    
                    if ((existingUser as any[]).length === 0) {
                        return NextResponse.json({
                            success: false,
                            error: 'User not found'
                        }, { status: 404 });
                    }
                    
                    // Update points
                    await connection.execute(
                        'UPDATE gamification_users SET points = points + ?, updated_at = NOW() WHERE email = ?',
                        [points, email]
                    );
                    
                    // Log the adjustment
                    await connection.execute(
                        `INSERT INTO point_adjustments (user_email, points_change, reason, admin_action, created_at) 
                         VALUES (?, ?, ?, TRUE, NOW())`,
                        [email, points, reason]
                    );
                    
                    break;
                    
                case 'update_eth_address':
                    const { ethAddress, isActive } = data;
                    
                    // Validate ETH address format (basic validation)
                    if (ethAddress && !/^0x[a-fA-F0-9]{40}$/.test(ethAddress)) {
                        return NextResponse.json({
                            success: false,
                            error: 'Invalid ETH address format'
                        }, { status: 400 });
                    }
                    
                    await connection.execute(
                        'UPDATE gamification_users SET eth_address = ?, is_eth_active = ?, updated_at = NOW() WHERE email = ?',
                        [ethAddress, isActive, email]
                    );
                    
                    break;
                    
                case 'create_user':
                    const { fullName, initialPoints = 0 } = data;
                    
                    // Check if user already exists
                    const [existingUserCheck] = await connection.execute(
                        'SELECT id FROM gamification_users WHERE email = ?',
                        [email]
                    );
                    
                    if ((existingUserCheck as any[]).length > 0) {
                        return NextResponse.json({
                            success: false,
                            error: 'User already exists'
                        }, { status: 409 });
                    }
                    
                    // Create new user
                    await connection.execute(
                        `INSERT INTO gamification_users 
                        (email, full_name, points, level, badges, achievements, total_clicks, last_active, created_at, updated_at) 
                        VALUES (?, ?, ?, 1, '[]', '[]', 0, NOW(), NOW(), NOW())`,
                        [email, fullName, initialPoints]
                    );
                    
                    break;
                    
                case 'toggle_eth_status':
                    await connection.execute(
                        'UPDATE gamification_users SET is_eth_active = NOT is_eth_active, updated_at = NOW() WHERE email = ?',
                        [email]
                    );
                    
                    break;
                    
                default:
                    return NextResponse.json({
                        success: false,
                        error: 'Invalid action'
                    }, { status: 400 });
            }
            
            return NextResponse.json({
                success: true,
                message: 'Gamification data updated successfully'
            });
            
        } finally {
            await connection.end();
        }
        
    } catch (error: any) {
        console.error('❌ Update gamification data error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update gamification data',
            details: error.message
        }, { status: 500 });
    }
}

// Delete user
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        
        if (!email) {
            return NextResponse.json({
                success: false,
                error: 'Email is required'
            }, { status: 400 });
        }
        
        const connection = await getDbConnection();
        
        try {
            await connection.execute(
                'DELETE FROM gamification_users WHERE email = ?',
                [email]
            );
            
            return NextResponse.json({
                success: true,
                message: 'User deleted successfully'
            });
            
        } finally {
            await connection.end();
        }
        
    } catch (error: any) {
        console.error('❌ Delete user error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete user',
            details: error.message
        }, { status: 500 });
    }
}
