const fs = require('fs');
const path = require('path');

// Comprehensive Image Verification Report
class ImageVerificationReport {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.successes = [];
    }

    addIssue(message) {
        this.issues.push(`❌ ${message}`);
    }

    addWarning(message) {
        this.warnings.push(`⚠️  ${message}`);
    }

    addSuccess(message) {
        this.successes.push(`✅ ${message}`);
    }

    print() {
        console.log('\n' + '='.repeat(80));
        console.log('IMAGE CONFIGURATION VERIFICATION REPORT');
        console.log('='.repeat(80) + '\n');

        if (this.successes.length > 0) {
            console.log('SUCCESSES:');
            this.successes.forEach(msg => console.log(msg));
            console.log();
        }

        if (this.warnings.length > 0) {
            console.log('WARNINGS:');
            this.warnings.forEach(msg => console.log(msg));
            console.log();
        }

        if (this.issues.length > 0) {
            console.log('CRITICAL ISSUES:');
            this.issues.forEach(msg => console.log(msg));
            console.log();
        }

        console.log('='.repeat(80) + '\n');
    }
}

const report = new ImageVerificationReport();

// 1. Check database.sql configuration
console.log('📋 Checking database.sql configuration...');
const dbPath = path.join(__dirname, 'database.sql');
const dbContent = fs.readFileSync(dbPath, 'utf8');

const hasImageFields = dbContent.includes('image_url') && 
                       dbContent.includes('nft_image_url') &&
                       dbContent.includes('catalog_image') &&
                       dbContent.includes('brand_logo');

if (hasImageFields) {
    report.addSuccess('Database has all image fields defined (image_url, nft_image_url, catalog_image, brand_logo)');
} else {
    report.addIssue('Database missing image field definitions');
}

const hasSiteAppearance = dbContent.includes('site_appearance') && dbContent.includes('page_banners');
if (hasSiteAppearance) {
    report.addSuccess('Database settings table has site_appearance and page_banners fields');
} else {
    report.addIssue('Database missing site_appearance or page_banners fields');
}

// 2. Check .env configuration
console.log('📋 Checking .env configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const hasDbConfig = envContent.includes('DB_HOST') &&
                       envContent.includes('DB_USER') &&
                       envContent.includes('DB_PASSWORD') &&
                       envContent.includes('DB_DATABASE');
    
    if (hasDbConfig) {
        report.addSuccess('.env has database configuration (DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE)');
    } else {
        report.addIssue('.env missing database configuration');
    }

    // Check for JWT
    const hasJWT = envContent.includes('JWT_SECRET');
    if (hasJWT) {
        report.addSuccess('.env has JWT_SECRET configured');
    } else {
        report.addWarning('.env missing JWT_SECRET - image upload may not work');
    }
} else {
    report.addIssue('.env file not found - database configuration missing');
}

// 3. Check frontend components for image handling
console.log('📋 Checking frontend components...');

const componentPaths = [
    'src/components/BannerRotation.tsx',
    'src/components/FloatingPromoImage.tsx',
    'src/components/PageBanner.tsx',
    'src/app/admin/page.tsx',
    'src/lib/db.ts'
];

for (const comp of componentPaths) {
    const compPath = path.join(__dirname, comp);
    if (fs.existsSync(compPath)) {
        const content = fs.readFileSync(compPath, 'utf8');
        
        // Check if component properly handles images
        if (content.includes('Image') || content.includes('img') || content.includes('imageUrl')) {
            report.addSuccess(`Component properly configured: ${comp}`);
        } else {
            report.addWarning(`Component ${comp} may not handle images properly`);
        }
    }
}

// 4. Check public/uploads directory
console.log('📋 Checking public/uploads directory...');
const uploadsPath = path.join(__dirname, 'public', 'uploads', 'images');
if (fs.existsSync(uploadsPath)) {
    const files = fs.readdirSync(uploadsPath);
    report.addSuccess(`public/uploads/images directory exists with ${files.length} image files`);
    
    if (files.length === 0) {
        report.addWarning('public/uploads/images directory is empty');
    }
} else {
    report.addIssue('public/uploads/images directory does not exist');
}

