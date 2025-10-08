#!/usr/bin/env node

const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function updateSchema() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Check if columns already exist
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'hostvoch_webapp'
            AND TABLE_NAME = 'mining_tasks'
        `);
        
        const existingColumns = columns.map(col => col.COLUMN_NAME);
        console.log('📋 Existing columns:', existingColumns);

        const columnsToAdd = [
            { name: 'enabled', sql: 'ADD COLUMN enabled BOOLEAN DEFAULT TRUE' },
            { name: 'cooldown', sql: 'ADD COLUMN cooldown INTEGER DEFAULT 24' },
            { name: 'task_type', sql: 'ADD COLUMN task_type VARCHAR(100) DEFAULT "custom"' },
            { name: 'requirements', sql: 'ADD COLUMN requirements JSON' }
        ];

        for (const column of columnsToAdd) {
            if (!existingColumns.includes(column.name)) {
                console.log(`➕ Adding column: ${column.name}`);
                await connection.execute(`ALTER TABLE mining_tasks ${column.sql}`);
                console.log(`✅ Added column: ${column.name}`);
            } else {
                console.log(`⏭️ Column ${column.name} already exists`);
            }
        }

        // Update icon column to support emojis
        console.log('🔧 Updating icon column to support emojis...');
        await connection.execute(`
            ALTER TABLE mining_tasks
            MODIFY COLUMN icon VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        console.log('✅ Icon column updated for emoji support');

        console.log('\n🎉 Schema update completed!');
        
    } catch (error) {
        console.error('❌ Error updating schema:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateSchema();
