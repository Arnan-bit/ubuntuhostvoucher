#!/usr/bin/env node
/**
 * Test API Endpoints
 * 
 * Tujuan: Verifikasi bahwa API routes di Next.js bekerja dengan database AWS
 * Ini menguji endpoint yang dibuat di src/app/api/
 */

const http = require('http');

const tests = [
  {
    name: '📄 Homepage (GET /)',
    method: 'GET',
    path: '/',
    expectedStatus: 200,
  },
  {
    name: '🛍️  Products API (GET /api/core/products)',
    method: 'GET',
    path: '/api/core/products',
    expectedStatus: 200,
  },
  {
    name: '🏷️  Categories API (GET /api/core/categories)',
    method: 'GET',
    path: '/api/core/categories',
    expectedStatus: 200,
  },
  {
    name: '🔐 Firebase Login API (POST /api/auth/firebase-login)',
    method: 'POST',
    path: '/api/auth/firebase-login',
    body: { email: 'test@test.com', password: 'test' },
    expectedStatus: 503, // Expected to return 503 (Firebase disabled)
  },
];

async function runTests(port = 3001) {
  console.log(`\n🧪 Running API Tests on localhost:${port}\n`);
  console.log('═'.repeat(50));

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await makeRequest(test.method, test.path, test.body, port);
      
      const statusMatch = result.status === test.expectedStatus;
      const status = statusMatch ? '✅' : '⚠️ ';
      
      console.log(`\n${status} ${test.name}`);
      console.log(`   Status: ${result.status} (expected: ${test.expectedStatus})`);
      
      if (result.data) {
        const preview = result.data.substring(0, 100);
        console.log(`   Response: ${preview}${result.data.length > 100 ? '...' : ''}`);
      }

      if (statusMatch) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`\n❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`\n📊 Test Results:`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total: ${passed + failed}\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${failed} test(s) failed\n`);
    process.exit(1);
  }
}

function makeRequest(method, path, body = null, port = 3001) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Run tests
const port = process.argv[2] || 3001;
runTests(parseInt(port));
