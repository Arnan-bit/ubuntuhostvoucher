#!/usr/bin/env node

// Test single product with shake animation
const API_BASE = 'http://localhost:9002';

const testProduct = {
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
    show_on_landing: true,
    link: '#',
    target_url: '#',
    seo_title: 'Premium Hosting Special Deal',
    seo_description: 'Get premium hosting at 90% off - limited time offer!',
    color: 'red',
    button_color: 'red',
    image: null,
    provider_logo: null,
    clicks: 0,
    code: null,
    short_link: null,
    catalog_image: null,
    brand_logo: null,
    brand_logo_text: null,
    display_style: 'vertical'
};

async function testSave() {
    try {
        console.log('🧪 Testing shake animation product save...');
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
        console.log('🎯 Now check http://localhost:9002/catalog to see the shake animation!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSave();
