-- สร้างตาราง user_requests สำหรับเก็บคำขอเข้าถึงระบบ
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

-- เพิ่มข้อมูลตัวอย่าง (ถ้าต้องการ)
-- INSERT INTO user_requests (username, password, email, reason) VALUES
-- ('testuser1', 'password123', 'test1@example.com', 'ต้องการเข้าถึงระบบเพื่อจัดการยานพาหนะ'),
-- ('testuser2', 'password456', 'test2@example.com', 'ต้องการดูประวัติการใช้งานยานพาหนะ');

ALTER TABLE user
ADD COLUMN otp_code VARCHAR(10) DEFAULT NULL,
ADD COLUMN otp_expiry DATETIME DEFAULT NULL; 