const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function fixFrontendImageMapping() {
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

        // Parse current site_appearance
        let siteAppearance = {};
        try {
            if (settings.site_appearance) {
                siteAppearance = typeof settings.site_appearance === 'string' 
                    ? JSON.parse(settings.site_appearance) 
                    : settings.site_appearance;
            }
        } catch (e) {
            console.log('❌ Error parsing site_appearance:', e.message);
            siteAppearance = {};
        }

        console.log('\n🔧 Frontend Component Image Mapping Analysis:');
        console.log('==============================================');

        // BERDASARKAN ANALISIS KOMPONEN FRONTEND:
        // 1. BrandLogo component menggunakan: settings?.site_appearance?.brandLogoUrl
        // 2. FloatingPromotionalPopup menggunakan: siteAppearance?.floatingPromoUrl  
        // 3. Specialist image menggunakan: siteAppearance?.specialistImageUrl
        // 4. Admin panel menggunakan: logo_url, favicon_url, specialist_image_url, floating_promo_url, popup_modal_image_url
        // 5. Banner slides menggunakan: slide.imageUrl

        const frontendCompatibleMapping = {
            // LOGO - untuk BrandLogo component di header
            brandLogoUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            logo_url: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            
            // FAVICON - untuk browser tab
            favicon_url: '/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
            
            // SPECIALIST - untuk footer profile dan landing page
            specialistImageUrl: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            specialist_image_url: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            
            // FLOATING PROMO - untuk FloatingPromotionalPopup component
            floatingPromoUrl: '/uploads/images/1755926500003_new_promo.png',
            floating_promo_url: '/uploads/images/1755926500003_new_promo.png',
            
            // POPUP MODAL - untuk modal call-to-action
            popupModalImageUrl: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            popup_modal_image_url: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            
            // BANNER/HERO - untuk banner background
            heroBackgroundImageUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            banner_image: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            
            // ADMIN PANEL COMPATIBILITY
            site_title: siteAppearance.site_title || 'HostVoucher',
            site_description: siteAppearance.site_description || 'Find the best hosting deals',
            primary_color: siteAppearance.primary_color || '#f97316',
            secondary_color: siteAppearance.secondary_color || '#1e293b',
            banner_text: siteAppearance.banner_text || 'Find the Best Hosting Deals in One Click',
            footer_text: siteAppearance.footer_text || '© 2025 HostVoucher. All rights reserved.'
        };

        // Update site_appearance dengan semua mapping yang diperlukan
        const updatedSiteAppearance = {
            ...siteAppearance,
            ...frontendCompatibleMapping
        };

        // Parse current page_banners
        let pageBanners = {};
        try {
            if (settings.page_banners) {
                pageBanners = typeof settings.page_banners === 'string' 
                    ? JSON.parse(settings.page_banners) 
                    : settings.page_banners;
            }
        } catch (e) {
            console.log('❌ Error parsing page_banners:', e.message);
            pageBanners = {};
        }

        // Update page banners dengan gambar yang benar untuk setiap slide
        const updatedPageBanners = {
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
                        imageUrl: '/uploads/images/1755926500003_new_promo.png', // Promo untuk hosting page
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

        console.log('\n📝 Frontend Component Mapping:');
        console.log('==============================');
        console.log('🏷️  BrandLogo (Header):', frontendCompatibleMapping.brandLogoUrl);
        console.log('🔖 Favicon (Browser):', frontendCompatibleMapping.favicon_url);
        console.log('👨‍💼 Specialist (Footer/Landing):', frontendCompatibleMapping.specialistImageUrl);
        console.log('🎯 FloatingPromo (Popup):', frontendCompatibleMapping.floatingPromoUrl);
        console.log('🎫 PopupModal (CTA):', frontendCompatibleMapping.popupModalImageUrl);
        console.log('🖼️  Banner (Background):', frontendCompatibleMapping.banner_image);

        // Update database
        await connection.execute(
            'UPDATE settings SET site_appearance = ?, page_banners = ? WHERE id = ?',
            [
                JSON.stringify(updatedSiteAppearance),
                JSON.stringify(updatedPageBanners),
                'main_settings'
            ]
        );

        console.log('\n✅ Frontend image mapping updated successfully!');

        // Verify the update
        console.log('\n🔍 Verifying frontend compatibility...');
        const [verifyRows] = await connection.execute('SELECT site_appearance, page_banners FROM settings WHERE id = ?', ['main_settings']);
        const verifyAppearance = JSON.parse(verifyRows[0].site_appearance);
        const verifyBanners = JSON.parse(verifyRows[0].page_banners);

        console.log('\n📊 Frontend Component Verification:');
        console.log('===================================');
        console.log('✅ BrandLogo component will use:', verifyAppearance.brandLogoUrl ? '✓ FOUND' : '❌ MISSING');
        console.log('✅ FloatingPromo component will use:', verifyAppearance.floatingPromoUrl ? '✓ FOUND' : '❌ MISSING');
        console.log('✅ Specialist component will use:', verifyAppearance.specialistImageUrl ? '✓ FOUND' : '❌ MISSING');
        console.log('✅ Admin panel logo field:', verifyAppearance.logo_url ? '✓ FOUND' : '❌ MISSING');
        console.log('✅ Admin panel favicon field:', verifyAppearance.favicon_url ? '✓ FOUND' : '❌ MISSING');
        console.log('✅ Banner slides configured:', Object.keys(verifyBanners).length, 'pages');

        console.log('\n🎉 FRONTEND MAPPING COMPLETE!');
        console.log('=============================');
        console.log('\n📋 Component-Image Assignments:');
        console.log('1. ✅ Header Logo → ChatGPT landscape image');
        console.log('2. ✅ Browser Favicon → ChatGPT portrait image');
        console.log('3. ✅ Footer Specialist → April profile image');
        console.log('4. ✅ Floating Popup → New promo design');
        console.log('5. ✅ Modal CTA → Coupon design');
        console.log('6. ✅ Banner Slides → Context-appropriate images');

        console.log('\n🚀 Next Steps:');
        console.log('1. Refresh browser at http://localhost:9002');
        console.log('2. Check header logo (should show ChatGPT landscape)');
        console.log('3. Check browser tab favicon');
        console.log('4. Scroll to footer to see specialist image');
        console.log('5. Wait 5 seconds for floating promo popup');
        console.log('6. Check banner on homepage');

        console.log('\n💡 Frontend Component Analysis:');
        console.log('- BrandLogo component reads: site_appearance.brandLogoUrl');
        console.log('- FloatingPromo reads: siteAppearance.floatingPromoUrl');
        console.log('- Specialist reads: siteAppearance.specialistImageUrl');
        console.log('- Banner slides read: slide.imageUrl');
        console.log('- Admin panel reads: logo_url, favicon_url, etc.');

    } catch (error) {
        console.error('❌ Frontend mapping error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the fix
fixFrontendImageMapping();
