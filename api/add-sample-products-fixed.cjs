const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

console.log('Adding sample products for all categories...');

const sampleProducts = [
    // WordPress Hosting
    {
        name: 'WordPress Pro Hosting',
        provider: 'WP Engine',
        type: 'WordPress Hosting',
        tier: 'Business',
        price: 25.00,
        rating: 4.9,
        num_reviews: 2987,
        features: ['Managed WordPress', 'Daily Backups', 'SSL Certificate', 'CDN Included'],
        target_url: 'https://wpengine.com',
        seo_description: 'Premium managed WordPress hosting with enterprise features'
    },
    {
        name: 'WordPress Starter',
        provider: 'Kinsta',
        type: 'WordPress Hosting',
        tier: 'Personal',
        price: 30.00,
        rating: 4.8,
        num_reviews: 1834,
        features: ['Google Cloud Platform', 'Free SSL', 'Daily Backups', '24/7 Support'],
        target_url: 'https://kinsta.com',
        seo_description: 'Fast WordPress hosting powered by Google Cloud'
    },
    
    // Cloud Hosting
    {
        name: 'Cloud VPS Pro',
        provider: 'DigitalOcean',
        type: 'Cloud Hosting',
        tier: 'Business',
        price: 20.00,
        rating: 4.8,
        num_reviews: 2234,
        features: ['SSD Storage', 'Load Balancers', 'Monitoring', 'API Access'],
        target_url: 'https://digitalocean.com',
        seo_description: 'Scalable cloud hosting for developers'
    },
    {
        name: 'AWS Lightsail',
        provider: 'Amazon',
        type: 'Cloud Hosting',
        tier: 'Enterprise',
        price: 15.00,
        rating: 4.7,
        num_reviews: 1987,
        features: ['AWS Integration', 'Auto Scaling', 'Load Balancing', 'CDN'],
        target_url: 'https://aws.amazon.com/lightsail',
        seo_description: 'Simple cloud hosting by Amazon Web Services'
    },
    
    // VPN
    {
        name: 'NordVPN Premium',
        provider: 'NordVPN',
        type: 'VPN',
        tier: 'Personal',
        price: 3.99,
        rating: 4.7,
        num_reviews: 1654,
        features: ['5500+ Servers', 'No Logs Policy', 'Kill Switch', '6 Devices'],
        target_url: 'https://nordvpn.com',
        seo_description: 'Secure VPN with global server network'
    },
    {
        name: 'ExpressVPN',
        provider: 'Express',
        type: 'VPN',
        tier: 'Business',
        price: 8.32,
        rating: 4.8,
        num_reviews: 2345,
        features: ['3000+ Servers', 'Split Tunneling', '24/7 Support', '5 Devices'],
        target_url: 'https://expressvpn.com',
        seo_description: 'Fast and secure VPN service'
    },
    
    // Domain
    {
        name: '.com Domain',
        provider: 'Namecheap',
        type: 'Domain',
        tier: 'Personal',
        price: 8.88,
        rating: 4.6,
        num_reviews: 1456,
        features: ['Free WHOIS Privacy', 'DNS Management', 'Email Forwarding', 'URL Forwarding'],
        target_url: 'https://namecheap.com',
        seo_description: 'Affordable domain registration with privacy protection'
    },
    {
        name: '.org Domain',
        provider: 'GoDaddy',
        type: 'Domain',
        tier: 'Personal',
        price: 12.99,
        rating: 4.5,
        num_reviews: 876,
        features: ['Domain Privacy', '24/7 Support', 'Easy Management', 'Free Email'],
        target_url: 'https://godaddy.com',
        seo_description: 'Professional domain registration services'
    }
];

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    
    console.log('✅ Connected to database');
    
    // Get the highest catalog_number first
    db.query('SELECT MAX(catalog_number) as max_num FROM products', (err, result) => {
        if (err) {
            console.error('Error getting max catalog number:', err);
            db.end();
            return;
        }
        
        let startNum = (result[0].max_num || 0) + 1;
        let completed = 0;
        
        sampleProducts.forEach((product, index) => {
            const id = uuidv4();
            const catalogNumber = startNum + index;
            
            const insertQuery = `
                INSERT INTO products (
                    id, catalog_number, name, provider, type, tier, price, rating, num_reviews,
                    features, target_url, seo_description, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            
            const values = [
                id,
                catalogNumber,
                product.name,
                product.provider,
                product.type,
                product.tier,
                product.price,
                product.rating,
                product.num_reviews,
                JSON.stringify(product.features),
                product.target_url,
                product.seo_description
            ];
            
            db.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error(`Error inserting ${product.name}:`, err);
                } else {
                    console.log(`✅ Added ${product.name} (${product.provider}) - ${product.type}: ${product.rating}★ (${product.num_reviews} reviews)`);
                }
                
                completed++;
                
                if (completed === sampleProducts.length) {
                    console.log('🎉 All sample products added!');
                    
                    // Verify the additions
                    db.query(`
                        SELECT type, COUNT(*) as total
                        FROM products 
                        WHERE type IN ('WordPress Hosting', 'Cloud Hosting', 'VPN', 'Domain')
                        GROUP BY type
                        ORDER BY type
                    `, (err, results) => {
                        if (err) {
                            console.error('Error in verification:', err);
                        } else {
                            console.log('\n📊 Products by Category:');
                            results.forEach(row => {
                                console.log(`${row.type}: ${row.total} products`);
                            });
                        }
                        db.end();
                    });
                }
            });
        });
    });
});
