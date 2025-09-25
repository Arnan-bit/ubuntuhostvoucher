const fs = require('fs');
const https = require('https');
const path = require('path');

// Create a simple placeholder image by downloading from a service
async function createPlaceholder() {
    const placeholderUrl = 'https://placehold.co/400x300/1e293b/ffffff.png?text=Image+Not+Available';
    const placeholderPath = path.join(__dirname, 'public', 'placeholder-image.png');
    
    console.log('📥 Downloading placeholder image...');
    console.log('URL:', placeholderUrl);
    console.log('Path:', placeholderPath);
    
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(placeholderPath);
        
        https.get(placeholderUrl, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log('✅ Placeholder image created successfully');
                resolve(placeholderPath);
            });
            
            file.on('error', (err) => {
                fs.unlink(placeholderPath, () => {}); // Delete the file on error
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Run the function
createPlaceholder()
    .then((path) => {
        console.log('🎉 Placeholder ready at:', path);
    })
    .catch((error) => {
        console.error('❌ Error creating placeholder:', error.message);
        
        // Create a simple text file as fallback
        const fallbackPath = path.join(__dirname, 'public', 'placeholder-image.txt');
        fs.writeFileSync(fallbackPath, 'Placeholder image not available');
        console.log('📝 Created text fallback at:', fallbackPath);
    });
