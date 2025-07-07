-- Railway Database Setup Script
-- สำหรับระบบจัดการรถกอล์ฟ

-- สร้างตาราง users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- สร้างตาราง vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  status ENUM('available', 'in_use', 'maintenance', 'out_of_service') DEFAULT 'available',
  location VARCHAR(100),
  battery_level INT DEFAULT 100,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vehicle_number (vehicle_number),
  INDEX idx_status (status)
);

-- สร้างตาราง usage_history
CREATE TABLE IF NOT EXISTS usage_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  duration_minutes INT,
  distance_km DECIMAL(5,2),
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_vehicle_id (vehicle_id),
  INDEX idx_start_time (start_time)
);

-- สร้างตาราง maintenance
CREATE TABLE IF NOT EXISTS maintenance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  maintenance_type ENUM('routine', 'repair', 'battery', 'tire', 'other') NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10,2),
  performed_by VARCHAR(100),
  maintenance_date DATE NOT NULL,
  next_maintenance_date DATE,
  status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  INDEX idx_vehicle_id (vehicle_id),
  INDEX idx_maintenance_date (maintenance_date),
  INDEX idx_status (status)
);

-- สร้างตาราง user_requests
CREATE TABLE IF NOT EXISTS user_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- เพิ่มคอลัมน์ OTP ในตาราง users
ALTER TABLE users 
ADD COLUMN otp_code VARCHAR(10) DEFAULT NULL,
ADD COLUMN otp_expiry DATETIME DEFAULT NULL;

-- เพิ่มข้อมูลตัวอย่าง (ถ้าต้องการ)
-- INSERT INTO users (username, password, email, role) VALUES
-- ('admin', '$2b$10$example_hash', 'admin@golfcart.com', 'admin'),
-- ('user1', '$2b$10$example_hash', 'user1@golfcart.com', 'user');

-- INSERT INTO vehicles (vehicle_number, vehicle_type, status, location) VALUES
-- ('GC001', 'Electric Golf Cart', 'available', 'Main Garage'),
-- ('GC002', 'Electric Golf Cart', 'available', 'Main Garage'),
-- ('GC003', 'Gas Golf Cart', 'maintenance', 'Service Bay');

-- แสดงสถานะการสร้างตาราง
SELECT 'Database setup completed successfully!' as status; 