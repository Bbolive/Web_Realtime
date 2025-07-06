import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const router = useRouter();
  const { email } = router.query;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirm) {
      setMessage('รหัสผ่านไม่ตรงกัน');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      setMessage('เกิดข้อผิดพลาด');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 380, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(80,120,255,0.10)', padding: '2.5rem 2rem', margin: 16 }}>
        <h2 style={{ textAlign: 'center', color: '#3b5bfd', marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>รีเซ็ตรหัสผ่านใหม่</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password" style={{ fontWeight: 500, color: '#222' }}>รหัสผ่านใหม่</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', margin: '10px 0 18px 0', padding: '12px', background: '#f3f6fd', border: '1px solid #e0e6f7', borderRadius: 8, fontSize: '1rem', color: '#23243a', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            autoFocus
          />
          <label htmlFor="confirm" style={{ fontWeight: 500, color: '#222' }}>ยืนยันรหัสผ่านใหม่</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={{ width: '100%', margin: '10px 0 18px 0', padding: '12px', background: '#f3f6fd', border: '1px solid #e0e6f7', borderRadius: 8, fontSize: '1rem', color: '#23243a', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', background: '#3b5bfd', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, boxShadow: '0 2px 8px #3b5bfd22', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 8, transition: 'background 0.2s' }}>
            {loading ? 'กำลังรีเซ็ต...' : 'รีเซ็ตรหัสผ่าน'}
          </button>
        </form>
        {message && <div style={{ marginTop: 18, textAlign: 'center', color: message.includes('สำเร็จ') ? '#16a34a' : '#e11d48', fontWeight: 500 }}>{message}</div>}
      </div>
    </div>
  );
} 