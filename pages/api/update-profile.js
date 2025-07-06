import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { username, full_name, email, phone } = req.body;
  if (!username || !full_name || !email) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }
  try {
    const connection = await connectToDatabase();
    // ตรวจสอบว่ามี user นี้หรือไม่
    const [users] = await connection.execute('SELECT * FROM user WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้นี้ในระบบ' });
    }
    // อัปเดตข้อมูล
    await connection.execute(
      'UPDATE user SET full_name = ?, email = ?, phone = ? WHERE username = ?',
      [full_name, email, phone, username]
    );
    return res.status(200).json({ message: 'อัปเดตข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาด: ' + error.message });
  }
} 