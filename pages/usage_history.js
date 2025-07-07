import { useEffect, useState } from 'react';
import styles from '../styles/UsageHistory.module.css';

/**
 * Usage history page for displaying vehicle usage records.
 * @returns {JSX.Element}
 */
export default function UsageHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/usage_history')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        // Ensure we have an array, even if the API returns unexpected structure
        const historyData = data.usage_history || data.vehicles || [];
        setHistory(Array.isArray(historyData) ? historyData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setHistory([]); // Ensure history is an empty array on error
        setLoading(false);
      });
  }, []);

  /**
   * Format date and time to Thai locale.
   * @param {string} dateString
   * @returns {string}
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Format time to Thai locale.
   * @param {string} dateString
   * @returns {string}
   */
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Format date only to Thai locale.
   * @param {string} dateString
   * @returns {string}
   */
  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        ← กลับไปหน้า Dashboard
      </a>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 ประวัติการใช้งาน</h1>
        <p className={styles.subtitle}>ติดตามประวัติการใช้งานยานพาหนะทั้งหมด</p>
      </div>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>กำลังโหลดข้อมูล...</span>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</div>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            ลองใหม่
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <div className={styles.emptyText}>ไม่พบประวัติการใช้งาน</div>
          <div className={styles.emptySubtext}>ยังไม่มีข้อมูลการใช้งานยานพาหนะ</div>
        </div>
      ) : (
        <div className={styles.historyGrid}>
          {history.map((h) => (
            <div key={h.id} className={styles.historyCard}>
              <div className={styles.historyHeader}>
                <h3>ประวัติการใช้งาน #{h.id}</h3>
                <span className={styles.historyId}>#{h.id}</span>
              </div>
              <div className={styles.historyInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ยานพาหนะ:</span>
                  <span className={styles.infoValue}>{h.vehicle_name || `Vehicle ${h.vehicle_id}`}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>คนขับ:</span>
                  <span className={styles.infoValue}>{h.driver_name || `Driver ${h.driver_id}`}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>วัตถุประสงค์:</span>
                  <span className={`${styles.purpose}`}>{h.purpose || 'ไม่ระบุ'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ระยะทาง:</span>
                  <span className={`${styles.distance}`}>{h.distance || '0'} km</span>
                </div>
                <div className={styles.timeRange}>
                  <div className={styles.timeItem}>
                    <div className={styles.timeLabel}>เริ่มต้น</div>
                    <div className={styles.timeValue}>{formatTime(h.start_time)}</div>
                    <div className={styles.timestamp}>{formatDateOnly(h.start_time)}</div>
                  </div>
                  <div className={styles.timeItem}>
                    <div className={styles.timeLabel}>สิ้นสุด</div>
                    <div className={styles.timeValue}>{formatTime(h.end_time)}</div>
                    <div className={styles.timestamp}>{formatDateOnly(h.end_time)}</div>
                  </div>
                </div>
                {h.notes && (
                  <div className={styles.notes}>
                    <strong>หมายเหตุ:</strong> {h.notes}
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>สร้างเมื่อ:</span>
                  <span className={`${styles.infoValue} ${styles.timestamp}`}>{formatDate(h.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
