import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.css';

/**
 * Dashboard page for displaying vehicle and usage statistics.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalTrips: 0,
    totalDistance: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleFilter, setVehicleFilter] = useState('all'); // 'all' or 'active'
  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
      setUserName(user.full_name);
      fetchDashboardData();
    } else {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  /**
   * Fetch dashboard data for vehicles and usage history.
   */
  const fetchDashboardData = async () => {
    try {
      const vehiclesRes = await fetch('/api/vehicles');
      const vehiclesData = await vehiclesRes.json();
      const vehicles = vehiclesData.vehicles || [];
      setVehicles(vehicles);

      const historyRes = await fetch('/api/usage_history');
      const historyData = await historyRes.json();
      const history = historyData.usage_history || [];

      // Calculate statistics
      const totalVehicles = vehicles.length;
      const activeVehicles = vehicles.filter(
        (v) =>
          v.status?.toLowerCase().includes('active') ||
          v.status?.toLowerCase().includes('running')
      ).length;
      const totalTrips = history.length;
      const totalDistance = history.reduce(
        (sum, trip) => sum + (parseFloat(trip.distance) || 0),
        0
      );

      setStats({
        totalVehicles,
        activeVehicles,
        totalTrips,
        totalDistance: Math.round(totalDistance * 100) / 100,
      });

      // Get recent activity (last 5 trips)
      const recent = history.slice(0, 5).map((trip) => ({
        id: trip.id,
        text: `${trip.vehicle_name || 'ยานพาหนะ'} ถูกใช้งานโดย ${trip.driver_name || 'ไม่ระบุ'}`,
        time: new Date(trip.start_time).toLocaleDateString('th-TH', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        icon: '🚗',
      }));
      setRecentActivity(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  /**
   * Logout the user and redirect to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  /**
   * Get greeting message based on current time.
   * @returns {string}
   */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>🚗 Golf Cart Dashboard</div>
        <div className={styles.navLinks}>
          <a href="/dashboard" className={`${styles.navLink} ${styles.active}`}>
            Dashboard
          </a>
          <a href="/vehicles" className={styles.navLink}>
            ยานพาหนะ
          </a>
          <a href="/maintenance" className={styles.navLink}>ซ่อมบำรุง</a>
          <a href="/usage_history" className={styles.navLink}>
            ประวัติการใช้งาน
          </a>
          {userRole === 'admin' && (
            <a href="/admin/user-requests" className={styles.navLink}>
              จัดการผู้ใช้
            </a>
          )}
        </div>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userRole}>{userRole}</div>
          </div>
          <a
            href="/setting"
            className={styles.navLink}
            style={{ marginRight: 12, fontWeight: 500 }}
          >
            ⚙️ Setting
          </a>
          <button onClick={handleLogout} className={styles.logoutButton}>
            ออกจากระบบ
          </button>
        </div>
      </nav>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            ยินดีต้อนรับสู่ระบบ Golf Cart
          </p>
        </div>
        {/* Statistics Cards */}
        <div className={styles.statsGrid}>
          <div
            className={styles.statCard}
            onClick={() => {
              setVehicleFilter('all');
              setShowVehiclePopup(true);
            }}
            style={{
              cursor: 'pointer',
              border:
                vehicleFilter === 'all' && showVehiclePopup
                  ? '2px solid #7b8cff'
                  : undefined,
            }}
          >
            <div className={styles.statIcon}>🚗</div>
            <div className={styles.statNumber}>{stats.totalVehicles}</div>
            <div className={styles.statLabel}>ยานพาหนะทั้งหมด</div>
            <div className={styles.statDescription}>
              จำนวนยานพาหนะที่ลงทะเบียนในระบบ
            </div>
          </div>
          <div
            className={styles.statCard}
            onClick={() => {
              setVehicleFilter('active');
              setShowVehiclePopup(true);
            }}
            style={{
              cursor: 'pointer',
              border:
                vehicleFilter === 'active' && showVehiclePopup
                  ? '2px solid #7b8cff'
                  : undefined,
            }}
          >
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statNumber}>{stats.activeVehicles}</div>
            <div className={styles.statLabel}>ยานพาหนะที่ใช้งานได้</div>
            <div className={styles.statDescription}>
              ยานพาหนะที่มีสถานะพร้อมใช้งาน
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statNumber}>{stats.totalTrips}</div>
            <div className={styles.statLabel}>การเดินทางทั้งหมด</div>
            <div className={styles.statDescription}>
              จำนวนครั้งที่มีการใช้งานยานพาหนะ
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🛣️</div>
            <div className={styles.statNumber}>{stats.totalDistance}</div>
            <div className={styles.statLabel}>ระยะทางรวม (กม.)</div>
            <div className={styles.statDescription}>
              ระยะทางรวมที่ยานพาหนะเดินทาง
            </div>
          </div>
        </div>
        {/* Vehicle Popup */}
        {showVehiclePopup && (
          <div
            className={styles.vehiclePopupOverlay}
            onClick={() => setShowVehiclePopup(false)}
          >
            <div
              className={styles.vehiclePopup}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.vehiclePopupClose}
                onClick={() => setShowVehiclePopup(false)}
                title="ปิด"
              >
                ×
              </button>
              <div className={styles.vehiclePopupTitle}>
                {vehicleFilter === 'all'
                  ? '🚗 ยานพาหนะทั้งหมด'
                  : '✅ ยานพาหนะที่ใช้งานได้'}
              </div>
              <ul className={styles.vehiclePopupList}>
                {(vehicleFilter === 'all'
                  ? vehicles
                  : vehicles.filter(
                      (v) =>
                        v.status &&
                        (v.status.toLowerCase().includes('active') ||
                          v.status.toLowerCase().includes('running'))
                    )
                ).map((vehicle) => (
                  <li key={vehicle.vehicle_id} className={styles.vehiclePopupItem}>
                    <div className={styles.vehiclePopupItemName}>
                      {vehicle.name}{' '}
                      <span className={styles.vehiclePopupItemModel}>
                        ({vehicle.model})
                      </span>
                    </div>
                    <div>
                      สถานะ:{' '}
                      <span
                        className={
                          vehicle.status &&
                          (vehicle.status.toLowerCase().includes('active') ||
                            vehicle.status.toLowerCase().includes('running'))
                            ? styles.vehiclePopupItemStatus + ' ' + styles.active
                            : styles.vehiclePopupItemStatus + ' ' + styles.inactive
                        }
                      >
                        {vehicle.status || '-'}
                      </span>
                    </div>
                    <div>ตำแหน่ง: {vehicle.location || '-'}</div>
                    <div>ผู้ขับ: {vehicle.driver || '-'}</div>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>
                      อัปเดตล่าสุด:{' '}
                      {vehicle.updated_at
                        ? new Date(vehicle.updated_at).toLocaleString('th-TH')
                        : '-'}
                    </div>
                  </li>
                ))}
                {((vehicleFilter === 'all' && vehicles.length === 0) ||
                  (vehicleFilter === 'active' &&
                    vehicles.filter(
                      (v) =>
                        v.status &&
                        (v.status.toLowerCase().includes('active') ||
                          v.status.toLowerCase().includes('running'))
                    ).length === 0)) && (
                  <li
                    style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}
                  >
                    ไม่มีข้อมูลยานพาหนะ
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        {/* Recent Activity */}
        <div className={styles.recentActivity}>
          <h2 className={styles.activityTitle}>📋 กิจกรรมล่าสุด</h2>
          {recentActivity.length > 0 ? (
            <ul className={styles.activityList}>
              {recentActivity.map((activity) => (
                <li key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>{activity.icon}</div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>{activity.text}</div>
                    <div className={styles.activityTime}>{activity.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
              ยังไม่มีกิจกรรมล่าสุด
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
