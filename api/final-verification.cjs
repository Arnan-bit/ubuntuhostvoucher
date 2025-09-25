const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostvoucher_db',
    port: parseInt(process.env.DB_PORT || '3306')
};

async function finalVerification() {
    let connection;
    
    try {
        console.log('🔄 Starting final verification...');
        connection = await mysql.createConnection(dbConfig);
        
        console.log('\n🎯 HOSTVOUCHER FINAL VERIFICATION REPORT');
        console.log('==========================================');
        
        // 1. Database Health Check
        console.log('\n1. 📊 DATABASE HEALTH CHECK:');
        const requiredTables = [
            'products', 'testimonials', 'gamification_users', 'purchase_requests',
            'point_adjustments', 'click_events', 'submitted_vouchers', 'deal_requests',
            'nft_showcase', 'hostvoucher_testimonials', 'site_settings'
        ];
        
        let allTablesOk = true;
        for (const table of requiredTables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`   ✅ ${table}: ${rows[0].count} records`);
            } catch (error) {
                console.log(`   ❌ ${table}: ERROR - ${error.message}`);
                allTablesOk = false;
            }
        }
        
        // 2. File Structure Check
        console.log('\n2. 📁 FILE STRUCTURE CHECK:');
        const criticalFiles = [
            'src/app/page.tsx',
            'src/app/request/page.tsx',
            'src/app/admin/page.tsx',
            'src/app/api/request/route.ts',
            'src/app/api/gamification/route.ts',
            'src/components/support/UnifiedSupportChat.tsx',
            'package.json',
            'next.config.js'
        ];
        
        let allFilesOk = true;
        for (const file of criticalFiles) {
            if (fs.existsSync(file)) {
                console.log(`   ✅ ${file}: EXISTS`);
            } else {
                console.log(`   ❌ ${file}: MISSING`);
                allFilesOk = false;
            }
        }
        
        // 3. Gamification System Check
        console.log('\n3. 🎮 GAMIFICATION SYSTEM CHECK:');
        const [gamificationStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_users,
                SUM(points) as total_points,
                COUNT(CASE WHEN eth_address IS NOT NULL THEN 1 END) as users_with_eth,
                COUNT(CASE WHEN is_eth_active = 1 THEN 1 END) as active_eth_users,
                MAX(points) as highest_points
            FROM gamification_users
        `);
        
        const stats = gamificationStats[0];
        console.log(`   ✅ Total Users: ${stats.total_users}`);
        console.log(`   ✅ Total Points in System: ${stats.total_points?.toLocaleString() || 0}`);
        console.log(`   ✅ Users with ETH Address: ${stats.users_with_eth}`);
        console.log(`   ✅ Active ETH Users: ${stats.active_eth_users}`);
        console.log(`   ✅ Highest Points: ${stats.highest_points?.toLocaleString() || 0}`);
        
        // 4. Products & Rating Check
        console.log('\n4. ⭐ PRODUCTS & RATING CHECK:');
        const [productStats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_products,
                COUNT(CASE WHEN rating IS NOT NULL AND rating > 0 THEN 1 END) as products_with_rating,
                COUNT(CASE WHEN num_reviews IS NOT NULL AND num_reviews > 0 THEN 1 END) as products_with_reviews,
                COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_products
            FROM products
        `);
        
        const prodStats = productStats[0];
        console.log(`   ✅ Total Products: ${prodStats.total_products}`);
        console.log(`   ✅ Products with Rating: ${prodStats.products_with_rating}`);
        console.log(`   ✅ Products with Reviews: ${prodStats.products_with_reviews}`);
        console.log(`   ✅ Featured Products: ${prodStats.featured_products}`);
        
        // 5. API Endpoints Check
        console.log('\n5. 🔌 API ENDPOINTS CHECK:');
        const apiEndpoints = [
            '/api/data',
            '/api/request', 
            '/api/gamification',
            '/api/upload',
            '/api/action'
        ];
        
        console.log('   📡 API Routes Available:');
        apiEndpoints.forEach(endpoint => {
            const filePath = `src/app${endpoint}/route.ts`;
            if (fs.existsSync(filePath)) {
                console.log(`   ✅ ${endpoint}: READY`);
            } else {
                console.log(`   ⚠️ ${endpoint}: CHECK MANUALLY`);
            }
        });
        
        // 6. Upload Directories Check
        console.log('\n6. 📤 UPLOAD DIRECTORIES CHECK:');
        const uploadDirs = [
            'public/uploads/requests',
            'public/uploads/images',
            'public/uploads/banners',
            'public/uploads/profiles'
        ];
        
        uploadDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                console.log(`   ✅ ${dir}: EXISTS`);
            } else {
                console.log(`   ⚠️ ${dir}: WILL BE CREATED ON FIRST UPLOAD`);
            }
        });
        
        // 7. Sample Data Verification
        console.log('\n7. 📋 SAMPLE DATA VERIFICATION:');
        
        // Check products with ratings
        const [sampleProducts] = await connection.execute(`
            SELECT name, provider, rating, num_reviews 
            FROM products 
            WHERE rating IS NOT NULL 
            ORDER BY rating DESC 
            LIMIT 3
        `);
        
        console.log('   🏆 Top Rated Products:');
        sampleProducts.forEach((product, index) => {
            console.log(`      ${index + 1}. ${product.name} (${product.provider}) - ⭐ ${product.rating} (${product.num_reviews} reviews)`);
        });
        
        // Check testimonials
        const [sampleTestimonials] = await connection.execute(`
            SELECT name, role, rating 
            FROM testimonials 
            ORDER BY rating DESC 
            LIMIT 3
        `);
        
        console.log('   💬 Sample Testimonials:');
        sampleTestimonials.forEach((testimonial, index) => {
            console.log(`      ${index + 1}. ${testimonial.name} (${testimonial.role}) - ⭐ ${testimonial.rating}/5`);
        });
        
        // 8. Overall System Health
        console.log('\n8. 🏥 OVERALL SYSTEM HEALTH:');
        const healthChecks = [
            { name: 'Database Connection', status: allTablesOk },
            { name: 'File Structure', status: allFilesOk },
            { name: 'Gamification System', status: stats.total_users > 0 },
            { name: 'Products Catalog', status: prodStats.total_products > 0 },
            { name: 'Rating System', status: prodStats.products_with_rating > 0 },
            { name: 'ETH Management', status: stats.users_with_eth > 0 }
        ];
        
        let overallHealth = true;
        healthChecks.forEach(check => {
            const status = check.status ? '✅ HEALTHY' : '❌ NEEDS ATTENTION';
            console.log(`   ${status}: ${check.name}`);
            if (!check.status) overallHealth = false;
        });
        
        console.log('\n==========================================');
        console.log(`🎉 FINAL STATUS: ${overallHealth ? 'ALL SYSTEMS OPERATIONAL' : 'SOME ISSUES DETECTED'}`);
        console.log('==========================================');
        
        if (overallHealth) {
            console.log('\n🚀 READY FOR PRODUCTION DEPLOYMENT!');
            console.log('\nNext steps:');
            console.log('1. Upload all files to hosting');
            console.log('2. Configure production environment variables');
            console.log('3. Run database setup scripts on production');
            console.log('4. Test all features on live site');
            console.log('\n📖 See HOSTING_MIGRATION_GUIDE.md for detailed instructions');
        }
        
    } catch (error) {
        console.error('❌ Verification failed:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run verification
finalVerification()
    .then(() => {
        console.log('\n✅ Final verification completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Final verification failed:', error);
        process.exit(1);
    });
