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

    console.log('\n📊 Checking realtime_visitors full structure...\n');

    // Get full structure
    const [result] = await conn.query('SHOW CREATE TABLE realtime_visitors');
    console.log('Current table definition:');
    console.log(result[0]['Create Table']);
    console.log('\n');

    await conn.end();
  } catch (e) {
    console.error('ERR:', e.message);
    process.exit(1);
  }
})();
