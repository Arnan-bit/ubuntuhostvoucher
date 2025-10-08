const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function verifyImageDisplay() {
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

        console.log('\n🎨 Current Image URLs in Database:');
        console.log('=====================================');
        
        console.log('\n📸 Site Appearance Images:');
        console.log(`  - Specialist Image: ${siteAppearance.specialistImageUrl || 'NOT SET'}`);
        console.log(`  - Floating Promo: ${siteAppearance.floatingPromoUrl || 'NOT SET'}`);
        console.log(`  - Brand Logo: ${siteAppearance.brandLogoUrl || 'NOT SET'}`);
        console.log(`  - Hero Background: ${siteAppearance.heroBackgroundImageUrl || 'NOT SET'}`);
        console.log(`  - Popup Modal: ${siteAppearance.popupModalImageUrl || 'NOT SET'}`);

        console.log('\n🎯 Page Banner Images:');
        Object.keys(pageBanners).forEach(page => {
            const banner = pageBanners[page];
            console.log(`  - ${page.toUpperCase()}:`);
            if (banner.slides && banner.slides.length > 0) {
                banner.slides.forEach((slide, index) => {
                    console.log(`    Slide ${index + 1}: ${slide.imageUrl || 'No image'}`);
                    console.log(`    Title: ${slide.title || 'No title'}`);
                    console.log(`    Enabled: ${slide.enabled !== false ? 'Yes' : 'No'}`);
                });
            } else {
                console.log(`    No slides configured`);
            }
        });

        // Check which images are from uploaded files vs external
        console.log('\n📁 Image Source Analysis:');
        console.log('==========================');
        
        const allImages = [
            { name: 'Specialist Image', url: siteAppearance.specialistImageUrl },
            { name: 'Floating Promo', url: siteAppearance.floatingPromoUrl },
            { name: 'Brand Logo', url: siteAppearance.brandLogoUrl },
            { name: 'Hero Background', url: siteAppearance.heroBackgroundImageUrl },
            { name: 'Popup Modal', url: siteAppearance.popupModalImageUrl }
        ];

        // Add banner images
        Object.keys(pageBanners).forEach(page => {
            const banner = pageBanners[page];
            if (banner.slides && banner.slides.length > 0) {
                banner.slides.forEach((slide, index) => {
                    if (slide.imageUrl) {
                        allImages.push({
                            name: `${page} Banner Slide ${index + 1}`,
                            url: slide.imageUrl
                        });
                    }
                });
            }
        });

        allImages.forEach(img => {
            if (img.url) {
                const isUploaded = img.url.includes('hostvocher.com/uploads/');
                const isExternal = img.url.includes('i.ibb.co') || img.url.includes('placehold.co');
                const source = isUploaded ? '📤 UPLOADED' : isExternal ? '🌐 EXTERNAL' : '❓ UNKNOWN';
                console.log(`  ${source} - ${img.name}`);
                console.log(`    URL: ${img.url}`);
            }
        });

        // Generate proxy URLs for testing
        console.log('\n🔄 Proxy URLs for Testing:');
        console.log('===========================');
        
        const uploadedImages = allImages.filter(img => 
            img.url && img.url.includes('hostvocher.com/uploads/')
        );

        uploadedImages.forEach(img => {
            const proxyUrl = `http://localhost:9002/api/image-proxy?url=${encodeURIComponent(img.url)}`;
            console.log(`\n${img.name}:`);
            console.log(`  Original: ${img.url}`);
            console.log(`  Proxy: ${proxyUrl}`);
        });

        // Check component usage
        console.log('\n🧩 Component Usage Check:');
        console.log('=========================');
        
        console.log('\n1. Specialist Image should appear in:');
        console.log('   - Footer (LayoutComponents.tsx)');
        console.log('   - Landing page (PageComponents.tsx)');
        console.log('   - URL used: siteAppearance.specialistImageUrl');
        
        console.log('\n2. Floating Promo should appear as:');
        console.log('   - Popup after 5 seconds (UIComponents.tsx)');
        console.log('   - URL used: siteAppearance.floatingPromoUrl');
        
        console.log('\n3. Page Banners should appear on:');
        console.log('   - Home page (if home banners configured)');
        console.log('   - Web hosting page (if web-hosting banners configured)');
        console.log('   - Other pages as configured');

        // Recommendations
        console.log('\n💡 Recommendations:');
        console.log('===================');
        
        if (siteAppearance.specialistImageUrl && siteAppearance.specialistImageUrl.includes('hostvocher.com')) {
            console.log('✅ Specialist image is uploaded and should work with proxy');
        } else {
            console.log('❌ Specialist image not found or using external URL');
        }
        
        if (siteAppearance.floatingPromoUrl && siteAppearance.floatingPromoUrl.includes('hostvocher.com')) {
            console.log('✅ Floating promo is uploaded and should work with proxy');
        } else {
            console.log('❌ Floating promo not found or using external URL');
        }

        const homeBanners = pageBanners.home;
        if (homeBanners && homeBanners.slides && homeBanners.slides.length > 0) {
            const enabledSlides = homeBanners.slides.filter(s => s.enabled !== false);
            console.log(`✅ Home page has ${enabledSlides.length} enabled banner slides`);
        } else {
            console.log('❌ No home page banners configured');
        }

        console.log('\n🚀 Next Steps:');
        console.log('==============');
        console.log('1. Open http://localhost:9002 in browser');
        console.log('2. Check browser console for any image loading errors');
        console.log('3. Look for specialist image in footer');
        console.log('4. Wait for floating promo popup (5 seconds)');
        console.log('5. Check home page banners');
        console.log('6. Test proxy URLs manually if needed');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the verification
verifyImageDisplay();
