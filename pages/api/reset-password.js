import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  try {
    const connection = await connectToDatabase();
    const [users] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });
    const user = users[0];
    // hash password ใหม่
    const hashed = await bcrypt.hash(password, 10);
    await connection.execute('UPDATE user SET password = ?, otp_code = NULL, otp_expiry = NULL WHERE email = ?', [hashed, email]);
    return res.status(200).json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาด: ' + error.message });
  }
} 