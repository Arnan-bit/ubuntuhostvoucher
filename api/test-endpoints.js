// api/test-endpoints.js
import http from 'http';

const testEndpoint = (path, method = 'GET') => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8800,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data,
                    path: path
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
};

const runTests = async () => {
    console.log('🧪 Testing API Endpoints...\n');
    
    const endpoints = [
        '/api/products',
        '/api/submissions', 
        '/api/settings',
        '/api/auth',
        '/api/upload'
    ];

    for (const endpoint of endpoints) {
        try {
            const result = await testEndpoint(endpoint);
            console.log(`✅ ${endpoint}: Status ${result.statusCode}`);
            if (result.statusCode !== 200 && result.statusCode !== 404) {
                console.log(`   Response: ${result.data.substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint}: ${error.message}`);
        }
    }
    
    console.log('\n🏁 API endpoint testing completed!');
};

runTests();
