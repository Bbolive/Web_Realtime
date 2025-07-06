import { useEffect, useState } from 'react';
import styles from '../styles/Maintenance.module.css';

export default function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [formData, setFormData] = useState({
    vehicles_id: '',
    maintenance_type: '',
    description: '',
    status: 'pending',
    scheduled_date: '',
    completed_date: '',
    cost: '',
    technician: '',
    note: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/maintenance');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRecords(data.maintenance || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setFormData({
      vehicles_id: '',
      maintenance_type: '',
      description: '',
      status: 'pending',
      scheduled_date: '',
      completed_date: '',
      cost: '',
      technician: '',
      note: ''
    });
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      vehicles_id: record.vehicles_id || '',
      maintenance_type: record.maintenance_type || '',
      description: record.description || '',
      status: record.status || 'pending',
      scheduled_date: record.scheduled_date ? record.scheduled_date.slice(0, 10) : '',
      completed_date: record.completed_date ? record.completed_date.slice(0, 10) : '',
      cost: record.cost || '',
      technician: record.technician || '',
      note: record.note || ''
    });
    setShowModal(true);
  };

  const handleDelete = (record) => {
    setDeletingRecord(record);
    setShowConfirmModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingRecord
        ? `/api/maintenance/${editingRecord.id}`
        : '/api/maintenance';
      const method = editingRecord ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to save maintenance record');
      setShowModal(false);
      fetchRecords();
    } catch (error) {
      console.error('Error saving maintenance:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/maintenance/${deletingRecord.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete maintenance record');
      setShowConfirmModal(false);
      setDeletingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('pending')) return styles.statusPending;
    if (s.includes('progress')) return styles.statusInProgress;
    if (s.includes('completed')) return styles.statusCompleted;
    if (s.includes('cancel')) return styles.statusCancelled;
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        ← กลับไปหน้า Dashboard
      </a>
      <div className={styles.header}>
        <h1 className={styles.title}>🛠️ ซ่อมบำรุง</h1>
        <p className={styles.subtitle}>ติดตามและจัดการประวัติการซ่อมบำรุงยานพาหนะ</p>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>กำลังโหลดข้อมูล...</span>
        </div>
      ) : records.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛠️</div>
          <div className={styles.emptyText}>ไม่พบข้อมูลซ่อมบำรุง</div>
          <div className={styles.emptySubtext}>ยังไม่มีข้อมูลการซ่อมบำรุง</div>
        </div>
      ) : (
        <div className={styles.maintenanceGrid}>
          {records.map(item => (
            <div key={item.id} className={styles.maintenanceCard}>
              <div className={styles.maintenanceHeader}>
                <h3 className={styles.maintenanceName}>ซ่อมบำรุง #{item.id}</h3>
                <span className={styles.maintenanceId}>#{item.id}</span>
              </div>
              <div className={styles.maintenanceInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>รหัสยานพาหนะ:</span>
                  <span className={styles.infoValue}>{item.vehicles_id}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ประเภท:</span>
                  <span className={styles.infoValue}>{item.maintenance_type}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>รายละเอียด:</span>
                  <span className={styles.infoValue}>{item.description}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>สถานะ:</span>
                  <span className={`${styles.status} ${getStatusClass(item.status)}`}>{item.status}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>วันที่นัดหมาย:</span>
                  <span className={styles.infoValue}>{formatDate(item.scheduled_date)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>วันที่เสร็จสิ้น:</span>
                  <span className={styles.infoValue}>{formatDate(item.completed_date)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ค่าใช้จ่าย:</span>
                  <span className={styles.cost}>{item.cost ? `${item.cost} บาท` : '-'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ช่างผู้รับผิดชอบ:</span>
                  <span className={styles.infoValue}>{item.technician}</span>
                </div>
                {item.note && (
                  <div className={styles.note}>
                    <strong>หมายเหตุ:</strong> {item.note}
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>สร้างเมื่อ:</span>
                  <span className={`${styles.infoValue} ${styles.timestamp}`}>{formatDate(item.created_at)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>อัปเดตล่าสุด:</span>
                  <span className={`${styles.infoValue} ${styles.timestamp}`}>{formatDate(item.updated_at)}</span>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleEdit(item)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  ✏️ แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                  🗑️ ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button onClick={handleAdd} className={styles.addMaintenanceButton}>
        ➕ เพิ่มซ่อมบำรุง
      </button>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingRecord ? 'แก้ไขซ่อมบำรุง' : 'เพิ่มซ่อมบำรุงใหม่'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>รหัสยานพาหนะ *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.vehicles_id}
                  onChange={e => setFormData({ ...formData, vehicles_id: e.target.value })}
                  required
                  placeholder="กรอกรหัสยานพาหนะ"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ประเภท *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.maintenance_type}
                  onChange={e => setFormData({ ...formData, maintenance_type: e.target.value })}
                  required
                  placeholder="กรอกประเภทซ่อมบำรุง"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>รายละเอียด</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="กรอกรายละเอียด"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>สถานะ</label>
                <select
                  className={styles.formSelect}
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">รอดำเนินการ</option>
                  <option value="in progress">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>วันที่นัดหมาย</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={formData.scheduled_date}
                  onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>วันที่เสร็จสิ้น</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={formData.completed_date}
                  onChange={e => setFormData({ ...formData, completed_date: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ค่าใช้จ่าย</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={formData.cost}
                  onChange={e => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="กรอกค่าใช้จ่าย (บาท)"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ช่างผู้รับผิดชอบ</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.technician}
                  onChange={e => setFormData({ ...formData, technician: e.target.value })}
                  placeholder="กรอกชื่อช่าง"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>หมายเหตุ</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  placeholder="กรอกหมายเหตุ"
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  ยกเลิก
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingRecord ? 'บันทึกการแก้ไข' : 'เพิ่มซ่อมบำรุง'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmContent}>
            <h3 className={styles.confirmTitle}>ยืนยันการลบ</h3>
            <p className={styles.confirmMessage}>
              คุณต้องการลบรายการซ่อมบำรุง "{deletingRecord?.maintenance_type}" ใช่หรือไม่? 
              การดำเนินการนี้ไม่สามารถยกเลิกได้
            </p>
            <div className={styles.confirmActions}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={styles.confirmCancelButton}
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className={styles.confirmDeleteButton}
              >
                ลบรายการ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
