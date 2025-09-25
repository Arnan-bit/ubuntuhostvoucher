// api/create-analytics-tables.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

console.log('Creating analytics tables...');

const createTables = [
    `CREATE TABLE IF NOT EXISTS visitor_analytics (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        ip_address VARCHAR(45),
        country VARCHAR(100),
        country_code VARCHAR(2),
        region VARCHAR(100),
        city VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        timezone VARCHAR(50),
        isp VARCHAR(255),
        user_agent TEXT,
        browser VARCHAR(100),
        browser_version VARCHAR(50),
        os VARCHAR(100),
        os_version VARCHAR(50),
        device_type VARCHAR(50),
        device_brand VARCHAR(100),
        device_model VARCHAR(100),
        referrer TEXT,
        landing_page VARCHAR(500),
        session_id VARCHAR(100),
        visit_duration INTEGER DEFAULT 0,
        page_views INTEGER DEFAULT 1,
        is_bot BOOLEAN DEFAULT FALSE,
        is_mobile BOOLEAN DEFAULT FALSE,
        screen_resolution VARCHAR(20),
        language VARCHAR(10),
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS page_views (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        visitor_id VARCHAR(36),
        session_id VARCHAR(100),
        page_url VARCHAR(500),
        page_title VARCHAR(255),
        referrer TEXT,
        time_on_page INTEGER DEFAULT 0,
        scroll_depth INTEGER DEFAULT 0,
        clicks_count INTEGER DEFAULT 0,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS marketing_campaigns (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        campaign_name VARCHAR(255),
        campaign_source VARCHAR(100),
        campaign_medium VARCHAR(100),
        campaign_content VARCHAR(255),
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_term VARCHAR(100),
        utm_content VARCHAR(100),
        target_countries TEXT,
        target_demographics TEXT,
        budget DECIMAL(10, 2),
        start_date DATE,
        end_date DATE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS campaign_analytics (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        campaign_id VARCHAR(36),
        visitor_id VARCHAR(36),
        conversion_type VARCHAR(50),
        conversion_value DECIMAL(10, 2),
        attributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
];

const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_visitor_analytics_ip ON visitor_analytics(ip_address)',
    'CREATE INDEX IF NOT EXISTS idx_visitor_analytics_country ON visitor_analytics(country_code)',
    'CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visited_at ON visitor_analytics(visited_at)',
    'CREATE INDEX IF NOT EXISTS idx_visitor_analytics_session ON visitor_analytics(session_id)',
    'CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id)',
    'CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id)',
    'CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at)',
    'CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_active ON marketing_campaigns(is_active)',
    'CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id)',
    'CREATE INDEX IF NOT EXISTS idx_campaign_analytics_visitor_id ON campaign_analytics(visitor_id)'
];

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    
    console.log('✅ Connected to database');
    
    let completed = 0;
    const total = createTables.length + createIndexes.length;
    
    // Create tables
    createTables.forEach((sql, index) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.error(`❌ Error creating table ${index + 1}:`, err);
            } else {
                console.log(`✅ Table ${index + 1} created successfully`);
            }
            
            completed++;
            if (completed === total) {
                console.log('🎉 All analytics tables and indexes created successfully!');
                db.end();
            }
        });
    });
    
    // Create indexes
    createIndexes.forEach((sql, index) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.error(`❌ Error creating index ${index + 1}:`, err);
            } else {
                console.log(`✅ Index ${index + 1} created successfully`);
            }
            
            completed++;
            if (completed === total) {
                console.log('🎉 All analytics tables and indexes created successfully!');
                db.end();
            }
        });
    });
});
