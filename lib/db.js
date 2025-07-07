// lib/db.js
import mysql from 'mysql2/promise';

/**
 * Establishes a connection to the MySQL database using environment variables or default values.
 * Supports DB_PORT and SSL for Railway or other cloud MySQL providers.
 * @returns {Promise<import('mysql2/promise').Connection>} The MySQL connection object.
 */
export async function connectToDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '4447',
    database: process.env.DB_NAME || 'golfcarts',
  };

  // Enable SSL if DB_SSL is 'true' or if using Railway public proxy
  if (
    process.env.DB_SSL === 'true' ||
    (config.host && config.host.includes('proxy.rlwy.net'))
  ) {
    config.ssl = {};
  }

  return mysql.createConnection(config);
}
