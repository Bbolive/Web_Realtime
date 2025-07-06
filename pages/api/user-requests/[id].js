import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    const { method } = req;
    const { id } = req.query;

    if (!id) return res.status(400).json({ message: 'Missing request id' });

    // สร้างตาราง user_requests ถ้ายังไม่มี
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_requests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100) NOT NULL,
          reason TEXT NOT NULL,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_username (username),
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
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50),
          password VARCHAR(255),
          full_name VARCHAR(100),
          role ENUM('admin', 'driver', 'staff') DEFAULT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          request_status ENUM('pending', 'approved', 'rejected') DEFAULT NULL,
          last_login DATETIME DEFAULT NULL,
          created_at DATETIME DEFAULT NULL,
          updated_at DATETIME DEFAULT NULL
        )
      `);
    } catch (tableError) {
      console.error('Error creating table user:', tableError);
    }

    if (method === 'PUT') {
      try {
        // ดึงคำขอจากตาราง user_requests
        const [[request]] = await connection.execute(
          'SELECT * FROM user_requests WHERE id = ?', [id]
        );
        if (!request) return res.status(404).json({ message: 'ไม่พบคำขอนี้' });

        // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
        const [existingUser] = await connection.execute(
          'SELECT username FROM user WHERE username = ? OR email = ?',
          [request.username, request.email]
        );

        if (existingUser.length > 0) {
          // อัปเดตสถานะคำขอเป็น approved แต่ไม่เพิ่มซ้ำ
          await connection.execute(
            'UPDATE user_requests SET status = "approved" WHERE id = ?', [id]
          );
          return res.status(200).json({ message: 'อนุมัติคำขอเรียบร้อยแล้ว (ผู้ใช้นี้มีอยู่แล้ว)' });
        }

        // เพิ่มผู้ใช้ใหม่เข้า user table
        await connection.execute(
          `INSERT INTO user (username, password, email, full_name, request_status, role, created_at)
           VALUES (?, ?, ?, ?, 'approved', ?, NOW())`,
          [request.username, request.password, request.email, request.username, 'driver'] // <-- เปลี่ยน role เป็น 'driver'
        );

        // อัปเดตสถานะคำขอเป็น approved
        await connection.execute(
          'UPDATE user_requests SET status = "approved" WHERE id = ?', [id]
        );

        return res.status(200).json({ message: 'อนุมัติผู้ใช้และเพิ่มเข้าในระบบเรียบร้อยแล้ว' });
      } catch (putError) {
        console.error('Error in PUT /api/user-requests/[id]:', putError);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอนุมัติ: ' + putError.message });
      }
    }

    if (method === 'DELETE') {
      try {
        // ปฏิเสธคำขอ โดยเปลี่ยน status เป็น rejected
        const [[request]] = await connection.execute(
          'SELECT * FROM user_requests WHERE id = ?', [id]
        );
        if (!request) return res.status(404).json({ message: 'ไม่พบคำขอนี้' });

        await connection.execute(
          'UPDATE user_requests SET status = "rejected" WHERE id = ?', [id]
        );

        return res.status(200).json({ message: 'ปฏิเสธคำขอเรียบร้อยแล้ว' });
      } catch (deleteError) {
        console.error('Error in DELETE /api/user-requests/[id]:', deleteError);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการปฏิเสธ: ' + deleteError.message });
      }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);

  } catch (error) {
    console.error('API user-requests/[id] error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
