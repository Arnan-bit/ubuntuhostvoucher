'use server';

import mysql from 'mysql2/promise';

// This function establishes a connection to your cPanel MySQL database.
// It securely reads the connection details from environment variables.
export async function query({ query, values = [] }: { query: string, values?: any[] }) {
  // Determine connection details based on the environment
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost', // Default to 'localhost' if not set
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306, // Default MySQL port
    connectTimeout: 10000 // 10 seconds
  };

  let connection;
  try {
    // Connect to the database
    connection = await mysql.createConnection(dbConfig);
    
    // Execute the query
    const [results] = await connection.execute(query, values);
    
    return results;
  } catch (error: any) {
    // In case of an error, log it and re-throw it to be handled by the calling function
    console.error("Database Query Error:", error.message);
    // A more user-friendly error message could be returned to the client
    throw error; // Re-throw the original error to be caught by the API route
  } finally {
    // Ensure the connection is closed even if an error occurred
    if (connection) {
        try {
            await connection.end();
        } catch(e) {
            console.error("Failed to close DB connection", e);
        }
    }
  }
}
