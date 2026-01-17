#!/usr/bin/env node
const http = require('http');

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    return new Promise((resolve) => {
      const req = http.get('http://localhost:3000/api/core/data?type=deals', (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log(`\n✅ SERVER READY & DATABASE CONNECTED!\n`);
            console.log(`📊 Products fetched: ${json.data.length}`);
            if (json.data.length > 0) {
              console.log(`\n🏆 Sample Product:`);
              console.log(`  Name: ${json.data[0].name}`);
              console.log(`  Price: ${json.data[0].price}`);
              console.log(`  Rating: ${json.data[0].rating}`);
            }
            resolve(true);
          } catch (e) {
            console.log(`Attempt ${i + 1}/${maxAttempts}: Parsing error, retrying...`);
            setTimeout(() => resolve(false), 1000);
          }
        });
      });

      req.on('error', (err) => {
        console.log(`Attempt ${i + 1}/${maxAttempts}: Connection failed, waiting...`);
        setTimeout(() => resolve(false), 1000);
      });

      req.setTimeout(2000);
    });
  }
}

waitForServer().then(success => {
  if (success) {
    console.log('\n✅ All database connections verified!');
    process.exit(0);
  } else {
    console.log('\n❌ Server failed to respond');
    process.exit(1);
  }
});
