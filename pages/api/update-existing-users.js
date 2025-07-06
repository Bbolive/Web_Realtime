import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    
    // ตรวจสอบโครงสร้างตาราง user
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM user
    `);
    
    const columnNames = columns.map(col => col.Field);
    console.log('Current columns:', columnNames);
    
    // อัปเดตข้อมูล user ที่มีอยู่แล้ว
    let updateQuery = '';
    let updateParams = [];
    
    if (columnNames.includes('full_name') && columnNames.includes('request_status')) {
      // อัปเดต full_name และ request_status
      updateQuery = `
        UPDATE user SET 
          full_name = COALESCE(full_name, username),
          request_status = COALESCE(request_status, 'approved')
        WHERE full_name IS NULL OR request_status IS NULL
      `;
    } else if (columnNames.includes('full_name')) {
      // อัปเดตเฉพาะ full_name
      updateQuery = `
        UPDATE user SET 
          full_name = COALESCE(full_name, username)
        WHERE full_name IS NULL
      `;
    } else if (columnNames.includes('request_status')) {
      // อัปเดตเฉพาะ request_status
      updateQuery = `
        UPDATE user SET 
          request_status = COALESCE(request_status, 'approved')
        WHERE request_status IS NULL
      `;
    }
    
    if (updateQuery) {
      const [result] = await connection.execute(updateQuery, updateParams);
      console.log('Updated users:', result.affectedRows);
    }
    
    // ดูข้อมูล user ทั้งหมด
    const [users] = await connection.execute(`
      SELECT * FROM user LIMIT 10
    `);
    
    await connection.end();
    
    return res.status(200).json({
      message: 'อัปเดตข้อมูล user สำเร็จ',
      columns: columnNames,
      updatedUsers: result ? result.affectedRows : 0,
      sampleUsers: users
    });
    
  } catch (error) {
    console.error('Update existing users error:', error);
    return res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
      error: error.message
    });
  }
} 