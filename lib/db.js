// lib/db.js
import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',       // ปรับเป็น host ของคุณ
    user: 'root',            // ใส่ชื่อ user ของ MySQL
    password: '4447',        // รหัสผ่าน MySQL
    database: 'golfcarts',   // ชื่อฐานข้อมูลที่ต้องการใช้
  });
  return connection;
}
