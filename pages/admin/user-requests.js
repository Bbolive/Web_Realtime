import { useEffect, useState } from 'react';

/**
 * Admin page for managing user access requests.
 * @returns {JSX.Element}
 */
export default function UserRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch all user requests from the API.
   */
  const fetchRequests = async () => {
    setLoading(true);
    const res = await fetch('/api/user-requests');
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  };

  /**
   * Approve a user request by ID.
   * @param {number} id
   */
  const handleApprove = async (id) => {
    setActionLoading(id);
    setMessage('');
    const res = await fetch(`/api/user-requests/${id}`, { method: 'PUT' });
    const data = await res.json();
    setMessage(data.message);
    await fetchRequests();
    setActionLoading(null);
  };

  /**
   * Reject a user request by ID.
   * @param {number} id
   */
  const handleReject = async (id) => {
    setActionLoading(id);
    setMessage('');
    const res = await fetch(`/api/user-requests/${id}`, { method: 'DELETE' });
    const data = await res.json();
    setMessage(data.message);
    await fetchRequests();
    setActionLoading(null);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #7f8ff4 0%, #a084ee 100%)', 
      padding: '2rem', 
      fontFamily: 'Segoe UI, Inter, Nunito, Arial, sans-serif',
      '@media (max-width: 768px)': { padding: '1rem' },
      '@media (max-width: 480px)': { padding: '0.8rem' }
    }}>
      <div style={{ 
        maxWidth: 700, 
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.97)', 
        borderRadius: 20, 
        boxShadow: '0 8px 32px rgba(80,80,160,0.13)', 
        padding: '2.5rem 2rem', 
        backdropFilter: 'blur(8px)',
        '@media (max-width: 768px)': { 
          padding: '2rem 1.5rem',
          borderRadius: 16,
          margin: '0 0.5rem'
        },
        '@media (max-width: 480px)': { 
          padding: '1.5rem 1rem',
          margin: '0 0.3rem'
        }
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '2rem',
          '@media (max-width: 480px)': { marginBottom: '1.5rem' }
        }}>
          <a href="/dashboard" style={{ 
            textDecoration: 'none', 
            color: '#7f8ff4', 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            '@media (max-width: 768px)': { fontSize: '1rem' },
            '@media (max-width: 480px)': { fontSize: '0.9rem' }
          }}>
            ← กลับไปยัง Dashboard
          </a>
        </div>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#23235b', 
          fontWeight: 800, 
          fontSize: '2rem', 
          marginBottom: 8,
          '@media (max-width: 768px)': { fontSize: '1.8rem' },
          '@media (max-width: 480px)': { fontSize: '1.5rem' }
        }}>จัดการคำขอเข้าถึงระบบ</h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#7f8ff4', 
          marginBottom: 32,
          '@media (max-width: 768px)': { fontSize: '0.95rem', marginBottom: 24 },
          '@media (max-width: 480px)': { fontSize: '0.9rem', marginBottom: 20 }
        }}>อนุมัติหรือปฏิเสธคำขอเข้าถึงระบบจากผู้ใช้ใหม่</p>
        {message && <div style={{ 
          textAlign: 'center', 
          color: '#38a169', 
          fontWeight: 600, 
          marginBottom: 18,
          '@media (max-width: 480px)': { fontSize: '0.9rem' }
        }}>{message}</div>}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#7f8ff4', 
            fontSize: '1.2rem', 
            padding: '2rem',
            '@media (max-width: 480px)': { fontSize: '1rem', padding: '1.5rem' }
          }}>กำลังโหลด...</div>
        ) : requests.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#718096', 
            fontSize: '1.1rem', 
            padding: '2rem',
            '@media (max-width: 480px)': { fontSize: '1rem', padding: '1.5rem' }
          }}>ไม่มีคำขอที่รอการอนุมัติ</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {requests.map(req => (
              <div key={req.id} style={{ 
                background: '#f7f8fa', 
                borderRadius: 14, 
                boxShadow: '0 2px 8px #a084ee22', 
                padding: '1.2rem 1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 8,
                '@media (max-width: 480px)': { 
                  padding: '1rem 0.8rem',
                  borderRadius: 12
                }
              }}>
                <div style={{ 
                  fontWeight: 700, 
                  color: '#23235b', 
                  fontSize: '1.1rem', 
                  marginBottom: 2,
                  '@media (max-width: 768px)': { fontSize: '1rem' },
                  '@media (max-width: 480px)': { fontSize: '0.95rem' }
                }}>
                  👤 {req.username} 
                  <span style={{ 
                    color: '#7f8ff4', 
                    fontWeight: 500, 
                    fontSize: '0.98rem', 
                    marginLeft: 8,
                    '@media (max-width: 768px)': { 
                      display: 'block',
                      marginLeft: 0,
                      marginTop: 4,
                      fontSize: '0.9rem'
                    },
                    '@media (max-width: 480px)': { fontSize: '0.85rem' }
                  }}>{req.email}</span>
                </div>
                <div style={{ 
                  color: '#4a5568', 
                  fontSize: '0.98rem', 
                  marginBottom: 2,
                  '@media (max-width: 480px)': { fontSize: '0.9rem' }
                }}>📅 ส่งคำขอเมื่อ: {new Date(req.created_at).toLocaleString('th-TH')}</div>
                <div style={{ 
                  color: '#4a5568', 
                  fontSize: '0.98rem', 
                  marginBottom: 2,
                  '@media (max-width: 480px)': { fontSize: '0.9rem' }
                }}>💬 เหตุผล: {req.reason}</div>
                <div style={{ 
                  display: 'flex', 
                  gap: 12, 
                  marginTop: 8,
                  '@media (max-width: 480px)': { 
                    flexDirection: 'column',
                    gap: 8
                  }
                }}>
                  <button onClick={() => handleApprove(req.id)} disabled={actionLoading === req.id} style={{ 
                    background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 10, 
                    padding: '0.6rem 1.3rem', 
                    fontWeight: 700, 
                    fontSize: '1rem', 
                    cursor: 'pointer', 
                    boxShadow: '0 2px 8px #48bb7833', 
                    transition: 'all 0.2s', 
                    opacity: actionLoading === req.id ? 0.7 : 1,
                    '@media (max-width: 768px)': { 
                      padding: '0.5rem 1rem',
                      fontSize: '0.95rem'
                    },
                    '@media (max-width: 480px)': { 
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.9rem'
                    }
                  }}>
                    {actionLoading === req.id ? 'กำลังประมวลผล...' : '✅ อนุมัติ'}
                  </button>
                  <button onClick={() => handleReject(req.id)} disabled={actionLoading === req.id} style={{ 
                    background: 'linear-gradient(90deg, #f56565 0%, #e53e3e 100%)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 10, 
                    padding: '0.6rem 1.3rem', 
                    fontWeight: 700, 
                    fontSize: '1rem', 
                    cursor: 'pointer', 
                    boxShadow: '0 2px 8px #e53e3e33', 
                    transition: 'all 0.2s', 
                    opacity: actionLoading === req.id ? 0.7 : 1,
                    '@media (max-width: 768px)': { 
                      padding: '0.5rem 1rem',
                      fontSize: '0.95rem'
                    },
                    '@media (max-width: 480px)': { 
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.9rem'
                    }
                  }}>
                    {actionLoading === req.id ? 'กำลังประมวลผล...' : '❌ ปฏิเสธ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 