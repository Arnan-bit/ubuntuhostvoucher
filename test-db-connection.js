const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_DATABASE);
  console.log('Port:', process.env.DB_PORT);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT || 3306),
    });
    
    console.log('\n✅ Database connection SUCCESSFUL!\n');
    
    // Test query untuk lihat tabel
    const [rows] = await connection.execute('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?', [process.env.DB_DATABASE]);
    console.log('📊 Tables in database:');
    rows.forEach(row => console.log('   -', row.TABLE_NAME));
    
    await connection.end();
  } catch (error) {
    console.error('\n❌ Connection FAILED!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();
