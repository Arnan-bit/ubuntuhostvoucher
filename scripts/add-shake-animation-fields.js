#!/usr/bin/env node

const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function addShakeAnimationFields() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Check if columns already exist
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'hostvoch_webapp' 
            AND TABLE_NAME = 'products'
        `);
        
        const existingColumns = columns.map(col => col.COLUMN_NAME);
        console.log('📋 Existing columns count:', existingColumns.length);

        const columnsToAdd = [
            { name: 'shake_animation', sql: 'ADD COLUMN shake_animation BOOLEAN DEFAULT FALSE' },
            { name: 'shake_intensity', sql: 'ADD COLUMN shake_intensity ENUM("normal", "intense") DEFAULT "normal"' }
        ];

        for (const column of columnsToAdd) {
            if (!existingColumns.includes(column.name)) {
                console.log(`➕ Adding column: ${column.name}`);
                await connection.execute(`ALTER TABLE products ${column.sql}`);
                console.log(`✅ Added column: ${column.name}`);
            } else {
                console.log(`⏭️ Column ${column.name} already exists`);
            }
        }

        console.log('\n🎉 Shake animation fields added successfully!');
        console.log('💡 You can now enable shake animation for products in the admin panel.');
        
    } catch (error) {
        console.error('❌ Error adding shake animation fields:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

addShakeAnimationFields();
