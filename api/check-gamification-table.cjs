const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function checkGamificationTable() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        // Check if user_gamification table exists
        const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('user_gamification', 'gamification_users')
        `, [dbConfig.database]);
        
        console.log('📊 Existing gamification tables:', tables);
        
        // Create user_gamification table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS user_gamification (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                full_name VARCHAR(255),
                eth_address VARCHAR(42),
                points BIGINT DEFAULT 0,
                level INT DEFAULT 1,
                badges JSON,
                achievements JSON,
                total_clicks INT DEFAULT 0,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_eth_active BOOLEAN DEFAULT FALSE,
                INDEX idx_email (email),
                INDEX idx_points (points),
                INDEX idx_level (level),
                INDEX idx_eth_address (eth_address)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await connection.execute(createTableQuery);
        console.log('✅ user_gamification table created/verified successfully');
        
        // Also create gamification_users as alias/view for compatibility
        const createAliasQuery = `
            CREATE OR REPLACE VIEW gamification_users AS 
            SELECT 
                id,
                email,
                full_name,
                eth_address,
                points,
                level,
                badges,
                achievements,
                total_clicks,
                last_active,
                created_at,
                updated_at,
                is_eth_active
            FROM user_gamification;
        `;
        
        await connection.execute(createAliasQuery);
        console.log('✅ gamification_users view created successfully');
        
        // Check current data
        const [userData] = await connection.execute('SELECT COUNT(*) as count FROM user_gamification');
        console.log(`📊 Current users in gamification: ${userData[0].count}`);
        
        // Show sample data if exists
        const [sampleData] = await connection.execute('SELECT email, points, level, is_eth_active FROM user_gamification LIMIT 5');
        if (sampleData.length > 0) {
            console.log('📋 Sample user data:');
            sampleData.forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.email} - ${user.points} points (Level ${user.level}) - ETH: ${user.is_eth_active ? 'Active' : 'Inactive'}`);
            });
        }
        
        console.log('🎉 Gamification system verified!');
        
    } catch (error) {
        console.error('❌ Error checking gamification system:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the check
checkGamificationTable()
    .then(() => {
        console.log('✅ Check completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Check failed:', error);
        process.exit(1);
    });
