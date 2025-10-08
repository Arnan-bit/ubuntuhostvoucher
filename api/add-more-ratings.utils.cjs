const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
});

console.log('Adding more ratings to products...');

// More diverse rating data
const ratingsData = [
    { rating: 4.8, num_reviews: 1247 },
    { rating: 4.6, num_reviews: 892 },
    { rating: 4.9, num_reviews: 2156 },
    { rating: 4.7, num_reviews: 1543 },
    { rating: 4.5, num_reviews: 678 },
    { rating: 4.8, num_reviews: 1834 },
    { rating: 4.4, num_reviews: 456 },
    { rating: 4.9, num_reviews: 2987 },
    { rating: 4.6, num_reviews: 1123 },
    { rating: 4.7, num_reviews: 1876 },
    { rating: 4.3, num_reviews: 567 },
    { rating: 4.8, num_reviews: 2234 },
    { rating: 4.5, num_reviews: 789 },
    { rating: 4.9, num_reviews: 3456 },
    { rating: 4.6, num_reviews: 1345 },
    { rating: 4.7, num_reviews: 1987 },
    { rating: 4.4, num_reviews: 654 },
    { rating: 4.8, num_reviews: 2567 },
    { rating: 4.5, num_reviews: 876 },
    { rating: 4.9, num_reviews: 3789 }
];

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    
    console.log('✅ Connected to database');
    
    // Get all products that don't have ratings yet
    db.query('SELECT id, name, provider FROM products WHERE (rating IS NULL OR rating = 0) AND (num_reviews IS NULL OR num_reviews = 0) ORDER BY id', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            db.end();
            return;
        }
        
        console.log(`Found ${results.length} products without ratings`);
        
        if (results.length === 0) {
            console.log('All products already have ratings!');
            db.end();
            return;
        }
        
        let completed = 0;
        
        results.forEach((product, index) => {
            const ratingData = ratingsData[index % ratingsData.length];
            
            const updateQuery = 'UPDATE products SET rating = ?, num_reviews = ? WHERE id = ?';
            
            db.query(updateQuery, [ratingData.rating, ratingData.num_reviews, product.id], (err, updateResult) => {
                if (err) {
                    console.error(`Error updating product ${product.id}:`, err);
                } else {
                    console.log(`✅ Updated ${product.name} (${product.provider}) with rating ${ratingData.rating} and ${ratingData.num_reviews} reviews`);
                }
                
                completed++;
                
                if (completed === results.length) {
                    console.log('🎉 All products updated with ratings!');
                    
                    // Verify the update
                    db.query('SELECT COUNT(*) as total, COUNT(CASE WHEN rating > 0 THEN 1 END) as with_ratings FROM products', (err, countResults) => {
                        if (err) {
                            console.error('Error verifying update:', err);
                        } else {
                            const { total, with_ratings } = countResults[0];
                            console.log(`📊 Summary: ${with_ratings}/${total} products now have ratings`);
                        }
                        db.end();
                    });
                }
            });
        });
    });
});
