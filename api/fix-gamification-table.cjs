const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function fixGamificationTable() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        // Check current structure of gamification_users table
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'gamification_users'
            ORDER BY ORDINAL_POSITION
        `, [dbConfig.database]);
        
        console.log('📊 Current gamification_users table structure:');
        columns.forEach((col) => {
            console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
        });
        
        // Add missing columns if they don't exist
        const columnNames = columns.map(col => col.COLUMN_NAME);
        
        const requiredColumns = [
            { name: 'eth_address', type: 'VARCHAR(42)', nullable: true },
            { name: 'is_eth_active', type: 'BOOLEAN', default: 'FALSE' },
            { name: 'full_name', type: 'VARCHAR(255)', nullable: true },
            { name: 'level', type: 'INT', default: '1' },
            { name: 'badges', type: 'JSON', nullable: true },
            { name: 'achievements', type: 'JSON', nullable: true },
            { name: 'total_clicks', type: 'INT', default: '0' },
            { name: 'last_active', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
            { name: 'updated_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
        ];
        
        for (const col of requiredColumns) {
            if (!columnNames.includes(col.name)) {
                let alterQuery = `ALTER TABLE gamification_users ADD COLUMN ${col.name} ${col.type}`;
                if (col.default) {
                    alterQuery += ` DEFAULT ${col.default}`;
                }
                if (col.nullable === false) {
                    alterQuery += ` NOT NULL`;
                }
                
                try {
                    await connection.execute(alterQuery);
                    console.log(`✅ Added column: ${col.name}`);
                } catch (error) {
                    console.log(`⚠️ Column ${col.name} might already exist or error:`, error.message);
                }
            }
        }
        
        // Add indexes if they don't exist
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_email ON gamification_users(email)',
            'CREATE INDEX IF NOT EXISTS idx_points ON gamification_users(points)',
            'CREATE INDEX IF NOT EXISTS idx_eth_address ON gamification_users(eth_address)',
            'CREATE INDEX IF NOT EXISTS idx_level ON gamification_users(level)'
        ];
        
        for (const indexQuery of indexes) {
            try {
                await connection.execute(indexQuery);
                console.log('✅ Index created/verified');
            } catch (error) {
                console.log('⚠️ Index might already exist:', error.message);
            }
        }
        
        // Check current data
        const [userData] = await connection.execute('SELECT COUNT(*) as count FROM gamification_users');
        console.log(`📊 Current users in gamification: ${userData[0].count}`);
        
        // Show sample data if exists
        const [sampleData] = await connection.execute('SELECT email, points, level, eth_address, is_eth_active FROM gamification_users LIMIT 5');
        if (sampleData.length > 0) {
            console.log('📋 Sample user data:');
            sampleData.forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.email} - ${user.points} points (Level ${user.level}) - ETH: ${user.eth_address || 'None'} (${user.is_eth_active ? 'Active' : 'Inactive'})`);
            });
        }
        
        console.log('🎉 Gamification table structure verified and fixed!');
        
    } catch (error) {
        console.error('❌ Error fixing gamification table:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the fix
fixGamificationTable()
    .then(() => {
        console.log('✅ Fix completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    });
