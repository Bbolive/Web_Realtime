import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    const { method } = req;

    // สร้างตาราง user_requests ถ้ายังไม่มี
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_requests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          reason TEXT NOT NULL,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_email (email)
        )
      `);
    } catch (tableError) {
      console.error('Error creating table user_requests:', tableError);
    }

    // สร้างตาราง user ถ้ายังไม่มี
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          role ENUM('admin', 'user') DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_username (username),
          INDEX idx_email (email)
        )
      `);
    } catch (tableError) {
      console.error('Error creating table user:', tableError);
    }

    if (method === 'POST') {
      try {
        const { username, password, email, reason } = req.body;
        console.log('🔍 Received:', { username, email });

        if (!username || !password || !email || !reason) {
          return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // ตรวจสอบว่า username หรือ email มีอยู่ใน user แล้วหรือยัง
        const [existingUsers] = await connection.execute(
          'SELECT username FROM user WHERE username = ? OR email = ?',
          [username, email]
        );
        if (existingUsers.length > 0) {
          return res.status(400).json({ message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' });
        }

        // ตรวจสอบว่ามีคำขอซ้ำใน user_requests หรือไม่ (สถานะ pending)
        const [existingRequests] = await connection.execute(
          'SELECT username, email FROM user_requests WHERE (username = ? OR email = ?) AND status = "pending"',
          [username, email]
        );
        if (existingRequests.length > 0) {
          return res.status(400).json({ message: 'มีคำขอสำหรับชื่อผู้ใช้หรืออีเมลนี้อยู่แล้ว กรุณารอการอนุมัติ' });
        }

        // บันทึกคำขอใหม่
        await connection.execute(
          `INSERT INTO user_requests (username, password, email, reason, status, created_at)
           VALUES (?, ?, ?, ?, 'pending', NOW())`,
          [username, password, email, reason]
        );

        console.log('✅ Request submitted for:', username);
        return res.status(201).json({ message: 'ส่งคำขอเรียบร้อยแล้ว กรุณารอการอนุมัติจากผู้ดูแลระบบ' });
      } catch (postError) {
        console.error('❌ Error in POST /api/user-requests:', postError.message);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งคำขอ: ' + postError.message });
      }
    }

    if (method === 'GET') {
      try {
        // ดึงคำขอที่สถานะ pending มาแสดง
        const [rows] = await connection.execute(`
          SELECT id, username, email, reason, status, created_at
          FROM user_requests
          WHERE status = 'pending'
          ORDER BY created_at DESC
        `);
        return res.status(200).json({ requests: rows });
      } catch (getError) {
        console.error('Error in GET /api/user-requests:', getError);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' + getError.message });
      }
    }

    // กรณี method อื่นที่ไม่ได้รับอนุญาต
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API user-requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
