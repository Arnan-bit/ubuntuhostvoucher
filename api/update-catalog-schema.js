// api/update-catalog-schema.js
// Script untuk menambahkan kolom baru ke tabel catalog untuk fitur landing page dan image management

import mysql from 'mysql2/promise';

const dbConfig = {
    host: '41.216.185.84',
    user: 'hostvoch_webar',
    password: 'Wizard@231191493',
    database: 'hostvoch_webapp'
};

async function updateCatalogSchema() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');

        // Tambahkan kolom baru untuk landing page management
        const alterQueries = [
            // Landing page visibility
            `ALTER TABLE products ADD COLUMN show_on_landing BOOLEAN DEFAULT TRUE`,

            // Display style untuk landing page
            `ALTER TABLE products ADD COLUMN display_style ENUM('vertical', 'horizontal') DEFAULT 'vertical'`,

            // Catalog image (berbeda dari main image)
            `ALTER TABLE products ADD COLUMN catalog_image TEXT`,

            // Brand logo image
            `ALTER TABLE products ADD COLUMN brand_logo TEXT`,

            // Brand logo text (alternatif dari image)
            `ALTER TABLE products ADD COLUMN brand_logo_text VARCHAR(100)`,

            // Update existing products to have default values
            `UPDATE products SET show_on_landing = TRUE WHERE show_on_landing IS NULL`,
            `UPDATE products SET display_style = 'vertical' WHERE display_style IS NULL`
        ];

        for (const query of alterQueries) {
            try {
                await connection.execute(query);
                console.log('✅ Executed:', query.substring(0, 50) + '...');
            } catch (error) {
                if (error.code === 'ER_DUP_FIELDNAME') {
                    console.log('⚠️  Column already exists:', query.substring(0, 50) + '...');
                } else {
                    console.error('❌ Error executing query:', query);
                    console.error(error.message);
                }
            }
        }

        // Verify the schema
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'hostvoch_webapp'
            AND TABLE_NAME = 'products'
            ORDER BY ORDINAL_POSITION
        `);

        console.log('\n📋 Current products table schema:');
        columns.forEach(col => {
            console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''}`);
        });

        // Test query to ensure everything works
        const [testResult] = await connection.execute(`
            SELECT id, name, show_on_landing, display_style, catalog_image, brand_logo, brand_logo_text
            FROM products
            LIMIT 3
        `);

        console.log('\n🧪 Test query result:');
        console.log(testResult);

        console.log('\n✅ Schema update completed successfully!');

    } catch (error) {
        console.error('❌ Error updating schema:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the update
updateCatalogSchema();
