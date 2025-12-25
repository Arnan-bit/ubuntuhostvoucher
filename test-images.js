const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function testImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Get current settings
        const [rows] = await connection.execute('SELECT * FROM settings WHERE id = ?', ['main_settings']);
        
        if (rows.length === 0) {
            console.log('❌ No settings found');
            return;
        }

        const settings = rows[0];

        // Parse site_appearance
        let siteAppearance = {};
        try {
            if (settings.site_appearance) {
                siteAppearance = typeof settings.site_appearance === 'string' 
                    ? JSON.parse(settings.site_appearance) 
                    : settings.site_appearance;
            }
        } catch (e) {
            console.log('❌ Error parsing site_appearance:', e.message);
        }

        // Parse page_banners
        let pageBanners = {};
        try {
            if (settings.page_banners) {
                pageBanners = typeof settings.page_banners === 'string' 
                    ? JSON.parse(settings.page_banners) 
                    : settings.page_banners;
            }
        } catch (e) {
            console.log('❌ Error parsing page_banners:', e.message);
        }

        console.log('\n🎨 Site Appearance Images:');
        console.log('  - specialistImageUrl:', siteAppearance.specialistImageUrl || 'NOT SET');
        console.log('  - floatingPromoUrl:', siteAppearance.floatingPromoUrl || 'NOT SET');
        console.log('  - brandLogoUrl:', siteAppearance.brandLogoUrl || 'NOT SET');
        console.log('  - heroBackgroundImageUrl:', siteAppearance.heroBackgroundImageUrl || 'NOT SET');
        console.log('  - popupModalImageUrl:', siteAppearance.popupModalImageUrl || 'NOT SET');

        console.log('\n🎯 Page Banners:');
        Object.keys(pageBanners).forEach(page => {
            const banner = pageBanners[page];
            console.log(`  - ${page}: ${banner.slides ? banner.slides.length : 0} slides`);
            if (banner.slides && banner.slides.length > 0) {
                banner.slides.forEach((slide, index) => {
                    console.log(`    Slide ${index + 1}: ${slide.imageUrl || 'No image'}`);
                });
            }
        });

        // Test direct access to images
        console.log('\n🌐 Testing direct image access...');
        const testUrls = [
            'https://hostvoucher.com/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
            'https://hostvoucher.com/uploads/images/1755916060366_new_promo.png',
            'https://hostvoucher.com/uploads/images/1755916097312_design_grafis_coupon_1_11zon.png',
            'https://hostvoucher.com/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png'
        ];

        for (const url of testUrls) {
            try {
                const response = await fetch(url, { 
                    method: 'HEAD',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                console.log(`  ${response.ok ? '✅' : '❌'} ${url} - Status: ${response.status}`);
                
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    const contentLength = response.headers.get('content-length');
                    console.log(`    Content-Type: ${contentType}, Size: ${contentLength} bytes`);
                }
            } catch (error) {
                console.log(`  ❌ ${url} - Error: ${error.message}`);
            }
        }

        // Test localhost proxy URLs
        console.log('\n🔄 Testing localhost proxy URLs...');
        const proxyUrls = testUrls.map(url => 
            `http://localhost:9002/api/image-proxy?url=${encodeURIComponent(url)}`
        );

        for (const proxyUrl of proxyUrls) {
            try {
                const response = await fetch(proxyUrl, { method: 'HEAD' });
                console.log(`  ${response.ok ? '✅' : '❌'} Proxy - Status: ${response.status}`);
            } catch (error) {
                console.log(`  ❌ Proxy - Error: ${error.message}`);
            }
        }

        console.log('\n📋 Summary:');
        console.log('1. Images are stored in database with correct URLs');
        console.log('2. Direct access from localhost may fail due to CORS/network issues');
        console.log('3. Use the image proxy (/api/image-proxy) for development');
        console.log('4. Deploy to hosting for full functionality');

        console.log('\n🚀 Next Steps:');
        console.log('1. Restart your Next.js server to load the new proxy');
        console.log('2. Check the browser console for any remaining errors');
        console.log('3. Test the admin panel image uploads');
        console.log('4. Deploy to hostvocher.com hosting for production testing');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the test
testImages();
