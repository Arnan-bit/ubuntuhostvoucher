// api/add-test-ratings.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

console.log('Adding test ratings to products...');

// Sample ratings data
const ratingsData = [
    { rating: 4.8, num_reviews: 1247 },
    { rating: 4.6, num_reviews: 892 },
    { rating: 4.9, num_reviews: 2156 },
    { rating: 4.5, num_reviews: 634 },
    { rating: 4.7, num_reviews: 1089 },
    { rating: 4.4, num_reviews: 456 },
    { rating: 4.8, num_reviews: 1678 },
    { rating: 4.6, num_reviews: 923 },
    { rating: 4.9, num_reviews: 1834 },
    { rating: 4.5, num_reviews: 567 }
];

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    
    console.log('✅ Connected to database');
    
    // Get all products
    db.query('SELECT id FROM products LIMIT 10', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            db.end();
            return;
        }
        
        console.log(`Found ${results.length} products to update`);
        
        let completed = 0;
        
        results.forEach((product, index) => {
            const ratingData = ratingsData[index % ratingsData.length];
            
            const updateQuery = 'UPDATE products SET rating = ?, num_reviews = ? WHERE id = ?';
            
            db.query(updateQuery, [ratingData.rating, ratingData.num_reviews, product.id], (err, updateResult) => {
                if (err) {
                    console.error(`Error updating product ${product.id}:`, err);
                } else {
                    console.log(`✅ Updated product ${product.id} with rating ${ratingData.rating} and ${ratingData.num_reviews} reviews`);
                }
                
                completed++;
                
                if (completed === results.length) {
                    console.log('🎉 All products updated with test ratings!');
                    db.end();
                }
            });
        });
    });
});
