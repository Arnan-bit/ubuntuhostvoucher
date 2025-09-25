#!/usr/bin/env node

// Test single digital product
const API_BASE = 'http://localhost:9002';

const testProduct = {
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
};

async function testSave() {
    try {
        console.log('🧪 Testing digital product save...');
        console.log('Product data:', JSON.stringify(testProduct, null, 2));
        
        const response = await fetch(`${API_BASE}/api/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'saveProduct', payload: testProduct })
        });

        console.log('Response status:', response.status);
        
        const result = await response.text();
        console.log('Response body:', result);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${result}`);
        }
        
        const jsonResult = JSON.parse(result);
        console.log('✅ Success! Product saved with ID:', jsonResult.data?.id);
        console.log('🎯 Now check http://localhost:9002 to see the digital product!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSave();
