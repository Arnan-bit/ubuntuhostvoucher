const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let connection;

    try {
        const { catalogs } = req.body;

        if (!catalogs || !Array.isArray(catalogs)) {
            return res.status(400).json({ error: 'Invalid catalogs data' });
        }

        connection = await mysql.createConnection(dbConfig);

        console.log('🔄 Updating catalog order for', catalogs.length, 'catalogs');

        // Start transaction
        await connection.beginTransaction();

        try {
            // Update each catalog's order and visibility
            for (const catalog of catalogs) {
                const updateQuery = `
                    UPDATE products 
                    SET display_order = ?, 
                        show_on_landing = ?, 
                        show_on_home = ?
                    WHERE id = ?
                `;
                
                await connection.execute(updateQuery, [
                    catalog.display_order,
                    catalog.show_on_landing ? 1 : 0,
                    catalog.show_on_home ? 1 : 0,
                    catalog.id
                ]);

                console.log(`✅ Updated catalog ${catalog.id}: order=${catalog.display_order}, landing=${catalog.show_on_landing}, home=${catalog.show_on_home}`);
            }

            // Commit transaction
            await connection.commit();

            console.log('🎉 Successfully updated all catalog orders');

            res.status(200).json({
                success: true,
                message: 'Catalog order updated successfully',
                updated: catalogs.length
            });

        } catch (error) {
            // Rollback transaction on error
            await connection.rollback();
            throw error;
        }

    } catch (error) {
        console.error('❌ Error updating catalog order:', error);
        
        res.status(500).json({
            error: 'Failed to update catalog order',
            details: error.message
        });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
