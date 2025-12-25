#!/usr/bin/env node

// ========================================
// HOSTVOUCHER - COMPREHENSIVE CHECK & FIX
// ========================================

const fs = require('fs');
const path = require('path');

console.log('🔍 HOSTVOUCHER COMPREHENSIVE CHECK & FIX');
console.log('==========================================');

let issues = [];
let fixes = [];

// Helper functions
function checkFile(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description}: EXISTS`);
        return true;
    } else {
        console.log(`❌ ${description}: MISSING`);
        issues.push(`Missing: ${description} (${filePath})`);
        return false;
    }
}

function checkDirectory(dirPath, description) {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        console.log(`✅ ${description}: EXISTS`);
        return true;
    } else {
        console.log(`❌ ${description}: MISSING`);
        issues.push(`Missing directory: ${description} (${dirPath})`);
        return false;
    }
}

function createFile(filePath, content, description) {
    try {
        fs.writeFileSync(filePath, content);
        console.log(`✅ CREATED: ${description}`);
        fixes.push(`Created: ${description}`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED TO CREATE: ${description} - ${error.message}`);
        return false;
    }
}

function createDirectory(dirPath, description) {
    try {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ CREATED: ${description}`);
        fixes.push(`Created directory: ${description}`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED TO CREATE: ${description} - ${error.message}`);
        return false;
    }
}

// Check 1: Core files
console.log('\n📁 Checking core files...');
checkFile('package.json', 'Frontend package.json');
checkFile('next.config.ts', 'Next.js configuration');
checkFile('tsconfig.json', 'TypeScript configuration');
checkFile('tailwind.config.ts', 'Tailwind configuration');
checkFile('api/package.json', 'API package.json');
checkFile('api/index.js', 'API entry point');

// Check 2: Environment files
console.log('\n🔧 Checking environment files...');
if (!checkFile('.env.local', 'Frontend environment')) {
    const envContent = `# Development Environment
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:9002
NEXT_PUBLIC_DB_HOST=localhost
NEXT_PUBLIC_DB_USER=root
NEXT_PUBLIC_DB_PASSWORD=
NEXT_PUBLIC_DB_DATABASE=hostvoucher_db
`;
    createFile('.env.local', envContent, 'Frontend .env.local');
}

if (!checkFile('api/.env', 'API environment')) {
    const apiEnvContent = `# API Environment
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=hostvoucher_db
DB_PORT=3306
PORT=5000
NODE_ENV=development
`;
    createFile('api/.env', apiEnvContent, 'API .env');
}

// Check 3: Required directories
console.log('\n📂 Checking required directories...');
const requiredDirs = [
    ['src/app', 'App directory'],
    ['src/components', 'Components directory'],
    ['src/lib', 'Library directory'],
    ['api/routes', 'API routes directory'],
    ['api/utils', 'API utils directory'],
    ['api/uploads', 'API uploads directory'],
    ['public/uploads', 'Public uploads directory'],
    ['src/components/animations', 'Animations components'],
    ['src/components/charity', 'Charity components'],
    ['src/components/chatbot', 'Chatbot components'],
    ['src/components/website-builder', 'Website builder components']
];

requiredDirs.forEach(([dir, desc]) => {
    if (!checkDirectory(dir, desc)) {
        createDirectory(dir, desc);
    }
});

// Check 4: Key component files
console.log('\n🧩 Checking key component files...');
const keyFiles = [
    ['src/app/page.tsx', 'Home page'],
    ['src/app/layout.tsx', 'Root layout'],
    ['src/app/admin/settings/page.tsx', 'Admin settings page'],
    ['src/components/hostvoucher/LayoutComponents.tsx', 'Layout components'],
    ['src/components/hostvoucher/UIComponents.tsx', 'UI components'],
    ['src/lib/hostvoucher-data.ts', 'Data library'],
    ['api/utils/db.js', 'Database utility'],
    ['api/routes/products.js', 'Products API'],
    ['api/routes/settings.js', 'Settings API']
];

keyFiles.forEach(([file, desc]) => {
    checkFile(file, desc);
});

