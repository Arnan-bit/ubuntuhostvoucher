#!/usr/bin/env node

/**
 * 🚀 HOSTVOUCHER DEPLOYMENT SCRIPT
 * Automated deployment script for HostVoucher website
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 HostVoucher Deployment Script');
console.log('================================');

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
    console.error('❌ .env.local file not found!');
    console.log('📝 Please create .env.local with your production environment variables');
    console.log('📖 See HOSTING_SETUP.md for details');
    process.exit(1);
}

// Check Node.js version
const nodeVersion = process.version;
console.log(`📦 Node.js version: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < 18) {
    console.error('❌ Node.js 18+ required');
    process.exit(1);
}

try {
    console.log('\n🔧 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('\n🏗️  Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('\n✅ Build completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Upload .next folder to your hosting provider');
    console.log('2. Set up your production database');
    console.log('3. Configure environment variables');
    console.log('4. Start the application with: npm start');
    
    console.log('\n🌐 Recommended hosting providers:');
    console.log('• Vercel (easiest): https://vercel.com');
    console.log('• Netlify: https://netlify.com');
    console.log('• DigitalOcean: https://digitalocean.com');

} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
}
