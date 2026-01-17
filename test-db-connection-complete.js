#!/usr/bin/env node
/**
 * Complete Database Connection Test
 *
 * Tests both direct connection and SSH tunnel connection
 * Usage: node test-db-connection-complete.js
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection(config, label) {
  console.log(`\n🔍 Testing ${label}...\n`);
  console.log('Configuration:');
  console.log(`  Host: ${config.host}:${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}\n`);

  try {
    const pool = mysql.createPool(config);
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database!\n');

    // Test database info
    const [dbInfo] = await connection.execute('SELECT VERSION() as version');
    console.log(`📊 MySQL Version: ${dbInfo[0].version}\n`);

    // Test products
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`🛍️  Products: ${products[0].count} items\n`);

    connection.release();
    await pool.end();

    console.log(`✅ ${label} - SUCCESS!\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${label} - FAILED\n`);
    console.error(`Error: ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log('🚀 Complete Database Connection Test\n');
  console.log('=' .repeat(50));

  // Test 1: Direct Connection (current .env.local)
  const directConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
  };

  const directSuccess = await testConnection(directConfig, 'Direct Connection');

  // Test 2: SSH Tunnel Connection (if available)
  const tunnelConfig = {
    ...directConfig,
    host: 'localhost',
    port: 3307,
  };

  const tunnelSuccess = await testConnection(tunnelConfig, 'SSH Tunnel Connection');

  // Results
  console.log('=' .repeat(50));
  console.log('📋 TEST RESULTS:');
  console.log(`  Direct Connection: ${directSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`  SSH Tunnel: ${tunnelSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);

  if (directSuccess) {
    console.log('\n🎉 Direct connection works! No SSH tunnel needed.');
    console.log('   Your AWS security group allows MySQL connections.');
  } else if (tunnelSuccess) {
    console.log('\n🔧 SSH tunnel works! Use tunnel for development.');
    console.log('   Run: cp .env.local.tunnel .env.local');
    console.log('   Then start SSH tunnel: node setup-ssh-tunnel.js');
  } else {
    console.log('\n❌ Both connections failed!');
    console.log('   Check:');
    console.log('   1. AWS security group allows MySQL (port 3306)');
    console.log('   2. MySQL service is running on AWS VPS');
    console.log('   3. SSH tunnel is active (if using tunnel)');
    console.log('   4. Database credentials are correct');
  }

  console.log('\n💡 Next steps:');
  if (directSuccess) {
    console.log('   Run: npm run dev');
  } else if (tunnelSuccess) {
    console.log('   1. cp .env.local.tunnel .env.local');
    console.log('   2. node setup-ssh-tunnel.js (in background)');
    console.log('   3. npm run dev (in new terminal)');
  } else {
    console.log('   Fix AWS security group or SSH tunnel setup');
  }
}

main().catch(console.error);
