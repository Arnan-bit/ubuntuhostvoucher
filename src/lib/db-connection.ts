'use server';

import mysql from 'mysql2/promise';

/**
 * DATABASE CONNECTION MODULE
 * ============================================
 * Single source of truth untuk MySQL connection
 * Menggunakan connection pooling untuk efficiency
 * 
 * Environment Variables yang diperlukan:
 * - DB_HOST: MySQL server host (41.216.185.84)
 * - DB_USER: MySQL username (hostvoch_webar)
 * - DB_PASSWORD: MySQL password
 * - DB_DATABASE: Database name (hostvoucher_db)
 * - DB_PORT: MySQL port (default 3306)
 */

// Database configuration - SINGLE SOURCE OF TRUTH
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'hostvoucher_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
};

// Connection pool singleton
let pool: mysql.Pool | null = null;

/**
 * Get or create connection pool
 */
function getPool(): mysql.Pool {
  if (!pool) {
    console.log('🔌 [DB] Creating MySQL connection pool...');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Port: ${dbConfig.port}`);
    
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Test database connection
 * @returns true jika koneksi berhasil, false jika gagal
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection();
    const [rows]: any = await connection.query('SELECT 1 as test');
    connection.release();
    
    console.log('✅ [DB] Database connection successful!');
    return true;
  } catch (error: any) {
    console.error('❌ [DB] Database connection failed:', error.message);
    return false;
  }
}

/**
 * Execute raw SQL query
 * @param sql - SQL query string
 * @param values - Query parameters for prepared statement
 * @returns Query results
 */
export async function executeQuery(
  sql: string,
  values: any[] = []
): Promise<any> {
  const connection = await getPool().getConnection();
  
  try {
    console.log(`[DB] Executing query: ${sql.substring(0, 100)}...`);
    const [results] = await connection.execute(sql, values);
    return results;
  } catch (error: any) {
    console.error('❌ [DB] Query Error:', {
      sql: sql.substring(0, 200),
      error: error.message,
      code: error.code
    });
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Insert data into table
 * @param table - Table name
 * @param data - Object dengan column: value pairs
 */
export async function insertQuery(
  table: string,
  data: Record<string, any>
): Promise<any> {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
  
  try {
    const result = await executeQuery(sql, values);
    console.log(`✅ [DB] Inserted into ${table}`);
    return result;
  } catch (error) {
    console.error(`❌ [DB] Insert into ${table} failed`, error);
    throw error;
  }
}

/**
 * Update data in table
 * @param table - Table name
 * @param data - Object dengan column: value pairs yang mau di-update
 * @param where - Object dengan WHERE clause conditions
 */
export async function updateQuery(
  table: string,
  data: Record<string, any>,
  where: Record<string, any>
): Promise<any> {
  const updates = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');
  
  const sql = `UPDATE ${table} SET ${updates} WHERE ${whereClause}`;
  const allValues = [...Object.values(data), ...Object.values(where)];
  
  try {
    const result = await executeQuery(sql, allValues);
    console.log(`✅ [DB] Updated ${table}`);
    return result;
  } catch (error) {
    console.error(`❌ [DB] Update ${table} failed`, error);
    throw error;
  }
}

/**
 * Select data from table
 * @param table - Table name
 * @param where - Optional WHERE clause conditions
 */
export async function selectQuery(
  table: string,
  where?: Record<string, any>
): Promise<any> {
  let sql = `SELECT * FROM ${table}`;
  
  try {
    if (where) {
      const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
      return await executeQuery(sql, Object.values(where));
    }
    
    return await executeQuery(sql);
  } catch (error) {
    console.error(`❌ [DB] Select from ${table} failed`, error);
    throw error;
  }
}

/**
 * Delete data from table
 * @param table - Table name
 * @param where - WHERE clause conditions
 */
export async function deleteQuery(
  table: string,
  where: Record<string, any>
): Promise<any> {
  const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  
  try {
    const result = await executeQuery(sql, Object.values(where));
    console.log(`✅ [DB] Deleted from ${table}`);
    return result;
  } catch (error) {
    console.error(`❌ [DB] Delete from ${table} failed`, error);
    throw error;
  }
}

/**
 * Get single row by ID
 */
export async function getById(table: string, id: string | number): Promise<any> {
  const result = await selectQuery(table, { id });
  return result && result.length > 0 ? result[0] : null;
}

/**
 * Count records in table
 */
export async function countRecords(table: string, where?: Record<string, any>): Promise<number> {
  let sql = `SELECT COUNT(*) as count FROM ${table}`;
  
  try {
    if (where) {
      const whereClause = Object.keys(where).map(k => `${k} = ?`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
      const result: any = await executeQuery(sql, Object.values(where));
      return result[0].count;
    }
    
    const result: any = await executeQuery(sql);
    return result[0].count;
  } catch (error) {
    console.error(`❌ [DB] Count ${table} failed`, error);
    throw error;
  }
}

/**
 * Get database health status
 */
export async function getDatabaseStatus() {
  try {
    const connection = await getPool().getConnection();
    const [version]: any = await connection.query('SELECT VERSION() as version');
    const [variables]: any = await connection.query('SHOW VARIABLES LIKE "max_connections"');
    connection.release();
    
    return {
      status: 'connected',
      version: version[0].version,
      host: dbConfig.host,
      database: dbConfig.database,
      maxConnections: variables[0]?.Value || 'unknown',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      status: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
