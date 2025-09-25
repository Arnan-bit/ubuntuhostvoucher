const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
};

async function checkDatabaseImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Check settings table structure
        console.log('\n📋 Checking settings table structure...');
        const [columns] = await connection.execute('DESCRIBE settings');
        console.log('Settings table columns:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type}`);
        });

        // Get current settings
        console.log('\n🔍 Checking current settings...');
        const [rows] = await connection.execute('SELECT * FROM settings WHERE id = ?', ['main_settings']);
        
        if (rows.length === 0) {
            console.log('❌ No settings found with id "main_settings"');
            return;
        }

        const settings = rows[0];
        console.log('\n📊 Current settings data:');
        console.log('ID:', settings.id);
        console.log('Theme:', settings.theme);

        // Parse site_appearance
        let siteAppearance = {};
        try {
            if (settings.site_appearance) {
                siteAppearance = typeof settings.site_appearance === 'string' 
                    ? JSON.parse(settings.site_appearance) 
                    : settings.site_appearance;
                console.log('\n🎨 Site Appearance Data:');
                console.log('  - specialistImageUrl:', siteAppearance.specialistImageUrl || 'NOT SET');
                console.log('  - floatingPromoUrl:', siteAppearance.floatingPromoUrl || 'NOT SET');
                console.log('  - brandLogoUrl:', siteAppearance.brandLogoUrl || 'NOT SET');
                console.log('  - heroBackgroundImageUrl:', siteAppearance.heroBackgroundImageUrl || 'NOT SET');
                console.log('  - popupModalImageUrl:', siteAppearance.popupModalImageUrl || 'NOT SET');
            } else {
                console.log('❌ No site_appearance data found');
            }
        } catch (e) {
            console.log('❌ Error parsing site_appearance:', e.message);
            console.log('Raw site_appearance data:', settings.site_appearance);
        }

        // Parse page_banners
        let pageBanners = {};
        try {
            if (settings.page_banners) {
                pageBanners = typeof settings.page_banners === 'string' 
                    ? JSON.parse(settings.page_banners) 
                    : settings.page_banners;
                console.log('\n🎯 Page Banners Data:');
                Object.keys(pageBanners).forEach(page => {
                    const banner = pageBanners[page];
                    console.log(`  - ${page}:`, banner.slides ? `${banner.slides.length} slides` : 'No slides');
                    if (banner.slides && banner.slides.length > 0) {
                        banner.slides.forEach((slide, index) => {
                            console.log(`    Slide ${index + 1}: ${slide.imageUrl || 'No image'}`);
                        });
                    }
                });
            } else {
                console.log('❌ No page_banners data found');
            }
        } catch (e) {
            console.log('❌ Error parsing page_banners:', e.message);
            console.log('Raw page_banners data:', settings.page_banners);
        }

        // Test image URLs
        console.log('\n🌐 Testing image URLs...');
        const imageUrls = [
            siteAppearance.specialistImageUrl,
            siteAppearance.floatingPromoUrl,
            siteAppearance.brandLogoUrl,
            siteAppearance.heroBackgroundImageUrl,
            siteAppearance.popupModalImageUrl
        ].filter(url => url);

        for (const url of imageUrls) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                console.log(`  ✅ ${url} - Status: ${response.status}`);
            } catch (error) {
                console.log(`  ❌ ${url} - Error: ${error.message}`);
            }
        }

        // Check if there are any uploaded images in hostvocher.com domain
        console.log('\n📁 Checking for uploaded images...');
        const uploadedImages = imageUrls.filter(url => url && url.includes('hostvocher.com'));
        if (uploadedImages.length > 0) {
            console.log('Found uploaded images:');
            uploadedImages.forEach(url => console.log(`  - ${url}`));
        } else {
            console.log('No uploaded images found (all using external URLs)');
        }

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the check
checkDatabaseImages();
