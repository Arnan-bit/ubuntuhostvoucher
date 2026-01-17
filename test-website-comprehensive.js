#!/usr/bin/env node
/**
 * Comprehensive Website Test
 *
 * Tests all main pages and API endpoints to identify issues
 * Usage: node test-website-comprehensive.js
 */

const http = require('http');

async function testEndpoint(url, description) {
  console.log(`\n🔍 Testing ${description}...`);
  console.log(`URL: ${url}`);

  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';

      console.log(`Status: ${res.statusCode}`);

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Check if response contains error indicators
          const hasErrors = data.toLowerCase().includes('error') ||
                           data.toLowerCase().includes('failed') ||
                           data.toLowerCase().includes('exception') ||
                           data.toLowerCase().includes('cannot');

          const hasDatabaseData = data.toLowerCase().includes('product') ||
                                 data.toLowerCase().includes('settings') ||
                                 data.toLowerCase().includes('success');

          console.log(`Response size: ${data.length} bytes`);
          console.log(`Contains errors: ${hasErrors ? '❌ YES' : '✅ NO'}`);
          console.log(`Contains data: ${hasDatabaseData ? '✅ YES' : '❌ NO'}`);

          if (data.length < 1000) {
            console.log(`Response preview: ${data.substring(0, 200)}...`);
          }

          resolve({
            url,
            description,
            status: res.statusCode,
            hasErrors,
            hasDatabaseData,
            size: data.length
          });
        } catch (error) {
          console.log(`Parse error: ${error.message}`);
          resolve({
            url,
            description,
            status: res.statusCode,
            hasErrors: true,
            hasDatabaseData: false,
            size: data.length,
            error: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`Request error: ${error.message}`);
      resolve({
        url,
        description,
        status: 0,
        hasErrors: true,
        hasDatabaseData: false,
        error: error.message
      });
    });

    req.setTimeout(10000, () => {
      console.log('Request timeout');
      req.destroy();
      resolve({
        url,
        description,
        status: 0,
        hasErrors: true,
        hasDatabaseData: false,
        error: 'Timeout'
      });
    });
  });
}

async function main() {
  console.log('🚀 Comprehensive Website Test\n');
  console.log('=' .repeat(60));

  const baseUrl = 'http://localhost:3000';
  const tests = [
    { url: `${baseUrl}/`, description: 'Homepage' },
    { url: `${baseUrl}/catalog`, description: 'Catalog Page' },
    { url: `${baseUrl}/admin`, description: 'Admin Panel' },
    { url: `${baseUrl}/api/data`, description: 'Settings API' },
    { url: `${baseUrl}/api/core/products`, description: 'Products API' },
    { url: `${baseUrl}/api/auth/mysql-admin-login`, description: 'Admin Login API' },
  ];

  const results = [];

  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description);
    results.push(result);
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📋 TEST SUMMARY:');

  let successCount = 0;
  let errorCount = 0;
  let dataCount = 0;

  results.forEach(result => {
    const status = result.status === 200 ? '✅' : '❌';
    const data = result.hasDatabaseData ? '📊' : '📭';
    const errors = result.hasErrors ? '⚠️' : '✅';

    console.log(`${status} ${data} ${errors} ${result.description} (${result.status})`);

    if (result.status === 200) successCount++;
    if (result.hasErrors) errorCount++;
    if (result.hasDatabaseData) dataCount++;
  });

  console.log(`\n📊 Statistics:`);
  console.log(`  Successful requests: ${successCount}/${tests.length}`);
  console.log(`  Pages with errors: ${errorCount}/${tests.length}`);
  console.log(`  Pages with database data: ${dataCount}/${tests.length}`);

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');

  if (successCount === tests.length) {
    console.log('✅ All pages are loading successfully!');
  } else {
    console.log('❌ Some pages have issues. Check the errors above.');
  }

  if (errorCount > 0) {
    console.log('⚠️  Pages contain error messages. Check browser console for details.');
  }

  if (dataCount === 0) {
    console.log('❌ No database data found. Database connection may be broken.');
  } else {
    console.log('✅ Database data is being served correctly.');
  }

  console.log('\n🔧 Next steps:');
  console.log('1. Open browser to http://localhost:3000');
  console.log('2. Check browser developer tools (F12) for JavaScript errors');
  console.log('3. Test each page manually to see actual display issues');
  console.log('4. Check network tab for failed requests');
}

main().catch(console.error);
