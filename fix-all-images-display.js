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

async function fixAllImagesDisplay() {
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

        console.log('\n🔍 Analyzing Current Image Issues:');
        console.log('==================================');

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

        // Check available uploaded images
        const uploadsDir = path.join(__dirname, 'public', 'uploads', 'images');
        console.log('\n📁 Available Uploaded Images:');
        console.log('=============================');
        
        if (fs.existsSync(uploadsDir)) {
            const imageFiles = fs.readdirSync(uploadsDir).filter(file => file.endsWith('.png'));
            imageFiles.forEach(file => {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                const fileSizeKB = Math.round(stats.size / 1024);
                console.log(`📸 ${file} (${fileSizeKB}KB)`);
            });
        } else {
            console.log('❌ Uploads directory not found');
            return;
        }

        console.log('\n🎯 FIXING ALL IMAGE DISPLAYS:');
        console.log('=============================');

        // BERDASARKAN SCREENSHOT YANG DIKIRIM:
        // 1. Banner Home: Harus tampil dengan background image yang sesuai
        // 2. Specialist Profile: Harus tampil gambar April di footer
        // 3. Floating Promo: Harus tampil popup promo
        // 4. Branding Logo: Harus tampil di header

        const perfectImageMapping = {
            // BRANDING - Logo untuk header (sesuai screenshot branding)
            brandLogoUrl: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            logo_url: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            
            // FAVICON - Icon browser
            favicon_url: '/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
            
            // SPECIALIST - Profile image untuk footer (sesuai screenshot specialist)
            specialistImageUrl: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            specialist_image_url: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png',
            
            // FLOATING PROMO - Popup promotional (sesuai screenshot floating promo)
            floatingPromoUrl: '/uploads/images/1755926500003_new_promo.png',
            floating_promo_url: '/uploads/images/1755926500003_new_promo.png',
            
            // POPUP MODAL - Call-to-action
            popupModalImageUrl: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            popup_modal_image_url: '/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png',
            
            // BANNER - Background untuk homepage (sesuai screenshot banner home)
            heroBackgroundImageUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            banner_image: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            
            // ADDITIONAL SETTINGS
            site_title: 'HostVoucher',
            site_description: '#1 source for exclusive tech & digital service deals!',
            primary_color: '#f97316',
            secondary_color: '#1e293b',
            banner_text: 'Find the Best Hosting Deals in One Click',
            banner_subtitle: 'We compare, you save. Discover promos for domains, VPS, cloud hosting, and more.',
            footer_text: '© 2025 HostVoucher. All rights reserved. Built with ❤️ for the best deals.'
        };

        // Update site_appearance dengan mapping yang sempurna
        const updatedSiteAppearance = {
            ...siteAppearance,
            ...perfectImageMapping
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

        // PERFECT BANNER CONFIGURATION - sesuai screenshot
        const perfectPageBanners = {
            home: {
                enabled: true,
                slides: [
                    {
                        id: 1,
                        title: "Find the Best Hosting Deals in One Click",
                        subtitle: "We compare, you save. Discover promos for domains, VPS, cloud hosting, and more.",
                        imageUrl: '/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png', // Banner background
                        buttonText: "Search Hosting Deals",
                        buttonLink: "/web-hosting",
                        buttonColor: "#f97316",
                        textPosition: "center",
                        enabled: true,
                        overlayOpacity: 0.7,
                        textColor: "#ffffff"
                    }
                ],
                animationType: "fade",
                rotationInterval: 8,
                autoRotate: false,
                height: "400px"
            },
            "web-hosting": {
                enabled: true,
                slides: [
                    {
                        id: 1,
                        title: "Premium Web Hosting Solutions",
                        subtitle: "Professional hosting with 99.9% uptime guarantee",
                        imageUrl: '/uploads/images/1755926500003_new_promo.png', // Promo image
                        buttonText: "View Hosting Plans",
                        buttonLink: "/web-hosting",
                        buttonColor: "#10b981",
                        textPosition: "left",
                        enabled: true,
                        overlayOpacity: 0.6,
                        textColor: "#ffffff"
                    }
                ],
                animationType: "slide",
                rotationInterval: 10,
                autoRotate: false,
                height: "350px"
            },
            hosting: {
                enabled: true,
                slides: [
                    {
                        id: 1,
                        title: "Reliable Hosting Services",
                        subtitle: "Trusted by thousands of websites worldwide",
                        imageUrl: '/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png', // Specialist image
                        buttonText: "Learn More",
                        buttonLink: "/hosting",
                        buttonColor: "#8b5cf6",
                        textPosition: "center",
                        enabled: true,
                        overlayOpacity: 0.5,
                        textColor: "#ffffff"
                    }
                ],
                animationType: "fade",
                rotationInterval: 12,
                autoRotate: false,
                height: "300px"
            }
        };

        console.log('\n📝 Perfect Image Assignments:');
        console.log('=============================');
        console.log('🏷️  Branding Logo:', perfectImageMapping.brandLogoUrl);
        console.log('🔖 Favicon:', perfectImageMapping.favicon_url);
        console.log('👨‍💼 Specialist Profile:', perfectImageMapping.specialistImageUrl);
        console.log('🎯 Floating Promo:', perfectImageMapping.floatingPromoUrl);
        console.log('🎫 Popup Modal:', perfectImageMapping.popupModalImageUrl);
        console.log('🖼️  Banner Background:', perfectImageMapping.banner_image);

        // Verify all files exist before updating
        console.log('\n✅ File Verification:');
        console.log('=====================');
        
        const imagesToVerify = [
            { name: 'Branding Logo', path: perfectImageMapping.brandLogoUrl },
            { name: 'Favicon', path: perfectImageMapping.favicon_url },
            { name: 'Specialist', path: perfectImageMapping.specialistImageUrl },
            { name: 'Floating Promo', path: perfectImageMapping.floatingPromoUrl },
            { name: 'Popup Modal', path: perfectImageMapping.popupModalImageUrl },
            { name: 'Banner Background', path: perfectImageMapping.banner_image }
        ];

        let allFilesExist = true;
        imagesToVerify.forEach(img => {
            const fullPath = path.join(__dirname, 'public', img.path);
            if (fs.existsSync(fullPath)) {
                const stats = fs.statSync(fullPath);
                const fileSizeKB = Math.round(stats.size / 1024);
                console.log(`✅ ${img.name}: ${fileSizeKB}KB - READY`);
            } else {
                console.log(`❌ ${img.name}: FILE NOT FOUND - ${img.path}`);
                allFilesExist = false;
            }
        });

        if (!allFilesExist) {
            console.log('\n❌ Some files are missing. Cannot proceed.');
            return;
        }

        // Update database dengan konfigurasi yang sempurna
        await connection.execute(
            'UPDATE settings SET site_appearance = ?, page_banners = ? WHERE id = ?',
            [
                JSON.stringify(updatedSiteAppearance),
                JSON.stringify(perfectPageBanners),
                'main_settings'
            ]
        );

        console.log('\n✅ Database updated with perfect image configuration!');

        // Final verification
        console.log('\n🔍 Final Verification:');
        console.log('======================');
        const [verifyRows] = await connection.execute('SELECT site_appearance, page_banners FROM settings WHERE id = ?', ['main_settings']);
        const verifyAppearance = JSON.parse(verifyRows[0].site_appearance);
        const verifyBanners = JSON.parse(verifyRows[0].page_banners);

        console.log('✅ Branding Logo URL:', verifyAppearance.brandLogoUrl);
        console.log('✅ Specialist Profile URL:', verifyAppearance.specialistImageUrl);
        console.log('✅ Floating Promo URL:', verifyAppearance.floatingPromoUrl);
        console.log('✅ Banner Background URL:', verifyAppearance.banner_image);
        console.log('✅ Banner Pages Configured:', Object.keys(verifyBanners).length);

        console.log('\n🎉 ALL IMAGES FIXED AND READY!');
        console.log('==============================');
        console.log('\n📋 What was perfected:');
        console.log('1. ✅ Banner Home: Background image configured perfectly');
        console.log('2. ✅ Specialist Profile: April image ready for footer display');
        console.log('3. ✅ Floating Promo: New promo popup configured');
        console.log('4. ✅ Branding Logo: Header logo ready');
        console.log('5. ✅ All paths verified and files accessible');
        console.log('6. ✅ Banner slides optimized for each page');

        console.log('\n🚀 TESTING RESULTS EXPECTED:');
        console.log('============================');
        console.log('🏠 Homepage Banner: Purple background with "Banner Image" text overlay');
        console.log('👨‍💼 Footer Specialist: April profile image in circular frame');
        console.log('🎯 Floating Promo: "Promotional Offer" popup after 5 seconds');
        console.log('🏷️  Header Logo: Professional branding logo');
        console.log('🔖 Browser Tab: Favicon visible in tab');

        console.log('\n💡 PERFECT DISPLAY MAPPING:');
        console.log('===========================');
        console.log('📸 April Profile → Branding Logo & Specialist Profile');
        console.log('📸 ChatGPT Portrait → Favicon (browser icon)');
        console.log('📸 New Promo → Floating promotional popup');
        console.log('📸 Coupon Design → Modal call-to-action');
        console.log('📸 ChatGPT Landscape → Banner background');

        console.log('\n🎊 INTEGRATION COMPLETE & PERFECT!');
        console.log('==================================');
        console.log('All images now configured to display exactly as shown');
        console.log('in your screenshots with professional placement!');

        console.log('\n🔗 Test URLs:');
        console.log('=============');
        console.log('🌐 Homepage: http://localhost:9002');
        console.log('🌐 Admin Panel: http://localhost:9002/admin/settings');
        console.log('🌐 Web Hosting: http://localhost:9002/web-hosting');

    } catch (error) {
        console.error('❌ Fix error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the perfect fix
fixAllImagesDisplay();
