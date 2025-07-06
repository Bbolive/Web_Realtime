import { connectToDatabase } from '../../lib/db';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'กรุณาระบุอีเมล' });
  try {
    const connection = await connectToDatabase();
    // ตรวจสอบว่ามี user นี้หรือไม่
    const [users] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });
    }
    // สร้าง OTP 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 1000 * 60 * 10); // 10 นาที
    await connection.execute('UPDATE user SET otp_code = ?, otp_expiry = ? WHERE email = ?', [otp, expiry, email]);
    // ส่งอีเมล (mock SMTP)
    const isMock = !process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.example.com';
    if (isMock) {
      console.log('OTP สำหรับรีเซ็ตรหัสผ่าน (dev):', otp);
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to: email,
        subject: 'OTP สำหรับรีเซ็ตรหัสผ่าน WebGolfCart',
        text: `รหัส OTP ของคุณคือ: ${otp} (หมดอายุใน 10 นาที)`
      });
    }
    return res.status(200).json({ message: 'ส่งรหัส OTP ไปยังอีเมลแล้ว' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาด: ' + error.message });
  }
} 