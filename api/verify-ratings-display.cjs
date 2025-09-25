const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
});

console.log('🔍 Verifying ratings display across all categories...\n');

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    
    console.log('✅ Connected to database\n');
    
    // Check ratings by category
    db.query(`
        SELECT 
            type,
            COUNT(*) as total_products,
            COUNT(CASE WHEN rating > 0 AND num_reviews > 0 THEN 1 END) as products_with_ratings,
            ROUND(AVG(CASE WHEN rating > 0 THEN rating END), 1) as avg_rating,
            MIN(CASE WHEN rating > 0 THEN rating END) as min_rating,
            MAX(rating) as max_rating,
            SUM(num_reviews) as total_reviews
        FROM products 
        WHERE type IN ('Web Hosting', 'WordPress Hosting', 'Cloud Hosting', 'VPS', 'VPN', 'Domain', 'Voucher')
        GROUP BY type
        ORDER BY type
    `, (err, results) => {
        if (err) {
            console.error('Error fetching category stats:', err);
            db.end();
            return;
        }
        
        console.log('📊 RATING STATISTICS BY CATEGORY:');
        console.log('=' .repeat(80));
        
        results.forEach(row => {
            const coverage = ((row.products_with_ratings / row.total_products) * 100).toFixed(1);
            console.log(`${row.type}:`);
            console.log(`  📦 Products: ${row.total_products} total, ${row.products_with_ratings} with ratings (${coverage}%)`);
            console.log(`  ⭐ Rating Range: ${row.min_rating || 'N/A'} - ${row.max_rating || 'N/A'} (avg: ${row.avg_rating || 'N/A'})`);
            console.log(`  💬 Total Reviews: ${row.total_reviews?.toLocaleString() || '0'}`);
            console.log('');
        });
        
        // Get sample products from each category
        db.query(`
            SELECT name, provider, type, rating, num_reviews
            FROM products 
            WHERE rating > 0 AND num_reviews > 0
            ORDER BY type, rating DESC
        `, (err, products) => {
            if (err) {
                console.error('Error fetching sample products:', err);
                db.end();
                return;
            }
            
            console.log('🌟 SAMPLE PRODUCTS WITH RATINGS:');
            console.log('=' .repeat(80));
            
            const productsByType = {};
            products.forEach(product => {
                if (!productsByType[product.type]) {
                    productsByType[product.type] = [];
                }
                productsByType[product.type].push(product);
            });
            
            Object.keys(productsByType).sort().forEach(type => {
                console.log(`\n${type}:`);
                productsByType[type].slice(0, 3).forEach(product => {
                    console.log(`  • ${product.name} (${product.provider}): ${product.rating}★ (${product.num_reviews.toLocaleString()} reviews)`);
                });
            });
            
            console.log('\n' + '=' .repeat(80));
            console.log('✅ VERIFICATION COMPLETE!');
            console.log('\n🎯 PAGES TO TEST:');
            console.log('  • Home: http://localhost:9002');
            console.log('  • Landing: http://localhost:9002/landing');
            console.log('  • Web Hosting: http://localhost:9002/web-hosting');
            console.log('  • WordPress Hosting: http://localhost:9002/wordpress-hosting');
            console.log('  • Cloud Hosting: http://localhost:9002/cloud-hosting');
            console.log('  • VPS: http://localhost:9002/vps');
            console.log('  • VPN: http://localhost:9002/vpn');
            console.log('  • Domains: http://localhost:9002/domain');
            console.log('  • Promotional Vouchers: http://localhost:9002/coupons');
            
            console.log('\n🌟 EXPECTED BEHAVIOR:');
            console.log('  • Star ratings should appear below product names');
            console.log('  • Format: "4.8/5 (1,247 Reviews)"');
            console.log('  • Only products with reviews > 0 show ratings');
            console.log('  • Ratings are consistent across all pages');
            console.log('  • Stars are filled based on rating value');
            
            db.end();
        });
    });
});
