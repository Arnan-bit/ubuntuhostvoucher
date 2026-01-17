#!/usr/bin/env node

/**
 * 🧪 NEXT.JS DATABASE INTEGRATION TEST
 * Testing if Next.js can connect to AWS VPS database
 */

// Load environment variables from .env.local FIRST
require('dotenv').config({ path: '.env.local' });

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '41.216.185.84',
  user: process.env.DB_USER || 'hostvoch_webar',
  password: process.env.DB_PASSWORD || 'Wizard@231191493',
  database: process.env.DB_DATABASE || 'hostvoch_webapp',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectTimeout: 10000,
};

console.log('🧪 NEXT.JS DATABASE INTEGRATION TEST');
console.log('====================================');
console.log('');

// Test the same query functions used in Next.js
async function testNextJsQueries() {
  let connection;

  try {
    console.log('🔗 Testing Next.js database integration...');

    const pool = mysql.createPool({
      ...dbConfig,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0
    });

    connection = await pool.getConnection();

    // Test 1: getDealsFromDb() equivalent
    console.log('   Test 1: Testing getDealsFromDb() equivalent...');
    const [products] = await connection.execute('SELECT * FROM products ORDER BY catalog_number DESC');
    console.log(`✅ Products query successful: Found ${products.length} products`);

    if (products.length > 0) {
      console.log(`   Sample product: ${products[0].name || 'N/A'} - $${products[0].price || 'N/A'}`);
    }

    // Test 2: getSiteSettingsFromDb() equivalent
    console.log('   Test 2: Testing getSiteSettingsFromDb() equivalent...');
    const [settings] = await connection.execute('SELECT * FROM settings WHERE id = ?', ['main_settings']);
    console.log(`✅ Settings query successful: ${settings.length > 0 ? 'Settings found' : 'No settings found'}`);

    // Test 3: getBlogPostsFromDb() equivalent
    console.log('   Test 3: Testing getBlogPostsFromDb() equivalent...');
    const [blogs] = await connection.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
    console.log(`✅ Blog posts query successful: Found ${blogs.length} blog posts`);

    // Test 4: Admin authentication query
    console.log('   Test 4: Testing admin authentication query...');
    const [admins] = await connection.execute('SELECT * FROM admin_users LIMIT 1');
    console.log(`✅ Admin users query successful: Found ${admins.length} admin users`);

    // Test 5: Test the exact query format used in Next.js
    console.log('   Test 5: Testing exact Next.js query format...');
    const query = { query: 'SELECT * FROM products ORDER BY catalog_number DESC', values: [] };
    const [nextjsResult] = await connection.execute(query.query, query.values);
    console.log(`✅ Next.js format query successful: Found ${nextjsResult.length} products`);

    connection.release();
    await pool.end();

    console.log('');
    console.log('🎉 SUCCESS: Next.js database integration is working!');
    console.log('   All database queries that Next.js uses are functional.');
    return true;

  } catch (error) {
    console.log(`❌ Next.js database integration failed: ${error.message}`);
    console.log(`   Error code: ${error.code || 'N/A'}`);
    console.log(`   Error errno: ${error.errno || 'N/A'}`);
    console.log(`   SQL State: ${error.sqlState || 'N/A'}`);

    if (connection) {
      connection.release();
    }

    return false;
  }
}

async function testConnectionPooling() {
  console.log('🔄 Testing connection pooling (Next.js style)...');

  try {
    // Create pool exactly like in src/lib/db.ts
    const pool = mysql.createPool({
      host: process.env.DB_HOST || '41.216.185.84',
      user: process.env.DB_USER || 'hostvoch_webar',
      password: process.env.DB_PASSWORD || 'Wizard@231191493',
      database: process.env.DB_DATABASE || 'hostvoch_webapp',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0
    });

    console.log('   Testing pool-based queries...');

    // Test the query function from src/lib/db.ts
    const testQuery = async ({ query, values = [] }) => {
      try {
        const [results] = await pool.execute(query, values);
        return results;
      } catch (error) {
        console.error("Database Query Error:", error.message);
        throw error;
      }
    };

    // Run some test queries
    const products = await testQuery({ query: 'SELECT COUNT(*) as count FROM products' });
    const settings = await testQuery({ query: 'SELECT COUNT(*) as count FROM settings' });
    const admins = await testQuery({ query: 'SELECT COUNT(*) as count FROM admin_users' });

    console.log(`✅ Pool query successful:`);
    console.log(`   Products: ${products[0].count}`);
    console.log(`   Settings: ${settings[0].count}`);
    console.log(`   Admin users: ${admins[0].count}`);

    await pool.end();
    console.log('✅ Connection pool test successful');
    return true;

  } catch (error) {
    console.log(`❌ Connection pool test failed: ${error.message}`);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 STARTING NEXT.JS DATABASE INTEGRATION TESTS');
  console.log('===============================================');
  console.log('');

  const results = {
    nextjs: await testNextJsQueries(),
    pooling: await testConnectionPooling(),
  };

  console.log('');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=======================');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(`Tests passed: ${passed}/${total}`);

  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${test.toUpperCase()}: ${status}`);
  });

  console.log('');
  if (results.nextjs && results.pooling) {
    console.log('🎉 EXCELLENT: Next.js database integration is fully working!');
    console.log('   Your localhost Next.js application can successfully connect to AWS VPS database.');
    console.log('   All database operations should work properly.');
  } else {
    console.log('💥 FAILURE: Next.js database integration has issues!');
    console.log('   Check the error messages above for troubleshooting.');
  }

  console.log('');
  console.log('🔍 Test completed at:', new Date().toISOString());
}

runTests().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
