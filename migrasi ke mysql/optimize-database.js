const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function optimizeDatabase() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        // Clean up old visitor analytics (keep only last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        try {
            const [result] = await connection.execute(
                'DELETE FROM visitor_analytics WHERE visited_at < ?',
                [thirtyDaysAgo.toISOString().slice(0, 19).replace('T', ' ')]
            );
            console.log(`✓ Cleaned up ${result.affectedRows} old visitor analytics records`);
        } catch (e) {
            console.log('⚠ visitor_analytics table cleanup skipped (table may not exist)');
        }

        // Clean up old realtime visitors (keep only last 1 hour)
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        
        try {
            const [result2] = await connection.execute(
                'DELETE FROM realtime_visitors WHERE last_seen < ?',
                [oneHourAgo.toISOString().slice(0, 19).replace('T', ' ')]
            );
            console.log(`✓ Cleaned up ${result2.affectedRows} old realtime visitor records`);
        } catch (e) {
            console.log('⚠ realtime_visitors table cleanup skipped (table may not exist)');
        }

        // Optimize tables
        const tables = [
            'deals', 'testimonials', 'settings', 'click_events', 
            'submitted_vouchers', 'deal_requests', 'blog_posts',
            'visitor_analytics', 'realtime_visitors', 'newsletter_subscriptions',
            'nft_redemption_requests', 'achievements', 'gamification_users',
            'nft_showcase', 'hostvoucher_testimonials'
        ];

        for (const table of tables) {
            try {
                await connection.execute(`OPTIMIZE TABLE ${table}`);
                console.log(`✓ Optimized table: ${table}`);
            } catch (e) {
                console.log(`⚠ Table ${table} optimization skipped (may not exist)`);
            }
        }

        // Add indexes for better performance if they don't exist
        const indexes = [
            {
                table: 'visitor_analytics',
                index: 'idx_visited_at',
                column: 'visited_at'
            },
            {
                table: 'realtime_visitors',
                index: 'idx_last_seen',
                column: 'last_seen'
            },
            {
                table: 'click_events',
                index: 'idx_product_id',
                column: 'product_id'
            },
            {
                table: 'deals',
                index: 'idx_type',
                column: 'type'
            }
        ];

        for (const idx of indexes) {
            try {
                await connection.execute(
                    `CREATE INDEX ${idx.index} ON ${idx.table} (${idx.column})`
                );
                console.log(`✓ Created index ${idx.index} on ${idx.table}.${idx.column}`);
            } catch (e) {
                if (e.code === 'ER_DUP_KEYNAME') {
                    console.log(`⚠ Index ${idx.index} already exists on ${idx.table}`);
                } else {
                    console.log(`⚠ Failed to create index ${idx.index} on ${idx.table}: ${e.message}`);
                }
            }
        }

        // Update statistics
        try {
            await connection.execute('ANALYZE TABLE deals, testimonials, settings');
            console.log('✓ Updated table statistics');
        } catch (e) {
            console.log('⚠ Table statistics update failed:', e.message);
        }

        console.log('\n✅ Database optimization completed successfully!');

    } catch (error) {
        console.error('Error optimizing database:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the optimization
optimizeDatabase();
