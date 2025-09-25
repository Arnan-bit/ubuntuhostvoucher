const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
};

async function addDefaultBanners() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Default banner data using uploaded images
        const defaultBanners = {
            home: {
                slides: [
                    {
                        imageUrl: 'https://hostvocher.com/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
                        title: 'Welcome to HostVoucher',
                        subtitle: 'Find the best hosting deals and save money on your web hosting needs',
                        buttonText: 'Browse Deals',
                        buttonLink: '/web-hosting',
                        enabled: true
                    },
                    {
                        imageUrl: 'https://hostvocher.com/uploads/images/1755916060366_new_promo.png',
                        title: 'Premium Hosting Solutions',
                        subtitle: 'Get 99.9% uptime guarantee with our trusted hosting partners',
                        buttonText: 'Get Started',
                        buttonLink: '/hosting',
                        enabled: true
                    }
                ],
                rotationInterval: 8000
            },
            'web-hosting': {
                slides: [
                    {
                        imageUrl: 'https://hostvocher.com/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
                        title: 'Best Web Hosting Deals',
                        subtitle: 'Professional hosting solutions for your website',
                        buttonText: 'View Deals',
                        buttonLink: '/web-hosting',
                        enabled: true
                    }
                ],
                rotationInterval: 8000
            },
            'hosting': {
                slides: [
                    {
                        imageUrl: 'https://hostvocher.com/uploads/images/1755916097312_design_grafis_coupon_1_11zon.png',
                        title: 'Hosting Solutions',
                        subtitle: 'Reliable hosting services for your business',
                        buttonText: 'Explore',
                        buttonLink: '/hosting',
                        enabled: true
                    }
                ],
                rotationInterval: 8000
            }
        };

        // Get current settings
        const [currentSettings] = await connection.execute(
            'SELECT site_appearance, page_banners FROM settings WHERE id = ?',
            ['main_settings']
        );

        if (currentSettings.length === 0) {
            console.log('❌ No settings found with ID "main_settings"');
            return;
        }

        const setting = currentSettings[0];
        
        // Parse existing site_appearance
        let siteAppearance = {};
        if (setting.site_appearance) {
            try {
                siteAppearance = JSON.parse(setting.site_appearance);
            } catch (e) {
                console.log('⚠️ Error parsing existing site_appearance, using empty object');
            }
        }

        // Update site_appearance with banner data for backward compatibility
        siteAppearance = {
            ...siteAppearance,
            // Add home banner slides to site_appearance for legacy support
            banner_slide_1_image: defaultBanners.home.slides[0].imageUrl,
            banner_slide_1_title: defaultBanners.home.slides[0].title,
            banner_slide_1_subtitle: defaultBanners.home.slides[0].subtitle,
            banner_slide_1_button_text: defaultBanners.home.slides[0].buttonText,
            banner_slide_1_button_link: defaultBanners.home.slides[0].buttonLink,
            banner_slide_2_image: defaultBanners.home.slides[1].imageUrl,
            banner_slide_2_title: defaultBanners.home.slides[1].title,
            banner_slide_2_subtitle: defaultBanners.home.slides[1].subtitle,
            banner_slide_2_button_text: defaultBanners.home.slides[1].buttonText,
            banner_slide_2_button_link: defaultBanners.home.slides[1].buttonLink,
            rotation_interval: 8,
            // Update with uploaded images
            specialistImageUrl: 'https://hostvocher.com/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
            floatingPromoUrl: 'https://hostvocher.com/uploads/images/1755916060366_new_promo.png',
            popupModalImageUrl: 'https://hostvocher.com/uploads/images/1755916097312_design_grafis_coupon_1_11zon.png',
            logo_url: siteAppearance.logo_url || 'https://hostvocher.com/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
            banner_image: siteAppearance.banner_image || 'https://hostvocher.com/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png'
        };

        // Update database
        const updateQuery = `
            UPDATE settings SET 
                site_appearance = ?,
                page_banners = ?
            WHERE id = ?
        `;

        const values = [
            JSON.stringify(siteAppearance),
            JSON.stringify(defaultBanners),
            'main_settings'
        ];

        await connection.execute(updateQuery, values);

        console.log('✅ Default banners added successfully!');
        console.log('📊 Added banners for pages:', Object.keys(defaultBanners));
        console.log('🖼️ Home page slides:', defaultBanners.home.slides.length);
        console.log('🌐 Web hosting slides:', defaultBanners['web-hosting'].slides.length);

    } catch (error) {
        console.error('❌ Error adding default banners:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run if this file is executed directly
if (require.main === module) {
    addDefaultBanners();
}

module.exports = { addDefaultBanners };
