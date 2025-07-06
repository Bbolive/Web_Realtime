import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    
    // ตรวจสอบโครงสร้างตาราง user ปัจจุบัน
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM user
    `);
    
    const existingColumns = columns.map(col => col.Field);
    console.log('Existing columns:', existingColumns);
    
    // เพิ่มคอลัมน์ที่จำเป็นถ้ายังไม่มี
    const requiredColumns = [
      { name: 'user_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'full_name', type: 'VARCHAR(100)' },
      { name: 'request_status', type: 'ENUM("pending", "approved", "rejected") DEFAULT "approved"' }
    ];
    
    for (const column of requiredColumns) {
      if (!existingColumns.includes(column.name)) {
        try {
          if (column.name === 'user_id') {
            // ถ้าไม่มี user_id และไม่มี id ให้เพิ่ม id แทน
            if (!existingColumns.includes('id')) {
              await connection.execute(`
                ALTER TABLE user ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST
              `);
              console.log('Added id column');
            }
            // เปลี่ยนชื่อ id เป็น user_id
            await connection.execute(`
                ALTER TABLE user CHANGE id user_id INT AUTO_INCREMENT PRIMARY KEY
              `);
            console.log('Changed id to user_id');
          } else {
            await connection.execute(`
              ALTER TABLE user ADD COLUMN ${column.name} ${column.type}
            `);
            console.log(`Added ${column.name} column`);
          }
        } catch (error) {
          console.error(`Error adding column ${column.name}:`, error);
        }
      }
    }
    
    // อัปเดตข้อมูลที่มีอยู่แล้วให้มี full_name และ request_status
    try {
      await connection.execute(`
        UPDATE user SET 
          full_name = username,
          request_status = 'approved'
        WHERE full_name IS NULL OR request_status IS NULL
      `);
      console.log('Updated existing user data');
    } catch (error) {
      console.error('Error updating existing data:', error);
    }
    
    // ตรวจสอบโครงสร้างตารางหลังจากแก้ไข
    const [newColumns] = await connection.execute(`
      SHOW COLUMNS FROM user
    `);
    
    await connection.end();
    
    return res.status(200).json({
      message: 'แก้ไขโครงสร้างตาราง user สำเร็จ',
      originalColumns: existingColumns,
      newColumns: newColumns.map(col => col.Field),
      updated: true
    });
    
  } catch (error) {
    console.error('Fix user table error:', error);
    return res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการแก้ไขตาราง',
      error: error.message
    });
  }
} 