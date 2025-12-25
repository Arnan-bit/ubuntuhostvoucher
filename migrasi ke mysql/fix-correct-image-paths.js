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

async function fixCorrectImagePaths() {
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

        console.log('\n🔍 Found Images in public/uploads/images/:');
        console.log('==========================================');

        // Check which files actually exist
        const uploadsDir = path.join(__dirname, 'public', 'uploads', 'images');
        const imageFiles = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.png'));
        
        imageFiles.forEach(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            const fileSizeKB = Math.round(stats.size / 1024);
            console.log(`📁 ${file} (${fileSizeKB}KB)`);
        });

        console.log('\n🎯 Mapping Images to Correct Purposes:');
        console.log('======================================');

        // BERDASARKAN SCREENSHOT ADMIN PANEL DAN FILE YANG ADA:
        // Logo: ChatGPT Image 18 Agu 2025, 10.55.24.png (landscape untuk branding)
        // Favicon: ChatGPT Image 18 Agu 2025, 10.37.41.png (portrait untuk icon)
        // Specialist: ChatGPT Image Apr 8, 2025, 05_52_32 PM.png (profile image)
        // Floating Promo: new promo.png (promotional content)
        // Popup Modal: design grafis coupon 1 11zon.png (call-to-action)

        const correctImagePaths = {
            // BRANDING - Logo untuk header dan banner
            brandLogoUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            logo_url: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            
            // FAVICON - Icon untuk browser tab
            favicon_url: '/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
            
            // SPECIALIST - Profile image untuk footer dan landing
            specialistImageUrl: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            specialist_image_url: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            
            // FLOATING PROMO - Promotional popup
            floatingPromoUrl: '/uploads/images/1755926500003_new_promo.png',
            floating_promo_url: '/uploads/images/1755926500003_new_promo.png',
            
            // POPUP MODAL - Call-to-action graphics
            popupModalImageUrl: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            popup_modal_image_url: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            
            // BANNER - Background untuk homepage
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

        // Verify all files exist
        console.log('\n✅ File Verification:');
        console.log('=====================');
        
        let allFilesExist = true;
        const imagesToVerify = [
            { name: 'Logo', path: correctImagePaths.brandLogoUrl },
            { name: 'Favicon', path: correctImagePaths.favicon_url },
            { name: 'Specialist', path: correctImagePaths.specialistImageUrl },
            { name: 'Floating Promo', path: correctImagePaths.floatingPromoUrl },
            { name: 'Popup Modal', path: correctImagePaths.popupModalImageUrl }
        ];

        imagesToVerify.forEach(img => {
            const fullPath = path.join(__dirname, 'public', img.path);
            if (fs.existsSync(fullPath)) {
                const stats = fs.statSync(fullPath);
                const fileSizeKB = Math.round(stats.size / 1024);
                console.log(`✅ ${img.name}: ${fileSizeKB}KB - ${img.path}`);
            } else {
                console.log(`❌ ${img.name}: File not found - ${img.path}`);
                allFilesExist = false;
            }
        });

        if (!allFilesExist) {
            console.log('\n❌ Some files are missing. Cannot proceed.');
            return;
        }

        // Update site_appearance dengan path yang benar
        const updatedSiteAppearance = {
            ...siteAppearance,
            ...correctImagePaths
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

        // Update page banners dengan path yang benar
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

        console.log('\n📝 Final Image Assignments:');
        console.log('===========================');
        console.log('🏷️  Logo (Header & Banner):', correctImagePaths.brandLogoUrl);
        console.log('🔖 Favicon (Browser Tab):', correctImagePaths.favicon_url);
        console.log('👨‍💼 Specialist (Footer):', correctImagePaths.specialistImageUrl);
        console.log('🎯 Floating Promo (Popup):', correctImagePaths.floatingPromoUrl);
        console.log('🎫 Popup Modal (CTA):', correctImagePaths.popupModalImageUrl);

        // Update database
        await connection.execute(
            'UPDATE settings SET site_appearance = ?, page_banners = ? WHERE id = ?',
            [
                JSON.stringify(updatedSiteAppearance),
                JSON.stringify(updatedPageBanners),
                'main_settings'
            ]
        );

        console.log('\n✅ Database updated with correct image paths!');

        // Final verification
        console.log('\n🔍 Final Verification:');
        console.log('======================');
        const [verifyRows] = await connection.execute('SELECT site_appearance FROM settings WHERE id = ?', ['main_settings']);
        const verifyAppearance = JSON.parse(verifyRows[0].site_appearance);

        console.log('✅ Logo URL:', verifyAppearance.brandLogoUrl);
        console.log('✅ Favicon URL:', verifyAppearance.favicon_url);
        console.log('✅ Specialist URL:', verifyAppearance.specialistImageUrl);
        console.log('✅ Floating Promo URL:', verifyAppearance.floatingPromoUrl);
        console.log('✅ Popup Modal URL:', verifyAppearance.popupModalImageUrl);

        console.log('\n🎉 IMAGE PATHS FIXED!');
        console.log('=====================');
        console.log('\n📋 What was corrected:');
        console.log('1. ✅ Fixed image paths to point to public/uploads/images/');
        console.log('2. ✅ Verified all image files exist');
        console.log('3. ✅ Updated database with correct URLs');
        console.log('4. ✅ Configured banner slides with appropriate images');
        console.log('5. ✅ Ensured frontend component compatibility');

        console.log('\n🚀 Next Steps:');
        console.log('1. Refresh browser at http://localhost:9002');
        console.log('2. All images should now display correctly');
        console.log('3. Check header logo, favicon, footer specialist');
        console.log('4. Wait for floating promo popup');
        console.log('5. Verify banner on homepage');

        console.log('\n💡 Image Context:');
        console.log('=================');
        console.log('🏷️  ChatGPT Landscape → Logo & Banner (professional branding)');
        console.log('🔖 ChatGPT Portrait → Favicon (compact browser icon)');
        console.log('👨‍💼 April Profile → Specialist (credibility & personal touch)');
        console.log('🎯 New Promo → Floating popup (marketing appeal)');
        console.log('🎫 Coupon Design → Modal CTA (conversion graphics)');

    } catch (error) {
        console.error('❌ Path fix error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the fix
fixCorrectImagePaths();
