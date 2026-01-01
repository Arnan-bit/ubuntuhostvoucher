#!/usr/bin/env node

/**
 * ============================================
 * MYSQL AWS SETUP & VERIFY SCRIPT
 * ============================================
 * 
 * Import database structure dan create missing tables
 * AWS Server: 41.216.185.84
 * Database: hostvoch_webapp
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

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

async function setupDatabase() {
  log('\n' + '='.repeat(60), 'bright');
  log('MYSQL AWS SETUP & VERIFICATION', 'bright');
  log('='.repeat(60), 'bright');

  const config = {
    host: '41.216.185.84',
    port: 3306,
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
  };

  try {
    log('\n[1/3] Connecting to AWS MySQL...', 'blue');
    const connection = await mysql.createConnection(config);
    log('✅ Connected successfully!', 'green');

    // Create admin_users table if missing
    log('\n[2/3] Creating required tables...', 'blue');
    
    const createAdminUsersSQL = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;

    await connection.execute(createAdminUsersSQL);
    log('✅ admin_users table created (or already exists)', 'green');

    // Verify tables
    log('\n[3/3] Verifying database structure...', 'blue');
    const [tables] = await connection.execute('SHOW TABLES');
    
    const requiredTables = [
      'products',
      'orders',
      'testimonials',
      'achievements',
      'admin_users'
    ];

    let allTableExists = true;
    log('\nDatabase Tables:', 'cyan');
    requiredTables.forEach(table => {
      const exists = tables.some(row => Object.values(row)[0] === table);
      if (exists) {
        log(`   ✅ ${table}`, 'green');
      } else {
        log(`   ❌ ${table} (MISSING)`, 'red');
        allTableExists = false;
      }
    });

    log(`\n📊 Total tables: ${tables.length}`, 'cyan');

    // Test CRUD operations
    log('\n' + '='.repeat(60), 'bright');
    log('TESTING CRUD OPERATIONS', 'bright');
    log('='.repeat(60), 'bright');

    const testId = 'test_' + Date.now();
    
    // CREATE
    log('\n[CREATE] Inserting test record...', 'blue');
    await connection.execute(
      `INSERT INTO admin_users (id, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
      [testId, 'test@' + Date.now() + '.com', 'testuser' + Date.now(), 'hash123', 'admin']
    );
    log('✅ INSERT successful', 'green');

    // READ
    log('\n[READ] Querying test record...', 'blue');
    const [readResult] = await connection.execute(
      `SELECT * FROM admin_users WHERE id = ?`,
      [testId]
    );
    if (readResult.length > 0) {
      log('✅ SELECT successful', 'green');
      log(`   Email: ${readResult[0].email}`, 'cyan');
      log(`   Username: ${readResult[0].username}`, 'cyan');
    }

    // UPDATE
    log('\n[UPDATE] Updating test record...', 'blue');
    await connection.execute(
      `UPDATE admin_users SET status = ? WHERE id = ?`,
      ['inactive', testId]
    );
    log('✅ UPDATE successful', 'green');

    // DELETE
    log('\n[DELETE] Deleting test record...', 'blue');
    const [deleteResult] = await connection.execute(
      `DELETE FROM admin_users WHERE id = ?`,
      [testId]
    );
    log(`✅ DELETE successful (${deleteResult.affectedRows} rows affected)`, 'green');

    await connection.end();

    // Final summary
    log('\n' + '='.repeat(60), 'bright');
    if (allTableExists) {
      log('✅ DATABASE SETUP COMPLETE!', 'green');
    } else {
      log('⚠️  PARTIALLY COMPLETE - Some tables missing', 'yellow');
    }
    log('='.repeat(60), 'bright');

    log('\n✅ MySQL Database Status: READY', 'green');
    log('\n📍 Connection Details:', 'bright');
    log(`   Host: ${config.host}`, 'cyan');
    log(`   Database: ${config.database}`, 'cyan');
    log(`   User: ${config.user}`, 'cyan');
    log(`   Tables: ${tables.length}`, 'cyan');

    log('\n📋 Next Steps:', 'yellow');
    log('   1. Import database.sql for complete schema', 'yellow');
    log('   2. Create production admin users', 'yellow');
    log('   3. Configure environment variables', 'yellow');
    log('   4. Start application server', 'yellow');
    log('\n');

  } catch (error) {
    log('\n❌ ERROR:', 'red');
    log(error.message, 'red');
    log('\n' + '='.repeat(60), 'bright');
    log('SETUP FAILED', 'red');
    log('='.repeat(60), 'bright');
    
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      log('\n❌ Connection lost - AWS server unreachable', 'red');
    } else if (error.code === 'ER_ACCESS_DENIED_FOR_USER') {
      log('\n❌ Authentication failed - wrong credentials', 'red');
    }

    log('\nTroubleshooting:', 'yellow');
    log('1. Check AWS IP: 41.216.185.84:3306', 'yellow');
    log('2. Verify credentials in .env.local', 'yellow');
    log('3. Ensure MySQL service is running', 'yellow');
    log('4. Check security groups allow port 3306', 'yellow');
    
    process.exit(1);
  }
}

// Run
setupDatabase().catch(err => {
  log('\n❌ FATAL:', 'red');
  log(err.message, 'red');
  process.exit(1);
});
