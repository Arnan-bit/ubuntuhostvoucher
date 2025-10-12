'use server';

import mysql from 'mysql2/promise';

// Database configuration with connection pooling
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3306,
  connectionLimit: 5, // Limit concurrent connections
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  idleTimeout: 300000,
  queueLimit: 0
};

// Create a connection pool to manage connections efficiently
const pool = mysql.createPool(dbConfig);

// Enhanced query function with connection pooling
export async function query({ query, values = [] }: { query: string, values?: any[] }) {
  try {
    // Use pool connection instead of creating new connection each time
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error: any) {
    console.error("Database Query Error:", error.message);
    throw error;
  }
}

// Pool is used internally only

// Direct database functions for build-time data fetching
export async function getBlogPostsFromDb() {
  try {
    const results = await query({ query: 'SELECT * FROM blog_posts ORDER BY created_at DESC' });
    return results as any[];
  } catch (error: any) {
    console.error("Error fetching blog_posts from database:", error.message);
    return [];
  }
}

export async function getDealsFromDb() {
  try {
    const results = await query({ query: 'SELECT * FROM products ORDER BY catalog_number DESC' });
    // Parse JSON fields and ensure rating/num_reviews are numbers
    return results.map((product: any) => ({
      ...product,
      features: product.features ? JSON.parse(product.features) : [],
      rating: product.rating ? parseFloat(product.rating) : 0,
      num_reviews: product.num_reviews ? parseInt(product.num_reviews) : 0,
      price: product.price ? parseFloat(product.price) : 0,
      original_price: product.original_price ? parseFloat(product.original_price) : null,
      clicks: product.clicks ? parseInt(product.clicks) : 0,
      show_on_landing: product.show_on_landing ? Boolean(product.show_on_landing) : true,
      display_style: product.display_style || 'vertical',
      is_featured: product.is_featured ? Boolean(product.is_featured) : false
    }));
  } catch (error: any) {
    console.error("Error fetching deals from database:", error.message);
    return [];
  }
}

export async function getSiteSettingsFromDb() {
  try {
    const settingsResult: any = await query({ query: 'SELECT * FROM settings WHERE id = ?', values: ['main_settings'] });
    const data = settingsResult.length > 0 ? settingsResult[0] : {};
    
    // Parse JSON fields
    if(data.page_banners && typeof data.page_banners === 'string') data.page_banners = JSON.parse(data.page_banners);
    if(data.popup_modal && typeof data.popup_modal === 'string') data.popup_modal = JSON.parse(data.popup_modal);
    if(data.site_appearance && typeof data.site_appearance === 'string') data.site_appearance = JSON.parse(data.site_appearance);
    if(data.currency_rates && typeof data.currency_rates === 'string') data.currency_rates = JSON.parse(data.currency_rates);
    if(data.gamification_points && typeof data.gamification_points === 'string') data.gamification_points = JSON.parse(data.gamification_points);
    if(data.idle_sound && typeof data.idle_sound === 'string') data.idle_sound = JSON.parse(data.idle_sound);
    if(data.pagination_settings && typeof data.pagination_settings === 'string') data.pagination_settings = JSON.parse(data.pagination_settings);
    
    return data;
  } catch (error: any) {
    console.error("Error fetching site settings from database:", error.message);
    return {};
  }
}