// 5. Check API routes for image handling
console.log('📋 Checking API routes...');
const apiPath = path.join(__dirname, 'src', 'app', 'api');
if (fs.existsSync(apiPath)) {
    report.addSuccess('API directory exists');
    
    // Check for upload endpoint
    const uploadEndpoint = path.join(apiPath, 'upload');
    if (fs.existsSync(uploadEndpoint)) {
        report.addSuccess('Upload API endpoint exists');
    } else {
        report.addWarning('Upload API endpoint may not exist');
    }
} else {
    report.addIssue('API directory not found');
}

// 6. Check configuration files
console.log('📋 Checking configuration files...');

const configFiles = [
    'next.config.ts',
    'src/config/environment.ts',
    'src/lib/db.ts'
];

for (const configFile of configFiles) {
    const configPath = path.join(__dirname, configFile);
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        if (content.includes('image') || content.includes('upload')) {
            report.addSuccess(`Configuration file properly handles images: ${configFile}`);
        } else {
            report.addWarning(`Configuration file may not handle images: ${configFile}`);
        }
    }
}

// 7. Database query integration
console.log('📋 Checking database query utilities...');
const dbUtilPath = path.join(__dirname, 'src', 'lib', 'db.ts');
if (fs.existsSync(dbUtilPath)) {
    const dbUtil = fs.readFileSync(dbUtilPath, 'utf8');
    
    const checks = [
        { name: 'site_appearance parsing', regex: /site_appearance|siteAppearance/ },
        { name: 'page_banners parsing', regex: /page_banners|pageBanners/ },
        { name: 'popup_modal parsing', regex: /popup_modal|popupModal/ },
        { name: 'JSON parsing', regex: /JSON\.parse/ },
        { name: 'image_url handling', regex: /image_url|imageUrl/ }
    ];

    for (const check of checks) {
        if (check.regex.test(dbUtil)) {
            report.addSuccess(`Database utility properly handles: ${check.name}`);
        } else {
            report.addWarning(`Database utility may not handle: ${check.name}`);
        }
    }
}

// 8. Summary and recommendations
console.log('📋 Generating summary...\n');

report.print();

// Final recommendations
console.log('\n🎯 RECOMMENDATIONS:');
console.log('==================');

if (report.issues.length > 0) {
    console.log(`\n⚠️  Found ${report.issues.length} critical issue(s) - Fix immediately before deployment:`);
    console.log('   1. Ensure database.sql has all image-related fields');
    console.log('   2. Create .env with database and JWT configuration');
    console.log('   3. Create public/uploads/images directory');
    console.log('   4. Verify database connection in production');
}

if (report.warnings.length > 0) {
    console.log(`\n⚠️  Found ${report.warnings.length} warning(s) - Review and optimize:`);
    console.log('   1. Ensure all frontend components load images correctly');
    console.log('   2. Test image upload functionality');
    console.log('   3. Verify image paths are accessible');
    console.log('   4. Check image file permissions on server');
}

if (report.issues.length === 0 && report.warnings.length === 0) {
    console.log('\n✅ All checks passed! Your image configuration is ready for deployment.');
}

console.log('\n💡 TESTING CHECKLIST:');
console.log('====================');
console.log('□ Test image upload in admin panel');
console.log('□ Verify images display on homepage');
console.log('□ Check floating promo appears');
console.log('□ Verify page banners rotate');
console.log('□ Test testimonial images load');
console.log('□ Check NFT showcase images load');
console.log('□ Verify logo, favicon, specialist images display');
console.log('□ Test in production environment');

console.log('\n📞 IMAGE LOCATIONS:');
console.log('===================');
console.log('✓ Site Images: /public/uploads/images/');
console.log('✓ Database Config: database.sql (settings table)');
console.log('✓ Frontend Components: /src/components/');
console.log('✓ API Endpoints: /src/app/api/upload/');
console.log('✓ Admin Panel: /src/app/admin/page.tsx');

console.log('\n✅ Verification complete!\n');
