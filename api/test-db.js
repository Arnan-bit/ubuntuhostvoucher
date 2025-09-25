// api/test-db.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config({ path: '../.env.local' });

console.log('Testing database connection...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('✅ Database connected successfully!');
        
        // Test a simple query
        db.query('SELECT 1 as test', (err, results) => {
            if (err) {
                console.error('Query test failed:', err);
            } else {
                console.log('✅ Query test successful:', results);
            }
            
            // Close connection
            db.end();
            console.log('Database connection closed.');
        });
    }
});
