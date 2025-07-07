// lib/db.js
import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'golfcarts',

    // ✅ บังคับ SSL โดยไม่ตรวจสอบใบ cert
    ssl: {
      rejectUnauthorized: false,
    },
  };

  console.log('🔒 Connecting to MySQL with SSL disabled check');
  return mysql.createConnection(config);
}
