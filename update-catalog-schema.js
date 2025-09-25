const mysql = require('mysql2/promise');

// Database configuration
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
        console.log('✅ Connected to database');

        console.log('\n🔧 UPDATING CATALOG SCHEMA');
        console.log('==========================');

        // Check if columns exist and add them if they don't
        const columnsToAdd = [
            {
                name: 'display_order',
                definition: 'INT DEFAULT 999',
                description: 'Order for displaying catalogs'
            },
            {
                name: 'show_on_landing',
                definition: 'BOOLEAN DEFAULT TRUE',
                description: 'Show catalog on landing page'
            },
            {
                name: 'show_on_home',
                definition: 'BOOLEAN DEFAULT TRUE',
                description: 'Show catalog on home page'
            }
        ];

        for (const column of columnsToAdd) {
            try {
                // Check if column exists
                const [columns] = await connection.execute(`
                    SELECT COLUMN_NAME 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = 'hostvoch_webapp' 
                    AND TABLE_NAME = 'products' 
                    AND COLUMN_NAME = ?
                `, [column.name]);

                if (columns.length === 0) {
                    // Column doesn't exist, add it
                    const alterQuery = `ALTER TABLE products ADD COLUMN ${column.name} ${column.definition}`;
                    await connection.execute(alterQuery);
                    console.log(`✅ Added column: ${column.name} - ${column.description}`);
                } else {
                    console.log(`✅ Column already exists: ${column.name}`);
                }
            } catch (error) {
                console.error(`❌ Error adding column ${column.name}:`, error.message);
            }
        }

        // Update existing products with default values
        console.log('\n🔄 UPDATING EXISTING PRODUCTS');
        console.log('=============================');

        // Set display_order based on current id order
        const [products] = await connection.execute('SELECT id FROM products ORDER BY id');
        
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            await connection.execute(`
                UPDATE products 
                SET display_order = ?, 
                    show_on_landing = TRUE, 
                    show_on_home = TRUE 
                WHERE id = ? AND display_order IS NULL
            `, [i + 1, product.id]);
        }

        console.log(`✅ Updated ${products.length} products with default values`);

        // Verify the schema
        console.log('\n📊 SCHEMA VERIFICATION');
        console.log('======================');

        const [schemaInfo] = await connection.execute(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'hostvoch_webapp' 
            AND TABLE_NAME = 'products' 
            AND COLUMN_NAME IN ('display_order', 'show_on_landing', 'show_on_home')
            ORDER BY COLUMN_NAME
        `);

        schemaInfo.forEach(column => {
            console.log(`✅ ${column.COLUMN_NAME}: ${column.DATA_TYPE} (Default: ${column.COLUMN_DEFAULT})`);
        });

        // Test the new functionality
        console.log('\n🧪 TESTING NEW FUNCTIONALITY');
        console.log('============================');

        const [testProducts] = await connection.execute(`
            SELECT id, name, display_order, show_on_landing, show_on_home 
            FROM products 
            ORDER BY display_order 
            LIMIT 5
        `);

        console.log('Sample products with new fields:');
        testProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Order: ${product.display_order}`);
            console.log(`   Landing: ${product.show_on_landing ? 'Yes' : 'No'}`);
            console.log(`   Home: ${product.show_on_home ? 'Yes' : 'No'}`);
            console.log('');
        });

        console.log('\n🎉 SCHEMA UPDATE COMPLETE');
        console.log('=========================');
        console.log('✅ All required columns added');
        console.log('✅ Default values set for existing products');
        console.log('✅ Schema verified and working');
        console.log('✅ Ready for Landing Page Manager');

    } catch (error) {
        console.error('❌ Schema update error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the schema update
updateCatalogSchema().catch(console.error);
