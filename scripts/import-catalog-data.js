// Script to import all catalog data from the provided dataset
// This will add all products to the database via API calls

const catalogData = {
    digitalProducts: [
        { id: 101, title: 'Learn Procreate: The Ultimate Guide', description: 'Master digital illustration with our comprehensive ebook.', price: 15.00, link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Learn%20Procreate%3A%20The%20Ultimate%20Guide%22.', image: 'https://placehold.co/100x100/34D399/FFFFFF?text=Ebook', rating: 4.9, numReviews: 1245, type: 'Digital Product', tier: 'Educational' },
        { id: 102, title: 'Custom Animated Wedding Invitation', description: 'A beautiful, unique video invitation for your special day.', price: 50.00, link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Custom%20Animated%20Wedding%20Invitation%22.', image: 'https://placehold.co/100x100/F472B6/FFFFFF?text=Wedding', rating: 5.0, numReviews: 832, type: 'Digital Product', tier: 'Custom Services' },
        { id: 103, title: 'Ghibli Style Portrait', description: 'Turn your photo into a magical Ghibli-inspired artwork.', price: 25.00, link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Ghibli%20Style%20Portrait%22.', image: 'https://placehold.co/100x100/60A5FA/FFFFFF?text=Ghibli', rating: 4.8, numReviews: 2109, type: 'Digital Product', tier: 'Art & Design' },
        { id: 104, title: 'Professional Object Removal', description: 'Remove any unwanted object or person from your photos.', price: 9.99, link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Professional%20Object%20Removal%22.', image: 'https://placehold.co/100x100/FBBF24/FFFFFF?text=Remove', rating: 4.7, numReviews: 543, type: 'Digital Product', tier: 'Photo Editing' },
        { id: 105, title: 'Personal Landing Page Website', description: 'Get a stunning, fast, one-page website for your brand.', price: 199.00, link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personal%20Landing%20Page%20Website%22.', image: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=WebDev', rating: 5.0, numReviews: 150, type: 'Digital Product', tier: 'Web Development' },
        { id: 106, title: 'Personalized Birthday Video Greeting', description: 'Surprise your loved ones with a fun, animated greeting.', price: 19.99, link: 'https://wa.me/628875023202?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20%22Personalized%20Birthday%20Video%20Greeting%22.', image: 'https://placehold.co/100x100/F472B6/FFFFFF?text=Birthday', rating: 4.9, numReviews: 971, type: 'Digital Product', tier: 'Custom Services' }
    ],
    
    hosting: [
        // Hostinger
        { id: 1, type: 'Web Hosting', provider: 'Hostinger', name: 'Premium Shared Hosting', price: 2.99, originalPrice: 11.99, discount: '75%', features: ['100 Websites', '100 GB NVMe Storage', 'Weekly Backups', 'Free SSL'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.7, numReviews: 19543, tier: 'Starter Plans', sales: 1200 },
        { id: 4, type: 'Web Hosting', provider: 'Hostinger', name: 'Business Hosting', price: 3.99, originalPrice: 13.99, discount: '71%', features: ['200 GB NVMe Storage', 'Daily Backups', 'Free CDN', 'Enhanced Security'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.8, numReviews: 19543, tier: 'Business & Pro Plans', sales: 1800 },
        { id: 47, type: 'WordPress Hosting', provider: 'Hostinger', name: 'Managed WordPress Starter', price: 1.99, originalPrice: 9.99, discount: '80%', features: ['100 Websites', '100 GB SSD Storage', 'Managed WordPress', 'WP-CLI & SSH'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.8, numReviews: 19543, tier: 'Managed WordPress', sales: 2200},
        { id: 54, type: 'Cloud Hosting', provider: 'Hostinger', name: 'Cloud Startup', price: 9.99, originalPrice: 29.99, discount: '67%', features: ['300 Websites', '200 GB NVMe Storage', 'Daily Backups', 'Dedicated IP Address'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.8, numReviews: 19543, tier: 'Business Cloud', sales: 900 },
        { id: 301, type: 'Cloud Hosting', provider: 'Hostinger', name: 'Cloud Professional', price: 14.99, originalPrice: 49.99, discount: '70%', features: ['300 Websites', '250 GB NVMe Storage', 'Daily Backups', 'Dedicated IP Address'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.9, numReviews: 19543, tier: 'High-Performance Cloud', sales: 1100 },
        
        // A2 Hosting
        { id: 500, type: 'Web Hosting', provider: 'A2 Hosting', name: 'Lite Shared Hosting', price: 2.99, originalPrice: 10.99, discount: '73%', features: ['1 Website', '100 GB SSD', 'Free SSL', 'Anytime Money Back Guarantee'], link: 'https://www.a2hosting.com/web-hosting', rating: 4.5, numReviews: 7458, tier: 'Starter Plans', sales: 750 },
        { id: 501, type: 'Web Hosting', provider: 'A2 Hosting', name: 'Turbo Boost Hosting', price: 6.99, originalPrice: 20.99, discount: '67%', features: ['Unlimited Websites', 'Unlimited SSD', 'Turbo (20X Faster)', 'Free Migrations'], link: 'https://www.a2hosting.com/web-hosting', rating: 4.7, numReviews: 7458, tier: 'Business & Pro Plans', sales: 1200 },
        { id: 502, type: 'WordPress Hosting', provider: 'A2 Hosting', name: 'Managed WordPress Lite', price: 7.99, originalPrice: 14.99, discount: '47%', features: ['1 Site', '50 GB NVMe SSD', 'Free Jetpack Personal', 'Managed Updates'], link: 'https://www.a2hosting.com/wordpress-hosting', rating: 4.6, numReviews: 7458, tier: 'Managed WordPress', sales: 900 },
        { id: 56, type: 'Cloud Hosting', provider: 'A2 Hosting', name: 'Supersonic Cloud', price: 12.99, originalPrice: 29.99, discount: '57%', features: ['Unlimited Websites', 'Turbo Servers (20X Faster)', 'Free Site Migration', '99.9% Uptime Commitment'], link: 'https://www.a2hosting.com/cloud-hosting', rating: 4.5, numReviews: 7458, tier: 'Performance Cloud' },

        // Bluehost
        { id: 2, type: 'Web Hosting', provider: 'Bluehost', name: 'Basic Plan', price: 2.95, originalPrice: 9.99, discount: '70%', features: ['1 Website', '10 GB SSD Storage', 'Free Domain for 1st Year', 'Free CDN'], link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', rating: 4.1, numReviews: 5321, tier: 'Starter Plans', sales: 850 },
        { id: 48, type: 'WordPress Hosting', provider: 'Bluehost', name: 'Choice Plus WP', price: 5.45, originalPrice: 16.99, discount: '67%', features: ['3 Websites', '40 GB SSD Storage', 'Free Domain Privacy', 'Daily Website Backup'], link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', rating: 4.3, numReviews: 5321, tier: 'Managed WordPress', sales: 1300},
        { id: 302, type: 'Web Hosting', provider: 'Bluehost', name: 'Choice Plus', price: 5.45, originalPrice: 14.99, discount: '63%', features: ['Unlimited Websites', '40 GB SSD', 'Free Domain & SSL', 'Free CDN'], link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', rating: 4.2, numReviews: 5321, tier: 'Business & Pro Plans', sales: 1000 },
        { id: 503, type: 'Cloud Hosting', provider: 'Bluehost', name: 'Cloud Hosting Basic', price: 19.95, features: ['Optimized Cloud Servers', 'High Performance', 'Scalable Resources', 'Free Domain & SSL'], link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', rating: 4.3, numReviews: 5321, tier: 'Business Cloud', sales: 700 },

        // Namecheap
        { id: 3, type: 'Web Hosting', provider: 'Namecheap', name: 'Stellar Plan', price: 1.98, originalPrice: 4.48, discount: '56%', features: ['3 Websites', '20 GB SSD', 'Free CDN', 'Domain Included'], link: 'https://www.namecheap.com/hosting/shared/', rating: 4.7, numReviews: 2000000, tier: 'Starter Plans', sales: 2500 },
        { id: 303, type: 'WordPress Hosting', provider: 'Namecheap', name: 'EasyWP Starter', price: 4.88, originalPrice: 9.88, discount: '50%', features: ['50 GB SSD Storage', '99.9% Uptime', 'Easy Backups', 'Free CDN & SSL'], link: 'https://www.namecheap.com/wordpress/', rating: 4.6, numReviews: 2000000, tier: 'Managed WordPress', sales: 1700 },
        { id: 504, type: 'Cloud Hosting', provider: 'Namecheap', name: 'Business Cloud', price: 8.88, features: ['2 Cores', '40 GB SSD', '2 GB RAM', 'Managed Cloud Environment'], link: 'https://www.namecheap.com/hosting/vps/', rating: 4.5, numReviews: 2000000, tier: 'Business Cloud', sales: 600 },

        // SiteGround
        { id: 5, type: 'Web Hosting', provider: 'SiteGround', name: 'GrowBig Plan', price: 4.99, originalPrice: 24.99, discount: '80%', features: ['Unlimited Websites', '20GB Web Space', 'On-demand Backups', 'Staging'], link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', rating: 4.9, numReviews: 12155, tier: 'Business & Pro Plans', sales: 1500 },
        { id: 49, type: 'WordPress Hosting', provider: 'SiteGround', name: 'StartUp WP', price: 2.99, originalPrice: 14.99, discount: '80%', features: ['1 Website', '10 GB Web Space', 'Free WP Installation', 'Managed WordPress'], link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', rating: 4.8, numReviews: 12155, tier: 'Managed WordPress', sales: 1600},
        { id: 55, type: 'Cloud Hosting', provider: 'SiteGround', name: 'Cloud Plan', price: 100.00, features: ['4 CPU Cores', '8 GB Memory', '40 GB SSD Space', '5 TB Data Transfer'], link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', rating: 4.9, numReviews: 12155, tier: 'High-Performance Cloud', sales: 150 }
    ],

    vps: [
        // Hostinger
        { id: 30, provider: 'Hostinger', name: 'KVM 2', price: 5.99, originalPrice: 21.99, discount: "72%", features: ['2 vCPU Cores', '8GB RAM', '100 GB NVMe SSD', '2TB Bandwidth'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.7, numReviews: 19543, tier: 'Medium VPS', sales: 1900, type: 'VPS' },
        { id: 308, provider: 'Hostinger', name: 'KVM 4', price: 10.99, originalPrice: 43.99, discount: "75%", features: ['4 vCPU Cores', '16GB RAM', '200 GB NVMe SSD', '4TB Bandwidth'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.8, numReviews: 19543, tier: 'High-Performance VPS', sales: 2500, type: 'VPS' },
        // Bluehost
        { id: 31, provider: 'Bluehost', name: 'Standard VPS', price: 31.99, features: ['2 Cores', '4GB RAM', '120GB SSD', '2TB Bandwidth'], link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', rating: 4.1, numReviews: 5321, tier: 'Medium VPS', type: 'VPS' }
    ],

    domain: [
        { id: 33, provider: 'Hostinger', name: '.com Domain', price: 4.99, originalPrice: 9.99, discount: '50%', features: ['Free with hosting plans'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.7, numReviews: 19543, tier: 'Popular Domains (.com, .net)', type: 'Domain' },
        { id: 34, provider: 'Bluehost', name: '.com Domain', price: 12.99, features: ['Free for 1st year with hosting'], link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', rating: 4.1, numReviews: 5321, tier: 'Popular Domains (.com, .net)', type: 'Domain' },
        { id: 35, provider: 'SiteGround', name: '.com Domain', price: 19.99, features: ['Private DNS management'], link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', rating: 4.8, numReviews: 12155, tier: 'Popular Domains (.com, .net)', type: 'Domain' },
        { id: 309, provider: 'Hostinger', name: '.com Domain', price: 4.99, originalPrice: 9.99, discount: '50%', features: ['Free WHOIS Protection'], link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.7, numReviews: 19543, tier: 'Popular Domains (.com, .net)', sales: 6000, type: 'Domain' }
    ],

    coupons: [
        { id: 22, code: 'SPECIAL15', description: '15% off Hostinger Business Hosting!', type: 'Coupon', provider: 'Hostinger', link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', tier: 'Web Hosting' },
        { id: 23, code: 'BLUEHOSTPRO', description: 'Up to 70% off Bluehost Choice Plus Plan!', type: 'Coupon', provider: 'Bluehost', link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', tier: 'Web Hosting' },
        { id: 320, code: 'HOSTCLOUD30', description: 'Save 30% on Hostinger Cloud Hosting plans!', type: 'Coupon', provider: 'Hostinger', link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', tier: 'Cloud Hosting' },
        { id: 321, code: 'WPDEAL25', description: '25% discount on annual WordPress Hosting plans.', type: 'Coupon', provider: 'Hostinger', link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', tier: 'WordPress Hosting' },
        { id: 322, code: 'SGWPRO', description: 'Special discount on all SiteGround WordPress plans.', type: 'Coupon', provider: 'SiteGround', link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', tier: 'WordPress Hosting' },
        { id: 36, code: 'HOSTVPS10', description: '10% OFF your first VPS plan from Hostinger.', type: 'Coupon', provider: 'Hostinger', link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', tier: 'VPS' },
        { id: 38, code: 'SITEDOMAIN', description: 'Get a .com for $19.99 at SiteGround.', type: 'Coupon', provider: 'SiteGround', link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', tier: 'Domain' },
        { id: 554, code: 'BLUEHOSTWP', description: 'Special deal for Bluehost WordPress Hosting.', type: 'Coupon', provider: 'Bluehost', link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', tier: 'WordPress Hosting' },
        { id: 555, code: 'SITEGROUNDCLOUD', description: 'Exclusive discount on SiteGround Cloud Hosting.', type: 'Coupon', provider: 'SiteGround', link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', tier: 'Cloud Hosting' },
        { id: 564, code: 'BLUEHOSTVPS', description: 'Save on Bluehost VPS hosting for your growing site.', type: 'Coupon', provider: 'Bluehost', link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', tier: 'VPS' }
    ],

    homeScrollerCatalog: [
        { id: 201, provider: 'SiteGround', name: 'GoGeek Plan', price: 7.99, link: 'https://world.siteground.com/index.htm?afcode=1af015da07946d940b02ee52b9fba048', rating: 4.8, numReviews: 12155, type: 'Featured', image: 'https://placehold.co/400x300/EF4444/FFFFFF?text=GoGeek', tier: 'Featured Deals' },
        { id: 209, provider: 'Hostinger', name: 'KVM 8 VPS', price: 18.99, link: 'https://www.hostinger.com/id/web-hosting?utm_medium=affiliate&utm_source=aff24685&utm_campaign=6&session=10219bee97a25ae5cc1e3001cfd695', rating: 4.8, numReviews: 19543, type: 'Featured', image: 'https://placehold.co/400x300/FF0000/FFFFFF?text=Hostinger+VPS', tier: 'Featured Deals' },
        { id: 210, provider: 'Bluehost', name: 'WP Pro Grow', price: 24.95, link: 'https://www.bluehost.com/?utm_medium=affiliate&irpid=105&channelid=P99C46097236S653N0B3A151D855E0000V100&utm_source=IR', rating: 4.4, numReviews: 5321, type: 'Featured', image: 'https://placehold.co/400x300/0000FF/FFFFFF?text=Bluehost+WP', tier: 'Featured Deals' }
    ]
};

// Function to convert product data to database format
function convertToDbFormat(product, category) {
    // Handle coupon products differently - they use 'code' as the name
    const isCodeProduct = product.code && !product.name && !product.title;
    const productName = isCodeProduct ? product.code : (product.name || product.title);
    const productTitle = isCodeProduct ? product.description : (product.title || product.name);

    return {
        // Don't include id for new products - let the API generate it
        name: productName,
        title: productTitle,
        provider: product.provider || 'HostVoucher',
        type: product.type || category,
        tier: product.tier || 'Standard',
        price: product.price || 0,
        original_price: product.originalPrice || product.original_price || null,
        discount: product.discount || null,
        features: Array.isArray(product.features) ? product.features : (product.features ? [product.features] : []),
        link: product.link || '',
        target_url: product.link || '',
        image: product.image || null,
        provider_logo: null,
        rating: product.rating || null,
        num_reviews: product.numReviews || product.num_reviews || 0,
        clicks: 0,
        code: product.code || null,
        short_link: null,
        seo_title: productTitle,
        seo_description: product.description || productTitle,
        color: null,
        button_color: null,
        is_featured: product.is_featured || false,
        show_on_landing: true,
        display_style: null,
        catalog_image: product.image || null,
        brand_logo: null,
        brand_logo_text: null
    };
}

// Export the data for use in import script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { catalogData, convertToDbFormat };
}
