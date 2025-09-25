const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
};

async function fixBannerData() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        // Get current settings
        const [rows] = await connection.execute('SELECT * FROM settings WHERE id = ?', ['main_settings']);
        
        if (rows.length === 0) {
            console.log('No settings found, creating default settings...');
            
            const defaultBanners = {
                home: {
                    slides: [
                        {
                            imageUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png',
                            title: 'Welcome to HostVoucher',
                            subtitle: 'Find the best hosting deals and save money on your next purchase',
                            buttonText: 'Explore Deals',
                            buttonLink: '/web-hosting'
                        }
                    ],
                    rotationInterval: 8000
                },
                landing: {
                    slides: [
                        {
                            imageUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png',
                            title: 'Special Landing Offer',
                            subtitle: 'Exclusive deals just for you',
                            buttonText: 'Get Started',
                            buttonLink: '/web-hosting'
                        }
                    ],
                    rotationInterval: 8000
                },
                hosting: {
                    slides: [
                        {
                            imageUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png',
                            title: 'Best Hosting Deals',
                            subtitle: 'Premium hosting at unbeatable prices',
                            buttonText: 'View Plans',
                            buttonLink: '/web-hosting'
                        }
                    ],
                    rotationInterval: 8000
                }
            };

            const defaultSiteAppearance = {
                specialistImageUrl: 'https://i.ibb.co/QdBBzJL/specialist-profile.jpg',
                floatingPromoUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png',
                brandLogoUrl: 'https://i.ibb.co/7XqJKzP/hostvoucher-logo.png',
                heroBackgroundImageUrl: 'https://i.ibb.co/9yKvpjZ/hero-bg.jpg',
                popupModalImageUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png'
            };

            await connection.execute(`
                INSERT INTO settings (id, theme, ga_id, fb_pixel_id, catalog_number_prefix, currency_rates, gamification_points, site_appearance, page_banners, popup_modal, idle_sound)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'main_settings',
                'dark',
                '',
                '',
                'HV',
                JSON.stringify({}),
                JSON.stringify({}),
                JSON.stringify(defaultSiteAppearance),
                JSON.stringify(defaultBanners),
                JSON.stringify({}),
                JSON.stringify({})
            ]);

            console.log('Default settings created successfully');
        } else {
            const settings = rows[0];
            console.log('Current settings found, checking banner data...');

            let pageBanners;
            try {
                pageBanners = typeof settings.page_banners === 'string' 
                    ? JSON.parse(settings.page_banners) 
                    : settings.page_banners;
            } catch (e) {
                console.log('Invalid page_banners JSON, resetting...');
                pageBanners = {};
            }

            // Fix banner structure if needed
            let needsUpdate = false;
            const pages = ['home', 'landing', 'hosting', 'web-hosting', 'wordpress-hosting', 'cloud-hosting', 'vps', 'vpn', 'domains', 'promotional-vouchers'];

            pages.forEach(page => {
                if (!pageBanners[page]) {
                    pageBanners[page] = {
                        slides: [],
                        rotationInterval: 8000
                    };
                    needsUpdate = true;
                }

                // Ensure slides array exists
                if (!pageBanners[page].slides) {
                    pageBanners[page].slides = [];
                    needsUpdate = true;
                }

                // Ensure rotationInterval exists
                if (!pageBanners[page].rotationInterval) {
                    pageBanners[page].rotationInterval = 8000;
                    needsUpdate = true;
                }

                // Fix slide structure
                pageBanners[page].slides = pageBanners[page].slides.map(slide => ({
                    imageUrl: slide.imageUrl || '',
                    title: slide.title || '',
                    subtitle: slide.subtitle || '',
                    buttonText: slide.buttonText || '',
                    buttonLink: slide.buttonLink || ''
                }));

                // Add default banners for pages if empty
                if (page === 'home' && pageBanners[page].slides.length <= 1) {
                    pageBanners[page].slides = [
                        {
                            imageUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png',
                            title: 'Welcome to HostVoucher',
                            subtitle: 'Find the best hosting deals and save money on your next purchase',
                            buttonText: 'Explore Deals',
                            buttonLink: '/web-hosting'
                        },
                        {
                            imageUrl: 'https://i.ibb.co/9yKvpjZ/hero-bg.jpg',
                            title: 'Premium Hosting Solutions',
                            subtitle: 'Get reliable hosting with 99.9% uptime guarantee',
                            buttonText: 'View Plans',
                            buttonLink: '/web-hosting'
                        }
                    ];
                    needsUpdate = true;
                }

                if (page === 'web-hosting' && pageBanners[page].slides.length === 0) {
                    pageBanners[page].slides.push({
                        imageUrl: 'https://i.ibb.co/QdBBzJL/specialist-profile.jpg',
                        title: 'Best Web Hosting Deals',
                        subtitle: 'Professional hosting solutions for your website',
                        buttonText: 'Get Started',
                        buttonLink: '/web-hosting'
                    });
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                await connection.execute(
                    'UPDATE settings SET page_banners = ? WHERE id = ?',
                    [JSON.stringify(pageBanners), 'main_settings']
                );
                console.log('Banner data structure fixed and updated');
            } else {
                console.log('Banner data structure is already correct');
            }

            console.log('Current banner pages:', Object.keys(pageBanners));
            Object.keys(pageBanners).forEach(page => {
                console.log(`${page}: ${pageBanners[page].slides.length} slides`);
            });
        }

    } catch (error) {
        console.error('Error fixing banner data:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the fix
fixBannerData();
