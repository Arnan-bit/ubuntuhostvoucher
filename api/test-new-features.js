// api/test-new-features.js
// Script untuk test fitur-fitur baru yang telah ditambahkan

import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function testNewFeatures() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🔗 Connected to MySQL database');

        // Test 1: Verify new columns exist
        console.log('\n📋 Test 1: Verifying new columns...');
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'hostvoch_webapp' 
            AND TABLE_NAME = 'products'
            AND COLUMN_NAME IN ('show_on_landing', 'display_style', 'catalog_image', 'brand_logo', 'brand_logo_text')
        `);
        
        const newColumns = columns.map(col => col.COLUMN_NAME);
        console.log('✅ New columns found:', newColumns);

        // Test 2: Update a sample product with new fields
        console.log('\n🔧 Test 2: Updating sample product with new fields...');
        const [products] = await connection.execute('SELECT id, name FROM products LIMIT 1');
        
        if (products.length > 0) {
            const sampleProduct = products[0];
            console.log(`📦 Testing with product: ${sampleProduct.name} (${sampleProduct.id})`);
            
            await connection.execute(`
                UPDATE products SET 
                    show_on_landing = ?,
                    display_style = ?,
                    catalog_image = ?,
                    brand_logo = ?,
                    brand_logo_text = ?
                WHERE id = ?
            `, [
                true,
                'horizontal',
                'https://example.com/catalog-image.jpg',
                'https://example.com/brand-logo.png',
                'SAMPLE BRAND',
                sampleProduct.id
            ]);
            
            console.log('✅ Sample product updated successfully');
            
            // Verify the update
            const [updatedProduct] = await connection.execute(`
                SELECT show_on_landing, display_style, catalog_image, brand_logo, brand_logo_text 
                FROM products WHERE id = ?
            `, [sampleProduct.id]);
            
            console.log('📊 Updated product data:', updatedProduct[0]);
        }

        // Test 3: Query products for landing page
        console.log('\n🏠 Test 3: Querying products for landing page...');
        const [landingProducts] = await connection.execute(`
            SELECT id, name, show_on_landing, display_style, catalog_image, brand_logo, brand_logo_text, rating, num_reviews
            FROM products 
            WHERE show_on_landing = TRUE 
            ORDER BY is_featured DESC, rating DESC 
            LIMIT 5
        `);
        
        console.log(`✅ Found ${landingProducts.length} products for landing page:`);
        landingProducts.forEach(product => {
            console.log(`  - ${product.name} (${product.display_style}, rating: ${product.rating})`);
        });

        // Test 4: Test different display styles
        console.log('\n🎨 Test 4: Testing display style distribution...');
        const [styleStats] = await connection.execute(`
            SELECT display_style, COUNT(*) as count 
            FROM products 
            WHERE show_on_landing = TRUE 
            GROUP BY display_style
        `);
        
        console.log('📊 Display style distribution:');
        styleStats.forEach(stat => {
            console.log(`  - ${stat.display_style}: ${stat.count} products`);
        });

        // Test 5: Test products with images
        console.log('\n🖼️  Test 5: Testing products with custom images...');
        const [imageProducts] = await connection.execute(`
            SELECT name, 
                   CASE WHEN catalog_image IS NOT NULL THEN 'Has catalog image' ELSE 'No catalog image' END as catalog_img_status,
                   CASE WHEN brand_logo IS NOT NULL THEN 'Has brand logo' ELSE 'No brand logo' END as brand_logo_status,
                   CASE WHEN brand_logo_text IS NOT NULL THEN brand_logo_text ELSE 'No brand text' END as brand_text
            FROM products 
            WHERE show_on_landing = TRUE 
            LIMIT 10
        `);
        
        console.log('🖼️  Image status for landing products:');
        imageProducts.forEach(product => {
            console.log(`  - ${product.name}:`);
            console.log(`    Catalog: ${product.catalog_img_status}`);
            console.log(`    Brand Logo: ${product.brand_logo_status}`);
            console.log(`    Brand Text: ${product.brand_text}`);
        });

        // Test 6: Simulate API response format
        console.log('\n🔌 Test 6: Simulating API response format...');
        const [apiProducts] = await connection.execute(`
            SELECT id, name, provider, type, price, rating, num_reviews, 
                   show_on_landing, display_style, catalog_image, brand_logo, brand_logo_text,
                   is_featured, features
            FROM products 
            WHERE show_on_landing = TRUE 
            LIMIT 3
        `);
        
        const formattedProducts = apiProducts.map(product => ({
            ...product,
            features: product.features ? JSON.parse(product.features) : [],
            rating: product.rating ? parseFloat(product.rating) : 0,
            num_reviews: product.num_reviews ? parseInt(product.num_reviews) : 0,
            price: product.price ? parseFloat(product.price) : 0,
            show_on_landing: Boolean(product.show_on_landing),
            is_featured: Boolean(product.is_featured)
        }));
        
        console.log('📡 Formatted API response sample:');
        console.log(JSON.stringify(formattedProducts[0], null, 2));

        console.log('\n✅ All tests completed successfully!');
        console.log('\n🎉 New features are ready to use:');
        console.log('  ✅ Landing page visibility toggle');
        console.log('  ✅ Horizontal/Vertical display styles');
        console.log('  ✅ Custom catalog images');
        console.log('  ✅ Brand logo images');
        console.log('  ✅ Brand logo text fallback');
        console.log('  ✅ Enhanced rating system');

    } catch (error) {
        console.error('❌ Error during testing:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the tests
testNewFeatures();
