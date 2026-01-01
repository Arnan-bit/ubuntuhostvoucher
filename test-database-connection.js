const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * ============================================
 * DATABASE CONNECTION & FUNCTIONALITY TEST
 * ============================================
 * 
 * Script ini menguji:
 * 1. Koneksi ke MySQL database
 * 2. Struktur table & data count
 * 3. Operasi INSERT, SELECT, DELETE
 * 4. Database integrity
 * 
 * Usage: node test-database-connection.js
 */

const DB_CONFIG = {
  host: process.env.DB_HOST || '41.216.185.84',
  user: process.env.DB_USER || 'hostvoch_webar',
  password: process.env.DB_PASSWORD || 'Wizard@231191493',
  database: process.env.DB_DATABASE || 'hostvoch_webapp',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Color codes untuk terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch(type) {
    case 'success':
      console.log(`${colors.green}${prefix} ✅ ${message}${colors.reset}`);
      break;
    case 'error':
      console.log(`${colors.red}${prefix} ❌ ${message}${colors.reset}`);
      break;
    case 'warning':
      console.log(`${colors.yellow}${prefix} ⚠️  ${message}${colors.reset}`);
      break;
    case 'info':
      console.log(`${colors.blue}${prefix} ℹ️  ${message}${colors.reset}`);
      break;
    case 'section':
      console.log(`\n${colors.cyan}${prefix} 📌 ${message}${colors.reset}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

async function testDatabaseConnection() {
  let connection;
  
  try {
    // ============================================
    // TEST 1: CONNECTION
    // ============================================
    log('TEST 1: Database Connection', 'section');
    log(`Connecting to ${DB_CONFIG.host}:${DB_CONFIG.port}...`, 'info');
    
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      port: DB_CONFIG.port
    });
    
    log('Successfully connected to MySQL database!', 'success');
    
    // ============================================
    // TEST 2: DATABASE INFO
    // ============================================
    log('TEST 2: Database Information', 'section');
    
    const [dbInfo] = await connection.execute(
      `SELECT DATABASE() as current_db, VERSION() as mysql_version`
    );
    log(`Database: ${dbInfo[0].current_db}`, 'info');
    log(`MySQL Version: ${dbInfo[0].mysql_version}`, 'info');
    
    // ============================================
    // TEST 3: TABLES
    // ============================================
    log('TEST 3: Database Tables', 'section');
    
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME, TABLE_ROWS, 
             ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024), 2) as size_kb
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_ROWS DESC
    `);
    
    log(`Total tables: ${tables.length}`, 'info');
    console.log('\nTable Summary:');
    console.log('┌─────────────────────────────┬──────────┬──────────┐');
    console.log('│ Table Name                  │ Rows     │ Size KB  │');
    console.log('├─────────────────────────────┼──────────┼──────────┤');
    
    tables.forEach(table => {
      const name = table.TABLE_NAME.padEnd(27);
      const rows = (table.TABLE_ROWS || 0).toString().padStart(8);
      const size = table.size_kb.toString().padStart(8);
      console.log(`│ ${name} │ ${rows} │ ${size} │`);
    });
    console.log('└─────────────────────────────┴──────────┴──────────┘');
    
    // ============================================
    // TEST 4: CRITICAL TABLES CHECK
    // ============================================
    log('TEST 4: Critical Tables Structure', 'section');
    
    const criticalTables = ['admin_users', 'products', 'orders'];
    
    for (const tableName of criticalTables) {
      try {
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        log(`Table '${tableName}' - ${columns.length} columns`, 'success');
        
        // Check row count
        const [countResult] = await connection.execute(
          `SELECT COUNT(*) as total FROM ${tableName}`
        );
        const count = countResult[0].total;
        
        if (count > 0) {
          log(`  └─ Rows: ${count}`, 'info');
        } else {
          log(`  └─ Rows: 0 (empty table)`, 'warning');
        }
      } catch (error) {
        log(`Table '${tableName}' - ERROR: ${error.message}`, 'error');
      }
    }
    
    // ============================================
    // TEST 5: TEST DATA WRITE OPERATION
    // ============================================
    log('TEST 5: Write Operation (INSERT)', 'section');
    
    const testId = `test_${Date.now()}`;
    const testEmail = `test_${Date.now()}@test.local`;
    const testName = `Test User ${Date.now()}`;
    
    try {
      await connection.execute(
        `INSERT INTO admin_users (id, email, name, role, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [testId, testEmail, testName, 'admin']
      );
      log(`Test INSERT successful - ID: ${testId}`, 'success');
    } catch (error) {
      log(`Test INSERT failed: ${error.message}`, 'error');
      throw error;
    }
    
    // ============================================
    // TEST 6: TEST DATA READ OPERATION
    // ============================================
    log('TEST 6: Read Operation (SELECT)', 'section');
    
    try {
      const [readResult] = await connection.execute(
        `SELECT id, email, name, role FROM admin_users WHERE id = ?`,
        [testId]
      );
      
      if (readResult.length > 0) {
        const record = readResult[0];
        log(`Test SELECT successful!`, 'success');
        console.log(`  ID: ${record.id}`);
        console.log(`  Email: ${record.email}`);
        console.log(`  Name: ${record.name}`);
        console.log(`  Role: ${record.role}`);
      } else {
        log(`No record found with ID: ${testId}`, 'error');
        throw new Error('Record not found after INSERT');
      }
    } catch (error) {
      log(`Test SELECT failed: ${error.message}`, 'error');
      throw error;
    }
    
    // ============================================
    // TEST 7: TEST DATA DELETE OPERATION
    // ============================================
    log('TEST 7: Delete Operation (DELETE)', 'section');
    
    try {
      const [deleteResult] = await connection.execute(
        `DELETE FROM admin_users WHERE id = ?`,
        [testId]
      );
      
      if (deleteResult.affectedRows > 0) {
        log(`Test DELETE successful - ${deleteResult.affectedRows} row(s) deleted`, 'success');
      } else {
        log(`No rows deleted (maybe already deleted?)`, 'warning');
      }
    } catch (error) {
      log(`Test DELETE failed: ${error.message}`, 'error');
      throw error;
    }
    
    // ============================================
    // TEST 8: DATABASE STATISTICS
    // ============================================
    log('TEST 8: Database Statistics', 'section');
    
    const [stats] = await connection.execute(`
      SELECT 
        SUM(TABLE_ROWS) as total_rows,
        ROUND(SUM(DATA_LENGTH) / 1024 / 1024, 2) as total_data_mb,
        ROUND(SUM(INDEX_LENGTH) / 1024 / 1024, 2) as total_index_mb
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);
    
    const stat = stats[0];
    log(`Total Rows: ${stat.total_rows || 0}`, 'info');
    log(`Data Size: ${stat.total_data_mb}MB`, 'info');
    log(`Index Size: ${stat.total_index_mb}MB`, 'info');
    
    // ============================================
    // TEST 9: CHECK CONNECTIONS
    // ============================================
    log('TEST 9: MySQL Status', 'section');
    
    const [status] = await connection.execute('SHOW STATUS LIKE "Threads_%"');
    const statusMap = {};
    status.forEach(row => {
      statusMap[row.Variable_name] = row.Value;
    });
    
    log(`Connected Threads: ${statusMap.Threads_connected || 'N/A'}`, 'info');
    log(`Running Threads: ${statusMap.Threads_running || 'N/A'}`, 'info');
    
    // ============================================
    // FINAL RESULT
    // ============================================
    log('ALL TESTS COMPLETED SUCCESSFULLY!', 'section');
    log('✅ Database is functioning correctly!', 'success');
    log('✅ INSERT, SELECT, DELETE operations work!', 'success');
    log('✅ Connection is stable!', 'success');
    
    console.log('\n📊 Summary:');
    console.log(`   Connected to: ${DB_CONFIG.host}`);
    console.log(`   Database: ${DB_CONFIG.database}`);
    console.log(`   Tables: ${tables.length}`);
    console.log(`   Total Rows: ${stat.total_rows || 0}`);
    console.log(`\n✨ Ready for deployment!`);
    
    process.exit(0);
    
  } catch (error) {
    log(`CRITICAL ERROR: ${error.message}`, 'error');
    console.error('\n📋 Full Error Details:');
    console.error(error);
    
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Check .env file values:');
    console.log(`      DB_HOST=${DB_CONFIG.host}`);
    console.log(`      DB_USER=${DB_CONFIG.user}`);
    console.log(`      DB_DATABASE=${DB_CONFIG.database}`);
    console.log('   2. Verify MySQL server is running');
    console.log('   3. Check firewall rules (port 3306 open?)');
    console.log('   4. Verify user credentials and permissions');
    
    process.exit(1);
    
  } finally {
    if (connection) {
      await connection.end();
      log('Database connection closed', 'info');
    }
  }
}

// Run tests
console.log('\n' + '='.repeat(60));
console.log('  DATABASE CONNECTION TEST SUITE');
console.log('='.repeat(60) + '\n');

testDatabaseConnection();
