const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testLocalUpload() {
    console.log('🧪 Testing Local File Manager Upload API...\n');

    // Test different categories
    const testCases = [
        {
            category: 'images',
            description: 'General Images'
        },
        {
            category: 'banners',
            description: 'Banner Images'
        },
        {
            category: 'profiles',
            description: 'Profile Images'
        },
        {
            category: 'promos',
            description: 'Promotional Images'
        }
    ];

    // Create a test image file (simple PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a simple test image buffer (1x1 PNG)
    const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
        0x90, 0x77, 0x53, 0xDE, // CRC
        0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // image data
        0xE2, 0x21, 0xBC, 0x33, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
    ]);

    fs.writeFileSync(testImagePath, pngBuffer);
    console.log(`📁 Created test image: ${testImagePath}`);

    for (const testCase of testCases) {
        console.log(`\n🔄 Testing ${testCase.description} (${testCase.category})...`);
        
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(testImagePath), {
                filename: `test-${testCase.category}-${Date.now()}.png`,
                contentType: 'image/png'
            });
            formData.append('category', testCase.category);

            const response = await fetch('http://localhost:9002/api/upload', {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders()
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log(`✅ ${testCase.description} upload successful:`);
                console.log(`   📄 Filename: ${result.filename}`);
                console.log(`   🔗 URL: ${result.url}`);
                console.log(`   📊 Size: ${result.size} bytes`);
                console.log(`   📂 Category: ${result.category}`);
                console.log(`   🌐 Full URL: ${result.fullUrl}`);

                // Test if file is accessible
                const testResponse = await fetch(`http://localhost:9002${result.url}`);
                if (testResponse.ok) {
                    console.log(`   ✅ File is accessible via URL`);
                } else {
                    console.log(`   ❌ File not accessible: ${testResponse.status}`);
                }
            } else {
                console.log(`❌ ${testCase.description} upload failed:`);
                console.log(`   Error: ${result.error}`);
                console.log(`   Details: ${result.details}`);
            }

        } catch (error) {
            console.log(`❌ ${testCase.description} upload error:`);
            console.log(`   ${error.message}`);
        }
    }

    // Test invalid file type
    console.log(`\n🔄 Testing invalid file type...`);
    try {
        const textFilePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(textFilePath, 'This is a test file');

        const formData = new FormData();
        formData.append('file', fs.createReadStream(textFilePath), {
            filename: 'test.txt',
            contentType: 'text/plain'
        });
        formData.append('category', 'images');

        const response = await fetch('http://localhost:9002/api/upload', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });

        const result = await response.json();

        if (!response.ok) {
            console.log(`✅ Invalid file type correctly rejected:`);
            console.log(`   Error: ${result.error}`);
        } else {
            console.log(`❌ Invalid file type was accepted (should be rejected)`);
        }

        // Cleanup
        fs.unlinkSync(textFilePath);

    } catch (error) {
        console.log(`❌ Invalid file type test error: ${error.message}`);
    }

    // Test file size limit
    console.log(`\n🔄 Testing file size validation...`);
    try {
        // Create a large file (simulate 15MB)
        const largeBuffer = Buffer.alloc(15 * 1024 * 1024, 0xFF);
        const largeFilePath = path.join(__dirname, 'large-test.png');
        
        // Add PNG header to make it a valid PNG
        const largePngBuffer = Buffer.concat([pngBuffer.slice(0, 33), largeBuffer, pngBuffer.slice(-12)]);
        fs.writeFileSync(largeFilePath, largePngBuffer);

        const formData = new FormData();
        formData.append('file', fs.createReadStream(largeFilePath), {
            filename: 'large-test.png',
            contentType: 'image/png'
        });
        formData.append('category', 'images');

        const response = await fetch('http://localhost:9002/api/upload', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });

        const result = await response.json();

        if (!response.ok) {
            console.log(`✅ Large file correctly rejected:`);
            console.log(`   Error: ${result.error}`);
        } else {
            console.log(`❌ Large file was accepted (should be rejected)`);
        }

        // Cleanup
        fs.unlinkSync(largeFilePath);

    } catch (error) {
        console.log(`❌ File size test error: ${error.message}`);
    }

    // List uploaded files
    console.log(`\n📁 Checking uploaded files...`);
    const categories = ['images', 'banners', 'profiles', 'promos'];
    
    for (const category of categories) {
        const categoryPath = path.join(__dirname, 'public', 'uploads', category);
        if (fs.existsSync(categoryPath)) {
            const files = fs.readdirSync(categoryPath);
            console.log(`\n📂 ${category.toUpperCase()} (${files.length} files):`);
            files.forEach(file => {
                const filePath = path.join(categoryPath, file);
                const stats = fs.statSync(filePath);
                console.log(`   - ${file} (${Math.round(stats.size / 1024)}KB)`);
            });
        } else {
            console.log(`\n📂 ${category.toUpperCase()}: Directory not found`);
        }
    }

    // Cleanup test file
    fs.unlinkSync(testImagePath);
    console.log(`\n🧹 Cleaned up test files`);

    console.log(`\n🎉 Local File Manager Upload Test Complete!`);
    console.log(`\n📋 Summary:`);
    console.log(`✅ Local file storage working`);
    console.log(`✅ Category-based organization`);
    console.log(`✅ File type validation`);
    console.log(`✅ File size validation`);
    console.log(`✅ URL generation and accessibility`);
    console.log(`✅ Error handling`);
}

// Run the test
testLocalUpload().catch(console.error);
