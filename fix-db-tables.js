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

    console.log('\n🔧 Fixing realtime_visitors table...\n');

    // Check current structure
    const [currentCols] = await conn.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'realtime_visitors'",
      [process.env.DB_DATABASE]
    );
    const colNames = currentCols.map(c => c.COLUMN_NAME);
    console.log('Current columns:', colNames);

    // Add missing columns if they don't exist
    if (!colNames.includes('visitor_id')) {
      console.log('Adding visitor_id column...');
      await conn.query('ALTER TABLE realtime_visitors ADD COLUMN visitor_id VARCHAR(36) PRIMARY KEY FIRST');
    }

    if (!colNames.includes('page_path')) {
      console.log('Adding page_path column...');
      await conn.query("ALTER TABLE realtime_visitors ADD COLUMN page_path VARCHAR(500) DEFAULT '/'");
    }

    if (!colNames.includes('last_activity')) {
      console.log('Adding last_activity column...');
      await conn.query('ALTER TABLE realtime_visitors ADD COLUMN last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    }

    // Add other common columns if missing
    const optionalCols = {
      'referrer': "VARCHAR(500)",
      'user_agent': "VARCHAR(500)",
      'ip_address': "VARCHAR(45)",
      'device_type': "VARCHAR(50) DEFAULT 'desktop'",
      'session_id': "VARCHAR(100)"
    };

    for (const [col, type] of Object.entries(optionalCols)) {
      if (!colNames.includes(col)) {
        console.log(`Adding ${col} column...`);
        await conn.query(`ALTER TABLE realtime_visitors ADD COLUMN ${col} ${type}`);
      }
    }

    console.log('\n✓ realtime_visitors table fixed!\n');

    // Now fix click_events table - add productId if missing
    const [clickCols] = await conn.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'click_events'",
      [process.env.DB_DATABASE]
    );
    const clickColNames = clickCols.map(c => c.COLUMN_NAME);
    
    if (!clickColNames.includes('productId')) {
      console.log('Adding productId column to click_events...');
      await conn.query('ALTER TABLE click_events ADD COLUMN productId INT');
      console.log('✓ click_events table fixed!\n');
    }

    await conn.end();
    console.log('✓ All tables repaired successfully!\n');
  } catch (e) {
    console.error('ERR:', e.message);
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('(Column already exists - this is OK)');
    }
    process.exit(1);
  }
})();
