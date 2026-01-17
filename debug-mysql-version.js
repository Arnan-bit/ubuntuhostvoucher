#!/usr/bin/env node

/**
 * 🔍 MYSQL VERSION & COMPATIBILITY TEST
 * Mengidentifikasi versi MySQL/MariaDB dan masalah kompatibilitas
 */

// Load environment variables from .env.local FIRST
require('dotenv').config({ path: '.env.local' });

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '3306'),
  connectTimeout: 10000,
};

console.log('🔍 MYSQL VERSION & COMPATIBILITY TEST');
console.log('=====================================');
console.log('');

async function testMySQLVersion() {
  let connection;

  try {
    console.log('🗄️  Testing MySQL/MariaDB version and compatibility...');

    const pool = mysql.createPool({
      ...dbConfig,
      connectionLimit: 1,
      queueLimit: 0,
    });

    connection = await pool.getConnection();

    // Test 1: Basic connectivity
    console.log('   Test 1: Basic connectivity...');
    const [basic] = await connection.execute('SELECT 1 as test');
    console.log(`✅ Basic query successful: ${JSON.stringify(basic[0])}`);

    // Test 2: Version information
    console.log('   Test 2: Getting version information...');
    const [version] = await connection.execute('SELECT VERSION() as version, @@version_comment as comment');
    console.log(`✅ Version query successful:`);
    console.log(`   Version: ${version[0].version}`);
    console.log(`   Comment: ${version[0].comment}`);

    // Test 3: Current timestamp (different methods)
    console.log('   Test 3: Testing timestamp functions...');

    // Try different timestamp functions
    const timestampTests = [
      'SELECT NOW() as current_time',
      'SELECT CURRENT_TIMESTAMP as current_time',
      'SELECT SYSDATE() as current_time',
      'SELECT UNIX_TIMESTAMP() as current_time'
    ];

    for (const query of timestampTests) {
      try {
        const [result] = await connection.execute(query);
        console.log(`✅ ${query}: ${JSON.stringify(result[0])}`);
        break; // Stop at first successful one
      } catch (error) {
        console.log(`❌ ${query}: ${error.message}`);
      }
    }

    // Test 4: Database and user info
    console.log('   Test 4: Database and user information...');
    const [dbInfo] = await connection.execute('SELECT DATABASE() as db, USER() as user, CONNECTION_ID() as conn_id');
    console.log(`✅ Database info:`);
    console.log(`   Database: ${dbInfo[0].db}`);
    console.log(`   User: ${dbInfo[0].user}`);
    console.log(`   Connection ID: ${dbInfo[0].conn_id}`);

    // Test 5: Table listing
    console.log('   Test 5: Listing tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables in database`);

    if (tables.length > 0) {
      console.log('   First 10 tables:');
      tables.slice(0, 10).forEach((table, index) => {
        console.log(`     ${index + 1}. ${Object.values(table)[0]}`);
      });
    }

    // Test 6: Test a simple table query if tables exist
    if (tables.length > 0) {
      console.log('   Test 6: Testing table query...');
      const firstTable = Object.values(tables[0])[0];
      try {
        const [sampleData] = await connection.execute(`SELECT * FROM \`${firstTable}\` LIMIT 1`);
        console.log(`✅ Successfully queried table '${firstTable}'`);
        if (sampleData.length > 0) {
          console.log(`   Sample row: ${JSON.stringify(sampleData[0])}`);
        }
      } catch (error) {
        console.log(`⚠️  Could not query table '${firstTable}': ${error.message}`);
      }
    }

    connection.release();
    await pool.end();

    console.log('');
    console.log('🎉 SUCCESS: MySQL/MariaDB connection is working!');
    console.log('   Database connectivity confirmed.');
    return true;

  } catch (error) {
    console.log(`❌ MySQL connection failed: ${error.message}`);
    console.log(`   Error code: ${error.code || 'N/A'}`);
    console.log(`   Error errno: ${error.errno || 'N/A'}`);
    console.log(`   SQL State: ${error.sqlState || 'N/A'}`);

    if (connection) {
      connection.release();
    }

    return false;
  }
}

async function testConnectionPool() {
  console.log('🔄 Testing connection pool...');

  try {
    const pool = mysql.createPool({
      ...dbConfig,
      connectionLimit: 3,
      queueLimit: 0,
    });

    console.log('   Creating multiple connections...');
    const connections = [];

    for (let i = 0; i < 3; i++) {
      const conn = await pool.getConnection();
      connections.push(conn);

      const [result] = await conn.execute('SELECT CONNECTION_ID() as id');
      console.log(`✅ Connection ${i + 1} established (ID: ${result[0].id})`);
    }

    console.log('   Releasing connections...');
    connections.forEach(conn => conn.release());

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
  console.log('🚀 STARTING MYSQL COMPATIBILITY TESTS');
  console.log('=====================================');
  console.log('');

  const results = {
    version: await testMySQLVersion(),
    pool: await testConnectionPool(),
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
  console.log('🔍 Test completed at:', new Date().toISOString());
}

runTests().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
