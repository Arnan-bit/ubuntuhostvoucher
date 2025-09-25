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
