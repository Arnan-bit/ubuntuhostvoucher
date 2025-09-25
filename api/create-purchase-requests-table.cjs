const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function createPurchaseRequestsTable() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        // Create purchase_requests table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS purchase_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                whatsapp_number VARCHAR(50) NOT NULL,
                provider VARCHAR(100) NOT NULL,
                domain VARCHAR(255),
                purchase_date DATE NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                screenshot_url VARCHAR(500) NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                admin_notes TEXT,
                points_awarded INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (user_email),
                INDEX idx_status (status),
                INDEX idx_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await connection.execute(createTableQuery);
        console.log('✅ Purchase requests table created successfully');
        
        // Check if table exists and has data
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM purchase_requests');
        console.log(`📊 Current purchase requests count: ${rows[0].count}`);
        
        // Create uploads directory if it doesn't exist
        const fs = require('fs');
        const path = require('path');
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'requests');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('📁 Created uploads/requests directory');
        }
        
        console.log('🎉 Purchase requests system setup complete!');
        
    } catch (error) {
        console.error('❌ Error setting up purchase requests:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the setup
createPurchaseRequestsTable()
    .then(() => {
        console.log('✅ Setup completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    });
