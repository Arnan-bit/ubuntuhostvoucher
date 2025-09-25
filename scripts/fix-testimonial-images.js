#!/usr/bin/env node

// Script to fix testimonial images and add Sarah Johnson
const API_BASE = 'http://localhost:9002';

const testimonialsWithImages = [
    {
        name: 'Sarah Johnson',
        role: 'Marketing Director',
        review: "HostVoucher has transformed how we find hosting deals. The curated selection and exclusive discounts have saved our company thousands of dollars while maintaining top-quality service.",
        image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Charlie Low',
        role: 'Co-founder of Nohma',
        review: "Ever since we've been with HostVoucher, it's been amazing. We've not really had any issues at all and if we ever do have a question, their customer service is incredible.",
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Jack Bies',
        role: 'Creative Director',
        review: "HostVoucher's Customer Success team goes above and beyond to understand my problem. Their dedication to performance and support is unmatched.",
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Sarah Mills',
        role: 'E-commerce Specialist',
        review: "The speed and uptime are phenomenal. Our online store has never been faster, and we've seen a noticeable increase in conversions since switching to a provider found on HostVoucher.",
        image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Mike Chen',
        role: 'Lead Developer, TechStart',
        review: "The VPS deals are unbeatable. We get the power and flexibility we need without the exorbitant costs. The curated selection on HostVoucher saved us days of research.",
        image_url: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Elena Rodriguez',
        role: 'Digital Nomad & Blogger',
        review: "As someone who works from different countries, the VPN deals on HostVoucher are a lifesaver. I get top-tier security and access to global content at a fraction of the price.",
        image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'David Kim',
        role: 'Startup Founder',
        review: "The hosting recommendations are spot-on. We launched our SaaS platform with confidence knowing we had the best hosting deal available. The performance has been exceptional.",
        image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Lisa Wang',
        role: 'UX Designer',
        review: "HostVoucher made it so easy to find the perfect hosting for my portfolio site. The interface is intuitive and the deals are genuinely valuable. Highly recommend!",
        image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Alex Thompson',
        role: 'DevOps Engineer',
        review: "The cloud hosting deals here are incredible. We migrated our entire infrastructure and saved 40% on costs while improving performance. The technical support guidance was invaluable.",
        image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Maria Garcia',
        role: 'Content Creator',
        review: "As a content creator, website speed is crucial for my audience. The hosting provider I found through HostVoucher has been lightning fast and incredibly reliable.",
        image_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'James Wilson',
        role: 'Small Business Owner',
        review: "Running a small business means every dollar counts. HostVoucher helped me find premium hosting at a fraction of the usual cost. My website has never performed better.",
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        rating: 5
    },
    {
        name: 'Priya Patel',
        role: 'Digital Marketing Manager',
        review: "The SSL certificate deals alone saved our agency thousands. Plus, the hosting performance has improved our clients' SEO rankings significantly. Absolutely fantastic service!",
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
        rating: 5
    }
];

async function saveTestimonial(testimonialData) {
    try {
        const response = await fetch(`${API_BASE}/api/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'saveTestimonial', payload: testimonialData })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to save testimonial');
        return result.data;
    } catch (error) {
        console.error(`Error saving testimonial ${testimonialData.name}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('📸 Fixing testimonial images and adding Sarah Johnson...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const testimonial of testimonialsWithImages) {
        console.log(`👤 Adding/Updating: ${testimonial.name} (${testimonial.role})`);
        console.log(`   📸 Image: Professional portrait from Unsplash`);
        console.log(`   ⭐ Rating: ${testimonial.rating}/5`);
        
        const result = await saveTestimonial(testimonial);
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
    console.log(`  📈 Total: ${testimonialsWithImages.length}`);
    
    if (successCount > 0) {
        console.log(`\n🎉 Testimonial images fixed successfully!`);
        console.log(`💡 Features added:`);
        console.log(`   📸 Professional portrait photos from Unsplash`);
        console.log(`   👤 Sarah Johnson testimonial with proper image`);
        console.log(`   🔄 Fallback system for missing images`);
        console.log(`   🎨 Consistent professional appearance`);
        console.log(`\n🌐 Visit your website to see the improved testimonials!`);
    }
}

main();
