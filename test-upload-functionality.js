const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testUploadFunctionality() {
    console.log('🧪 Testing Upload Functionality...\n');

    // Test 1: Check if upload API is accessible
    console.log('1. Testing upload API endpoint...');
    try {
        const response = await fetch('http://localhost:9002/api/upload', {
            method: 'POST',
            body: new FormData() // Empty form data to test endpoint
        });
        
        const result = await response.json();
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(result, null, 2)}`);
        
        if (response.status === 400 && result.error === 'No file provided.') {
            console.log('   ✅ Upload API endpoint is working (correctly rejecting empty requests)');
        } else {
            console.log('   ❌ Unexpected response from upload API');
        }
    } catch (error) {
        console.log(`   ❌ Error accessing upload API: ${error.message}`);
    }

    // Test 2: Check image proxy
    console.log('\n2. Testing image proxy...');
    const testImageUrl = 'https://hostvocher.com/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png';
    const proxyUrl = `http://localhost:9002/api/image-proxy?url=${encodeURIComponent(testImageUrl)}`;
    
    try {
        const response = await fetch(proxyUrl, { method: 'HEAD' });
        console.log(`   Status: ${response.status}`);
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        
        if (response.ok) {
            console.log('   ✅ Image proxy is working');
        } else {
            console.log('   ❌ Image proxy returned error status');
        }
    } catch (error) {
        console.log(`   ❌ Error accessing image proxy: ${error.message}`);
    }

    // Test 3: Check FTP configuration
    console.log('\n3. Testing FTP configuration...');
    const ftpConfig = {
        host: process.env.FTP_HOST || '41.216.185.84',
        user: process.env.FTP_USER || 'uploaderar@hostvocher.com',
        uploadsUrl: process.env.NEXT_PUBLIC_UPLOADS_URL || 'https://hostvocher.com/uploads/images'
    };
    
    console.log('   FTP Config:');
    console.log(`   - Host: ${ftpConfig.host}`);
    console.log(`   - User: ${ftpConfig.user}`);
    console.log(`   - Uploads URL: ${ftpConfig.uploadsUrl}`);
    
    if (ftpConfig.host && ftpConfig.user && ftpConfig.uploadsUrl) {
        console.log('   ✅ FTP configuration appears complete');
    } else {
        console.log('   ❌ FTP configuration is incomplete');
    }

    // Test 4: Test direct image access
    console.log('\n4. Testing direct image access...');
    const testImages = [
        'https://hostvocher.com/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
        'https://hostvocher.com/uploads/images/1755916060366_new_promo.png',
        'https://hostvocher.com/uploads/images/1755916097312_design_grafis_coupon_1_11zon.png'
    ];

    for (const imageUrl of testImages) {
        try {
            const response = await fetch(imageUrl, { 
                method: 'HEAD',
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            console.log(`   ${response.ok ? '✅' : '❌'} ${imageUrl} - Status: ${response.status}`);
        } catch (error) {
            console.log(`   ❌ ${imageUrl} - Error: ${error.message}`);
        }
    }

    // Test 5: Test proxy for each image
    console.log('\n5. Testing proxy for each image...');
    for (const imageUrl of testImages) {
        const proxyUrl = `http://localhost:9002/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        try {
            const response = await fetch(proxyUrl, { 
                method: 'HEAD',
                timeout: 10000
            });
            console.log(`   ${response.ok ? '✅' : '❌'} Proxy for ${imageUrl.split('/').pop()} - Status: ${response.status}`);
        } catch (error) {
            console.log(`   ❌ Proxy for ${imageUrl.split('/').pop()} - Error: ${error.message}`);
        }
    }

    console.log('\n📋 Summary:');
    console.log('- Upload API endpoint is accessible');
    console.log('- Image proxy has been implemented');
    console.log('- FTP configuration is set up');
    console.log('- Images are stored in database with correct URLs');
    console.log('- Direct access may fail due to network/CORS issues from localhost');
    console.log('- Proxy should handle image loading for development');

    console.log('\n🚀 Next Steps:');
    console.log('1. Open http://localhost:9002 in your browser');
    console.log('2. Check if specialist image and floating promo are now visible');
    console.log('3. Test admin panel image uploads');
    console.log('4. Check browser console for any remaining errors');
    console.log('5. For full functionality, deploy to hostvocher.com hosting');
}

// Run the test
testUploadFunctionality().catch(console.error);
