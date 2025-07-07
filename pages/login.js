import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Login.module.css';

/**
 * Login page for user authentication.
 * @returns {JSX.Element}
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  /**
   * Handle login form submission.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage(`Welcome ${data.user.full_name}!`);
      router.push('/dashboard');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.loginBox}>
        <div className={styles.iconTitle}>
          <span className={styles.shield}>🚗</span>
          <h2 className={styles.title}>เข้าสู่ระบบ</h2>
        </div>
        <div className={styles.underline}></div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>👤</span>
            <input
              type="text"
              className={styles.input}
              placeholder="ใส่ชื่อผู้ใช้งาน"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="ใส่รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#7b8cff',
                padding: '4px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f4ff';
                e.target.style.color = '#5a67d8';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#7b8cff';
              }}
            >
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.81 21.81 0 0 1 5.06-6.06"/>
                  <path d="M1 1l22 22"/>
                  <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/>
                  <path d="M14.47 14.47A3 3 0 0 1 12 9a3 3 0 0 1-2.47 5.47"/>
                  <path d="M22.94 12.94A10.94 10.94 0 0 0 12 5c-7 0-11 7-11 7"/>
                </svg>
              )}
            </button>
          </div>
          <button type="submit" className={styles.loginBtn}>
            เข้าสู่ระบบ
          </button>
        </form>
        <p className={styles.message}>{message}</p>
        <Link href="/forgot-password" legacyBehavior>
          <a
            style={{
              display: 'block',
              textAlign: 'center',
              color: '#7b8cff',
              margin: '1rem 0 0.5rem 0',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            ลืมรหัสผ่าน?
          </a>
        </Link>
        <Link href="/request-access" legacyBehavior>
          <a
            style={{
              display: 'block',
              textAlign: 'center',
              color: '#7b8cff',
              fontWeight: 600,
              margin: '1.5rem 0 0.5rem 0',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '1.1em' }}>➕</span> ขอสิทธิ์เข้าถึง
          </a>
        </Link>
      </div>
    </div>
  );
}
