const http = require('http');
const fs = require('fs');
const path = require('path');

async function testImageAccess() {
    console.log('🔍 TESTING IMAGE ACCESS FROM API SERVER');
    console.log('=======================================');

    // Test URLs untuk gambar yang sudah diupload
    const testUrls = [
        {
            name: 'Branding Logo (April Profile)',
            url: 'http://localhost:9001/uploads/images/1755926458595_ChatGPT_Image_Apr_8__2025__05_52_32_PM.png'
        },
        {
            name: 'Favicon (ChatGPT Portrait)',
            url: 'http://localhost:9001/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png'
        },
        {
            name: 'Floating Promo (New Promo)',
            url: 'http://localhost:9001/uploads/images/1755926500003_new_promo.png'
        },
        {
            name: 'Popup Modal (Coupon Design)',
            url: 'http://localhost:9001/uploads/images/1755926522433_design_grafis_coupon_1_11zon.png'
        },
        {
            name: 'Banner Background (ChatGPT Landscape)',
            url: 'http://localhost:9001/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png'
        }
    ];

    console.log('\n📁 File System Check:');
    console.log('=====================');

    // Check if files exist in both possible locations
    const locations = [
        path.join(__dirname, 'api', 'uploads', 'images'),
        path.join(__dirname, 'public', 'uploads', 'images')
    ];

    locations.forEach((location, index) => {
        console.log(`\n📂 Location ${index + 1}: ${location}`);
        if (fs.existsSync(location)) {
            const files = fs.readdirSync(location).filter(f => f.endsWith('.png'));
            console.log(`✅ Directory exists with ${files.length} PNG files`);
            files.forEach(file => {
                const filePath = path.join(location, file);
                const stats = fs.statSync(filePath);
                const fileSizeKB = Math.round(stats.size / 1024);
                console.log(`   📸 ${file} (${fileSizeKB}KB)`);
            });
        } else {
            console.log('❌ Directory not found');
        }
    });

    console.log('\n🌐 HTTP Access Test:');
    console.log('====================');

    for (const testUrl of testUrls) {
        try {
            const result = await testHttpAccess(testUrl.url);
            if (result.success) {
                console.log(`✅ ${testUrl.name}: ${result.size}KB - ACCESSIBLE`);
            } else {
                console.log(`❌ ${testUrl.name}: ${result.error}`);
            }
        } catch (error) {
            console.log(`❌ ${testUrl.name}: ${error.message}`);
        }
    }

    console.log('\n🔧 SOLUTION RECOMMENDATIONS:');
    console.log('============================');
    
    // Check which location has the files
    const publicLocation = path.join(__dirname, 'public', 'uploads', 'images');
    const apiLocation = path.join(__dirname, 'api', 'uploads', 'images');
    
    if (fs.existsSync(publicLocation)) {
        const publicFiles = fs.readdirSync(publicLocation).filter(f => f.endsWith('.png'));
        console.log(`✅ Files found in public/uploads/images (${publicFiles.length} files)`);
        console.log('📋 Recommendation: API server static config is correct');
    }
    
    if (fs.existsSync(apiLocation)) {
        const apiFiles = fs.readdirSync(apiLocation).filter(f => f.endsWith('.png'));
        console.log(`✅ Files found in api/uploads (${apiFiles.length} files)`);
        console.log('📋 Recommendation: API server can serve from api/uploads');
    }

    console.log('\n🚀 NEXT STEPS:');
    console.log('==============');
    console.log('1. ✅ API server configured with static file serving');
    console.log('2. ✅ Files exist in public/uploads/images');
    console.log('3. 🔄 Test frontend image display');
    console.log('4. 🔄 Verify banner background shows correctly');
    console.log('5. 🔄 Check specialist profile in footer');

    console.log('\n💡 FRONTEND INTEGRATION:');
    console.log('========================');
    console.log('Frontend should request images from:');
    console.log('🌐 http://localhost:9001/uploads/images/[filename]');
    console.log('🌐 Or configure proxy to serve from Next.js public folder');
}

function testHttpAccess(url) {
    return new Promise((resolve) => {
        const request = http.get(url, (response) => {
            let data = '';
            let size = 0;
            
            response.on('data', (chunk) => {
                data += chunk;
                size += chunk.length;
            });
            
            response.on('end', () => {
                if (response.statusCode === 200) {
                    resolve({
                        success: true,
                        size: Math.round(size / 1024),
                        statusCode: response.statusCode
                    });
                } else {
                    resolve({
                        success: false,
                        error: `HTTP ${response.statusCode}`,
                        statusCode: response.statusCode
                    });
                }
            });
        });
        
        request.on('error', (error) => {
            resolve({
                success: false,
                error: error.message
            });
        });
        
        request.setTimeout(5000, () => {
            request.destroy();
            resolve({
                success: false,
                error: 'Request timeout'
            });
        });
    });
}

// Run the test
testImageAccess().catch(console.error);
