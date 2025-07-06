import { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.css';

const tabList = [
  { key: 'profile', label: 'โปรไฟล์', icon: '👤' },
  { key: 'notification', label: 'การแจ้งเตือน', icon: '🔔' },
  { key: 'appearance', label: 'การแสดงผล', icon: '🖥️' },
  { key: 'security', label: 'ความปลอดภัย', icon: '🔒' },
  { key: 'system', label: 'ระบบ', icon: '⚙️' },
];

export default function Setting() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ username: '', full_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState('');
  // Notification
  const [emailNotify, setEmailNotify] = useState(true);
  const [systemNotify, setSystemNotify] = useState(false);
  // Appearance
  const [themeMode, setThemeMode] = useState('auto');
  // Security
  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [twoFA, setTwoFA] = useState(false);

  useEffect(() => {
    // ดึงข้อมูล user จาก localStorage (หรือ API ถ้ามีระบบ auth จริง)
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
    if (user) {
      setProfile({
        username: user.username || '',
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
    setLoading(false);
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      // เรียก API update profile (ต้องมี endpoint จริง)
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('บันทึกข้อมูลสำเร็จ');
        localStorage.setItem('user', JSON.stringify({ ...profile }));
        setEdit(false);
      } else {
        setMessage(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setMessage('เกิดข้อผิดพลาด');
    }
    setLoading(false);
  };

  const handleChangePassword = e => {
    e.preventDefault();
    setPassMsg('');
    if (!oldPass || !newPass || !confirmPass) {
      setPassMsg('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    // mock: เปลี่ยนรหัสผ่านสำเร็จ
    setTimeout(() => {
      setPassMsg('เปลี่ยนรหัสผ่านสำเร็จ (mock)');
      setOldPass(''); setNewPass(''); setConfirmPass('');
      setShowChangePass(false);
    }, 1000);
  };

  if (loading) return <div className={styles.mainContent} style={{ textAlign: 'center', marginTop: 60 }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent} style={{ maxWidth: 800, width: '100%', margin: '40px auto', padding: 0, display: 'flex', gap: 0, background: 'none', boxShadow: 'none' }}>
        {/* Sidebar Menu */}
        <div style={{ minWidth: 200, maxWidth: 220, background: 'rgba(255,255,255,0.98)', borderRadius: '20px 0 0 20px', boxShadow: '0 4px 24px rgba(80,120,255,0.10)', padding: '2.5rem 0 2.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
          <h3 style={{ textAlign: 'center', color: '#3b5bfd', fontWeight: 800, fontSize: 22, marginBottom: 24, letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>ตั้งค่า</h3>
          {tabList.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={styles.navLink + ' ' + (activeTab === tab.key ? styles.active : '')} style={{
              fontSize: 16, fontWeight: 700, padding: '12px 0', color: activeTab === tab.key ? '#3b5bfd' : '#23243a', background: activeTab === tab.key ? 'rgba(59,91,253,0.10)' : 'none', border: 'none', borderRight: activeTab === tab.key ? '4px solid #3b5bfd' : '4px solid transparent', borderRadius: '0 20px 20px 0', margin: '0 0', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s', boxShadow: activeTab === tab.key ? '0 2px 8px #3b5bfd11' : 'none', outline: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.98)', borderRadius: '0 20px 20px 0', boxShadow: '0 4px 24px rgba(80,120,255,0.10)', padding: '2.5rem 2rem', minHeight: 340, color: '#23243a', fontSize: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>👤</span><label style={{ fontWeight: 700, color: '#3b5bfd', marginBottom: 2, fontSize: 15 }}>ชื่อผู้ใช้</label></div>
            <input
              name="username"
              value={profile.username}
              disabled
              className={styles.statCard}
              style={{ width: '100%', marginBottom: 8, padding: '12px', background: '#f3f6fd', border: '1px solid #e0e6f7', borderRadius: 10, fontSize: '1rem', color: '#23243a', outline: 'none', boxSizing: 'border-box', fontWeight: 500 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>📝</span><label style={{ fontWeight: 700, color: '#3b5bfd', marginBottom: 2, fontSize: 15 }}>ชื่อ-นามสกุล</label></div>
            <input
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              disabled={!edit}
              className={styles.statCard}
              style={{ width: '100%', marginBottom: 8, padding: '12px', background: '#f3f6fd', border: '1px solid #e0e6f7', borderRadius: 10, fontSize: '1rem', color: '#23243a', outline: 'none', boxSizing: 'border-box', fontWeight: 500 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>✉️</span><label style={{ fontWeight: 700, color: '#3b5bfd', marginBottom: 2, fontSize: 15 }}>อีเมล</label></div>
            <input
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!edit}
              className={styles.statCard}
              style={{ width: '100%', marginBottom: 8, padding: '12px', background: '#f3f6fd', border: '1px solid #e0e6f7', borderRadius: 10, fontSize: '1rem', color: '#23243a', outline: 'none', boxSizing: 'border-box', fontWeight: 500 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>📞</span><label style={{ fontWeight: 700, color: '#3b5bfd', marginBottom: 2, fontSize: 15 }}>เบอร์โทรศัพท์</label></div>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!edit}
              className={styles.statCard}
              style={{ width: '100%', marginBottom: 8, padding: '12px', background: '#f3f6fd', border: '1px solid #e0e6f7', borderRadius: 10, fontSize: '1rem', color: '#23243a', outline: 'none', boxSizing: 'border-box', fontWeight: 500 }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              {!edit ? (
                <button type="button" onClick={() => setEdit(true)} className={styles.logoutButton} style={{ flex: 1, fontSize: 17, fontWeight: 700, letterSpacing: 0.5 }}>แก้ไขข้อมูล</button>
              ) : (
                <>
                  <button type="submit" disabled={loading} className={styles.logoutButton} style={{ flex: 1, fontSize: 17, fontWeight: 700, opacity: loading ? 0.7 : 1, letterSpacing: 0.5 }}>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
                  <button type="button" onClick={() => { setEdit(false); setMessage(''); }} className={styles.navLink} style={{ flex: 1, background: '#e0e6f7', color: '#3b5bfd', fontWeight: 700, fontSize: 17, letterSpacing: 0.5 }}>ยกเลิก</button>
                </>
              )}
            </div>
          </form>
        )}
        {activeTab === 'notification' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontWeight: 700, color: '#3b5bfd', fontSize: 17, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>🔔</span>ตั้งค่าการแจ้งเตือน</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontWeight: 500, color: '#23243a' }}>
              <input type="checkbox" checked={emailNotify} onChange={e => setEmailNotify(e.target.checked)} />
              แจ้งเตือนทางอีเมล
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500, color: '#23243a' }}>
              <input type="checkbox" checked={systemNotify} onChange={e => setSystemNotify(e.target.checked)} />
              แจ้งเตือนในระบบ (popup)
            </label>
          </div>
        )}
        {activeTab === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontWeight: 700, color: '#3b5bfd', fontSize: 17, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>🖥️</span>โหมดการแสดงผล</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, fontWeight: 500, color: '#23243a' }}>
              <input type="radio" name="themeMode" value="light" checked={themeMode === 'light'} onChange={() => setThemeMode('light')} /> Light
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, fontWeight: 500, color: '#23243a' }}>
              <input type="radio" name="themeMode" value="dark" checked={themeMode === 'dark'} onChange={() => setThemeMode('dark')} /> Dark
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500, color: '#23243a' }}>
              <input type="radio" name="themeMode" value="auto" checked={themeMode === 'auto'} onChange={() => setThemeMode('auto')} /> Auto
            </label>
          </div>
        )}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontWeight: 700, color: '#3b5bfd', fontSize: 17, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>🔒</span>ความปลอดภัย</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontWeight: 500, color: '#23243a' }}>
              <input type="checkbox" checked={twoFA} onChange={e => setTwoFA(e.target.checked)} /> เปิดใช้งาน 2FA (OTP ทางอีเมล)
            </label>
            <button type="button" onClick={() => setShowChangePass(v => !v)} className={styles.navLink} style={{ padding: '10px 0', width: '100%', background: '#e0e6f7', color: '#3b5bfd', fontWeight: 700, fontSize: 16, marginBottom: 10, letterSpacing: 0.5 }}>
              {showChangePass ? 'ยกเลิกเปลี่ยนรหัสผ่าน' : 'เปลี่ยนรหัสผ่าน'}
            </button>
            {showChangePass && (
              <form onSubmit={handleChangePassword} style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="password" placeholder="รหัสผ่านเดิม" value={oldPass} onChange={e => setOldPass(e.target.value)} className={styles.statCard} style={{ width: '100%', margin: 0, borderRadius: 10, fontWeight: 500 }} />
                <input type="password" placeholder="รหัสผ่านใหม่" value={newPass} onChange={e => setNewPass(e.target.value)} className={styles.statCard} style={{ width: '100%', margin: 0, borderRadius: 10, fontWeight: 500 }} />
                <input type="password" placeholder="ยืนยันรหัสผ่านใหม่" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className={styles.statCard} style={{ width: '100%', margin: 0, borderRadius: 10, fontWeight: 500 }} />
                <button type="submit" className={styles.logoutButton} style={{ width: '100%', marginTop: 8, fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>บันทึกรหัสผ่านใหม่</button>
                {passMsg && <div style={{ marginTop: 10, color: passMsg.includes('สำเร็จ') ? '#16a34a' : '#e11d48', textAlign: 'center', fontWeight: 600 }}>{passMsg}</div>}
              </form>
            )}
          </div>
        )}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 700, color: '#3b5bfd', fontSize: 17, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>⚙️</span>ข้อมูลระบบ</div>
            <div style={{ background: '#f3f6fd', borderRadius: 10, padding: 16, color: '#23243a', fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px #3b5bfd11' }}>
              <div>WebGolfCart Version: <b>1.0.0</b></div>
              <div>Last Update: <b>2024-06-09</b></div>
              <div>Node.js: <b>{typeof process !== 'undefined' ? process.version : '-'}</b></div>
              <div>OS: <b>{typeof window !== 'undefined' ? window.navigator.platform : '-'}</b></div>
            </div>
          </div>
        )}
        {message && <div style={{ marginTop: 18, textAlign: 'center', color: message.includes('สำเร็จ') ? '#16a34a' : '#e11d48', fontWeight: 700, fontSize: 16 }}>{message}</div>}
        </div>
      </div>
    </div>
  );
} 