import { useState } from 'react';
import styles from '../styles/RequestAccess.module.css';

export default function RequestAccess() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    reason: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ฟังก์ชันตรวจสอบความแข็งแกร่งของรหัสผ่าน
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#e53e3e' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { strength: score, text: 'อ่อน', color: '#e53e3e' };
    if (score <= 3) return { strength: score, text: 'ปานกลาง', color: '#ed8936' };
    if (score <= 4) return { strength: score, text: 'ดี', color: '#38a169' };
    return { strength: score, text: 'แข็งแกร่ง', color: '#2f855a' };
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    
    // ตรวจสอบรหัสผ่าน
    if (!form.password.trim()) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (form.password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    
    // ตรวจสอบการยืนยันรหัสผ่าน
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }
    
    if (!form.email.trim()) newErrors.email = 'กรุณากรอกอีเมล';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    if (!form.reason.trim()) newErrors.reason = 'กรุณาระบุเหตุผล';
    return newErrors;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await fetch('/api/user-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'เกิดข้อผิดพลาดในการส่งคำขอ' });
      }
    } catch (error) {
      setErrors({ submit: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoIcon}>🚗</div>
        <div className={styles.title}>ขอเข้าถึงระบบ</div>
        <div className={styles.subtitle}>ส่งคำขอเข้าถึงระบบจัดการยานพาหนะ Golf Cart</div>
        <a className={styles.requestLink} href="#" style={{pointerEvents: 'none'}}>
          <span style={{fontSize: '1.1em'}}>🔐</span> ขอสิทธิ์เข้าถึง
        </a>
        <hr style={{margin: '0 0 1.5rem 0', border: 'none', borderTop: '1.5px solid #ececf6'}} />
        {errors.submit && (
          <div style={{textAlign: 'center', color: '#e53e3e', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', padding: '0.5rem', background: '#fed7d7', borderRadius: '8px'}}>
            ❌ {errors.submit}
          </div>
        )}
        {submitted ? (
          <div style={{textAlign: 'center', color: '#23235b', fontWeight: 600, fontSize: '1.1rem', minHeight: 200}}>
            ✅ คำขอของคุณได้รับการส่งเรียบร้อยแล้ว<br/>กรุณารอการอนุมัติจากผู้ดูแลระบบ
                          <a href="/login" className={styles.backLink} style={{marginTop: '2rem', display: 'block'}}>
                ← กลับไปยังหน้าเข้าสู่ระบบ
              </a>
          </div>
        ) : (
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">
              <span>👨‍💼</span> ชื่อผู้ใช้ที่ต้องการ
            </label>
            <input
              className={styles.input}
              id="username"
              name="username"
              type="text"
              placeholder="เลือกชื่อผู้ใช้"
              value={form.username}
              onChange={handleChange}
              required
            />
            {errors.username && <div className={styles.error}>{errors.username}</div>}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              <span>🔐</span> รหัสผ่านที่ต้องการ
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className={styles.input}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="เลือกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                value={form.password}
                onChange={handleChange}
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
                  color: '#a084ee',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f0f4ff';
                  e.target.style.color = '#7f8ff4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#a084ee';
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
            {form.password && (
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.9rem',
                color: getPasswordStrength(form.password).color,
                fontWeight: 600
              }}>
                ความแข็งแกร่ง: {getPasswordStrength(form.password).text}
                <div style={{ 
                  marginTop: '0.25rem',
                  height: '4px',
                  background: '#e2e8f0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(getPasswordStrength(form.password).strength / 6) * 100}%`,
                    background: getPasswordStrength(form.password).color,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            )}
            {errors.password && <div className={styles.error}>{errors.password}</div>}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              <span>🔏</span> ยืนยันรหัสผ่าน
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className={styles.input}
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่านของคุณ"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#a084ee',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f0f4ff';
                  e.target.style.color = '#7f8ff4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#a084ee';
                }}
              >
                {showConfirmPassword ? (
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
            {form.confirmPassword && (
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.9rem',
                color: form.password === form.confirmPassword ? '#38a169' : '#e53e3e',
                fontWeight: 600
              }}>
                {form.password === form.confirmPassword ? '✅ รหัสผ่านตรงกัน' : '❌ รหัสผ่านไม่ตรงกัน'}
              </div>
            )}
            {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              <span>📨</span> ที่อยู่อีเมล
            </label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              placeholder="ใส่อีเมลของคุณ"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className={styles.error}>{errors.email}</div>}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="reason">
              <span>📝</span> เหตุผลในการขอเข้าถึง
            </label>
            <textarea
              className={styles.textarea}
              id="reason"
              name="reason"
              placeholder="กรุณาอธิบายเหตุผลที่ต้องการเข้าถึงระบบ"
              value={form.reason}
              onChange={handleChange}
              required
            />
            {errors.reason && <div className={styles.error}>{errors.reason}</div>}
          </div>
          <button className={styles.submitBtn} type="submit">
            <span>📤</span> ส่งคำขอ
          </button>
        </form>
        )}
        <a href="/login" className={styles.backLink}>
          ← กลับไปยังหน้าเข้าสู่ระบบ
        </a>
      </div>
    </div>
  );
} 