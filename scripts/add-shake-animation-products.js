#!/usr/bin/env node

// Script to add products with shake animation and ratings for testing
const API_BASE = 'http://localhost:9002';

const testProducts = [
    {
        name: 'LIMITED TIME: Premium Hosting 90% OFF!',
        title: 'Premium Hosting Special Deal',
        provider: 'SuperHost',
        type: 'Web Hosting',
        tier: 'Premium Plans',
        price: 2.99,
        original_price: 29.99,
        discount: '90%',
        features: ['Unlimited Bandwidth', 'Free SSL', '24/7 Support', 'Free Domain'],
        rating: 4.9,
        num_reviews: 1250,
        shake_animation: true,
        shake_intensity: 'intense',
        is_featured: true,
        show_on_landing: true
    },
    {
        name: 'Flash Sale: VPS Hosting',
        title: 'High Performance VPS',
        provider: 'CloudMax',
        type: 'VPS',
        tier: 'Performance VPS',
        price: 9.99,
        original_price: 39.99,
        discount: '75%',
        features: ['8GB RAM', '4 CPU Cores', '200GB SSD', 'Full Root Access'],
        rating: 4.7,
        num_reviews: 890,
        shake_animation: true,
        shake_intensity: 'normal',
        is_featured: true,
        show_on_landing: true
    },
    {
        name: 'WordPress Hosting Pro',
        title: 'Managed WordPress Hosting',
        provider: 'WPExpert',
        type: 'WordPress Hosting',
        tier: 'Managed WordPress',
        price: 12.99,
        original_price: 24.99,
        discount: '48%',
        features: ['Auto Updates', 'Daily Backups', 'CDN Included', 'Staging Sites'],
        rating: 4.8,
        num_reviews: 2100,
        shake_animation: false,
        is_featured: false,
        show_on_landing: true
    },
    {
        name: 'URGENT: Domain Sale Ends Today!',
        title: '.com Domain Registration',
        provider: 'DomainKing',
        type: 'Domain',
        tier: 'Popular Domains (.com, .net)',
        price: 0.99,
        original_price: 14.99,
        discount: '93%',
        features: ['Free WHOIS Protection', 'DNS Management', 'Email Forwarding'],
        rating: 4.6,
        num_reviews: 5600,
        shake_animation: true,
        shake_intensity: 'intense',
        is_featured: true,
        show_on_landing: true
    }
];

async function saveProduct(productData) {
    try {
        const response = await fetch(`${API_BASE}/api/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'saveProduct', payload: productData })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to save product');
        return result.data;
    } catch (error) {
        console.error(`Error saving product ${productData.name}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🎯 Adding products with shake animation and ratings...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of testProducts) {
        console.log(`📦 Adding: ${product.name}`);
        console.log(`   ⭐ Rating: ${product.rating}/5 (${product.num_reviews} reviews)`);
        console.log(`   ${product.shake_animation ? '🔥 SHAKE: ' + product.shake_intensity : '📍 No animation'}`);
        
        const result = await saveProduct(product);
        if (result) {
            successCount++;
            console.log(`  ✅ Success\n`);
        } else {
            errorCount++;
            console.log(`  ❌ Failed\n`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`📊 Summary:`);
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📈 Total: ${testProducts.length}`);
    
    if (successCount > 0) {
        console.log(`\n🎉 Test products added successfully!`);
        console.log(`💡 Visit http://localhost:9002/catalog to see:`);
        console.log(`   ⭐ Star ratings and review counts`);
        console.log(`   🔥 Shake animations on special deals`);
        console.log(`   📱 Mobile-responsive catalog cards`);
        console.log(`\n🎮 Admin Panel: http://localhost:9002/admin`);
        console.log(`   - Edit shake animation settings`);
        console.log(`   - Configure banner rotation intervals`);
        console.log(`   - Manage product ratings`);
    }
}

main();
