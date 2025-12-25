const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function fixImagePlacement() {
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
        console.log('\n🔍 Current Settings Analysis:');
        console.log('============================');

        // Parse current site_appearance
        let siteAppearance = {};
        try {
            if (settings.site_appearance) {
                siteAppearance = typeof settings.site_appearance === 'string' 
                    ? JSON.parse(settings.site_appearance) 
                    : settings.site_appearance;
                console.log('✅ Site appearance parsed successfully');
            }
        } catch (e) {
            console.log('❌ Error parsing site_appearance:', e.message);
            siteAppearance = {};
        }

        // Parse current page_banners
        let pageBanners = {};
        try {
            if (settings.page_banners) {
                pageBanners = typeof settings.page_banners === 'string' 
                    ? JSON.parse(settings.page_banners) 
                    : settings.page_banners;
                console.log('✅ Page banners parsed successfully');
            }
        } catch (e) {
            console.log('❌ Error parsing page_banners:', e.message);
            pageBanners = {};
        }

        console.log('\n🎯 Fixing Image Placement Based on Admin Panel:');
        console.log('===============================================');

        // PERBAIKAN BERDASARKAN SCREENSHOT ADMIN PANEL:
        // 1. Logo: ChatGPT Image 18 Agu 2025, 10.55.24.png
        // 2. Favicon: ChatGPT Image 18 Agu 2025, 10.37.41.png  
        // 3. Specialist: ChatGPT Image Apr 8, 2025, 05_52_32 PM.png
        // 4. Floating Promo: new promo.png
        // 5. Popup Modal: design grafis coupon 1 11zon.png

        const correctImageMapping = {
            // BRANDING - sesuai admin panel
            logo_url: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            brandLogoUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            
            favicon_url: '/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
            
            // GENERAL IMAGES - sesuai admin panel
            specialistImageUrl: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            specialist_image_url: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            
            floatingPromoUrl: '/uploads/images/1755926500003_new_promo.png',
            floating_promo_url: '/uploads/images/1755926500003_new_promo.png',
            
            popupModalImageUrl: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            popup_modal_image_url: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            
            // BANNER IMAGES - menggunakan gambar yang tepat untuk banner
            heroBackgroundImageUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            banner_image: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png'
        };

        // Update site_appearance dengan mapping yang benar
        const updatedSiteAppearance = {
            ...siteAppearance,
            ...correctImageMapping
        };

        // Perbaiki page_banners dengan gambar yang sesuai konteks
        const correctedPageBanners = {
            home: {
                enabled: true,
                slides: [
                    {
                        id: 1,
                        title: "Find the Best Hosting Deals in One Click",
                        subtitle: "We compare, you save. Discover promos for domains, VPS, cloud hosting, and more.",
                        imageUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png', // Logo untuk banner utama
                        buttonText: "Search Hosting Deals",
                        buttonLink: "/web-hosting",
                        buttonColor: "orange",
                        textPosition: "left",
                        enabled: true
                    }
                ],
                animationType: "fade",
                rotationInterval: 8,
                autoRotate: true
            },
            "web-hosting": {
                enabled: true,
                slides: [
                    {
                        id: 1,
                        title: "Best Web Hosting Deals",
                        subtitle: "Professional hosting solutions for your website",
                        imageUrl: '/uploads/images/1755926500003_new_promo.png', // Promo untuk hosting
                        buttonText: "View Hosting",
                        buttonLink: "/web-hosting",
                        buttonColor: "green",
                        textPosition: "left",
                        enabled: true
                    }
                ],
                animationType: "slide",
                rotationInterval: 10,
                autoRotate: false
            },
            hosting: {
                enabled: true,
                slides: [
                    {
                        id: 1,
                        title: "Premium Hosting Services",
                        subtitle: "Reliable hosting with 99.9% uptime guarantee",
                        imageUrl: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png', // Specialist untuk kredibilitas
                        buttonText: "Learn More",
                        buttonLink: "/hosting",
                        buttonColor: "purple",
                        textPosition: "center",
                        enabled: true
                    }
                ],
                animationType: "fade",
                rotationInterval: 12,
                autoRotate: false
            }
        };

        console.log('\n📝 Correct Image Assignments:');
        console.log('=============================');
        console.log('🏷️  Logo (Branding):', correctImageMapping.logo_url);
        console.log('🔖 Favicon (Browser Icon):', correctImageMapping.favicon_url);
        console.log('👨‍💼 Specialist (Footer Profile):', correctImageMapping.specialistImageUrl);
        console.log('🎯 Floating Promo (Popup):', correctImageMapping.floatingPromoUrl);
        console.log('🎫 Popup Modal (CTA):', correctImageMapping.popupModalImageUrl);
        console.log('🖼️  Banner Background:', correctImageMapping.banner_image);

        // Update database dengan mapping yang benar
        await connection.execute(
            'UPDATE settings SET site_appearance = ?, page_banners = ? WHERE id = ?',
            [
                JSON.stringify(updatedSiteAppearance),
                JSON.stringify(correctedPageBanners),
                'main_settings'
            ]
        );

        console.log('\n✅ Database updated with correct image placement!');

        // Verify the update
        console.log('\n🔍 Verifying updates...');
        const [verifyRows] = await connection.execute('SELECT site_appearance, page_banners FROM settings WHERE id = ?', ['main_settings']);
        const verifyAppearance = JSON.parse(verifyRows[0].site_appearance);
        const verifyBanners = JSON.parse(verifyRows[0].page_banners);

        console.log('\n📊 Verification Results:');
        console.log('========================');
        console.log('✅ Logo URL:', verifyAppearance.logo_url);
        console.log('✅ Favicon URL:', verifyAppearance.favicon_url);
        console.log('✅ Specialist URL:', verifyAppearance.specialistImageUrl);
        console.log('✅ Floating Promo URL:', verifyAppearance.floatingPromoUrl);
        console.log('✅ Popup Modal URL:', verifyAppearance.popupModalImageUrl);
        console.log('✅ Banner Pages:', Object.keys(verifyBanners).length);

        console.log('\n🎉 IMAGE PLACEMENT FIXED!');
        console.log('=========================');
        console.log('\n📋 What was corrected:');
        console.log('1. ✅ Logo: ChatGPT landscape → Logo & Banner');
        console.log('2. ✅ Favicon: ChatGPT portrait → Browser icon');
        console.log('3. ✅ Specialist: April image → Footer profile');
        console.log('4. ✅ Floating Promo: New promo → Promotional popup');
        console.log('5. ✅ Popup Modal: Coupon design → Call-to-action');
        console.log('6. ✅ Banner: Fixed to use appropriate images per page');

        console.log('\n🚀 Next Steps:');
        console.log('1. Refresh browser at http://localhost:9002');
        console.log('2. Check homepage banner (should show logo image)');
        console.log('3. Verify favicon in browser tab');
        console.log('4. Check footer specialist image');
        console.log('5. Test floating promo popup');
        console.log('6. Verify popup modal image');

        console.log('\n💡 Image Context Mapping:');
        console.log('- Logo Image → Main branding & homepage banner');
        console.log('- Favicon → Browser tab icon (compact)');
        console.log('- Specialist → Footer profile (credibility)');
        console.log('- New Promo → Floating promotional content');
        console.log('- Coupon Design → Modal call-to-action graphics');

    } catch (error) {
        console.error('❌ Fix error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the fix
fixImagePlacement();
