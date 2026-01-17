#!/usr/bin/env node

/**
 * 🔍 DATABASE CONNECTION DIAGNOSTIC SCRIPT
 * Debug tool untuk mengidentifikasi masalah koneksi database AWS VPS
 * Dibuat oleh: Database Debugging Specialist (60 tahun pengalaman)
 */

const mysql = require('mysql2/promise');
const dns = require('dns').promises;
const net = require('net');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

console.log('🔍 DATABASE CONNECTION DIAGNOSTIC TOOL');
console.log('=====================================');
console.log('');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '41.216.185.84',
  user: process.env.DB_USER || 'hostvoch_webar',
  password: process.env.DB_PASSWORD || 'Wizard@231191493',
  database: process.env.DB_DATABASE || 'hostvoch_webapp',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000,
};

console.log('📋 DATABASE CONFIGURATION:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Password: ${dbConfig.password ? '***SET***' : 'NOT SET'}`);
console.log('');

async function testDNSResolution() {
  console.log('🌐 STEP 1: Testing DNS Resolution...');
  try {
    const addresses = await dns.lookup(dbConfig.host);
    console.log(`✅ DNS Resolution successful: ${dbConfig.host} -> ${addresses.address}`);
    return true;
  } catch (error) {
    console.log(`❌ DNS Resolution failed: ${error.message}`);
    return false;
  }
}

async function testPortConnectivity() {
  console.log('🔌 STEP 2: Testing Port Connectivity...');
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 5000;

    socket.setTimeout(timeout);

    socket.connect(dbConfig.port, dbConfig.host, () => {
      console.log(`✅ Port ${dbConfig.port} is open on ${dbConfig.host}`);
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      console.log(`❌ Connection timeout after ${timeout}ms`);
      socket.destroy();
      resolve(false);
    });

    socket.on('error', (error) => {
      console.log(`❌ Port connectivity failed: ${error.message}`);
      resolve(false);
    });
  });
}

