const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function fixImageUrls() {
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
        let needsUpdate = false;

        // Parse and fix site_appearance
        let siteAppearance = {};
        try {
            if (settings.site_appearance) {
                siteAppearance = typeof settings.site_appearance === 'string' 
                    ? JSON.parse(settings.site_appearance) 
                    : settings.site_appearance;

                console.log('\n🔧 Fixing site_appearance URLs...');
                
                // Fix typo in domain name: hostvocher.com -> hostvoucher.com
                Object.keys(siteAppearance).forEach(key => {
                    if (siteAppearance[key] && typeof siteAppearance[key] === 'string') {
                        const oldUrl = siteAppearance[key];
                        const newUrl = oldUrl.replace('hostvocher.com', 'hostvoucher.com');
                        if (oldUrl !== newUrl) {
                            console.log(`  - ${key}: ${oldUrl} -> ${newUrl}`);
                            siteAppearance[key] = newUrl;
                            needsUpdate = true;
                        }
                    }
                });
            }
        } catch (e) {
            console.log('❌ Error parsing site_appearance:', e.message);
        }

        // Parse and fix page_banners
        let pageBanners = {};
        try {
            if (settings.page_banners) {
                pageBanners = typeof settings.page_banners === 'string' 
                    ? JSON.parse(settings.page_banners) 
                    : settings.page_banners;

                console.log('\n🔧 Fixing page_banners URLs...');
                
                Object.keys(pageBanners).forEach(page => {
                    const banner = pageBanners[page];
                    if (banner.slides && Array.isArray(banner.slides)) {
                        banner.slides.forEach((slide, index) => {
                            if (slide.imageUrl && typeof slide.imageUrl === 'string') {
                                const oldUrl = slide.imageUrl;
                                const newUrl = oldUrl.replace('hostvocher.com', 'hostvoucher.com');
                                if (oldUrl !== newUrl) {
                                    console.log(`  - ${page} slide ${index + 1}: ${oldUrl} -> ${newUrl}`);
                                    slide.imageUrl = newUrl;
                                    needsUpdate = true;
                                }
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.log('❌ Error parsing page_banners:', e.message);
        }

        // Update database if needed
        if (needsUpdate) {
            console.log('\n💾 Updating database...');
            
            await connection.execute(
                'UPDATE settings SET site_appearance = ?, page_banners = ? WHERE id = ?',
                [
                    JSON.stringify(siteAppearance),
                    JSON.stringify(pageBanners),
                    'main_settings'
                ]
            );
            
            console.log('✅ Database updated successfully');
            
            // Verify the update
            console.log('\n🔍 Verifying updates...');
            const [verifyRows] = await connection.execute('SELECT site_appearance, page_banners FROM settings WHERE id = ?', ['main_settings']);
            const verifySettings = verifyRows[0];
            
            const verifyAppearance = JSON.parse(verifySettings.site_appearance);
            const verifyBanners = JSON.parse(verifySettings.page_banners);
            
            console.log('\n✅ Updated site_appearance URLs:');
            Object.keys(verifyAppearance).forEach(key => {
                if (verifyAppearance[key] && typeof verifyAppearance[key] === 'string') {
                    console.log(`  - ${key}: ${verifyAppearance[key]}`);
                }
            });
            
            console.log('\n✅ Updated page_banners URLs:');
            Object.keys(verifyBanners).forEach(page => {
                const banner = verifyBanners[page];
                if (banner.slides && banner.slides.length > 0) {
                    banner.slides.forEach((slide, index) => {
                        if (slide.imageUrl) {
                            console.log(`  - ${page} slide ${index + 1}: ${slide.imageUrl}`);
                        }
                    });
                }
            });
            
        } else {
            console.log('\n✅ No URL fixes needed - all URLs are already correct');
        }

        // Test the fixed URLs
        console.log('\n🌐 Testing fixed image URLs...');
        const allImageUrls = [];
        
        // Collect all image URLs
        Object.values(siteAppearance).forEach(url => {
            if (url && typeof url === 'string' && url.startsWith('http')) {
                allImageUrls.push(url);
            }
        });
        
        Object.values(pageBanners).forEach(banner => {
            if (banner.slides && Array.isArray(banner.slides)) {
                banner.slides.forEach(slide => {
                    if (slide.imageUrl && slide.imageUrl.startsWith('http')) {
                        allImageUrls.push(slide.imageUrl);
                    }
                });
            }
        });

        // Test each URL
        for (const url of [...new Set(allImageUrls)]) {
            try {
                const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
                console.log(`  ✅ ${url} - Status: ${response.status}`);
            } catch (error) {
                console.log(`  ❌ ${url} - Error: ${error.message}`);
            }
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

// Run the fix
fixImageUrls();
