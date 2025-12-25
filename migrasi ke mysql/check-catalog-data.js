const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function checkCatalogData() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        console.log('\n🔍 CATALOG DATA INVESTIGATION');
        console.log('============================');

        // Check total products
        const [totalRows] = await connection.execute('SELECT COUNT(*) as total FROM products');
        console.log(`📊 Total products in database: ${totalRows[0].total}`);

        if (totalRows[0].total === 0) {
            console.log('❌ NO PRODUCTS FOUND IN DATABASE!');
            console.log('🔧 This is why the catalog is empty.');
            
            // Let's add some sample data
            console.log('\n🚀 ADDING SAMPLE WEB HOSTING DATA...');
            
            const sampleProducts = [
                {
                    name: 'Shared Hosting Starter',
                    title: 'Perfect for Small Websites',
                    provider: 'HostGator',
                    type: 'Web Hosting',
                    tier: 'Personal',
                    price: 2.75,
                    original_price: 10.95,
                    discount: '75% OFF',
                    features: JSON.stringify(['1 Website', '10 GB Storage', 'Free SSL', '24/7 Support']),
                    link: 'https://hostgator.com',
                    target_url: 'https://hostgator.com',
                    image: 'https://i.ibb.co/hosting1.jpg',
                    provider_logo: 'https://i.ibb.co/hostgator-logo.png',
                    rating: 4.5,
                    num_reviews: 1250,
                    clicks: 0,
                    code: 'SAVE75',
                    color: 'blue',
                    button_color: 'orange',
                    is_featured: 1,
                    show_on_landing: 1,
                    display_style: 'card'
                },
                {
                    name: 'Business Hosting Pro',
                    title: 'Ideal for Growing Businesses',
                    provider: 'Bluehost',
                    type: 'Web Hosting',
                    tier: 'Business',
                    price: 5.45,
                    original_price: 15.99,
                    discount: '66% OFF',
                    features: JSON.stringify(['Unlimited Websites', '50 GB Storage', 'Free Domain', 'Free SSL', 'Marketing Credits']),
                    link: 'https://bluehost.com',
                    target_url: 'https://bluehost.com',
                    image: 'https://i.ibb.co/hosting2.jpg',
                    provider_logo: 'https://i.ibb.co/bluehost-logo.png',
                    rating: 4.7,
                    num_reviews: 2100,
                    clicks: 0,
                    code: 'BUSINESS66',
                    color: 'green',
                    button_color: 'blue',
                    is_featured: 1,
                    show_on_landing: 1,
                    display_style: 'card'
                },
                {
                    name: 'Enterprise Hosting Elite',
                    title: 'Maximum Performance & Security',
                    provider: 'SiteGround',
                    type: 'Web Hosting',
                    tier: 'Enterprise',
                    price: 14.99,
                    original_price: 39.99,
                    discount: '62% OFF',
                    features: JSON.stringify(['Unlimited Websites', '100 GB Storage', 'Free CDN', 'Daily Backups', 'Priority Support', 'Advanced Security']),
                    link: 'https://siteground.com',
                    target_url: 'https://siteground.com',
                    image: 'https://i.ibb.co/hosting3.jpg',
                    provider_logo: 'https://i.ibb.co/siteground-logo.png',
                    rating: 4.8,
                    num_reviews: 3500,
                    clicks: 0,
                    code: 'ELITE62',
                    color: 'purple',
                    button_color: 'green',
                    is_featured: 1,
                    show_on_landing: 1,
                    display_style: 'card'
                }
            ];

            for (let i = 0; i < sampleProducts.length; i++) {
                const product = sampleProducts[i];
                const catalogNumber = 1001 + i;
                
                const insertQuery = `
                    INSERT INTO products (
                        name, title, provider, type, tier, price, original_price, discount, 
                        features, link, target_url, image, provider_logo, rating, num_reviews, 
                        clicks, code, catalog_number, color, button_color, is_featured, 
                        show_on_landing, display_style
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                
                const values = [
                    product.name, product.title, product.provider, product.type, product.tier,
                    product.price, product.original_price, product.discount, product.features,
                    product.link, product.target_url, product.image, product.provider_logo,
                    product.rating, product.num_reviews, product.clicks, product.code,
                    catalogNumber, product.color, product.button_color, product.is_featured,
                    product.show_on_landing, product.display_style
                ];
                
                await connection.execute(insertQuery, values);
                console.log(`✅ Added: ${product.name} (${product.tier})`);
            }
            
            console.log('\n🎉 Sample data added successfully!');
        }

        // Check Web Hosting products
        const [webHostingRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ?', ['Web Hosting']);
        console.log(`🌐 Web Hosting products: ${webHostingRows[0].total}`);

        // Check by tier
        const [personalRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ? AND tier = ?', ['Web Hosting', 'Personal']);
        const [businessRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ? AND tier = ?', ['Web Hosting', 'Business']);
        const [enterpriseRows] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE type = ? AND tier = ?', ['Web Hosting', 'Enterprise']);
        
        console.log(`📊 Personal tier: ${personalRows[0].total}`);
        console.log(`📊 Business tier: ${businessRows[0].total}`);
        console.log(`📊 Enterprise tier: ${enterpriseRows[0].total}`);

        // Sample products
        const [sampleRows] = await connection.execute('SELECT id, name, type, tier, price, rating FROM products WHERE type = ? LIMIT 5', ['Web Hosting']);
        console.log('\n📋 Sample Web Hosting products:');
        sampleRows.forEach(product => {
            console.log(`  • ${product.name} (${product.tier}) - $${product.price} - ⭐${product.rating}`);
        });

        // Test API endpoint
        console.log('\n🔗 TESTING API ENDPOINT...');
        try {
            const response = await fetch('http://localhost:9002/api/data?type=deals');
            if (response.ok) {
                const apiData = await response.json();
                console.log(`✅ API Response: ${apiData.data.length} deals found`);
                
                const webHostingDeals = apiData.data.filter(d => d.type === 'Web Hosting');
                console.log(`🌐 Web Hosting deals from API: ${webHostingDeals.length}`);
                
                if (webHostingDeals.length > 0) {
                    console.log('✅ API is working correctly');
                } else {
                    console.log('❌ API not returning Web Hosting deals');
                }
            } else {
                console.log(`❌ API Error: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ API Test failed: ${error.message}`);
        }

        console.log('\n🎯 DIAGNOSIS COMPLETE');
        console.log('====================');
        
        if (totalRows[0].total === 0) {
            console.log('✅ Issue: Database was empty');
            console.log('✅ Solution: Added sample Web Hosting data');
            console.log('✅ Status: Catalog should now display products');
        } else {
            console.log('✅ Database has products');
            console.log('✅ Check if API endpoint is working');
            console.log('✅ Check if frontend is filtering correctly');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the check
checkCatalogData().catch(console.error);
