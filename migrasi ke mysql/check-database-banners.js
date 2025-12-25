const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function checkDatabaseBanners() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Check settings table structure
        console.log('\n📋 Checking settings table structure...');
        const [columns] = await connection.execute('DESCRIBE settings');
        console.log('Settings table columns:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
        });

        // Get current settings data
        console.log('\n📊 Checking current settings data...');
        const [settings] = await connection.execute('SELECT * FROM settings WHERE id = ?', ['main_settings']);
        
        if (settings.length > 0) {
            const setting = settings[0];
            console.log('Settings found:');
            console.log('  - ID:', setting.id);
            console.log('  - GA ID:', setting.ga_id);
            console.log('  - FB Pixel ID:', setting.fb_pixel_id);
            
            // Parse and display site_appearance
            if (setting.site_appearance) {
                try {
                    const siteAppearance = JSON.parse(setting.site_appearance);
                    console.log('\n🎨 Site Appearance Data:');
                    console.log('  - Site Title:', siteAppearance.site_title);
                    console.log('  - Logo URL:', siteAppearance.logo_url);
                    console.log('  - Specialist Image URL:', siteAppearance.specialistImageUrl);
                    console.log('  - Floating Promo URL:', siteAppearance.floatingPromoUrl);
                    console.log('  - Banner Image:', siteAppearance.banner_image);
                    
                    // Check banner slides
                    console.log('\n🖼️ Banner Slides:');
                    for (let i = 1; i <= 4; i++) {
                        const slideImage = siteAppearance[`banner_slide_${i}_image`];
                        const slideTitle = siteAppearance[`banner_slide_${i}_title`];
                        if (slideImage || slideTitle) {
                            console.log(`  Slide ${i}:`);
                            console.log(`    - Image: ${slideImage || 'Not set'}`);
                            console.log(`    - Title: ${slideTitle || 'Not set'}`);
                        }
                    }
                } catch (e) {
                    console.log('❌ Error parsing site_appearance JSON:', e.message);
                }
            } else {
                console.log('⚠️ No site_appearance data found');
            }
            
            // Parse and display page_banners
            if (setting.page_banners) {
                try {
                    const pageBanners = JSON.parse(setting.page_banners);
                    console.log('\n🏠 Page Banners Data:');
                    Object.keys(pageBanners).forEach(page => {
                        console.log(`  ${page.toUpperCase()}:`);
                        const pageData = pageBanners[page];
                        if (pageData.slides && pageData.slides.length > 0) {
                            pageData.slides.forEach((slide, index) => {
                                console.log(`    Slide ${index + 1}:`);
                                console.log(`      - Image: ${slide.imageUrl || 'Not set'}`);
                                console.log(`      - Title: ${slide.title || 'Not set'}`);
                                console.log(`      - Enabled: ${slide.enabled ? 'Yes' : 'No'}`);
                            });
                        } else {
                            console.log('    - No slides configured');
                        }
                    });
                } catch (e) {
                    console.log('❌ Error parsing page_banners JSON:', e.message);
                }
            } else {
                console.log('⚠️ No page_banners data found');
            }
            
        } else {
            console.log('❌ No settings found with ID "main_settings"');
            
            // Check if there are any settings at all
            const [allSettings] = await connection.execute('SELECT id FROM settings');
            if (allSettings.length > 0) {
                console.log('Available settings IDs:');
                allSettings.forEach(s => console.log(`  - ${s.id}`));
            } else {
                console.log('⚠️ Settings table is empty');
            }
        }

        console.log('\n✅ Database check completed');

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run check if this file is executed directly
if (require.main === module) {
    checkDatabaseBanners();
}

module.exports = { checkDatabaseBanners };
