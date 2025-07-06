import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',       // ปรับเป็น host ของคุณ
    user: 'your_username',   // ใส่ชื่อ user ของ MySQL
    password: 'your_password', // รหัสผ่าน MySQL
    database: 'your_database', // ชื่อฐานข้อมูลที่ต้องการใช้
  });
  return connection;
} 