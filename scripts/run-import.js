#!/usr/bin/env node

// Import script to add all catalog data to the database
// Run this with: node scripts/run-import.js

const { catalogData, convertToDbFormat } = require('./import-catalog-data.js');

const API_BASE = 'http://localhost:9002'; // Change this to your actual API URL

async function saveProduct(productData) {
    try {
        const response = await fetch(`${API_BASE}/api/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'saveProduct',
                payload: productData
            })
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to save product');
        }
        
        return result.data;
    } catch (error) {
        console.error(`Error saving product ${productData.name}:`, error.message);
        return null;
    }
}

async function importCategory(categoryName, products) {
    console.log(`\n🚀 Importing ${categoryName}...`);
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
        const dbProduct = convertToDbFormat(product, categoryName);
        
        console.log(`  📦 Adding: ${dbProduct.name} (${dbProduct.provider || 'N/A'})`);
        
        const result = await saveProduct(dbProduct);
        
        if (result) {
            successCount++;
            console.log(`    ✅ Success`);
        } else {
            errorCount++;
            console.log(`    ❌ Failed`);
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 ${categoryName} Summary:`);
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📈 Total: ${products.length}`);
}

async function main() {
    console.log('🎯 Starting catalog import...\n');
    
    try {
        // Import all categories
        await importCategory('Digital Product', catalogData.digitalProducts);
        await importCategory('Web Hosting', catalogData.hosting.filter(h => h.type === 'Web Hosting'));
        await importCategory('WordPress Hosting', catalogData.hosting.filter(h => h.type === 'WordPress Hosting'));
        await importCategory('Cloud Hosting', catalogData.hosting.filter(h => h.type === 'Cloud Hosting'));
        await importCategory('VPS', catalogData.vps);
        await importCategory('Domain', catalogData.domain);
        await importCategory('Coupon', catalogData.coupons);
        await importCategory('Featured', catalogData.homeScrollerCatalog);
        
        console.log('\n🎉 Import completed!');
        console.log('\n💡 Next steps:');
        console.log('  1. Check the admin panel at /admin');
        console.log('  2. Review and edit products as needed');
        console.log('  3. Set featured products and display orders');
        
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

// Check if we have fetch available (Node 18+)
if (typeof fetch === 'undefined') {
    console.error('❌ This script requires Node.js 18+ with built-in fetch support');
    console.log('💡 Alternative: Install node-fetch with: npm install node-fetch');
    process.exit(1);
}

main();
