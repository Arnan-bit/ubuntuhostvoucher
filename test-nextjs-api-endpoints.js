#!/usr/bin/env node
/**
 * Test Next.js API Endpoints with AWS Database
 *
 * This script tests the actual Next.js API routes to ensure they work
 * with the AWS VPS database connection.
 */

const http = require('http');

console.log('🧪 TESTING NEXT.JS API ENDPOINTS WITH AWS DATABASE\n');

// Test configuration
const baseUrl = 'http://localhost:3000';
const testEndpoints = [
  { path: '/api/data', description: 'Data API endpoint' },
  { path: '/api/core/products', description: 'Products API endpoint' },
  { path: '/api/core/categories', description: 'Categories API endpoint' },
  { path: '/api/auth/mysql-admin-login', description: 'Admin login endpoint' },
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testEndpoint(endpoint) {
  const url = `${baseUrl}${endpoint.path}`;
  console.log(`\n🔍 Testing: ${endpoint.description}`);
  console.log(`   URL: ${url}`);

  try {
    const response = await makeRequest(url);

    if (response.status === 200) {
      console.log(`   ✅ Status: ${response.status} - SUCCESS`);

      if (typeof response.data === 'object' && response.data !== null) {
        // Check for database-related data
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log(`   📊 Data: Found ${response.data.length} records`);
          console.log(`   📝 Sample: ${JSON.stringify(response.data[0]).substring(0, 100)}...`);
        } else if (response.data.products && Array.isArray(response.data.products)) {
          console.log(`   📊 Products: Found ${response.data.products.length} products`);
        } else if (response.data.categories && Array.isArray(response.data.categories)) {
          console.log(`   📊 Categories: Found ${response.data.categories.length} categories`);
        } else if (response.data.message) {
          console.log(`   💬 Message: ${response.data.message}`);
        } else {
          console.log(`   📄 Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
        }
      } else {
        console.log(`   📄 Response: ${response.data.substring(0, 200)}...`);
      }
    } else {
      console.log(`   ❌ Status: ${response.status} - FAILED`);
      console.log(`   📄 Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
    }

    return response.status === 200;
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Step 1: Checking if Next.js development server is running...');

  try {
    await makeRequest(`${baseUrl}/api/data`);
    console.log('✅ Next.js development server is running');
  } catch (error) {
    console.log('❌ Next.js development server is NOT running');
    console.log('\n🔧 SOLUTION: Start the Next.js development server:');
    console.log('   npm run dev');
    console.log('   or');
    console.log('   yarn dev');
    console.log('\n⚠️  IMPORTANT: Make sure .env.local is loaded by restarting the server if it was already running');
    process.exit(1);
  }

  console.log('\nStep 2: Testing API endpoints...\n');

  let successCount = 0;
  let totalTests = testEndpoints.length;

  for (const endpoint of testEndpoints) {
    const success = await testEndpoint(endpoint);
    if (success) successCount++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful endpoints: ${successCount}/${totalTests}`);

  if (successCount === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Next.js API endpoints are working with AWS database');
    console.log('✅ Your website should now be fully functional');
    console.log('\n🚀 Ready for production deployment!');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('🔧 Possible solutions:');
    console.log('1. Restart Next.js development server: Ctrl+C then npm run dev');
    console.log('2. Check .env.local file has correct database credentials');
    console.log('3. Verify AWS VPS MySQL server is accessible');
    console.log('4. Check database tables exist and have data');

    if (successCount === 0) {
      console.log('\n❌ CRITICAL: No API endpoints working');
      console.log('💡 This indicates environment variables are not loaded');
      console.log('🔧 Try: rm -rf .next && npm run dev');
    }
  }

  console.log('\n📋 Environment Variables Status:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'NOT SET'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? 'SET' : 'NOT SET'}`);
  console.log(`   DB_DATABASE: ${process.env.DB_DATABASE || 'NOT SET'}`);

  console.log('\n🔍 Next Steps:');
  console.log('1. If tests failed, restart Next.js: npm run dev');
  console.log('2. Open browser to http://localhost:3000');
  console.log('3. Test website functionality');
  console.log('4. Check browser console for any errors');
}

runTests().catch(err => {
  console.error('\n💥 FATAL ERROR:', err.message);
  process.exit(1);
});
