const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function addWebHostingData() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        console.log('\n🚀 ADDING COMPREHENSIVE WEB HOSTING DATA');
        console.log('=======================================');

        // Get current max catalog number
        const [maxCatalogRows] = await connection.execute('SELECT MAX(catalog_number) as max_num FROM products');
        let nextCatalogNumber = (maxCatalogRows[0].max_num || 1000) + 1;

        const webHostingProducts = [
            // Personal Tier
            {
                name: 'Shared Hosting Starter',
                title: 'Perfect for Small Websites & Blogs',
                provider: 'HostGator',
                type: 'Web Hosting',
                tier: 'Personal',
                price: 2.75,
                original_price: 10.95,
                discount: '75% OFF',
                features: JSON.stringify(['1 Website', '10 GB Storage', 'Free SSL Certificate', 'Unmetered Bandwidth', '24/7 Support', 'cPanel Control Panel']),
                link: 'https://hostgator.com/shared-hosting',
                target_url: 'https://hostgator.com/shared-hosting',
                image: 'https://i.ibb.co/qkjH8vL/hostgator-shared.jpg',
                provider_logo: 'https://i.ibb.co/9yKvpQs/hostgator-logo.png',
                rating: 4.5,
                num_reviews: 1250,
                code: 'SAVE75NOW',
                color: 'blue',
                button_color: 'orange'
            },
            {
                name: 'Basic Web Hosting',
                title: 'Reliable Hosting for Personal Sites',
                provider: 'Bluehost',
                type: 'Web Hosting',
                tier: 'Personal',
                price: 3.95,
                original_price: 9.99,
                discount: '60% OFF',
                features: JSON.stringify(['1 Website', '50 GB Storage', 'Free Domain for 1 Year', 'Free SSL Certificate', 'WordPress Optimized', '24/7 Chat Support']),
                link: 'https://bluehost.com/hosting/shared',
                target_url: 'https://bluehost.com/hosting/shared',
                image: 'https://i.ibb.co/2qvH8mL/bluehost-basic.jpg',
                provider_logo: 'https://i.ibb.co/8xKvpQs/bluehost-logo.png',
                rating: 4.7,
                num_reviews: 2100,
                code: 'BLUE60OFF',
                color: 'blue',
                button_color: 'blue'
            },
            {
                name: 'Personal Hosting Plan',
                title: 'Fast & Secure Personal Hosting',
                provider: 'SiteGround',
                type: 'Web Hosting',
                tier: 'Personal',
                price: 4.99,
                original_price: 14.99,
                discount: '67% OFF',
                features: JSON.stringify(['1 Website', '10 GB Storage', 'Free SSL & CDN', 'Daily Backups', 'Email Accounts', 'WordPress Staging']),
                link: 'https://siteground.com/web-hosting',
                target_url: 'https://siteground.com/web-hosting',
                image: 'https://i.ibb.co/3qvH8mL/siteground-personal.jpg',
                provider_logo: 'https://i.ibb.co/7xKvpQs/siteground-logo.png',
                rating: 4.8,
                num_reviews: 3500,
                code: 'SITE67OFF',
                color: 'green',
                button_color: 'green'
            },

            // Business Tier
            {
                name: 'Business Hosting Pro',
                title: 'Powerful Hosting for Growing Businesses',
                provider: 'HostGator',
                type: 'Web Hosting',
                tier: 'Business',
                price: 5.95,
                original_price: 16.95,
                discount: '65% OFF',
                features: JSON.stringify(['Unlimited Websites', 'Unlimited Storage', 'Free SSL Certificate', 'Free Domain', 'Marketing Credits $200', 'SEO Tools', 'Advanced Analytics']),
                link: 'https://hostgator.com/business-hosting',
                target_url: 'https://hostgator.com/business-hosting',
                image: 'https://i.ibb.co/4qvH8mL/hostgator-business.jpg',
                provider_logo: 'https://i.ibb.co/9yKvpQs/hostgator-logo.png',
                rating: 4.6,
                num_reviews: 1800,
                code: 'BIZPRO65',
                color: 'orange',
                button_color: 'orange'
            },
            {
                name: 'Choice Plus Hosting',
                title: 'Complete Business Solution',
                provider: 'Bluehost',
                type: 'Web Hosting',
                tier: 'Business',
                price: 7.45,
                original_price: 18.99,
                discount: '61% OFF',
                features: JSON.stringify(['Unlimited Websites', 'Unlimited Storage', 'Free Domain Privacy', 'CodeGuard Backup', 'Spam Experts', 'Office 365 Email']),
                link: 'https://bluehost.com/hosting/choice-plus',
                target_url: 'https://bluehost.com/hosting/choice-plus',
                image: 'https://i.ibb.co/5qvH8mL/bluehost-choice.jpg',
                provider_logo: 'https://i.ibb.co/8xKvpQs/bluehost-logo.png',
                rating: 4.7,
                num_reviews: 2400,
                code: 'CHOICE61',
                color: 'blue',
                button_color: 'blue'
            },
            {
                name: 'GrowBig Business',
                title: 'Advanced Business Hosting',
                provider: 'SiteGround',
                type: 'Web Hosting',
                tier: 'Business',
                price: 9.99,
                original_price: 24.99,
                discount: '60% OFF',
                features: JSON.stringify(['Unlimited Websites', '20 GB Storage', 'Premium Support', 'On-Demand Backups', 'Staging & Git', 'White-label Caching']),
                link: 'https://siteground.com/growbig-hosting',
                target_url: 'https://siteground.com/growbig-hosting',
                image: 'https://i.ibb.co/6qvH8mL/siteground-growbig.jpg',
                provider_logo: 'https://i.ibb.co/7xKvpQs/siteground-logo.png',
                rating: 4.9,
                num_reviews: 4200,
                code: 'GROWBIG60',
                color: 'green',
                button_color: 'green'
            },

            // Enterprise Tier
            {
                name: 'Enterprise Hosting Elite',
                title: 'Maximum Performance & Security',
                provider: 'HostGator',
                type: 'Web Hosting',
                tier: 'Enterprise',
                price: 14.99,
                original_price: 39.99,
                discount: '62% OFF',
                features: JSON.stringify(['Unlimited Everything', 'Free Dedicated IP', 'Private SSL', 'Priority Support', 'Advanced Security', 'Performance Monitoring', 'Custom Integrations']),
                link: 'https://hostgator.com/enterprise-hosting',
                target_url: 'https://hostgator.com/enterprise-hosting',
                image: 'https://i.ibb.co/7qvH8mL/hostgator-enterprise.jpg',
                provider_logo: 'https://i.ibb.co/9yKvpQs/hostgator-logo.png',
                rating: 4.8,
                num_reviews: 950,
                code: 'ELITE62OFF',
                color: 'red',
                button_color: 'red'
            },
            {
                name: 'Pro Enterprise Plan',
                title: 'Ultimate Business Performance',
                provider: 'Bluehost',
                type: 'Web Hosting',
                tier: 'Enterprise',
                price: 18.95,
                original_price: 49.99,
                discount: '62% OFF',
                features: JSON.stringify(['High Performance', 'Dedicated Resources', 'Enhanced Security', 'Priority Support', 'Advanced Analytics', 'Custom Solutions', 'SLA Guarantee']),
                link: 'https://bluehost.com/hosting/pro',
                target_url: 'https://bluehost.com/hosting/pro',
                image: 'https://i.ibb.co/8qvH8mL/bluehost-pro.jpg',
                provider_logo: 'https://i.ibb.co/8xKvpQs/bluehost-logo.png',
                rating: 4.9,
                num_reviews: 1200,
                code: 'PROPRO62',
                color: 'purple',
                button_color: 'purple'
            },
            {
                name: 'GoGeek Enterprise',
                title: 'Premium Enterprise Solution',
                provider: 'SiteGround',
                type: 'Web Hosting',
                tier: 'Enterprise',
                price: 24.99,
                original_price: 59.99,
                discount: '58% OFF',
                features: JSON.stringify(['Premium Resources', '40 GB Storage', 'White-label Options', 'Priority Support', 'Advanced Caching', 'Custom PHP Settings', 'Enterprise Security']),
                link: 'https://siteground.com/gogeek-hosting',
                target_url: 'https://siteground.com/gogeek-hosting',
                image: 'https://i.ibb.co/9qvH8mL/siteground-gogeek.jpg',
                provider_logo: 'https://i.ibb.co/7xKvpQs/siteground-logo.png',
                rating: 4.9,
                num_reviews: 2800,
                code: 'GOGEEK58',
                color: 'purple',
                button_color: 'purple'
            }
        ];

        console.log(`📊 Adding ${webHostingProducts.length} Web Hosting products...`);

        for (let i = 0; i < webHostingProducts.length; i++) {
            const product = webHostingProducts[i];
            const catalogNumber = nextCatalogNumber + i;
            
            const insertQuery = `
                INSERT INTO products (
                    name, title, provider, type, tier, price, original_price, discount,
                    features, link, target_url, image, provider_logo, rating, num_reviews,
                    clicks, code, catalog_number, color, button_color, is_featured,
                    show_on_landing
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                product.name, product.title, product.provider, product.type, product.tier,
                product.price, product.original_price, product.discount, product.features,
                product.link, product.target_url, product.image, product.provider_logo,
                product.rating, product.num_reviews, 0, product.code,
                catalogNumber, product.color, product.button_color, 1, 1
            ];
            
            await connection.execute(insertQuery, values);
            console.log(`✅ Added: ${product.name} (${product.tier}) - $${product.price}`);
        }

        // Verify the data
        console.log('\n📊 VERIFICATION:');
        const [totalRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ?', ['Web Hosting']);
        console.log(`🌐 Total Web Hosting products: ${totalRows[0].total}`);

        const [personalRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ? AND tier = ?', ['Web Hosting', 'Personal']);
        const [businessRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ? AND tier = ?', ['Web Hosting', 'Business']);
        const [enterpriseRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ? AND tier = ?', ['Web Hosting', 'Enterprise']);
        
        console.log(`📊 Personal tier: ${personalRows[0].total}`);
        console.log(`📊 Business tier: ${businessRows[0].total}`);
        console.log(`📊 Enterprise tier: ${enterpriseRows[0].total}`);

        console.log('\n🎉 WEB HOSTING DATA ADDED SUCCESSFULLY!');
        console.log('======================================');
        console.log('✅ Comprehensive product catalog created');
        console.log('✅ All tiers populated (Personal, Business, Enterprise)');
        console.log('✅ Multiple providers (HostGator, Bluehost, SiteGround)');
        console.log('✅ Realistic pricing and features');
        console.log('✅ Admin panel integration ready');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the function
addWebHostingData().catch(console.error);
