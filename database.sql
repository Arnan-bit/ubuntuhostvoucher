-- HostVoucher Admin Panel Database Schema
-- Dikonversi dari PostgreSQL ke MySQL

-- Tabel Products (Catalog)
CREATE TABLE IF NOT EXISTS products (
    -- #UBAH: Menggunakan VARCHAR(36) untuk UUID dan fungsi UUID() MySQL 8.0+
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    provider VARCHAR(255),
    `type` VARCHAR(100), -- #UBAH: type adalah kata kunci, gunakan backtick
    tier VARCHAR(100),
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    discount VARCHAR(50),
    features TEXT,
    link VARCHAR(500),
    target_url VARCHAR(500),
    image VARCHAR(500),
    provider_logo VARCHAR(500),
    rating DECIMAL(2,1),
    num_reviews INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    code VARCHAR(100),
    short_link VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    catalog_number INTEGER UNIQUE,
    color VARCHAR(50),
    button_color VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    show_on_landing BOOLEAN DEFAULT TRUE,
    display_style VARCHAR(50),
    catalog_image VARCHAR(500),
    brand_logo VARCHAR(500),
    brand_logo_text VARCHAR(255),
    shake_animation BOOLEAN DEFAULT FALSE,
    shake_intensity ENUM('normal', 'intense') DEFAULT 'normal',
    -- #UBAH: Menggunakan TIMESTAMP dan CURRENT_TIMESTAMP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Click Events
CREATE TABLE IF NOT EXISTS click_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    -- #UBAH: Menyesuaikan tipe data dan menambahkan FOREIGN KEY secara eksplisit
    product_id VARCHAR(36),
    product_name VARCHAR(255),
    product_type VARCHAR(100),
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- #UBAH: timestamp adalah kata kunci
    -- #UBAH: Tipe data INET diubah menjadi VARCHAR(45) untuk menampung IPv4/IPv6
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabel Submitted Vouchers
CREATE TABLE IF NOT EXISTS submitted_vouchers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    provider VARCHAR(255),
    voucher_code VARCHAR(255),
    description TEXT,
    link VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_email VARCHAR(255)
);

-- Tabel Deal Requests
CREATE TABLE IF NOT EXISTS deal_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_email VARCHAR(255),
    service_type VARCHAR(100),
    provider_name VARCHAR(255),
    additional_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Gamification Users
CREATE TABLE IF NOT EXISTS gamification_users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE,
    eth_address VARCHAR(255),
    points INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nft_claimed BOOLEAN DEFAULT FALSE,
    nft_awarded_at TIMESTAMP NULL
);

-- Tabel Mining Tasks
CREATE TABLE IF NOT EXISTS mining_tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255),
    description TEXT,
    points INTEGER DEFAULT 0,
    icon VARCHAR(50),
    icon_url VARCHAR(500),
    link VARCHAR(500),
    enabled BOOLEAN DEFAULT TRUE,
    cooldown INTEGER DEFAULT 24,
    task_type VARCHAR(100) DEFAULT 'custom',
    requirements JSON,
    task_limit VARCHAR(50) DEFAULT 'unlimited', -- 'unlimited', 'daily', 'once'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    image_hint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255),
    `role` VARCHAR(255), -- #UBAH: role adalah kata kunci
    review TEXT,
    image_url VARCHAR(500),
    -- #INFO: Sintaks CHECK constraint ini didukung di MySQL 8.0.16+
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel NFT Showcase
CREATE TABLE IF NOT EXISTS nft_showcase (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255),
    nft_image_url VARCHAR(500),
    marketplace_link VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_email VARCHAR(255)
);

-- Tabel HostVoucher Testimonials
CREATE TABLE IF NOT EXISTS hostvoucher_testimonials (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255),
    email VARCHAR(255),
    testimonial TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel NFT Redemption Requests (Enhanced for Proof of Purchase)
CREATE TABLE IF NOT EXISTS nft_redemption_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    full_name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    screenshot_url VARCHAR(500) NOT NULL,
    user_email VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    points_awarded INTEGER DEFAULT 50000000,
    admin_notes TEXT,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Add indexes for better performance
    INDEX idx_status (status),
    INDEX idx_user_email (user_email),
    INDEX idx_submitted_at (submitted_at)
);

-- Tabel Visitor Analytics
CREATE TABLE IF NOT EXISTS visitor_analytics (
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
);

