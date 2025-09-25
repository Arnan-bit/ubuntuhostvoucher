#!/usr/bin/env node

// Script to fix Sarah Johnson testimonial image specifically
const API_BASE = 'http://localhost:9002';

async function updateSarahJohnsonImage() {
    try {
        console.log('🔍 Searching for Sarah Johnson testimonial...');
        
        // First, get all testimonials to find Sarah Johnson
        const response = await fetch(`${API_BASE}/api/data?type=testimonials`);
        const result = await response.json();
        const testimonials = Array.isArray(result) ? result : (result.data || []);
        
        console.log(`📋 Found ${testimonials.length} testimonials`);
        
        // Find Sarah Johnson
        const sarahTestimonial = testimonials.find(t => 
            t.name && t.name.toLowerCase().includes('sarah johnson')
        );
        
        if (!sarahTestimonial) {
            console.log('❌ Sarah Johnson testimonial not found. Creating new one...');
            
            // Create new Sarah Johnson testimonial
            const newTestimonial = {
                name: 'Sarah Johnson',
                role: 'Marketing Director',
                review: "HostVoucher has transformed how we find hosting deals. The curated selection and exclusive discounts have saved our company thousands of dollars while maintaining top-quality service.",
                image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
                rating: 5
            };
            
            const saveResponse = await fetch(`${API_BASE}/api/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'saveTestimonial', payload: newTestimonial })
            });
            
            if (saveResponse.ok) {
                console.log('✅ Created new Sarah Johnson testimonial with professional image');
            } else {
                console.log('❌ Failed to create Sarah Johnson testimonial');
            }
        } else {
            console.log(`✅ Found Sarah Johnson testimonial: ${sarahTestimonial.name} (${sarahTestimonial.role})`);
            console.log(`📸 Current image: ${sarahTestimonial.image_url || 'No image'}`);
            
            // Update with professional image
            const updatedTestimonial = {
                ...sarahTestimonial,
                image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
            };
            
            const updateResponse = await fetch(`${API_BASE}/api/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'saveTestimonial', payload: updatedTestimonial })
            });
            
            if (updateResponse.ok) {
                console.log('✅ Updated Sarah Johnson testimonial with professional image');
                console.log('📸 New image: Professional portrait from Unsplash');
            } else {
                console.log('❌ Failed to update Sarah Johnson testimonial');
            }
        }
        
        console.log('\n🎉 Sarah Johnson testimonial image fix completed!');
        console.log('💡 Features:');
        console.log('   📸 High-quality professional portrait');
        console.log('   🎨 Consistent with other testimonials');
        console.log('   📱 Optimized for all devices');
        console.log('   ⚡ Fast loading with Unsplash CDN');
        
        console.log('\n🌐 Visit your website to see the updated testimonial!');
        
    } catch (error) {
        console.error('❌ Error fixing Sarah Johnson image:', error.message);
    }
}

updateSarahJohnsonImage();
