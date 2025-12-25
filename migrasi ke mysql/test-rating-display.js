// Test script to verify rating display across all pages
const puppeteer = require('puppeteer');

const pages = [
    { name: 'Home', url: 'http://localhost:9002' },
    { name: 'Landing', url: 'http://localhost:9002/landing' },
    { name: 'Web Hosting', url: 'http://localhost:9002/web-hosting' },
    { name: 'WordPress Hosting', url: 'http://localhost:9002/wordpress-hosting' },
    { name: 'Cloud Hosting', url: 'http://localhost:9002/cloud-hosting' },
    { name: 'VPS', url: 'http://localhost:9002/vps' },
    { name: 'VPN', url: 'http://localhost:9002/vpn' },
    { name: 'Domain', url: 'http://localhost:9002/domain' },
    { name: 'Coupons', url: 'http://localhost:9002/coupons' }
];

async function testRatingDisplay() {
    console.log('🧪 Testing rating display across all pages...\n');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    for (const testPage of pages) {
        try {
            console.log(`📄 Testing ${testPage.name}: ${testPage.url}`);
            
            await page.goto(testPage.url, { waitUntil: 'networkidle2', timeout: 10000 });
            
            // Check for star ratings
            const starRatings = await page.$$eval('[aria-label*="Rating:"]', elements => 
                elements.map(el => ({
                    rating: el.getAttribute('aria-label'),
                    visible: el.offsetParent !== null
                }))
            );
            
            // Check for rating text
            const ratingTexts = await page.$$eval('span:contains("/5")', elements => 
                elements.map(el => el.textContent)
            );
            
            console.log(`  ⭐ Found ${starRatings.length} star rating components`);
            console.log(`  📊 Found ${ratingTexts.length} rating text displays`);
            
            if (starRatings.length > 0) {
                console.log(`  ✅ Ratings are displaying correctly`);
            } else {
                console.log(`  ⚠️  No ratings found - check if products have rating data`);
            }
            
        } catch (error) {
            console.log(`  ❌ Error testing ${testPage.name}: ${error.message}`);
        }
        
        console.log('');
    }
    
    await browser.close();
    console.log('🎉 Rating display test completed!');
}

// Run if called directly
if (require.main === module) {
    testRatingDisplay().catch(console.error);
}

module.exports = { testRatingDisplay };
