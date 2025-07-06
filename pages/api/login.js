import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username required' });
    try {
      const connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM user WHERE username = ?', [username]);
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return;
  }

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const connection = await connectToDatabase();

    // ตรวจสอบโครงสร้างตาราง user
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM user
    `);
    
    const columnNames = columns.map(col => col.Field);
    console.log('Login - User table columns:', columnNames);

    const [rows] = await connection.execute(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );

    if (rows.length === 0) return res.status(401).json({ message: 'Invalid username or password' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    console.log('Found user:', { username: user.username, hasRequestStatus: !!user.request_status });

    // ตรวจสอบสถานะการอนุมัติ (ถ้ามีคอลัมน์ request_status)
    if (columnNames.includes('request_status') && user.request_status && user.request_status !== 'approved') {
      return res.status(403).json({ message: 'Your access is not approved yet.' });
    }

    // สร้าง response ตามโครงสร้างที่มีอยู่
    const userResponse = {
      username: user.username,
      role: user.role || 'user'
    };

    // เพิ่มข้อมูลตามที่มีในตาราง
    if (columnNames.includes('user_id')) {
      userResponse.user_id = user.user_id;
    } else if (columnNames.includes('id')) {
      userResponse.user_id = user.id;
    }

    if (columnNames.includes('full_name')) {
      userResponse.full_name = user.full_name || user.username;
    } else {
      userResponse.full_name = user.username;
    }

    // สำเร็จ
    res.status(200).json({
      message: 'Login success',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
