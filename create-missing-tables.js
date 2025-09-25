const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
};

async function createMissingTables() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        // Create nft_redemption_requests table
        const createNftRedemptionTable = `
            CREATE TABLE IF NOT EXISTS nft_redemption_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255),
                nft_id VARCHAR(255),
                request_type VARCHAR(100),
                status VARCHAR(50) DEFAULT 'pending',
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

        await connection.execute(createNftRedemptionTable);
        console.log('✓ nft_redemption_requests table created/verified');

        // Create visitor_analytics table if not exists
        const createVisitorAnalyticsTable = `
            CREATE TABLE IF NOT EXISTS visitor_analytics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                visitor_id VARCHAR(255),
                page_url VARCHAR(500),
                referrer VARCHAR(500),
                user_agent TEXT,
                ip_address VARCHAR(45),
                country VARCHAR(100),
                city VARCHAR(100),
                device_type VARCHAR(50),
                browser VARCHAR(100),
                visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.execute(createVisitorAnalyticsTable);
        console.log('✓ visitor_analytics table created/verified');

        // Create realtime_visitors table if not exists
        const createRealtimeVisitorsTable = `
            CREATE TABLE IF NOT EXISTS realtime_visitors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(255) UNIQUE,
                page_url VARCHAR(500),
                user_agent TEXT,
                ip_address VARCHAR(45),
                country VARCHAR(100),
                city VARCHAR(100),
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.execute(createRealtimeVisitorsTable);
        console.log('✓ realtime_visitors table created/verified');

        // Create newsletter_subscriptions table if not exists
        const createNewsletterTable = `
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                unsubscribed_at TIMESTAMP NULL
            )
        `;

        await connection.execute(createNewsletterTable);
        console.log('✓ newsletter_subscriptions table created/verified');

        console.log('\n✅ All missing tables have been created successfully!');

    } catch (error) {
        console.error('Error creating missing tables:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the script
createMissingTables();
