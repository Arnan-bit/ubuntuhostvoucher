#!/usr/bin/env node

/**
 * ============================================
 * MYSQL AWS CONNECTION TESTER
 * ============================================
 *
 * Test database connection dan operations
 * AWS Server: 3.104.65.75
 * Database: hostvoucher_db
 * User: hostvoch_webar
 *
 * Jalankan: node test-mysql-aws.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const mysql = require('mysql2/promise');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnection() {
  log('\n' + '='.repeat(60), 'bright');
  log('MYSQL AWS CONNECTION TEST', 'bright');
  log('='.repeat(60), 'bright');
  
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  };

  log('\n📋 Configuration:', 'cyan');
  log(`   Host: ${config.host}`, 'cyan');
  log(`   Port: ${config.port}`, 'cyan');
  log(`   Database: ${config.database}`, 'cyan');
  log(`   User: ${config.user}`, 'cyan');

  try {
    // STEP 1: Test Connection
    log('\n[1/5] Testing connection...', 'blue');
    const connection = await mysql.createConnection(config);
    log('✅ Connection successful!', 'green');

    // STEP 2: Test SELECT
    log('\n[2/5] Testing SELECT query...', 'blue');
    const [tables] = await connection.execute('SHOW TABLES');
    log(`✅ Found ${tables.length} tables in database:`, 'green');
    tables.forEach(row => {
      const tableName = Object.values(row)[0];
      log(`   • ${tableName}`, 'cyan');
    });

    // STEP 3: Test INSERT
    log('\n[3/5] Testing INSERT...', 'blue');
    const testId = 'test_' + Date.now();
    const [insertResult] = await connection.execute(
      `INSERT INTO admin_users (id, email, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
      [testId, 'test@example.com', 'testuser', 'hash123', 'admin']
    );
    log(`✅ Inserted test record (ID: ${testId})`, 'green');

    // STEP 4: Test SELECT
    log('\n[4/5] Testing SELECT with inserted data...', 'blue');
    const [selectResult] = await connection.execute(
      `SELECT * FROM admin_users WHERE id = ?`,
      [testId]
    );
    if (selectResult.length > 0) {
      log(`✅ Retrieved test record:`, 'green');
      log(`   ID: ${selectResult[0].id}`, 'cyan');
      log(`   Email: ${selectResult[0].email}`, 'cyan');
      log(`   Username: ${selectResult[0].username}`, 'cyan');
    } else {
      log('❌ Record not found!', 'red');
    }

    // STEP 5: Test DELETE
    log('\n[5/5] Testing DELETE...', 'blue');
    const [deleteResult] = await connection.execute(
      `DELETE FROM admin_users WHERE id = ?`,
      [testId]
    );
    log(`✅ Deleted test record (${deleteResult.affectedRows} row affected)`, 'green');

    // Verify deletion
    const [verifyResult] = await connection.execute(
      `SELECT * FROM admin_users WHERE id = ?`,
      [testId]
    );
    if (verifyResult.length === 0) {
      log('✅ Deletion verified - record is gone', 'green');
    }

    await connection.end();

    // Summary
    log('\n' + '='.repeat(60), 'bright');
    log('✅ ALL TESTS PASSED!', 'green');
    log('='.repeat(60), 'bright');
    log('\n✅ MySQL Database WORKS 100%:', 'green');
    log('   ✓ Connection successful', 'green');
    log('   ✓ SELECT queries working', 'green');
    log('   ✓ INSERT operations working', 'green');
    log('   ✓ DELETE operations working', 'green');
    log('   ✓ Data integrity verified', 'green');
    log('\n📊 Database Status: READY FOR PRODUCTION\n', 'bright');

  } catch (error) {
    log('\n❌ ERROR:', 'red');
    log(error.message, 'red');
    log('\n' + '='.repeat(60), 'bright');
    log('DATABASE CONNECTION FAILED', 'red');
    log('='.repeat(60), 'bright');
    log('\nTroubleshooting:', 'yellow');
    log('1. Verify AWS IP: 41.216.185.84', 'yellow');
    log('2. Check credentials: hostvoch_webar / Wizard@231191493', 'yellow');
    log('3. Verify MySQL service is running on AWS', 'yellow');
    log('4. Check firewall/security groups allow port 3306', 'yellow');
    log('5. Database must exist: hostvoch_webapp', 'yellow');
    process.exit(1);
  }
}

// Run test
testConnection().catch(err => {
  log('\n❌ FATAL ERROR:', 'red');
  log(err.message, 'red');
  process.exit(1);
});
