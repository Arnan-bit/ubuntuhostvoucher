const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function createAllMissingTables() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        console.log('📋 Creating all missing tables...');
        
        // 1. Products table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                provider VARCHAR(100),
                type VARCHAR(50),
                tier VARCHAR(50),
                price DECIMAL(10,2),
                original_price DECIMAL(10,2),
                discount_percentage INT,
                target_url TEXT,
                image_url VARCHAR(500),
                brand_logo_url VARCHAR(500),
                brand_text VARCHAR(100),
                seo_description TEXT,
                code VARCHAR(100),
                rating DECIMAL(3,2),
                num_reviews INT DEFAULT 0,
                is_featured BOOLEAN DEFAULT FALSE,
                show_on_landing BOOLEAN DEFAULT TRUE,
                show_on_home BOOLEAN DEFAULT TRUE,
                display_style ENUM('vertical', 'horizontal') DEFAULT 'vertical',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_type (type),
                INDEX idx_featured (is_featured),
                INDEX idx_rating (rating)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Products table created');
        
        // 2. Testimonials table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                review TEXT NOT NULL,
                rating INT DEFAULT 5,
                imageUrl VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Testimonials table created');
        
        // 3. Click events table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS click_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT,
                user_ip VARCHAR(45),
                user_agent TEXT,
                referrer VARCHAR(500),
                clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_product_id (product_id),
                INDEX idx_clicked_at (clicked_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Click events table created');
        
        // 4. Submitted vouchers table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS submitted_vouchers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                provider VARCHAR(100) NOT NULL,
                voucher_code VARCHAR(100) NOT NULL,
                description TEXT,
                link VARCHAR(500),
                submitted_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Submitted vouchers table created');
        
        // 5. Deal requests table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS deal_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                provider_name VARCHAR(100) NOT NULL,
                service_type VARCHAR(50),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Deal requests table created');
        
        // 6. NFT showcase table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS nft_showcase (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                nft_image_url VARCHAR(500),
                marketplace_link VARCHAR(500),
                collection VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ NFT showcase table created');
        
        // 7. HostVoucher testimonials table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS hostvoucher_testimonials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                rating INT DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ HostVoucher testimonials table created');
        
        // 8. Site settings table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS site_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                site_name VARCHAR(255) DEFAULT 'HostVoucher',
                site_description TEXT,
                site_logo VARCHAR(500),
                site_favicon VARCHAR(500),
                primary_color VARCHAR(7) DEFAULT '#f97316',
                secondary_color VARCHAR(7) DEFAULT '#ea580c',
                site_appearance JSON,
                page_banners JSON,
                popup_modal JSON,
                pagination_settings JSON,
                catalog_number_prefix VARCHAR(10) DEFAULT 'HV',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Site settings table created');
        
        // Insert default site settings if table is empty
        const [settingsCount] = await connection.execute('SELECT COUNT(*) as count FROM site_settings');
        if (settingsCount[0].count === 0) {
            await connection.execute(`
                INSERT INTO site_settings (site_name, site_description, site_appearance, page_banners, popup_modal, pagination_settings) 
                VALUES (
                    'HostVoucher', 
                    'Your #1 source for exclusive tech & digital service deals!',
                    '{}',
                    '{}',
                    '{}',
                    '{"itemsPerPage": 12, "showPagination": true}'
                )
            `);
            console.log('✅ Default site settings inserted');
        }
        
        console.log('\n🎉 All missing tables created successfully!');
        
        // Final verification
        console.log('\n🔍 Final verification...');
        const tables = ['products', 'testimonials', 'gamification_users', 'purchase_requests', 'point_adjustments', 'click_events', 'submitted_vouchers', 'deal_requests', 'nft_showcase', 'hostvoucher_testimonials', 'site_settings'];
        
        for (const table of tables) {
            const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`   ✅ ${table}: ${rows[0].count} records`);
        }
        
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the setup
createAllMissingTables()
    .then(() => {
        console.log('\n✅ All tables setup completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Tables setup failed:', error);
        process.exit(1);
    });
