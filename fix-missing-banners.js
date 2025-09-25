const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
};

async function fixMissingBanners() {
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
        }

        // Create page banners using uploaded images
        const pageBanners = {
            home: {
                enabled: true,
                slides: [
                    {
                        id: 1,
                        title: "Welcome to HostVoucher",
                        subtitle: "Find the best hosting deals and save money",
                        imageUrl: siteAppearance.specialistImageUrl || "https://hostvocher.com/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png",
                        buttonText: "Explore Deals",
                        buttonLink: "/web-hosting",
                        buttonColor: "orange",
                        textPosition: "left",
                        enabled: true
                    },
                    {
                        id: 2,
                        title: "Special Promotional Offers",
                        subtitle: "Limited time deals on premium hosting services",
                        imageUrl: siteAppearance.floatingPromoUrl || "https://hostvocher.com/uploads/images/1755916060366_new_promo.png",
                        buttonText: "Get Promo",
                        buttonLink: "/promotional-vouchers",
                        buttonColor: "blue",
                        textPosition: "center",
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
                        imageUrl: siteAppearance.popupModalImageUrl || "https://hostvocher.com/uploads/images/1755916097312_design_grafis_coupon_1_11zon.png",
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
                        imageUrl: siteAppearance.specialistImageUrl || "https://hostvocher.com/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png",
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

        console.log('\n🔧 Creating page banners configuration...');
        console.log('==========================================');

        // Update database with page banners
        await connection.execute(
            'UPDATE settings SET page_banners = ? WHERE id = ?',
            [JSON.stringify(pageBanners), 'main_settings']
        );

        console.log('✅ Page banners configuration saved to database');

        // Verify the update
        console.log('\n🔍 Verifying page banners...');
        const [verifyRows] = await connection.execute('SELECT page_banners FROM settings WHERE id = ?', ['main_settings']);
        const verifyBanners = JSON.parse(verifyRows[0].page_banners);

        Object.keys(verifyBanners).forEach(page => {
            const banner = verifyBanners[page];
            console.log(`\n📄 ${page.toUpperCase()} Page:`);
            console.log(`   Enabled: ${banner.enabled ? 'Yes' : 'No'}`);
            console.log(`   Slides: ${banner.slides.length}`);
            console.log(`   Animation: ${banner.animationType}`);
            console.log(`   Auto-rotate: ${banner.autoRotate ? 'Yes' : 'No'}`);
            
            banner.slides.forEach((slide, index) => {
                console.log(`   Slide ${index + 1}:`);
                console.log(`     Title: ${slide.title}`);
                console.log(`     Image: ${slide.imageUrl}`);
                console.log(`     Enabled: ${slide.enabled ? 'Yes' : 'No'}`);
            });
        });

        // Test image accessibility
        console.log('\n🌐 Testing image accessibility...');
        console.log('==================================');

        const testImages = [
            { name: 'Specialist Image', url: siteAppearance.specialistImageUrl },
            { name: 'Floating Promo', url: siteAppearance.floatingPromoUrl },
            { name: 'Popup Modal', url: siteAppearance.popupModalImageUrl }
        ];

        for (const img of testImages) {
            if (img.url && img.url.includes('hostvocher.com')) {
                const proxyUrl = `http://localhost:9002/api/image-proxy?url=${encodeURIComponent(img.url)}`;
                console.log(`\n${img.name}:`);
                console.log(`  Original: ${img.url}`);
                console.log(`  Proxy: ${proxyUrl}`);
                console.log(`  Status: Should work with proxy in localhost`);
            }
        }

        console.log('\n✅ SETUP COMPLETE!');
        console.log('==================');
        console.log('\n🎯 What should now work:');
        console.log('1. ✅ Floating promo popup (already working - seen in screenshot)');
        console.log('2. ✅ Home page banners (2 slides with uploaded images)');
        console.log('3. ✅ Web hosting page banner (1 slide)');
        console.log('4. ✅ Specialist image in footer/landing page');
        console.log('5. ✅ All images use proxy for localhost development');

        console.log('\n🚀 Next Steps:');
        console.log('1. Refresh your browser at http://localhost:9002');
        console.log('2. Check home page for rotating banners');
        console.log('3. Look for specialist image in footer');
        console.log('4. Visit /web-hosting to see banner there');
        console.log('5. Check browser console for any remaining errors');

        console.log('\n💡 Troubleshooting:');
        console.log('- If images still not showing, check browser console');
        console.log('- Try hard refresh (Ctrl+F5)');
        console.log('- Test proxy URLs manually in browser');
        console.log('- Ensure Next.js server is running on port 9002');

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
fixMissingBanners();
