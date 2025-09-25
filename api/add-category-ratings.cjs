const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
});

console.log('Adding ratings to products by category...');

// Category-specific rating data
const categoryRatings = {
    'Web Hosting': [
        { rating: 4.8, num_reviews: 1247 },
        { rating: 4.7, num_reviews: 1543 },
        { rating: 4.6, num_reviews: 892 },
        { rating: 4.9, num_reviews: 2156 },
        { rating: 4.5, num_reviews: 678 }
    ],
    'WordPress Hosting': [
        { rating: 4.9, num_reviews: 2987 },
        { rating: 4.8, num_reviews: 1834 },
        { rating: 4.7, num_reviews: 1876 },
        { rating: 4.6, num_reviews: 1123 },
        { rating: 4.5, num_reviews: 789 }
    ],
    'Cloud Hosting': [
        { rating: 4.8, num_reviews: 2234 },
        { rating: 4.9, num_reviews: 3456 },
        { rating: 4.7, num_reviews: 1987 },
        { rating: 4.6, num_reviews: 1345 },
        { rating: 4.4, num_reviews: 654 }
    ],
    'VPS': [
        { rating: 4.9, num_reviews: 3789 },
        { rating: 4.8, num_reviews: 2567 },
        { rating: 4.7, num_reviews: 1876 },
        { rating: 4.6, num_reviews: 1234 },
        { rating: 4.5, num_reviews: 876 }
    ],
    'VPN': [
        { rating: 4.7, num_reviews: 1654 },
        { rating: 4.8, num_reviews: 2345 },
        { rating: 4.6, num_reviews: 1123 },
        { rating: 4.9, num_reviews: 2876 },
        { rating: 4.5, num_reviews: 987 }
    ],
    'Domain': [
        { rating: 4.6, num_reviews: 1456 },
        { rating: 4.7, num_reviews: 1789 },
        { rating: 4.8, num_reviews: 2123 },
        { rating: 4.5, num_reviews: 876 },
        { rating: 4.9, num_reviews: 3234 }
    ]
};

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    
    console.log('✅ Connected to database');
    
    // Process each category
    const categories = Object.keys(categoryRatings);
    let categoryIndex = 0;
    
    function processNextCategory() {
        if (categoryIndex >= categories.length) {
            console.log('🎉 All categories processed!');
            
            // Final verification
            db.query(`
                SELECT type, COUNT(*) as total, 
                       COUNT(CASE WHEN rating > 0 THEN 1 END) as with_ratings,
                       AVG(rating) as avg_rating
                FROM products 
                WHERE type IN ('Web Hosting', 'WordPress Hosting', 'Cloud Hosting', 'VPS', 'VPN', 'Domain')
                GROUP BY type
                ORDER BY type
            `, (err, results) => {
                if (err) {
                    console.error('Error in final verification:', err);
                } else {
                    console.log('\n📊 Final Summary by Category:');
                    results.forEach(row => {
                        console.log(`${row.type}: ${row.with_ratings}/${row.total} products with ratings (avg: ${row.avg_rating ? row.avg_rating.toFixed(1) : 'N/A'}★)`);
                    });
                }
                db.end();
            });
            return;
        }
        
        const category = categories[categoryIndex];
        const ratings = categoryRatings[category];
        
        console.log(`\nProcessing ${category}...`);
        
        // Get products for this category
        db.query('SELECT id, name, provider FROM products WHERE type = ? ORDER BY id', [category], (err, products) => {
            if (err) {
                console.error(`Error fetching ${category} products:`, err);
                categoryIndex++;
                processNextCategory();
                return;
            }
            
            console.log(`Found ${products.length} ${category} products`);
            
            if (products.length === 0) {
                categoryIndex++;
                processNextCategory();
                return;
            }
            
            let completed = 0;
            
            products.forEach((product, index) => {
                const ratingData = ratings[index % ratings.length];
                
                const updateQuery = 'UPDATE products SET rating = ?, num_reviews = ? WHERE id = ?';
                
                db.query(updateQuery, [ratingData.rating, ratingData.num_reviews, product.id], (err, updateResult) => {
                    if (err) {
                        console.error(`Error updating ${product.name}:`, err);
                    } else {
                        console.log(`✅ ${product.name} (${product.provider}): ${ratingData.rating}★ (${ratingData.num_reviews} reviews)`);
                    }
                    
                    completed++;
                    
                    if (completed === products.length) {
                        categoryIndex++;
                        processNextCategory();
                    }
                });
            });
        });
    }
    
    processNextCategory();
});
