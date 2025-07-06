import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setTimeout(() => router.push({ pathname: '/verify-otp', query: { email } }), 1000);
      }
    } catch (err) {
      setMessage('เกิดข้อผิดพลาด');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 380, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(80,120,255,0.10)', padding: '2.5rem 2rem', margin: 16 }}>
        <h2 style={{ textAlign: 'center', color: '#3b5bfd', marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>ลืมรหัสผ่าน</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{ fontWeight: 500, color: '#222' }}>อีเมล</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', margin: '10px 0 18px 0', padding: '12px', background: '#f3f6fd', border: '1px solid #e0e6f7', borderRadius: 8, fontSize: '1rem', color: '#23243a', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            autoFocus
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', background: '#3b5bfd', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, boxShadow: '0 2px 8px #3b5bfd22', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 8, transition: 'background 0.2s' }}>
            {loading ? 'กำลังส่ง...' : 'ขอรหัส OTP'}
          </button>
        </form>
        {message && <div style={{ marginTop: 18, textAlign: 'center', color: message.includes('ส่งรหัส') ? '#16a34a' : '#e11d48', fontWeight: 500 }}>{message}</div>}
      </div>
    </div>
  );
} 