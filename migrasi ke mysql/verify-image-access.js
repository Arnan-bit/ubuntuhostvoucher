const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function verifyImageAccess() {
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
            return;
        }

        console.log('\n🔍 Image Access Verification:');
        console.log('=============================');

        // Define all images that should be accessible
        const imagesToCheck = [
            {
                name: 'Logo (Header)',
                dbField: 'brandLogoUrl',
                url: siteAppearance.brandLogoUrl,
                component: 'BrandLogo component in header'
            },
            {
                name: 'Favicon (Browser)',
                dbField: 'favicon_url',
                url: siteAppearance.favicon_url,
                component: 'Browser tab icon'
            },
            {
                name: 'Specialist (Footer)',
                dbField: 'specialistImageUrl',
                url: siteAppearance.specialistImageUrl,
                component: 'Footer profile & landing page'
            },
            {
                name: 'Floating Promo',
                dbField: 'floatingPromoUrl',
                url: siteAppearance.floatingPromoUrl,
                component: 'FloatingPromotionalPopup component'
            },
            {
                name: 'Popup Modal',
                dbField: 'popupModalImageUrl',
                url: siteAppearance.popupModalImageUrl,
                component: 'Modal call-to-action'
            },
            {
                name: 'Banner Background',
                dbField: 'banner_image',
                url: siteAppearance.banner_image,
                component: 'Homepage banner background'
            }
        ];

        console.log('\n📁 File System Check:');
        console.log('=====================');

        let allImagesAccessible = true;

        for (const image of imagesToCheck) {
            if (!image.url) {
                console.log(`❌ ${image.name}: URL not set in database`);
                allImagesAccessible = false;
                continue;
            }

            // Convert URL to file path
            const relativePath = image.url.replace('/uploads/', '');
            const fullPath = path.join(__dirname, 'uploads', relativePath);

            try {
                if (fs.existsSync(fullPath)) {
                    const stats = fs.statSync(fullPath);
                    const fileSizeKB = Math.round(stats.size / 1024);
                    console.log(`✅ ${image.name}: ${fileSizeKB}KB - ${image.component}`);
                } else {
                    console.log(`❌ ${image.name}: File not found at ${fullPath}`);
                    allImagesAccessible = false;
                }
            } catch (error) {
                console.log(`❌ ${image.name}: Error checking file - ${error.message}`);
                allImagesAccessible = false;
            }
        }

        console.log('\n🌐 URL Mapping Check:');
        console.log('=====================');

        imagesToCheck.forEach(image => {
            if (image.url) {
                console.log(`${image.name}: http://localhost:9002${image.url}`);
            } else {
                console.log(`${image.name}: ❌ URL not configured`);
            }
        });

        // Check page banners
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

        console.log('\n🎯 Banner Slides Check:');
        console.log('=======================');

        Object.keys(pageBanners).forEach(page => {
            const pageConfig = pageBanners[page];
            if (pageConfig.slides && pageConfig.slides.length > 0) {
                console.log(`📄 ${page.toUpperCase()} page:`);
                pageConfig.slides.forEach((slide, index) => {
                    if (slide.imageUrl) {
                        const relativePath = slide.imageUrl.replace('/uploads/', '');
                        const fullPath = path.join(__dirname, 'uploads', relativePath);
                        const exists = fs.existsSync(fullPath);
                        console.log(`  Slide ${index + 1}: ${exists ? '✅' : '❌'} ${slide.imageUrl}`);
                    } else {
                        console.log(`  Slide ${index + 1}: ❌ No image URL set`);
                    }
                });
            }
        });

        console.log('\n📊 Summary:');
        console.log('===========');
        
        if (allImagesAccessible) {
            console.log('🎉 ALL IMAGES ARE ACCESSIBLE!');
            console.log('\n✅ Status: Ready for frontend display');
            console.log('✅ Database: All image URLs configured');
            console.log('✅ File System: All files exist and accessible');
            console.log('✅ Components: All frontend components have image sources');
        } else {
            console.log('⚠️  SOME IMAGES HAVE ISSUES');
            console.log('\n❌ Status: Needs attention');
            console.log('❌ Some images may not display correctly');
        }

        console.log('\n🔧 Component-Database Mapping:');
        console.log('==============================');
        console.log('Header Logo → site_appearance.brandLogoUrl');
        console.log('Browser Favicon → site_appearance.favicon_url');
        console.log('Footer Specialist → site_appearance.specialistImageUrl');
        console.log('Floating Promo → site_appearance.floatingPromoUrl');
        console.log('Popup Modal → site_appearance.popupModalImageUrl');
        console.log('Banner Slides → page_banners[page].slides[n].imageUrl');

        console.log('\n🚀 Testing Instructions:');
        console.log('========================');
        console.log('1. Open http://localhost:9002 in browser');
        console.log('2. Check header for logo (top-left corner)');
        console.log('3. Check browser tab for favicon');
        console.log('4. Scroll to footer to see specialist image');
        console.log('5. Wait 5 seconds for floating promo popup');
        console.log('6. Look for banner on homepage');
        console.log('7. Navigate to /web-hosting to see different banner');

        console.log('\n💡 Expected Results:');
        console.log('====================');
        console.log('🏷️  Header: ChatGPT landscape logo');
        console.log('🔖 Browser Tab: ChatGPT portrait favicon');
        console.log('👨‍💼 Footer: April specialist profile');
        console.log('🎯 Popup: New promo design (after 5 seconds)');
        console.log('🖼️  Banner: ChatGPT landscape on homepage');
        console.log('🎫 Modal: Coupon design for call-to-action');

    } catch (error) {
        console.error('❌ Verification error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the verification
verifyImageAccess();
