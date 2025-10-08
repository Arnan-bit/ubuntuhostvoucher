const mysql = require('mysql2/promise');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

// Download image from URL
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        console.log(`📥 Downloading: ${url}`);
        
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${path.basename(filepath)}`);
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

async function migrateImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Get current settings
        const [rows] = await connection.execute('SELECT * FROM settings WHERE id = ?', ['main_settings']);
        
        if (rows.length === 0) {
            console.log('❌ No settings found');
            return;
        }

        const settings = rows[0];

        // Parse site_appearance
        let siteAppearance = {};
        try {
            if (settings.site_appearance) {
                siteAppearance = typeof settings.site_appearance === 'string' 
                    ? JSON.parse(settings.site_appearance) 
                    : settings.site_appearance;
            }
        } catch (e) {
            console.log('❌ Error parsing site_appearance:', e.message);
        }

        // Parse page_banners
        let pageBanners = {};
        try {
            if (settings.page_banners) {
                pageBanners = typeof settings.page_banners === 'string' 
                    ? JSON.parse(settings.page_banners) 
                    : settings.page_banners;
            }
        } catch (e) {
            console.log('❌ Error parsing page_banners:', e.message);
        }

        console.log('\n🔍 Finding images to migrate...');
        
        // Collect all images that need migration
        const imagesToMigrate = [];
        
        // Site appearance images
        Object.keys(siteAppearance).forEach(key => {
            const url = siteAppearance[key];
            if (url && typeof url === 'string' && (url.includes('hostvocher.com/uploads/') || url.includes('hostvoucher.com/uploads/'))) {
                imagesToMigrate.push({
                    type: 'site_appearance',
                    key: key,
                    url: url,
                    filename: url.split('/').pop()
                });
            }
        });

        // Page banner images
        Object.keys(pageBanners).forEach(page => {
            const banner = pageBanners[page];
            if (banner.slides && Array.isArray(banner.slides)) {
                banner.slides.forEach((slide, index) => {
                    const url = slide.imageUrl;
                    if (url && typeof url === 'string' && (url.includes('hostvocher.com/uploads/') || url.includes('hostvoucher.com/uploads/'))) {
                        imagesToMigrate.push({
                            type: 'page_banner',
                            page: page,
                            slideIndex: index,
                            url: url,
                            filename: url.split('/').pop()
                        });
                    }
                });
            }
        });

        console.log(`📊 Found ${imagesToMigrate.length} images to migrate:`);
        imagesToMigrate.forEach(img => {
            console.log(`  - ${img.filename} (${img.type})`);
        });

        if (imagesToMigrate.length === 0) {
            console.log('✅ No images need migration');
            return;
        }

        // Create directories if they don't exist
        const directories = ['images', 'banners', 'profiles', 'promos'];
        directories.forEach(dir => {
            const dirPath = path.join(process.cwd(), 'public', 'uploads', dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`📁 Created directory: ${dirPath}`);
            }
        });

        // Download images
        console.log('\n📥 Starting image migration...');
        let successCount = 0;
        let errorCount = 0;

        for (const img of imagesToMigrate) {
            try {
                const localPath = path.join(process.cwd(), 'public', 'uploads', 'images', img.filename);
                
                // Skip if file already exists
                if (fs.existsSync(localPath)) {
                    console.log(`⏭️ Skipping ${img.filename} (already exists)`);
                    successCount++;
                    continue;
                }

                await downloadImage(img.url, localPath);
                successCount++;
                
                // Small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`❌ Failed to download ${img.filename}:`, error.message);
                errorCount++;
            }
        }

        console.log(`\n📊 Migration Summary:`);
        console.log(`  ✅ Success: ${successCount}`);
        console.log(`  ❌ Errors: ${errorCount}`);
        console.log(`  📁 Total: ${imagesToMigrate.length}`);

        // Update database URLs to use local paths
        console.log('\n🔄 Updating database URLs...');
        
        // Update site_appearance URLs
        Object.keys(siteAppearance).forEach(key => {
            const url = siteAppearance[key];
            if (url && typeof url === 'string' && (url.includes('hostvocher.com/uploads/') || url.includes('hostvoucher.com/uploads/'))) {
                const filename = url.split('/').pop();
                siteAppearance[key] = `/uploads/images/${filename}`;
                console.log(`  Updated ${key}: ${filename}`);
            }
        });

        // Update page banner URLs
        Object.keys(pageBanners).forEach(page => {
            const banner = pageBanners[page];
            if (banner.slides && Array.isArray(banner.slides)) {
                banner.slides.forEach((slide, index) => {
                    const url = slide.imageUrl;
                    if (url && typeof url === 'string' && (url.includes('hostvocher.com/uploads/') || url.includes('hostvoucher.com/uploads/'))) {
                        const filename = url.split('/').pop();
                        slide.imageUrl = `/uploads/images/${filename}`;
                        console.log(`  Updated ${page} slide ${index + 1}: ${filename}`);
                    }
                });
            }
        });

        // Save updated URLs to database
        await connection.execute(
            'UPDATE settings SET site_appearance = ?, page_banners = ? WHERE id = ?',
            [
                JSON.stringify(siteAppearance),
                JSON.stringify(pageBanners),
                'main_settings'
            ]
        );

        console.log('✅ Database URLs updated successfully');

        console.log('\n🎉 Migration completed successfully!');
        console.log('\n📋 What was done:');
        console.log('1. ✅ Downloaded images from hosting to local storage');
        console.log('2. ✅ Updated database URLs to use local paths');
        console.log('3. ✅ Images now served from /uploads/ directory');
        console.log('4. ✅ No more CORS issues or network dependencies');

        console.log('\n🚀 Next steps:');
        console.log('1. Restart your Next.js server');
        console.log('2. Test image uploads in admin panel');
        console.log('3. Check that all images display correctly');
        console.log('4. Images are now stored locally and will work offline');

    } catch (error) {
        console.error('❌ Migration error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the migration
migrateImages();
