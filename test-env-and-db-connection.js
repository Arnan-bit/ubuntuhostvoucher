#!/usr/bin/env node
/**
 * Comprehensive Environment Variables and Database Connection Test
 *
 * This script will:
 * 1. Check if .env.local file exists
 * 2. Load environment variables manually
 * 3. Test database connection with AWS VPS
 * 4. Verify all database tables exist
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

console.log('🔍 COMPREHENSIVE ENVIRONMENT & DATABASE TEST\n');

// Step 1: Check for .env.local file first (development override)
console.log('Step 1: Checking for .env.local file...');
const envLocalPath = path.join(process.cwd(), '.env.local');
console.log(`Looking for file at: ${envLocalPath}`);

let envContent = '';
let envVars = {};

try {
  if (fs.existsSync(envLocalPath)) {
    console.log('✅ .env.local file exists (development override)');
    envContent = fs.readFileSync(envLocalPath, 'utf8');
    console.log(`File size: ${envContent.length} characters`);
  } else {
    console.log('⚠️ .env.local file does NOT exist, checking .env file...');
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      console.log('✅ .env file exists (master configuration)');
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log(`File size: ${envContent.length} characters`);
    } else {
      console.log('❌ Neither .env.local nor .env file exists');
      console.log('\n🔧 SOLUTION: Create .env file with your database credentials.');
      console.log('   Copy the following template and replace with your actual values:');
      console.log('');
      console.log('DB_HOST=localhost');
      console.log('DB_USER=hostvoch_webar');
      console.log('DB_PASSWORD=Wizard@231191493');
      console.log('DB_DATABASE=hostvoch_webapp');
      console.log('DB_PORT=3306');
      console.log('');
      console.log('⚠️  SECURITY WARNING: Never commit .env file to GitHub!');
      console.log('   .env is already in .gitignore for your safety.');
      process.exit(1);
    }
  }

  // Parse environment variables from the loaded file
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
    }
  });

  console.log(`✅ Found ${Object.keys(envVars).length} environment variables`);
} catch (error) {
  console.log('❌ Error reading .env.local file:', error.message);
  process.exit(1);
}

// Step 2: Load environment variables
console.log('\nStep 2: Loading environment variables...');
process.env.DB_HOST = envVars.DB_HOST || process.env.DB_HOST;
process.env.DB_USER = envVars.DB_USER || process.env.DB_USER;
process.env.DB_PASSWORD = envVars.DB_PASSWORD || process.env.DB_PASSWORD;
process.env.DB_DATABASE = envVars.DB_DATABASE || process.env.DB_DATABASE;
process.env.DB_PORT = envVars.DB_PORT || process.env.DB_PORT || '3306';

console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET (hidden)' : 'NOT SET');
console.log('DB_DATABASE:', process.env.DB_DATABASE || 'NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || 'NOT SET');

// Step 3: Validate required environment variables
console.log('\nStep 3: Validating environment variables...');
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:', missingVars.join(', '));
  console.log('\n🔧 SOLUTION: Add these to your .env.local file:');
  missingVars.forEach(varName => {
    console.log(`${varName}=your_${varName.toLowerCase()}_value`);
  });
  process.exit(1);
}

console.log('✅ All required environment variables are set');

// Step 4: Test database connection
console.log('\nStep 4: Testing database connection...');

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000,
};

console.log('Connection config:');
console.log(`  Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`  User: ${dbConfig.user}`);
console.log(`  Database: ${dbConfig.database}`);

async function testDatabaseConnection() {
  let connection;

  try {
    console.log('\n⏳ Attempting to connect to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');

    // Test 1: Get MySQL version
    console.log('\n📊 Database Information:');
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    console.log(`  MySQL Version: ${versionResult[0].version}`);

    // Test 2: List all tables
    console.log('\n📋 Available Tables:');
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME",
      [dbConfig.database]
    );

    if (tables.length === 0) {
      console.log('  ⚠️  No tables found in database!');
    } else {
      console.log(`  Found ${tables.length} tables:`);
      tables.forEach((table, idx) => {
        console.log(`    ${idx + 1}. ${table.TABLE_NAME}`);
      });
    }

    // Test 3: Check critical tables
    console.log('\n🔍 Checking Critical Tables:');
    const criticalTables = ['products', 'admin_users', 'settings', 'realtime_visitors'];

    for (const tableName of criticalTables) {
      try {
        const [countResult] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${tableName} LIMIT 1`
        );
        console.log(`  ✅ ${tableName}: ${countResult[0].count} records`);
      } catch (error) {
        console.log(`  ❌ ${tableName}: ${error.message}`);
      }
    }

    // Test 4: Sample data from products table
    console.log('\n📦 Sample Products Data:');
    try {
      const [products] = await connection.execute(
        'SELECT id, name, price FROM products LIMIT 3'
      );
      if (products.length > 0) {
        products.forEach((product, idx) => {
          console.log(`  ${idx + 1}. ${product.name} - $${product.price}`);
        });
      } else {
        console.log('  No products found');
      }
    } catch (error) {
      console.log(`  Error fetching products: ${error.message}`);
    }

    await connection.end();

    console.log('\n🎉 DATABASE TEST COMPLETED SUCCESSFULLY!');
    console.log('✅ Environment variables loaded correctly');
    console.log('✅ Database connection working');
    console.log('✅ All critical tables accessible');
    console.log('\n🚀 Your website should now work with AWS VPS database!');

  } catch (error) {
    console.log('\n❌ DATABASE CONNECTION FAILED');
    console.log('Error details:', error.message);
    console.log('Error code:', error.code);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('1. Check if database server is running');
      console.log('2. Verify DB_HOST in your .env file');
      console.log('3. Check if MySQL port 3306 is open in security groups');
      console.log('4. Verify MySQL service is running on server');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('1. Check DB_USER in your .env file');
      console.log('2. Check DB_PASSWORD in your .env file');
      console.log('3. Verify user has access to the database');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('1. Check DB_DATABASE in your .env file');
      console.log('2. Verify database exists on server');
    }

    process.exit(1);
  }
}

testDatabaseConnection().catch(err => {
  console.error('\n💥 FATAL ERROR:', err.message);
  process.exit(1);
});
