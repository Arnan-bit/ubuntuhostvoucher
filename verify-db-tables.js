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

    console.log('\n✓ Connected to database\n');

    // Verify critical tables exist and have correct structure
    const tables = [
      { name: 'products', required_cols: ['id', 'name', 'price'] },
      { name: 'realtime_visitors', required_cols: ['visitor_id', 'page_path', 'last_activity'] },
      { name: 'page_views', required_cols: ['visitor_id', 'page_url'] },
      { name: 'click_events', required_cols: ['id', 'productId'] }
    ];

    for (const table of tables) {
      try {
        const [cols] = await conn.query(
          "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
          [process.env.DB_DATABASE, table.name]
        );
        const colNames = cols.map((c) => c.COLUMN_NAME);
        const missing = table.required_cols.filter(c => !colNames.includes(c));
        
        if (missing.length > 0) {
          console.warn(`⚠ Table '${table.name}': Missing columns:`, missing);
        } else {
          console.log(`✓ Table '${table.name}': OK`);
        }
      } catch (e) {
        console.error(`✗ Table '${table.name}' does not exist!`);
      }
    }

    await conn.end();
    console.log('\n✓ Verification complete\n');
  } catch (e) {
    console.error('ERR:', e.message);
    process.exit(1);
  }
})();
