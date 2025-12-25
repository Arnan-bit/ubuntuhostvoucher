const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Default settings with proper image URLs
const defaultSettings = {
    id: 'main_settings',
    theme: 'dark',
    ga_id: '',
    fb_pixel_id: '',
    catalog_number_prefix: 'HV',
    currency_rates: JSON.stringify({}),
    gamification_points: JSON.stringify({}),
    site_appearance: JSON.stringify({
        specialistImageUrl: 'https://i.ibb.co/QdBBzJL/specialist-profile.jpg',
        floatingPromoUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png',
        brandLogoUrl: 'https://i.ibb.co/7XqJKzP/hostvoucher-logo.png',
        heroBackgroundImageUrl: 'https://i.ibb.co/9yKvpjZ/hero-bg.jpg',
        popupModalImageUrl: 'https://i.ibb.co/L8y2zS6/new-promo.png'
    }),
    page_banners: JSON.stringify({
        home: {
            images: [
                'https://i.ibb.co/L8y2zS6/new-promo.png'
            ]
        }
    }),
    popup_modal: JSON.stringify({
        enabled: true,
        title: 'Special Offer!',
        description: 'Get amazing hosting deals now!',
        images: ['https://i.ibb.co/L8y2zS6/new-promo.png']
    }),
    idle_sound: JSON.stringify({
        enabled: false,
        url: ''
    }),
    nft_exchange_active: false,
    require_eth_address: true,
    max_points_per_user: 1000
};

// Function to initialize or update settings
function initializeSettings() {
    // First check if settings exist
    const checkQuery = "SELECT id FROM settings WHERE id = 'main_settings'";
    
    db.query(checkQuery, (err, results) => {
        if (err) {
            console.error("Error checking settings:", err);
            return;
        }

        if (results.length === 0) {
            // Insert new settings
            const insertQuery = `
                INSERT INTO settings (
                    id, theme, ga_id, fb_pixel_id, catalog_number_prefix,
                    currency_rates, gamification_points, site_appearance,
                    page_banners, popup_modal, idle_sound, nft_exchange_active,
                    require_eth_address, max_points_per_user
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                defaultSettings.id,
                defaultSettings.theme,
                defaultSettings.ga_id,
                defaultSettings.fb_pixel_id,
                defaultSettings.catalog_number_prefix,
                defaultSettings.currency_rates,
                defaultSettings.gamification_points,
                defaultSettings.site_appearance,
                defaultSettings.page_banners,
                defaultSettings.popup_modal,
                defaultSettings.idle_sound,
                defaultSettings.nft_exchange_active,
                defaultSettings.require_eth_address,
                defaultSettings.max_points_per_user
            ];

            db.query(insertQuery, values, (err, insertResults) => {
                if (err) {
                    console.error("Error inserting default settings:", err);
                } else {
                    console.log("✅ Default settings inserted successfully!");
                }
                db.end();
            });
        } else {
            // Update existing settings with new site_appearance
            const updateQuery = `
                UPDATE settings SET 
                    site_appearance = ?
                WHERE id = 'main_settings'
            `;

            db.query(updateQuery, [defaultSettings.site_appearance], (err, updateResults) => {
                if (err) {
                    console.error("Error updating settings:", err);
                } else {
                    console.log("✅ Settings updated with default images!");
                }
                db.end();
            });
        }
    });
}

// Connect and initialize
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to database");
    initializeSettings();
});