// Check 5: Database file
console.log('\n🗄️ Checking database files...');
if (!checkFile('database.sql', 'Database schema')) {
    const dbSchema = `-- HOSTVOUCHER DATABASE SCHEMA
CREATE DATABASE IF NOT EXISTS hostvoucher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hostvoucher_db;

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(50) PRIMARY KEY,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(100),
    provider VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45),
    user_agent TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    page_visited VARCHAR(255),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT IGNORE INTO settings (id, data) VALUES 
('main_settings', '{"site_name": "HostVoucher", "site_description": "Your #1 source for exclusive tech & digital service deals!"}');
`;
    createFile('database.sql', dbSchema, 'Database schema');
}

// Check 6: Startup scripts
console.log('\n🚀 Checking startup scripts...');
if (!checkFile('start.sh', 'Linux startup script')) {
    const startScript = `#!/bin/bash
echo "🚀 Starting HostVoucher..."

# Start API
cd api && npm start &
sleep 3

# Start frontend
cd .. && npm run dev
`;
    createFile('start.sh', startScript, 'Linux startup script');
}

if (!checkFile('start.bat', 'Windows startup script')) {
    const startBat = `@echo off
echo 🚀 Starting HostVoucher...

start "API" cmd /k "cd api && npm start"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "npm run dev"

echo ✅ HostVoucher started!
echo Frontend: http://localhost:9002
echo API: http://localhost:5000
pause
`;
    createFile('start.bat', startBat, 'Windows startup script');
}

// Check 7: Package.json scripts
console.log('\n📦 Checking package.json scripts...');
try {
    if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredScripts = {
            "dev": "next dev --turbopack -p 9002",
            "build": "next build",
            "start": "next start -p 9002",
            "lint": "next lint"
        };
        
        let needsUpdate = false;
        Object.entries(requiredScripts).forEach(([script, command]) => {
            if (!packageJson.scripts[script] || packageJson.scripts[script] !== command) {
                packageJson.scripts[script] = command;
                needsUpdate = true;
            }
        });
        
        if (needsUpdate) {
            fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
            console.log('✅ Updated package.json scripts');
            fixes.push('Updated package.json scripts');
        } else {
            console.log('✅ Package.json scripts are correct');
        }
    }
} catch (error) {
    console.log(`❌ Error checking package.json: ${error.message}`);
}

// Check 8: API package.json
console.log('\n📦 Checking API package.json...');
try {
    if (fs.existsSync('api/package.json')) {
        const apiPackageJson = JSON.parse(fs.readFileSync('api/package.json', 'utf8'));
        
        let needsUpdate = false;
        if (apiPackageJson.type !== 'module') {
            apiPackageJson.type = 'module';
            needsUpdate = true;
        }
        
        const requiredScripts = {
            "start": "node index.js",
            "dev": "nodemon index.js"
        };
        
        Object.entries(requiredScripts).forEach(([script, command]) => {
            if (!apiPackageJson.scripts[script]) {
                apiPackageJson.scripts[script] = command;
                needsUpdate = true;
            }
        });
        
        if (needsUpdate) {
            fs.writeFileSync('api/package.json', JSON.stringify(apiPackageJson, null, 2));
            console.log('✅ Updated API package.json');
            fixes.push('Updated API package.json');
        } else {
            console.log('✅ API package.json is correct');
        }
    }
} catch (error) {
    console.log(`❌ Error checking API package.json: ${error.message}`);
}

// Check 9: Placeholder files
console.log('\n🖼️ Checking placeholder files...');
if (!checkFile('public/placeholder-image.png', 'Placeholder image')) {
    // Create a simple text file as placeholder
    const placeholderText = 'Placeholder image - replace with actual image';
    createFile('public/placeholder.txt', placeholderText, 'Placeholder file');
}

// Summary
console.log('\n📊 SUMMARY');
console.log('==========================================');
console.log(`Issues found: ${issues.length}`);
console.log(`Fixes applied: ${fixes.length}`);

if (issues.length > 0) {
    console.log('\n❌ REMAINING ISSUES:');
    issues.forEach(issue => console.log(`   - ${issue}`));
}

if (fixes.length > 0) {
    console.log('\n✅ FIXES APPLIED:');
    fixes.forEach(fix => console.log(`   - ${fix}`));
}

console.log('\n🚀 NEXT STEPS:');
console.log('1. Install dependencies: npm install && cd api && npm install');
console.log('2. Setup database: Import database.sql to MySQL');
console.log('3. Configure environment files with your actual values');
console.log('4. Start development: npm run dev (frontend) + cd api && npm start (backend)');
console.log('5. Access: http://localhost:9002 (frontend) + http://localhost:5000 (API)');

console.log('\n✅ Check completed!');
