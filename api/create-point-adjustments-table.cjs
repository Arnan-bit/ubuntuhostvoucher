const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function createPointAdjustmentsTable() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        // Create point_adjustments table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS point_adjustments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                points_change BIGINT NOT NULL,
                reason TEXT,
                admin_action BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_email (user_email),
                INDEX idx_created_at (created_at),
                FOREIGN KEY (user_email) REFERENCES gamification_users(email) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await connection.execute(createTableQuery);
        console.log('✅ Point adjustments table created successfully');
        
        // Check if table exists and has data
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM point_adjustments');
        console.log(`📊 Current point adjustments count: ${rows[0].count}`);
        
        console.log('🎉 Point adjustments system setup complete!');
        
    } catch (error) {
        console.error('❌ Error setting up point adjustments:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the setup
createPointAdjustmentsTable()
    .then(() => {
        console.log('✅ Setup completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    });
