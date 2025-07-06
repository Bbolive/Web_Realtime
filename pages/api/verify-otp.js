import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  try {
    const connection = await connectToDatabase();
    const [users] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });
    const user = users[0];
    if (!user.otp_code || !user.otp_expiry) return res.status(400).json({ message: 'ยังไม่ได้ขอ OTP หรือ OTP หมดอายุ' });
    if (user.otp_code !== otp) return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
    if (new Date(user.otp_expiry) < new Date()) return res.status(400).json({ message: 'OTP หมดอายุ' });
    // OTP ถูกต้อง
    return res.status(200).json({ message: 'OTP ถูกต้อง' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาด: ' + error.message });
  }
} 