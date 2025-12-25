const fs = require('fs');
const path = require('path');

async function testUpload() {
    console.log('🧪 Testing Upload API...');
    
    // Create a test image file
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'This is a test file for upload testing');
    
    try {
        const formData = new FormData();
        const file = new File([fs.readFileSync(testImagePath)], 'test-image.txt', {
            type: 'text/plain'
        });
        formData.append('file', file);
        
        console.log('📤 Sending test upload...');
        const response = await fetch('http://localhost:9002/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        console.log('📥 Upload result:', result);
        
        if (result.success) {
            console.log('✅ Upload test successful!');
            console.log('🌐 File URL:', result.url);
        } else {
            console.log('❌ Upload test failed:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Upload test error:', error);
    } finally {
        // Clean up test file
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
    }
}

// Run test if this file is executed directly
if (require.main === module) {
    testUpload();
}

module.exports = { testUpload };
