const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT || 3306)
    });

    console.log('\n🔧 Fixing realtime_visitors table schema...\n');

    // Drop the old table and recreate with correct schema
    await conn.query('DROP TABLE IF EXISTS realtime_visitors');
    
    const createTableSQL = `
      CREATE TABLE realtime_visitors (
        visitor_id VARCHAR(36) PRIMARY KEY,
        page_path VARCHAR(500) DEFAULT '/',
        referrer VARCHAR(500),
        user_agent VARCHAR(500),
        ip_address VARCHAR(45),
        device_type VARCHAR(50) DEFAULT 'desktop',
        session_id VARCHAR(100),
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_last_activity (last_activity),
        KEY idx_session_id (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    console.log('Creating new realtime_visitors table...');
    await conn.query(createTableSQL);
    console.log('✓ realtime_visitors table created!\n');

    // Also verify/fix click_events
    const [clickRes] = await conn.query('SHOW COLUMNS FROM click_events');
    const clickCols = clickRes.map(c => c.Field);
    console.log('click_events columns:', clickCols);

    if (!clickCols.includes('productId')) {
      console.log('Adding productId to click_events...');
      await conn.query('ALTER TABLE click_events ADD COLUMN productId INT AFTER id');
      console.log('✓ productId added\n');
    }

    await conn.end();
    console.log('✓ All fixes complete!\n');
  } catch (e) {
    console.error('ERR:', e.message);
    process.exit(1);
  }
})();
