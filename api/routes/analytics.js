// api/routes/analytics.js
import express from "express";
import db from "../utils/db.js";
import { randomUUID } from "crypto";

const router = express.Router();

// Track visitor
router.post("/track-visitor", async (req, res) => {
    try {
        const {
            ip_address,
            country,
            country_code,
            region,
            city,
            latitude,
            longitude,
            timezone,
            isp,
            user_agent,
            browser,
            browser_version,
            os,
            os_version,
            device_type,
            device_brand,
            device_model,
            referrer,
            landing_page,
            session_id,
            is_mobile,
            screen_resolution,
            language
        } = req.body;

        const visitorId = randomUUID();
        
        const query = `
            INSERT INTO visitor_analytics (
                id, ip_address, country, country_code, region, city,
                latitude, longitude, timezone, isp, user_agent, browser,
                browser_version, os, os_version, device_type, device_brand,
                device_model, referrer, landing_page, session_id, is_mobile,
                screen_resolution, language, visited_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            visitorId, ip_address, country, country_code, region, city,
            latitude, longitude, timezone, isp, user_agent, browser,
            browser_version, os, os_version, device_type, device_brand,
            device_model, referrer, landing_page, session_id, is_mobile,
            screen_resolution, language
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error tracking visitor:", err);
                return res.status(500).json({ error: "Failed to track visitor" });
            }
            res.json({ success: true, visitor_id: visitorId });
        });
    } catch (error) {
        console.error("Error in track-visitor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Track page view
router.post("/track-pageview", (req, res) => {
    try {
        const {
            visitor_id,
            session_id,
            page_url,
            page_title,
            referrer,
            time_on_page,
            scroll_depth,
            clicks_count
        } = req.body;

        const pageViewId = randomUUID();
        
        const query = `
            INSERT INTO page_views (
                id, visitor_id, session_id, page_url, page_title,
                referrer, time_on_page, scroll_depth, clicks_count, viewed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            pageViewId, visitor_id, session_id, page_url, page_title,
            referrer, time_on_page || 0, scroll_depth || 0, clicks_count || 0
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error tracking page view:", err);
                return res.status(500).json({ error: "Failed to track page view" });
            }
            res.json({ success: true, page_view_id: pageViewId });
        });
    } catch (error) {
        console.error("Error in track-pageview:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get visitor analytics
router.get("/visitors", (req, res) => {
    const { limit = 100, offset = 0, country, date_from, date_to } = req.query;
    
    let query = `
        SELECT 
            id, ip_address, country, country_code, region, city,
            latitude, longitude, timezone, isp, browser, os,
            device_type, referrer, landing_page, is_mobile,
            screen_resolution, language, visited_at, last_activity,
            page_views, visit_duration
        FROM visitor_analytics
        WHERE 1=1
    `;
    
    const values = [];
    
    if (country) {
        query += " AND country_code = ?";
        values.push(country);
    }
    
    if (date_from) {
        query += " AND visited_at >= ?";
        values.push(date_from);
    }
    
    if (date_to) {
        query += " AND visited_at <= ?";
        values.push(date_to);
    }
    
    query += " ORDER BY visited_at DESC LIMIT ? OFFSET ?";
    values.push(parseInt(limit), parseInt(offset));

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Error fetching visitors:", err);
            return res.status(500).json({ error: "Failed to fetch visitors" });
        }
        res.json(results);
    });
});

// Get analytics summary
router.get("/summary", (req, res) => {
    const { date_from, date_to } = req.query;
    
    let dateFilter = "";
    const values = [];
    
    if (date_from && date_to) {
        dateFilter = "WHERE visited_at BETWEEN ? AND ?";
        values.push(date_from, date_to);
    }
    
    const queries = [
        `SELECT COUNT(*) as total_visitors FROM visitor_analytics ${dateFilter}`,
        `SELECT COUNT(*) as total_page_views FROM page_views ${dateFilter.replace('visited_at', 'viewed_at')}`,
        `SELECT country, COUNT(*) as count FROM visitor_analytics ${dateFilter} GROUP BY country ORDER BY count DESC LIMIT 10`,
        `SELECT browser, COUNT(*) as count FROM visitor_analytics ${dateFilter} GROUP BY browser ORDER BY count DESC LIMIT 5`,
        `SELECT device_type, COUNT(*) as count FROM visitor_analytics ${dateFilter} GROUP BY device_type ORDER BY count DESC`,
        `SELECT AVG(visit_duration) as avg_duration FROM visitor_analytics ${dateFilter}`,
        `SELECT COUNT(*) as mobile_visitors FROM visitor_analytics ${dateFilter} AND is_mobile = 1`
    ];
    
    Promise.all(queries.map(query => 
        new Promise((resolve, reject) => {
            db.query(query, values, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        })
    )).then(results => {
        res.json({
            total_visitors: results[0][0].total_visitors,
            total_page_views: results[1][0].total_page_views,
            top_countries: results[2],
            top_browsers: results[3],
            device_breakdown: results[4],
            avg_visit_duration: results[5][0].avg_duration,
            mobile_visitors: results[6][0].mobile_visitors
        });
    }).catch(error => {
        console.error("Error fetching analytics summary:", error);
        res.status(500).json({ error: "Failed to fetch analytics summary" });
    });
});

// Get real-time visitors
router.get("/realtime", (req, res) => {
    const query = `
        SELECT 
            country, country_code, city, browser, device_type,
            landing_page, visited_at, is_mobile
        FROM visitor_analytics 
        WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
        ORDER BY visited_at DESC
        LIMIT 50
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching real-time visitors:", err);
            return res.status(500).json({ error: "Failed to fetch real-time visitors" });
        }
        res.json(results);
    });
});

export default router;
