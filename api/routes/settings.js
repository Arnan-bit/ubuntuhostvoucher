// api/routes/settings.js
import express from "express";
import db from "../utils/db.js";

const router = express.Router();

// Get all settings
router.get("/", (req, res) => {
    const query = "SELECT * FROM settings WHERE id = 'main_settings'";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching settings:", err);
            return res.status(500).json({ error: "Failed to fetch settings" });
        }

        if (results.length === 0) {
            // Create default settings if none exist
            const defaultSettings = {
                id: 'main_settings',
                theme: 'system',
                ga_id: '',
                fb_pixel_id: '',
                catalog_number_prefix: 'HV',
                currency_rates: JSON.stringify({}),
                gamification_points: JSON.stringify({}),
                site_appearance: JSON.stringify({}),
                page_banners: JSON.stringify([]),
                popup_modal: JSON.stringify({}),
                idle_sound: JSON.stringify({}),
                pagination_settings: JSON.stringify({
                    itemsPerPage: 12,
                    rowsPerPage: 3,
                    showPagination: true,
                    paginationStyle: 'numbers'
                }),
                nft_exchange_active: false,
                require_eth_address: true,
                max_points_per_user: 1000
            };

            const insertQuery = `
                INSERT INTO settings (
                    id, theme, ga_id, fb_pixel_id, catalog_number_prefix,
                    currency_rates, gamification_points, site_appearance,
                    page_banners, popup_modal, idle_sound, pagination_settings, nft_exchange_active,
                    require_eth_address, max_points_per_user
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                defaultSettings.pagination_settings,
                defaultSettings.nft_exchange_active,
                defaultSettings.require_eth_address,
                defaultSettings.max_points_per_user
            ];

            db.query(insertQuery, values, (err, insertResults) => {
                if (err) {
                    console.error("Error creating default settings:", err);
                    return res.status(500).json({ error: "Failed to create default settings" });
                }

                // Parse JSON fields for response
                const settings = {
                    ...defaultSettings,
                    currency_rates: JSON.parse(defaultSettings.currency_rates),
                    gamification_points: JSON.parse(defaultSettings.gamification_points),
                    site_appearance: JSON.parse(defaultSettings.site_appearance),
                    page_banners: JSON.parse(defaultSettings.page_banners),
                    popup_modal: JSON.parse(defaultSettings.popup_modal),
                    idle_sound: JSON.parse(defaultSettings.idle_sound),
                    pagination_settings: JSON.parse(defaultSettings.pagination_settings)
                };

                res.json(settings);
            });
        } else {
            // Parse JSON fields
            const settings = {
                ...results[0],
                currency_rates: results[0].currency_rates ? JSON.parse(results[0].currency_rates) : {},
                gamification_points: results[0].gamification_points ? JSON.parse(results[0].gamification_points) : {},
                site_appearance: results[0].site_appearance ? JSON.parse(results[0].site_appearance) : {},
                page_banners: results[0].page_banners ? JSON.parse(results[0].page_banners) : [],
                popup_modal: results[0].popup_modal ? JSON.parse(results[0].popup_modal) : {},
                idle_sound: results[0].idle_sound ? JSON.parse(results[0].idle_sound) : {},
                pagination_settings: results[0].pagination_settings ? JSON.parse(results[0].pagination_settings) : {
                    itemsPerPage: 12,
                    rowsPerPage: 3,
                    showPagination: true,
                    paginationStyle: 'numbers'
                }
            };

            res.json(settings);
        }
    });
});

// Update settings
router.put("/", (req, res) => {
    const settingsData = req.body;

    const updateQuery = `
        UPDATE settings SET
            theme = ?,
            ga_id = ?,
            fb_pixel_id = ?,
            catalog_number_prefix = ?,
            currency_rates = ?,
            gamification_points = ?,
            site_appearance = ?,
            page_banners = ?,
            popup_modal = ?,
            idle_sound = ?,
            pagination_settings = ?,
            nft_exchange_active = ?,
            require_eth_address = ?,
            max_points_per_user = ?
        WHERE id = 'main_settings'
    `;

    const values = [
        settingsData.theme || 'system',
        settingsData.ga_id || '',
        settingsData.fb_pixel_id || '',
        settingsData.catalog_number_prefix || 'HV',
        JSON.stringify(settingsData.currency_rates || {}),
        JSON.stringify(settingsData.gamification_points || {}),
        JSON.stringify(settingsData.site_appearance || {}),
        JSON.stringify(settingsData.page_banners || []),
        JSON.stringify(settingsData.popup_modal || {}),
        JSON.stringify(settingsData.idle_sound || {}),
        JSON.stringify(settingsData.pagination_settings || {
            itemsPerPage: 12,
            rowsPerPage: 3,
            showPagination: true,
            paginationStyle: 'numbers'
        }),
        settingsData.nft_exchange_active || false,
        settingsData.require_eth_address !== undefined ? settingsData.require_eth_address : true,
        settingsData.max_points_per_user || 1000
    ];

    db.query(updateQuery, values, (err, results) => {
        if (err) {
            console.error("Error updating settings:", err);
            return res.status(500).json({ error: "Failed to update settings" });
        }

        res.json({ message: "Settings updated successfully" });
    });
});

// Get banners specifically
router.get("/banners", (req, res) => {
    const query = "SELECT page_banners FROM settings WHERE id = 'main_settings'";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching banners:", err);
            return res.status(500).json({ error: "Failed to fetch banners" });
        }

        const banners = results[0]?.page_banners ? JSON.parse(results[0].page_banners) : [];
        res.json(banners);
    });
});

// Update banners specifically
router.put("/banners", (req, res) => {
    const { banners } = req.body;

    const updateQuery = "UPDATE settings SET page_banners = ? WHERE id = 'main_settings'";

    db.query(updateQuery, [JSON.stringify(banners || [])], (err, results) => {
        if (err) {
            console.error("Error updating banners:", err);
            return res.status(500).json({ error: "Failed to update banners" });
        }

        res.json({ message: "Banners updated successfully" });
    });
});

export default router;