async function testMySQLConnection() {
  console.log('🗄️  STEP 3: Testing MySQL Connection...');
  let connection;

  try {
    console.log('   Attempting to create connection pool...');
    const pool = mysql.createPool({
      ...dbConfig,
      connectionLimit: 1,
      queueLimit: 0,
    });

    console.log('   Attempting to get connection from pool...');
    connection = await pool.getConnection();

    console.log('   Testing simple query...');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
    console.log(`✅ MySQL connection successful!`);
    console.log(`   Test query result: ${JSON.stringify(rows)}`);

    // Test database access
    console.log('   Testing database access...');
    const [dbTest] = await connection.execute('SELECT DATABASE() as current_db, USER() as current_user');
    console.log(`✅ Database access successful!`);
    console.log(`   Current database: ${dbTest[0].current_db}`);
    console.log(`   Current user: ${dbTest[0].current_user}`);

    // Test table access
    console.log('   Testing table access...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ Table access successful! Found ${tables.length} tables.`);

    if (tables.length > 0) {
      console.log('   Sample tables:');
      tables.slice(0, 5).forEach((table, index) => {
        console.log(`     ${index + 1}. ${Object.values(table)[0]}`);
      });
    }

    connection.release();
    await pool.end();

    return true;
  } catch (error) {
    console.log(`❌ MySQL connection failed: ${error.message}`);
    console.log(`   Error code: ${error.code}`);
    console.log(`   Error errno: ${error.errno}`);
    console.log(`   SQL State: ${error.sqlState}`);

    if (connection) {
      connection.release();
    }

    return false;
  }
}

async function testNetworkConnectivity() {
  console.log('🌍 STEP 4: Testing Network Connectivity...');

  try {
    console.log('   Testing ping...');
    const { stdout: pingOutput } = await execAsync(`ping -n 4 ${dbConfig.host}`);
    console.log('✅ Ping successful');
    console.log(pingOutput.split('\n').slice(-3).join('\n'));
  } catch (error) {
    console.log(`⚠️  Ping failed (might be blocked by firewall): ${error.message}`);
  }

  try {
    console.log('   Testing traceroute...');
    const { stdout: traceOutput } = await execAsync(`tracert -d -h 10 ${dbConfig.host}`);
    console.log('✅ Traceroute completed');
    const lines = traceOutput.split('\n').filter(line => line.trim());
    console.log('   Route summary:');
    lines.slice(-5).forEach(line => console.log(`     ${line}`));
  } catch (error) {
    console.log(`⚠️  Traceroute failed: ${error.message}`);
  }
}

async function testEnvironmentVariables() {
  console.log('🔧 STEP 5: Checking Environment Variables...');

  const envVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE', 'DB_PORT'];
  let allSet = true;

  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${varName.includes('PASSWORD') ? '***SET***' : value}`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      allSet = false;
    }
  });

  if (!allSet) {
    console.log('');
    console.log('⚠️  Some environment variables are missing!');
    console.log('   Make sure your .env file contains:');
    envVars.forEach(varName => {
      console.log(`   ${varName}=your_value_here`);
    });
  }

  return allSet;
}

async function testFirewallAndSecurity() {
  console.log('🔒 STEP 6: Testing Firewall & Security...');

  // Test if MySQL port is blocked
  console.log('   Checking if MySQL port 3306 is accessible...');

  try {
    const { stdout } = await execAsync('netstat -an | find "3306"');
    console.log('✅ Local MySQL port check completed');
  } catch (error) {
    console.log('⚠️  Could not check local ports (might be Windows limitation)');
  }

  // Check if AWS security group allows connections
  console.log('   Note: Make sure your AWS EC2 security group allows:');
  console.log('   - Inbound TCP 3306 from your IP address (or 0.0.0.0/0 for testing)');
  console.log('   - MySQL/Aurora protocol');
}

async function runFullDiagnostic() {
  console.log('🚀 STARTING COMPREHENSIVE DATABASE DIAGNOSTIC');
  console.log('==============================================');
  console.log('');

  const results = {
    dns: await testDNSResolution(),
    port: await testPortConnectivity(),
    mysql: await testMySQLConnection(),
    env: await testEnvironmentVariables(),
  };

  await testNetworkConnectivity();
  await testFirewallAndSecurity();

  console.log('');
  console.log('📊 DIAGNOSTIC RESULTS SUMMARY');
  console.log('=============================');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(`Tests passed: ${passed}/${total}`);

  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${test.toUpperCase()}: ${status}`);
  });

  console.log('');
  if (results.mysql) {
    console.log('🎉 SUCCESS: Database connection is working!');
    console.log('   Your Next.js application should be able to connect to the database.');
  } else {
    console.log('💥 FAILURE: Database connection issues detected!');
    console.log('');
    console.log('🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Check if AWS EC2 instance is running');
    console.log('2. Verify security group allows MySQL connections (port 3306)');
    console.log('3. Confirm database credentials are correct');
    console.log('4. Check if MySQL service is running on the server');
    console.log('5. Verify network connectivity from your location');
    console.log('6. Check AWS VPC and subnet configurations');
  }

  console.log('');
  console.log('🔍 Diagnostic completed at:', new Date().toISOString());
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Database Connection Diagnostic Tool');
  console.log('');
  console.log('Usage: node debug-database-connection.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h    Show this help message');
  console.log('  --quick       Run only basic connectivity tests');
  console.log('  --mysql-only  Test only MySQL connection');
  console.log('');
  process.exit(0);
}

if (args.includes('--quick')) {
  console.log('Running quick diagnostic...');
  Promise.all([
    testDNSResolution(),
    testPortConnectivity(),
    testEnvironmentVariables()
  ]).then(([dns, port, env]) => {
    console.log('');
    console.log('Quick test results:', { dns, port, env });
  });
} else if (args.includes('--mysql-only')) {
  console.log('Testing MySQL connection only...');
  testMySQLConnection().then(success => {
    console.log('');
    console.log('MySQL test result:', success ? 'SUCCESS' : 'FAILED');
  });
} else {
  runFullDiagnostic().catch(error => {
    console.error('Diagnostic failed with error:', error);
    process.exit(1);
  });
}

module.exports = {
  testDNSResolution,
  testPortConnectivity,
  testMySQLConnection,
  testEnvironmentVariables,
  runFullDiagnostic
};
