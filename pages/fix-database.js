import { useState } from 'react';

export default function FixDatabase() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const fixUserTable = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fix-user-table');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const updateExistingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/update-existing-users');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const checkTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/check-tables');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #7f8ff4 0%, #a084ee 100%)', 
      padding: '2rem', 
      fontFamily: 'Segoe UI, Inter, Nunito, Arial, sans-serif' 
    }}>
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.97)', 
        borderRadius: 20, 
        boxShadow: '0 8px 32px rgba(80,80,160,0.13)', 
        padding: '2.5rem 2rem', 
        backdropFilter: 'blur(8px)' 
      }}>
        <h1 style={{ textAlign: 'center', color: '#23235b', fontWeight: 800, fontSize: '2rem', marginBottom: '1rem' }}>
          🔧 แก้ไขปัญหาฐานข้อมูล
        </h1>
        <p style={{ textAlign: 'center', color: '#7f8ff4', marginBottom: '2rem' }}>
          แก้ไขปัญหาโครงสร้างตารางและข้อมูลที่ไม่ตรงกับระบบ login
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={checkTables}
            disabled={loading}
            style={{ 
              background: 'linear-gradient(90deg, #4299e1 0%, #3182ce 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 10, 
              padding: '1rem', 
              fontWeight: 700, 
              fontSize: '1rem', 
              cursor: 'pointer', 
              opacity: loading ? 0.7 : 1 
            }}
          >
            🔍 ตรวจสอบโครงสร้างตาราง
          </button>

          <button 
            onClick={fixUserTable}
            disabled={loading}
            style={{ 
              background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 10, 
              padding: '1rem', 
              fontWeight: 700, 
              fontSize: '1rem', 
              cursor: 'pointer', 
              opacity: loading ? 0.7 : 1 
            }}
          >
            🛠️ แก้ไขโครงสร้างตาราง User
          </button>

          <button 
            onClick={updateExistingUsers}
            disabled={loading}
            style={{ 
              background: 'linear-gradient(90deg, #ed8936 0%, #dd6b20 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 10, 
              padding: '1rem', 
              fontWeight: 700, 
              fontSize: '1rem', 
              cursor: 'pointer', 
              opacity: loading ? 0.7 : 1 
            }}
          >
            📝 อัปเดตข้อมูล User ที่มีอยู่
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: '#7f8ff4', fontSize: '1.2rem', padding: '2rem' }}>
            กำลังประมวลผล...
          </div>
        )}

        {error && (
          <div style={{ 
            textAlign: 'center', 
            color: '#e53e3e', 
            fontWeight: 600, 
            fontSize: '1rem', 
            marginBottom: '1rem', 
            padding: '1rem', 
            background: '#fed7d7', 
            borderRadius: '8px' 
          }}>
            ❌ {error}
          </div>
        )}

        {results && (
          <div style={{ 
            background: '#f7f8fa', 
            borderRadius: 14, 
            padding: '1.5rem', 
            marginTop: '1rem' 
          }}>
            <h3 style={{ color: '#23235b', fontWeight: 700, marginBottom: '1rem' }}>
              ✅ ผลลัพธ์
            </h3>
            <pre style={{ 
              background: '#2d3748', 
              color: '#e2e8f0', 
              padding: '1rem', 
              borderRadius: '8px', 
              overflow: 'auto', 
              fontSize: '0.9rem' 
            }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/login" style={{ 
            textDecoration: 'none', 
            color: '#7f8ff4', 
            fontSize: '1.1rem', 
            fontWeight: 600 
          }}>
            ← กลับไปยังหน้า Login
          </a>
        </div>
      </div>
    </div>
  );
} 