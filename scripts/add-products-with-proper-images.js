#!/usr/bin/env node

// Script to add products with proper provider images
const API_BASE = 'http://localhost:9002';

const productsWithImages = [
    {
        name: 'Hostinger Premium Hosting',
        title: 'Premium Web Hosting Plan',
        provider: 'Hostinger',
        type: 'Web Hosting',
        tier: 'Premium Plans',
        price: 2.99,
        original_price: 11.99,
        discount: '75%',
        features: ['100 Websites', 'Unlimited Bandwidth', 'Free SSL', 'Free Domain'],
        rating: 4.8,
        num_reviews: 15420,
        image: 'https://logo.clearbit.com/hostinger.com',
        provider_logo: 'https://logo.clearbit.com/hostinger.com',
        link: 'https://hostinger.com',
        target_url: 'https://hostinger.com',
        seo_title: 'Hostinger Premium Hosting - 75% Off',
        seo_description: 'Get premium web hosting from Hostinger at 75% discount',
        color: 'purple',
        button_color: 'purple',
        is_featured: true,
        show_on_landing: true,
        display_style: 'vertical',
        shake_animation: false,
        shake_intensity: 'normal',
        clicks: 0,
        code: null,
        short_link: null,
        catalog_image: null,
        brand_logo: null,
        brand_logo_text: null
    },
    {
        name: 'Bluehost Choice Plus',
        title: 'Choice Plus Hosting Plan',
        provider: 'Bluehost',
        type: 'Web Hosting',
        tier: 'Business & Pro Plans',
        price: 5.45,
        original_price: 13.95,
        discount: '61%',
        features: ['Unlimited Websites', 'Unmetered Bandwidth', 'Free SSL', 'Domain Privacy'],
        rating: 4.6,
        num_reviews: 8900,
        image: 'https://logo.clearbit.com/bluehost.com',
        provider_logo: 'https://logo.clearbit.com/bluehost.com',
        link: 'https://bluehost.com',
        target_url: 'https://bluehost.com',
        seo_title: 'Bluehost Choice Plus - 61% Off',
        seo_description: 'Professional hosting from Bluehost with 61% discount',
        color: 'blue',
        button_color: 'blue',
        is_featured: false,
        show_on_landing: true,
        display_style: 'vertical',
        shake_animation: false,
        shake_intensity: 'normal',
        clicks: 0,
        code: null,
        short_link: null,
        catalog_image: null,
        brand_logo: null,
        brand_logo_text: null
    },
    {
        name: 'SiteGround GrowBig',
        title: 'GrowBig Hosting Plan',
        provider: 'SiteGround',
        type: 'Web Hosting',
        tier: 'Business & Pro Plans',
        price: 6.99,
        original_price: 19.99,
        discount: '65%',
        features: ['Unlimited Websites', 'Premium Support', 'Free CDN', 'Daily Backups'],
        rating: 4.9,
        num_reviews: 12500,
        image: 'https://logo.clearbit.com/siteground.com',
        provider_logo: 'https://logo.clearbit.com/siteground.com',
        link: 'https://siteground.com',
        target_url: 'https://siteground.com',
        seo_title: 'SiteGround GrowBig - 65% Off',
        seo_description: 'Premium hosting from SiteGround with 65% discount',
        color: 'green',
        button_color: 'green',
        is_featured: true,
        show_on_landing: true,
        display_style: 'vertical',
        shake_animation: true,
        shake_intensity: 'normal',
        clicks: 0,
        code: null,
        short_link: null,
        catalog_image: null,
        brand_logo: null,
        brand_logo_text: null
    },
    {
        name: 'DigitalOcean Droplet',
        title: 'Basic Cloud Droplet',
        provider: 'DigitalOcean',
        type: 'Cloud Hosting',
        tier: 'Performance Cloud',
        price: 5.00,
        features: ['1 vCPU', '1 GB RAM', '25 GB SSD', '1 TB Transfer'],
        rating: 4.7,
        num_reviews: 18600,
        image: 'https://logo.clearbit.com/digitalocean.com',
        provider_logo: 'https://logo.clearbit.com/digitalocean.com',
        link: 'https://digitalocean.com',
        target_url: 'https://digitalocean.com',
        seo_title: 'DigitalOcean Cloud Hosting',
        seo_description: 'Reliable cloud hosting from DigitalOcean',
        color: 'blue',
        button_color: 'blue',
        is_featured: false,
        show_on_landing: true,
        display_style: 'vertical',
        shake_animation: false,
        shake_intensity: 'normal',
        clicks: 0,
        code: null,
        short_link: null,
        catalog_image: null,
        brand_logo: null,
        brand_logo_text: null,
        original_price: null,
        discount: null
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
    console.log('🖼️ Adding products with proper provider images...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of productsWithImages) {
        console.log(`📦 Adding: ${product.name} (${product.provider})`);
        console.log(`   🖼️ Image: ${product.provider} logo from Clearbit`);
        console.log(`   ⭐ Rating: ${product.rating}/5 (${product.num_reviews.toLocaleString()} reviews)`);
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
    console.log(`  📈 Total: ${productsWithImages.length}`);
    
    if (successCount > 0) {
        console.log(`\n🎉 Products with proper images added successfully!`);
        console.log(`💡 Features added:`);
        console.log(`   🖼️ Provider logos from Clearbit API`);
        console.log(`   📱 Professional catalog appearance`);
        console.log(`   🔄 Fallback system for missing images`);
        console.log(`   ⭐ Star ratings and review counts`);
        console.log(`   🔥 Shake animations for featured products`);
        console.log(`\n🌐 Visit http://localhost:9002/catalog to see the improved catalog!`);
    }
}

main();
