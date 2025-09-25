#!/usr/bin/env node

// Script to verify all 12 testimonials are properly saved
const API_BASE = 'http://localhost:9002';

async function getTestimonials() {
    try {
        const response = await fetch(`${API_BASE}/api/data?type=testimonials`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to get testimonials');
        return result;
    } catch (error) {
        console.error('Error getting testimonials:', error.message);
        return null;
    }
}

async function main() {
    console.log('🔍 Verifying testimonials...\n');

    const result = await getTestimonials();

    if (!result) {
        console.log('❌ Failed to retrieve testimonials');
        return;
    }

    const testimonials = Array.isArray(result) ? result : result.data || [];
    console.log(`📊 Total testimonials found: ${testimonials.length}\n`);
    
    const expectedNames = [
        'Sarah Johnson',
        'Charlie Low', 
        'Jack Bies',
        'Sarah Mills',
        'Mike Chen',
        'Elena Rodriguez',
        'David Kim',
        'Lisa Wang',
        'Alex Thompson',
        'Maria Garcia',
        'James Wilson',
        'Priya Patel'
    ];

    console.log('👥 Testimonials found:');
    testimonials.forEach((testimonial, index) => {
        const hasImage = testimonial.image_url ? '📸' : '❌';
        console.log(`${index + 1}. ${hasImage} ${testimonial.name} - ${testimonial.role}`);
        console.log(`   ⭐ Rating: ${testimonial.rating}/5`);
        console.log(`   💬 "${testimonial.review.substring(0, 80)}..."`);
        console.log('');
    });

    console.log('✅ Verification Summary:');
    console.log(`   📈 Total: ${testimonials.length}/12 expected`);
    console.log(`   📸 With images: ${testimonials.filter(t => t.image_url).length}`);
    console.log(`   ⭐ Average rating: ${(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}`);
    
    const missingNames = expectedNames.filter(name => 
        !testimonials.some(t => t.name === name)
    );
    
    if (missingNames.length > 0) {
        console.log(`   ❌ Missing: ${missingNames.join(', ')}`);
    } else {
        console.log('   ✅ All expected testimonials found!');
    }
    
    console.log('\n🌐 Visit http://localhost:9002 to see the testimonials in action!');
}

main();
