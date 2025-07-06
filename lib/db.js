// lib/db.js
import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '4447',
    database: process.env.DB_NAME || 'golfcarts',
  });
  return connection;
}
