#!/usr/bin/env node

// Script to add digital products to catalog
const API_BASE = 'http://localhost:9002';

const digitalProducts = [
    {
        name: 'Learn Procreate: The Ultimate Guide',
        title: 'Learn Procreate: The Ultimate Guide',
        provider: 'Digital Learning',
        type: 'Digital Product',
        tier: 'Educational Ebooks',
        price: 15.00,
        original_price: 29.99,
        discount: '50%',
        features: ['Complete Procreate Tutorial', 'Step-by-step Guide', 'Professional Techniques', 'Bonus Resources'],
        rating: 4.9,
        num_reviews: 1245,
        link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.',
        target_url: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.',
        image: 'https://placehold.co/400x300/34D399/FFFFFF.png?text=Learn+Procreate+Guide',
        provider_logo: null,
        seo_title: 'Learn Procreate: The Ultimate Guide - Digital Art Mastery',
        seo_description: 'Master digital illustration with our comprehensive Procreate ebook guide',
        color: 'green',
        button_color: 'green',
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
        name: 'Custom Animated Wedding Invitation',
        title: 'Custom Animated Wedding Invitation',
        provider: 'Creative Services',
        type: 'Digital Product',
        tier: 'Custom Design Services',
        price: 50.00,
        original_price: 99.99,
        discount: '50%',
        features: ['Personalized Animation', 'HD Video Quality', 'Multiple Formats', 'Fast Delivery'],
        rating: 5.0,
        num_reviews: 832,
        link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Custom%20Animated%20Wedding%20Invitation%22.',
        target_url: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Custom%20Animated%20Wedding%20Invitation%22.',
        image: 'https://placehold.co/400x300/F472B6/FFFFFF.png?text=Wedding+Invitation',
        provider_logo: null,
        seo_title: 'Custom Animated Wedding Invitation - Beautiful Video Invites',
        seo_description: 'Create beautiful, unique video invitations for your special day',
        color: 'pink',
        button_color: 'pink',
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
        name: 'Ghibli Style Portrait',
        title: 'Ghibli Style Portrait',
        provider: 'Art Services',
        type: 'Digital Product',
        tier: 'Custom Art Services',
        price: 25.00,
        original_price: 49.99,
        discount: '50%',
        features: ['Studio Ghibli Style', 'High Resolution', 'Multiple Revisions', 'Digital Delivery'],
        rating: 4.8,
        num_reviews: 2109,
        link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Ghibli%20Style%20Portrait%22.',
        target_url: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Ghibli%20Style%20Portrait%22.',
        image: 'https://placehold.co/400x300/60A5FA/FFFFFF.png?text=Ghibli+Portrait',
        provider_logo: null,
        seo_title: 'Ghibli Style Portrait - Magical Anime Artwork',
        seo_description: 'Transform your photo into magical Ghibli-inspired artwork',
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
        name: 'Professional Object Removal',
        title: 'Professional Object Removal',
        provider: 'Photo Services',
        type: 'Digital Product',
        tier: 'Photo Editing Services',
        price: 9.99,
        original_price: 19.99,
        discount: '50%',
        features: ['Professional Editing', 'Natural Results', 'Fast Turnaround', 'Unlimited Revisions'],
        rating: 4.7,
        num_reviews: 543,
        link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Professional%20Object%20Removal%22.',
        target_url: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Professional%20Object%20Removal%22.',
        image: 'https://placehold.co/400x300/FBBF24/FFFFFF.png?text=Object+Removal',
        provider_logo: null,
        seo_title: 'Professional Object Removal - Clean Photo Editing',
        seo_description: 'Remove unwanted objects or people from your photos professionally',
        color: 'yellow',
        button_color: 'yellow',
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
        name: 'Personal Landing Page Website',
        title: 'Personal Landing Page Website',
        provider: 'Web Development',
        type: 'Digital Product',
        tier: 'Website Development',
        price: 199.00,
        original_price: 399.99,
        discount: '50%',
        features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile Friendly'],
        rating: 5.0,
        num_reviews: 150,
        link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personal%20Landing%20Page%20Website%22.',
        target_url: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personal%20Landing%20Page%20Website%22.',
        image: 'https://placehold.co/400x300/A78BFA/FFFFFF.png?text=Landing+Page',
        provider_logo: null,
        seo_title: 'Personal Landing Page Website - Professional Web Development',
        seo_description: 'Get a stunning, fast, one-page website for your brand',
        color: 'purple',
        button_color: 'purple',
        is_featured: true,
        show_on_landing: true,
        display_style: 'vertical',
        shake_animation: true,
        shake_intensity: 'intense',
        clicks: 0,
        code: null,
        short_link: null,
        catalog_image: null,
        brand_logo: null,
        brand_logo_text: null
    },
    {
        name: 'Personalized Birthday Video Greeting',
        title: 'Personalized Birthday Video Greeting',
        provider: 'Video Services',
        type: 'Digital Product',
        tier: 'Custom Video Services',
        price: 19.99,
        original_price: 39.99,
        discount: '50%',
        features: ['Custom Animation', 'Personal Message', 'HD Quality', 'Multiple Formats'],
        rating: 4.9,
        num_reviews: 971,
        link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personalized%20Birthday%20Video%20Greeting%22.',
        target_url: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personalized%20Birthday%20Video%20Greeting%22.',
        image: 'https://placehold.co/400x300/F472B6/FFFFFF.png?text=Birthday+Video',
        provider_logo: null,
        seo_title: 'Personalized Birthday Video Greeting - Custom Animated Messages',
        seo_description: 'Surprise loved ones with fun, animated birthday greetings',
        color: 'pink',
        button_color: 'pink',
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
    console.log('🎨 Adding digital products to catalog...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of digitalProducts) {
        console.log(`📦 Adding: ${product.name}`);
        console.log(`   💰 Price: $${product.price} (was $${product.original_price}) - ${product.discount} OFF`);
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
    console.log(`  📈 Total: ${digitalProducts.length}`);
    
    if (successCount > 0) {
        console.log(`\n🎉 Digital products added successfully!`);
        console.log(`💡 Features added:`);
        console.log(`   🎨 Professional digital product catalog`);
        console.log(`   💰 Original prices with discount percentages`);
        console.log(`   ⭐ Star ratings and review counts`);
        console.log(`   🔥 Shake animations for featured products`);
        console.log(`   📱 WhatsApp integration for orders`);
        console.log(`   🖼️ Professional placeholder images`);
        console.log(`\n🌐 Visit http://localhost:9002 to see the new digital products catalog!`);
    }
}

main();
