const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

async function testAdminUpload() {
    console.log('🧪 Testing Admin Panel Upload...');
    
    // Create a test image file
    const testImagePath = path.join(__dirname, 'test-banner.png');
    
    // Create a simple PNG file (1x1 pixel)
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
        0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // data
        0xE2, 0x21, 0xBC, 0x33, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    fs.writeFileSync(testImagePath, pngBuffer);
    
    try {
        console.log('📤 Testing upload API...');
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(testImagePath), {
            filename: 'test-banner.png',
            contentType: 'image/png'
        });
        
        const response = await axios.post('http://localhost:9002/api/upload', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const result = response.data;
        console.log('📥 Upload result:', result);
        
        if (result.success) {
            console.log('✅ Upload test successful!');
            console.log('🌐 File URL:', result.url);
            
            // Test if the uploaded file is accessible
            console.log('🔍 Testing file accessibility...');
            try {
                const fileResponse = await axios.get(result.url);
                if (fileResponse.status === 200) {
                    console.log('✅ Uploaded file is accessible');
                } else {
                    console.log('❌ Uploaded file is not accessible:', fileResponse.status);
                }
            } catch (e) {
                console.log('❌ File accessibility test failed:', e.message);
            }
            
        } else {
            console.log('❌ Upload test failed:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Upload test error:', error.message);
    } finally {
        // Clean up test file
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
            console.log('🧹 Test file cleaned up');
        }
    }
}

async function testSaveSettings() {
    console.log('\n🧪 Testing Save Settings API...');
    
    const testSettings = {
        site_title: 'HostVoucher Test',
        specialist_image_url: 'https://hostvocher.com/uploads/images/1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
        floating_promo_url: 'https://hostvocher.com/uploads/images/1755916060366_new_promo.png',
        home_banner_slide_1_image: 'https://hostvocher.com/uploads/images/1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
        home_banner_slide_1_title: 'Test Banner Title',
        home_banner_slide_1_subtitle: 'Test Banner Subtitle',
        home_banner_slide_1_enabled: true
    };
    
    try {
        const response = await axios.post('http://localhost:9002/api/action', {
            action: 'save_settings',
            ...testSettings
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = response.data;
        console.log('📥 Save settings result:', result);
        
        if (result.success) {
            console.log('✅ Save settings test successful!');
        } else {
            console.log('❌ Save settings test failed:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Save settings test error:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    (async () => {
        await testAdminUpload();
        await testSaveSettings();
    })();
}

module.exports = { testAdminUpload, testSaveSettings };
