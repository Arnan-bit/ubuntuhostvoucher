const https = require('https');
const fs = require('fs');
const path = require('path');

// Sample images to create
const sampleImages = [
    {
        filename: '1755916217104_ChatGPT_Image_18_Agu_2025__10.37.41.png',
        url: 'https://placehold.co/400x300/3b82f6/ffffff.png?text=Specialist+Profile',
        description: 'Specialist Profile Image'
    },
    {
        filename: '1755916060366_new_promo.png',
        url: 'https://placehold.co/500x400/ef4444/ffffff.png?text=Promotional+Offer',
        description: 'Floating Promo Image'
    },
    {
        filename: '1755916097312_design_grafis_coupon_1_11zon.png',
        url: 'https://placehold.co/600x300/10b981/ffffff.png?text=Coupon+Design',
        description: 'Popup Modal Coupon'
    },
    {
        filename: '1755916018928_ChatGPT_Image_18_Agu_2025__10.55.24.png',
        url: 'https://placehold.co/400x200/8b5cf6/ffffff.png?text=Banner+Image',
        description: 'Banner Image'
    },
    {
        filename: '1755916033205_ChatGPT_Image_18_Agu_2025__10.55.24.png',
        url: 'https://placehold.co/350x250/f59e0b/ffffff.png?text=Logo+Image',
        description: 'Logo Image'
    }
];

// Download image from URL
function downloadImage(url, filepath, description) {
    return new Promise((resolve, reject) => {
        console.log(`📥 Creating ${description}...`);
        
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ Created: ${path.basename(filepath)}`);
                resolve(filepath);
            });
            
            file.on('error', (err) => {
                fs.unlink(filepath, () => {}); // Delete the file on error
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function createSampleImages() {
    console.log('🎨 Creating sample images for testing...\n');
    
    // Ensure directory exists
    const imagesDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        console.log(`📁 Created directory: ${imagesDir}`);
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const img of sampleImages) {
        try {
            const filepath = path.join(imagesDir, img.filename);
            
            // Skip if file already exists
            if (fs.existsSync(filepath)) {
                console.log(`⏭️ Skipping ${img.filename} (already exists)`);
                successCount++;
                continue;
            }
            
            await downloadImage(img.url, filepath, img.description);
            successCount++;
            
            // Small delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`❌ Failed to create ${img.filename}:`, error.message);
            errorCount++;
        }
    }
    
    console.log(`\n📊 Sample Images Summary:`);
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📁 Total: ${sampleImages.length}`);
    
    // List created files
    console.log(`\n📁 Files in uploads/images:`);
    const files = fs.readdirSync(imagesDir);
    files.forEach(file => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB)`);
    });
    
    console.log(`\n🎉 Sample images ready!`);
    console.log(`\n📋 What's available:`);
    console.log(`1. ✅ Specialist Profile Image`);
    console.log(`2. ✅ Floating Promotional Popup`);
    console.log(`3. ✅ Coupon Design for Modal`);
    console.log(`4. ✅ Banner Images`);
    console.log(`5. ✅ Logo Images`);
    
    console.log(`\n🚀 Next steps:`);
    console.log(`1. Restart Next.js server`);
    console.log(`2. Open http://localhost:9002`);
    console.log(`3. Check that all images display correctly`);
    console.log(`4. Test admin panel uploads`);
}

// Run the function
createSampleImages().catch(console.error);
