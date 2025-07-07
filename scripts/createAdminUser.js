// scripts/createAdminUser.js
// ไฟล์สำหรับสร้าง admin user ใหม่

import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

async function createAdminUser() {
  try {
    // ข้อมูลการเชื่อมต่อ database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '4447',
      database: process.env.DB_NAME || 'golfcarts',
    });

    console.log('เชื่อมต่อ database สำเร็จ');

    // สร้างรหัสผ่านที่เข้ารหัสแล้ว
    const password = 'adminpass';
    const hashedPassword = await bcrypt.hash(password, 10);

    // ตรวจสอบว่ามี user admin อยู่แล้วหรือไม่
    const [existingUsers] = await connection.execute(
      'SELECT * FROM user WHERE username = ?',
      ['admin']
    );

    if (existingUsers.length > 0) {
      // อัปเดตรหัสผ่านของ admin ที่มีอยู่
      await connection.execute(
        'UPDATE user SET password = ? WHERE username = ?',
        [hashedPassword, 'admin']
      );
      console.log('✅ อัปเดตรหัสผ่าน admin สำเร็จ');
      console.log('Username: admin');
      console.log('Password: adminpass');
    } else {
      // สร้าง admin user ใหม่
      await connection.execute(
        'INSERT INTO user (username, password, email, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'admin@golfcart.com', 'admin']
      );
      console.log('✅ สร้าง admin user สำเร็จ');
      console.log('Username: admin');
      console.log('Password: adminpass');
    }

    // แสดงข้อมูล user ทั้งหมด
    const [allUsers] = await connection.execute('SELECT username, email, role FROM user');
    console.log('\n📋 รายชื่อผู้ใช้ทั้งหมด:');
    allUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - ${user.role}`);
    });

    await connection.end();
    console.log('\n✅ เสร็จสิ้น');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

// รันฟังก์ชัน
createAdminUser(); 