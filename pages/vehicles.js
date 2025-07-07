import { useEffect, useState } from 'react';
import styles from '../styles/Vehicles.module.css';

/**
 * Vehicles management page for listing, adding, editing, and deleting vehicles.
 * @returns {JSX.Element}
 */
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    status: 'active',
    location: '',
    driver: '',
  });

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch all vehicles from the API.
   */
  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setVehicles(data.vehicles);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /**
   * Open modal for adding a new vehicle.
   */
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      model: '',
      status: 'active',
      location: '',
      driver: '',
    });
    setShowModal(true);
  };

  /**
   * Open modal for editing an existing vehicle.
   * @param {object} vehicle
   */
  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name || '',
      model: vehicle.model || '',
      status: vehicle.status || 'active',
      location: vehicle.location || '',
      driver: vehicle.driver || '',
    });
    setShowModal(true);
  };

  /**
   * Open confirmation modal for deleting a vehicle.
   * @param {object} vehicle
   */
  const handleDeleteVehicle = (vehicle) => {
    setDeletingVehicle(vehicle);
    setShowConfirmModal(true);
  };

  /**
   * Submit form for adding or editing a vehicle.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingVehicle
        ? `/api/vehicles/${editingVehicle.vehicle_id}`
        : '/api/vehicles';
      const method = editingVehicle ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to save vehicle');
      setShowModal(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  /**
   * Confirm and delete a vehicle.
   */
  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/vehicles/${deletingVehicle.vehicle_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete vehicle');
      setShowConfirmModal(false);
      setDeletingVehicle(null);
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  /**
   * Get CSS class for vehicle status.
   * @param {string} status
   * @returns {string}
   */
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('running')) {
      return styles.statusActive;
    } else if (statusLower.includes('inactive') || statusLower.includes('stopped')) {
      return styles.statusInactive;
    } else if (statusLower.includes('maintenance') || statusLower.includes('repair')) {
      return styles.statusMaintenance;
    } else {
      return styles.statusAvailable;
    }
  };

  /**
   * Format date string to Thai locale.
   * @param {string} dateString
   * @returns {string}
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        ← กลับไปหน้า Dashboard
      </a>
      <div className={styles.header}>
        <h1 className={styles.title}>🚗 ยานพาหนะ</h1>
        <p className={styles.subtitle}>จัดการและติดตามสถานะยานพาหนะทั้งหมด</p>
      </div>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>กำลังโหลดข้อมูล...</span>
        </div>
      ) : vehicles.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🚗</div>
          <div className={styles.emptyText}>ไม่พบข้อมูลยานพาหนะ</div>
          <div className={styles.emptySubtext}>ลองรีเฟรชหน้าหรือทำการสอบถามการเชื่อมต่อ</div>
        </div>
      ) : (
        <div className={styles.vehiclesGrid}>
          {vehicles.map((vehicle) => (
            <div key={vehicle.vehicle_id} className={styles.vehicleCard}>
              <div className={styles.vehicleHeader}>
                <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                <span className={styles.vehicleId}>#{vehicle.vehicle_id}</span>
              </div>
              <div className={styles.vehicleInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>รุ่น:</span>
                  <span className={styles.infoValue}>{vehicle.model}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>สถานะ:</span>
                  <span className={`${styles.status} ${getStatusClass(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ตำแหน่ง:</span>
                  <span className={styles.infoValue}>{vehicle.location || 'ไม่ระบุ'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>คนขับ:</span>
                  <span className={styles.infoValue}>{vehicle.driver || 'ไม่ระบุ'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>อัปเดตล่าสุด:</span>
                  <span className={`${styles.infoValue} ${styles.timestamp}`}>{formatDate(vehicle.updated_at)}</span>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleEditVehicle(vehicle)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  ✏️ แก้ไข
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle)}
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
      <button onClick={handleAddVehicle} className={styles.addVehicleButton}>
        ➕ เพิ่มยานพาหนะ
      </button>
      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingVehicle ? 'แก้ไขยานพาหนะ' : 'เพิ่มยานพาหนะใหม่'}
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
                <label className={styles.formLabel}>ชื่อยานพาหนะ *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="กรอกชื่อยานพาหนะ"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>รุ่น *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                  placeholder="กรอกรุ่นยานพาหนะ"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>สถานะ</label>
                <select
                  className={styles.formSelect}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">ใช้งานได้</option>
                  <option value="inactive">ไม่ใช้งาน</option>
                  <option value="maintenance">ซ่อมบำรุง</option>
                  <option value="available">พร้อมใช้งาน</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ตำแหน่ง</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="กรอกตำแหน่งปัจจุบัน"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>คนขับ</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  placeholder="กรอกชื่อคนขับ"
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
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className={styles.modal}>
          <div className={styles.confirmContent}>
            <div className={styles.confirmTitle}>ยืนยันการลบ</div>
            <div className={styles.confirmMessage}>
              คุณต้องการลบยานพาหนะนี้หรือไม่?
            </div>
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
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
