#!/usr/bin/env node
/**
 * Test Database Connection Directly
 * 
 * Tujuan: Verifikasi koneksi ke database AWS MySQL tanpa melalui Next.js server
 * Database: 41.216.185.84:3306 (hostvoch_webapp)
 */

const mysql = require('mysql2/promise');

const config = {
  host: '41.216.185.84',
  port: 3306,
  user: 'hostvoch_webar',
  password: 'Wizard@231191493',
  database: 'hostvoch_webapp',
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
};

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${config.host}:${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}\n`);

  try {
    const pool = mysql.createPool(config);
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database!\n');

    // Test 1: Check Database Info
    console.log('📊 Database Information:');
    const [dbInfo] = await connection.execute('SELECT VERSION() as version');
    console.log(`  MySQL Version: ${dbInfo[0].version}\n`);

    // Test 2: List Tables
    console.log('📋 Available Tables:');
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",[config.database]
    );
    if (tables.length === 0) {
      console.log('  ⚠️  No tables found!');
    } else {
      tables.forEach((table, idx) => {
        console.log(`  ${idx + 1}. ${table.TABLE_NAME}`);
      });
    }
    console.log();

    // Test 3: Check Products/Deals Table
    console.log('🛍️  Checking Products/Deals Data:');
    try {
      const [products] = await connection.execute(
        'SELECT COUNT(*) as count FROM products LIMIT 1'
      );
      console.log(`  Products found: ${products[0].count}`);
    } catch (e) {
      console.log(`  ⚠️  Products table: ${e.message}`);
    }

    // Test 4: Check Categories
    console.log('\n📂 Checking Categories Data:');
    try {
      const [categories] = await connection.execute(
        'SELECT COUNT(*) as count FROM categories LIMIT 1'
      );
      console.log(`  Categories found: ${categories[0].count}`);
    } catch (e) {
      console.log(`  ⚠️  Categories table: ${e.message}`);
    }

    // Test 5: Check Banners
    console.log('\n🎨 Checking Banners Data:');
    try {
      const [banners] = await connection.execute(
        'SELECT COUNT(*) as count FROM banners LIMIT 1'
      );
      console.log(`  Banners found: ${banners[0].count}`);
    } catch (e) {
      console.log(`  ⚠️  Banners table: ${e.message}`);
    }

    // Test 6: Sample Data
    console.log('\n📝 Sample Product Data (First 3):');
    try {
      const [sampleData] = await connection.execute(
        'SELECT id, name, description, price FROM products LIMIT 3'
      );
      sampleData.forEach((product, idx) => {
        console.log(`\n  ${idx + 1}. ${product.name}`);
        console.log(`     ID: ${product.id}`);
        console.log(`     Price: ${product.price}`);
      });
    } catch (e) {
      console.log(`  ⚠️  Error fetching sample data: ${e.message}`);
    }

    connection.release();
    await pool.end();

    console.log('\n\n✅ DATABASE TEST PASSED - Connection successful!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ DATABASE TEST FAILED\n');
    console.error('Error Details:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔧 Troubleshooting:');
      console.error('  - Check if AWS MySQL server is running');
      console.error('  - Verify IP address: 41.216.185.84');
      console.error('  - Verify port: 3306');
      console.error('  - Check network connectivity');
    } else if (error.code === 'ER_ACCESS_DENIED_FOR_USER') {
      console.error('🔧 Troubleshooting:');
      console.error('  - Check username: hostvoch_webar');
      console.error('  - Check password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('🔧 Troubleshooting:');
      console.error('  - Check database name: hostvoch_webapp');
      console.error('  - Verify database exists on server');
    }
    
    process.exit(1);
  }
}

testConnection();
