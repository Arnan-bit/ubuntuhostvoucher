#!/usr/bin/env node

const http = require('http');

async function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            status: res.statusCode,
            path: path,
            method: method,
            body: json
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            path: path,
            method: method,
            body: data
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        error: err.message,
        path: path
      });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');

  // Test 1: GET /api/data
  console.log('Test 1: GET /api/data?type=products&limit=3');
  let result = await testEndpoint('/api/data?type=products&limit=3');
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.body, null, 2));
  console.log('');

  // Test 2: GET /api/data stats
  console.log('Test 2: GET /api/data?type=stats');
  result = await testEndpoint('/api/data?type=stats');
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.body, null, 2));
  console.log('');

  // Test 3: POST /api/analytics/track-visitor
  console.log('Test 3: POST /api/analytics/track-visitor');
  result = await testEndpoint('/api/analytics/track-visitor', 'POST', {
    visitor_id: 'test-visitor-' + Date.now(),
    page_path: '/',
    device_type: 'desktop',
    session_id: 'test-session'
  });
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.body, null, 2));
  console.log('');

  // Test 4: GET /api/analytics/track-visitor
  console.log('Test 4: GET /api/analytics/track-visitor');
  result = await testEndpoint('/api/analytics/track-visitor');
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.body, null, 2));
  console.log('');

  console.log('✅ All tests completed!');
}

runTests();
