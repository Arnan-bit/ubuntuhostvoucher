#!/usr/bin/env node

// Script to add more dummy products for testing pagination
const API_BASE = 'http://localhost:9002';

const additionalProducts = [
    // More Web Hosting
    { name: 'HostGator Baby Plan', provider: 'HostGator', type: 'Web Hosting', tier: 'Starter Plans', price: 3.95, originalPrice: 12.95, discount: '69%', features: ['Unlimited Websites', 'Unlimited Storage', 'Free SSL', 'Free Domain'], rating: 4.2, numReviews: 8500 },
    { name: 'DreamHost Shared Starter', provider: 'DreamHost', type: 'Web Hosting', tier: 'Starter Plans', price: 2.59, originalPrice: 7.99, discount: '68%', features: ['1 Website', 'Fast SSD Storage', 'Free Domain', '24/7 Support'], rating: 4.4, numReviews: 6200 },
    { name: 'InMotion Hosting Launch', provider: 'InMotion', type: 'Web Hosting', tier: 'Business & Pro Plans', price: 6.99, originalPrice: 15.99, discount: '56%', features: ['2 Websites', '100 GB SSD', 'Free SSL', 'Website Builder'], rating: 4.6, numReviews: 4800 },
    
    // More WordPress Hosting
    { name: 'WP Engine Startup', provider: 'WP Engine', type: 'WordPress Hosting', tier: 'Managed WordPress', price: 20.00, originalPrice: 30.00, discount: '33%', features: ['1 Site', '10 GB Storage', 'CDN Included', 'Daily Backups'], rating: 4.7, numReviews: 3200 },
    { name: 'Kinsta Starter', provider: 'Kinsta', type: 'WordPress Hosting', tier: 'Managed WordPress', price: 30.00, features: ['1 WordPress Site', '10 GB SSD', 'Google Cloud Platform', 'Free CDN'], rating: 4.8, numReviews: 2100 },
    { name: 'Flywheel Tiny', provider: 'Flywheel', type: 'WordPress Hosting', tier: 'Managed WordPress', price: 13.00, features: ['1 Site', '5 GB Disk Space', 'Free SSL', 'Staging Sites'], rating: 4.5, numReviews: 1800 },
    
    // More Cloud Hosting
    { name: 'DigitalOcean Droplet', provider: 'DigitalOcean', type: 'Cloud Hosting', tier: 'Performance Cloud', price: 5.00, features: ['1 vCPU', '1 GB RAM', '25 GB SSD', '1 TB Transfer'], rating: 4.6, numReviews: 15000 },
    { name: 'Linode Nanode', provider: 'Linode', type: 'Cloud Hosting', tier: 'Performance Cloud', price: 5.00, features: ['1 vCPU', '1 GB RAM', '25 GB SSD', '1 TB Transfer'], rating: 4.5, numReviews: 12000 },
    { name: 'Vultr Regular Performance', provider: 'Vultr', type: 'Cloud Hosting', tier: 'Performance Cloud', price: 6.00, features: ['1 vCPU', '1 GB RAM', '25 GB SSD', '1 TB Bandwidth'], rating: 4.4, numReviews: 9500 },
    
    // More VPS
    { name: 'Contabo VPS S', provider: 'Contabo', type: 'VPS', tier: 'Budget VPS', price: 3.99, features: ['4 vCPU Cores', '8 GB RAM', '200 GB SSD', 'Unlimited Traffic'], rating: 4.3, numReviews: 7200 },
    { name: 'OVH VPS Starter', provider: 'OVH', type: 'VPS', tier: 'Budget VPS', price: 3.50, features: ['1 vCore', '2 GB RAM', '20 GB SSD', 'Unlimited Bandwidth'], rating: 4.1, numReviews: 5400 },
    { name: 'Hetzner CX11', provider: 'Hetzner', type: 'VPS', tier: 'Budget VPS', price: 2.96, features: ['1 vCPU', '4 GB RAM', '20 GB SSD', '20 TB Traffic'], rating: 4.7, numReviews: 8900 },
    
    // More Digital Products
    { name: 'Logo Design Package', provider: 'HostVoucher', type: 'Digital Product', tier: 'Design Services', price: 75.00, features: ['3 Logo Concepts', 'Unlimited Revisions', 'Vector Files', 'Brand Guidelines'], rating: 4.9, numReviews: 450 },
    { name: 'SEO Audit Report', provider: 'HostVoucher', type: 'Digital Product', tier: 'Marketing Services', price: 49.99, features: ['Complete Site Analysis', 'Keyword Research', 'Competitor Analysis', 'Action Plan'], rating: 4.8, numReviews: 320 },
    { name: 'Social Media Templates', provider: 'HostVoucher', type: 'Digital Product', tier: 'Design Resources', price: 29.99, features: ['50+ Templates', 'Instagram & Facebook', 'Editable PSD Files', 'Commercial License'], rating: 4.6, numReviews: 680 },
    
    // More Domains
    { name: '.net Domain', provider: 'Hostinger', type: 'Domain', tier: 'Popular Domains (.com, .net)', price: 5.99, originalPrice: 12.99, discount: '54%', features: ['Free WHOIS Protection', 'DNS Management'], rating: 4.7, numReviews: 19543 },
    { name: '.org Domain', provider: 'Namecheap', type: 'Domain', tier: 'Popular Domains (.com, .net)', price: 8.88, features: ['Free WHOIS Protection', 'Email Forwarding'], rating: 4.6, numReviews: 2000000 },
    { name: '.io Domain', provider: 'SiteGround', type: 'Domain', tier: 'Premium Domains', price: 39.99, features: ['Tech-Focused TLD', 'Premium DNS'], rating: 4.5, numReviews: 12155 },
    
    // More Coupons
    { name: 'SAVE50HOST', description: 'Save 50% on all hosting plans this month!', provider: 'HostGator', type: 'Coupon', tier: 'Web Hosting' },
    { name: 'WPSPECIAL', description: 'Special WordPress hosting discount - 40% off!', provider: 'DreamHost', type: 'Coupon', tier: 'WordPress Hosting' },
    { name: 'CLOUDBOOST', description: 'Get 30% off cloud hosting for new customers.', provider: 'DigitalOcean', type: 'Coupon', tier: 'Cloud Hosting' },
    { name: 'VPSPOWER', description: 'Power up with 25% off VPS hosting plans.', provider: 'Linode', type: 'Coupon', tier: 'VPS' },
    { name: 'DOMAINPRO', description: 'Professional domains at discounted rates.', provider: 'Namecheap', type: 'Coupon', tier: 'Domain' }
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

function convertToDbFormat(product) {
    const isCodeProduct = product.name && product.name.includes('SAVE') || product.name && product.name.includes('SPECIAL');
    
    return {
        name: product.name,
        title: product.name,
        provider: product.provider || 'HostVoucher',
        type: product.type,
        tier: product.tier || 'Standard',
        price: product.price || 0,
        original_price: product.originalPrice || null,
        discount: product.discount || null,
        features: Array.isArray(product.features) ? product.features : (product.features ? [product.features] : []),
        link: product.link || '#',
        target_url: product.link || '#',
        image: null,
        provider_logo: null,
        rating: product.rating || null,
        num_reviews: product.numReviews || 0,
        clicks: 0,
        code: isCodeProduct ? product.name : null,
        short_link: null,
        seo_title: product.name,
        seo_description: product.description || product.name,
        color: null,
        button_color: null,
        is_featured: false,
        show_on_landing: true,
        display_style: null,
        catalog_image: null,
        brand_logo: null,
        brand_logo_text: null
    };
}

async function main() {
    console.log('🚀 Adding more products for pagination testing...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of additionalProducts) {
        const dbProduct = convertToDbFormat(product);
        console.log(`📦 Adding: ${dbProduct.name} (${dbProduct.provider})`);
        
        const result = await saveProduct(dbProduct);
        if (result) {
            successCount++;
            console.log(`  ✅ Success`);
        } else {
            errorCount++;
            console.log(`  ❌ Failed`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📈 Total: ${additionalProducts.length}`);
    console.log(`\n🎉 Now you should have enough products to test pagination!`);
    console.log(`💡 Visit http://localhost:9002/catalog to see the paginated catalog.`);
}

main();
