const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function addSampleData() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        console.log('📋 Adding sample data...');
        
        // 1. Add sample products with ratings
        const sampleProducts = [
            {
                name: 'Hostinger Premium Hosting',
                provider: 'Hostinger',
                type: 'Web Hosting',
                tier: 'Premium',
                price: 2.99,
                original_price: 9.99,
                discount_percentage: 70,
                target_url: 'https://hostinger.com',
                rating: 4.8,
                num_reviews: 1247,
                is_featured: true,
                seo_description: 'Premium web hosting with 99.9% uptime guarantee'
            },
            {
                name: 'Namecheap Shared Hosting',
                provider: 'Namecheap',
                type: 'Web Hosting',
                tier: 'Starter',
                price: 1.99,
                original_price: 5.99,
                discount_percentage: 67,
                target_url: 'https://namecheap.com',
                rating: 4.6,
                num_reviews: 892,
                is_featured: true,
                seo_description: 'Affordable shared hosting for beginners'
            },
            {
                name: 'DigitalOcean VPS',
                provider: 'DigitalOcean',
                type: 'VPS',
                tier: 'Professional',
                price: 5.00,
                original_price: 12.00,
                discount_percentage: 58,
                target_url: 'https://digitalocean.com',
                rating: 4.9,
                num_reviews: 2156,
                is_featured: true,
                seo_description: 'High-performance VPS hosting for developers'
            }
        ];
        
        for (const product of sampleProducts) {
            await connection.execute(`
                INSERT INTO products (name, provider, type, tier, price, original_price, discount_percentage, target_url, rating, num_reviews, is_featured, seo_description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                product.name, product.provider, product.type, product.tier,
                product.price, product.original_price, product.discount_percentage,
                product.target_url, product.rating, product.num_reviews,
                product.is_featured, product.seo_description
            ]);
        }
        console.log('✅ Sample products added');
        
        // 2. Add sample testimonials
        const sampleTestimonials = [
            {
                name: 'Sarah Johnson',
                role: 'CEO @ TechStart',
                review: 'HostVoucher saved us thousands on hosting costs. The deals are incredible and the service is top-notch!',
                rating: 5,
                imageUrl: '/uploads/avatars/sarah.jpg'
            },
            {
                name: 'Mike Chen',
                role: 'Web Developer',
                review: 'Best platform for finding hosting deals. I recommend it to all my clients. Amazing discounts!',
                rating: 5,
                imageUrl: '/uploads/avatars/mike.jpg'
            },
            {
                name: 'Emily Rodriguez',
                role: 'Digital Marketer',
                review: 'The voucher codes actually work! Saved 70% on my hosting plan. Will definitely use again.',
                rating: 5,
                imageUrl: '/uploads/avatars/emily.jpg'
            }
        ];
        
        for (const testimonial of sampleTestimonials) {
            await connection.execute(`
                INSERT INTO testimonials (name, role, review, rating, imageUrl)
                VALUES (?, ?, ?, ?, ?)
            `, [testimonial.name, testimonial.role, testimonial.review, testimonial.rating, testimonial.imageUrl]);
        }
        console.log('✅ Sample testimonials added');
        
        // 3. Add sample ETH addresses to existing users
        const ethAddresses = [
            '0x742d35Cc6634C0532925a3b8D4C9db96C4b8d4e1',
            '0x8ba1f109551bD432803012645Hac136c0532925a',
            '0x1234567890123456789012345678901234567890'
        ];
        
        const [users] = await connection.execute('SELECT email FROM gamification_users LIMIT 3');
        
        for (let i = 0; i < users.length && i < ethAddresses.length; i++) {
            await connection.execute(`
                UPDATE gamification_users 
                SET eth_address = ?, is_eth_active = ?, updated_at = NOW() 
                WHERE email = ?
            `, [ethAddresses[i], i === 0, users[i].email]); // Only first user has active ETH
        }
        console.log('✅ Sample ETH addresses added');
        
        // 4. Add some click events
        const [productIds] = await connection.execute('SELECT id FROM products LIMIT 3');
        
        for (const product of productIds) {
            // Add random clicks for each product
            const clickCount = Math.floor(Math.random() * 50) + 10;
            for (let i = 0; i < clickCount; i++) {
                await connection.execute(`
                    INSERT INTO click_events (product_id, user_ip, user_agent, clicked_at)
                    VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))
                `, [
                    product.id,
                    `192.168.1.${Math.floor(Math.random() * 255)}`,
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    Math.floor(Math.random() * 30)
                ]);
            }
        }
        console.log('✅ Sample click events added');
        
        console.log('\n🎉 All sample data added successfully!');
        
        // Final count
        const tables = ['products', 'testimonials', 'gamification_users', 'click_events'];
        for (const table of tables) {
            const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`   📊 ${table}: ${rows[0].count} records`);
        }
        
    } catch (error) {
        console.error('❌ Error adding sample data:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the setup
addSampleData()
    .then(() => {
        console.log('\n✅ Sample data setup completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Sample data setup failed:', error);
        process.exit(1);
    });