-- Tabel Page Views
CREATE TABLE IF NOT EXISTS page_views (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    visitor_id VARCHAR(36),
    session_id VARCHAR(100),
    page_url VARCHAR(500),
    page_title VARCHAR(255),
    referrer TEXT,
    time_on_page INTEGER DEFAULT 0,
    scroll_depth INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitor_analytics(id) ON DELETE CASCADE
);

-- Tabel Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
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
);

-- Tabel Campaign Analytics
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    campaign_id VARCHAR(36),
    visitor_id VARCHAR(36),
    conversion_type VARCHAR(50),
    conversion_value DECIMAL(10, 2),
    attributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (visitor_id) REFERENCES visitor_analytics(id) ON DELETE CASCADE
);

-- Tabel Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Settings
CREATE TABLE IF NOT EXISTS settings (
    -- #UBAH: Menggunakan VARCHAR untuk PRIMARY KEY non-UUID
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main_settings',
    theme VARCHAR(50) DEFAULT 'system',
    ga_id VARCHAR(255),
    fb_pixel_id VARCHAR(255),
    catalog_number_prefix VARCHAR(10) DEFAULT 'HV',
    -- #UBAH: JSONB menjadi JSON
    currency_rates JSON,
    gamification_points JSON,
    site_appearance JSON,
    page_banners JSON,
    popup_modal JSON,
    idle_sound JSON,
    pagination_settings JSON,
    nft_exchange_active BOOLEAN DEFAULT FALSE,
    require_eth_address BOOLEAN DEFAULT TRUE,
    max_points_per_user INTEGER DEFAULT 1000,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'records',
    daily_value INTEGER DEFAULT 0,
    daily_date TIMESTAMP NULL,
    monthly_value INTEGER DEFAULT 0,
    monthly_date TIMESTAMP NULL,
    seasonal_value INTEGER DEFAULT 0,
    seasonal_date TIMESTAMP NULL,
    yearly_value INTEGER DEFAULT 0,
    yearly_date TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- #DIHAPUS: Bagian Keamanan (Row Level Security & Policies)
-- #INFO: Fitur ini spesifik PostgreSQL. Di MySQL, hak akses diatur per pengguna
-- menggunakan perintah GRANT. Logika seperti "hanya admin" biasanya diimplementasikan
-- di level aplikasi (misal: di kode backend PHP/Node.js/Python Anda).

-- Indexes for performance (Sintaks sudah kompatibel)
CREATE INDEX idx_products_type ON products(`type`);
CREATE INDEX idx_products_catalog_number ON products(catalog_number);
CREATE INDEX idx_click_events_product_id ON click_events(product_id);
CREATE INDEX idx_click_events_timestamp ON click_events(`timestamp`);
CREATE INDEX idx_gamification_users_email ON gamification_users(email);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at);
CREATE INDEX idx_visitor_analytics_ip ON visitor_analytics(ip_address);
CREATE INDEX idx_visitor_analytics_country ON visitor_analytics(country_code);
CREATE INDEX idx_visitor_analytics_visited_at ON visitor_analytics(visited_at);
CREATE INDEX idx_visitor_analytics_session ON visitor_analytics(session_id);
CREATE INDEX idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX idx_marketing_campaigns_active ON marketing_campaigns(is_active);
CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_visitor_id ON campaign_analytics(visitor_id);

-- #DIUBAH: Fungsi dan Trigger
-- #INFO: Di MySQL, logika trigger didefinisikan langsung, bukan lewat fungsi terpisah.
-- Di sini kita hanya perlu trigger untuk tabel-tabel yang tidak memiliki
-- ON UPDATE CURRENT_TIMESTAMP secara default (jika ada).
-- Namun, karena semua kolom updated_at sudah ditangani dengan ON UPDATE CURRENT_TIMESTAMP,
-- trigger kustom tidak lagi diperlukan untuk fungsionalitas ini.

-- #DIUBAH: Insert default settings
-- #INFO: ON CONFLICT adalah sintaks PostgreSQL. Di MySQL, padanannya adalah INSERT IGNORE
-- atau INSERT ... ON DUPLICATE KEY UPDATE. INSERT IGNORE lebih mirip DO NOTHING.
INSERT IGNORE INTO settings (id) VALUES ('main_settings');
INSERT IGNORE INTO achievements (id) VALUES ('records');
