import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    
    // ทดสอบการเชื่อมต่อ
    await connection.execute('SELECT 1');
    
    // ตรวจสอบตาราง user_requests
    const [userRequestsTables] = await connection.execute(`
      SHOW TABLES LIKE 'user_requests'
    `);
    
    // ตรวจสอบตาราง user
    const [userTables] = await connection.execute(`
      SHOW TABLES LIKE 'user'
    `);
    
    // ตรวจสอบโครงสร้างตาราง user_requests
    let userRequestsStructure = null;
    if (userRequestsTables.length > 0) {
      const [structure] = await connection.execute(`
        DESCRIBE user_requests
      `);
      userRequestsStructure = structure;
    }
    
    // ตรวจสอบโครงสร้างตาราง user
    let userStructure = null;
    if (userTables.length > 0) {
      const [structure] = await connection.execute(`
        DESCRIBE user
      `);
      userStructure = structure;
    }
    
    await connection.end();
    
    return res.status(200).json({
      message: 'การเชื่อมต่อฐานข้อมูลสำเร็จ',
      database: 'golfcarts',
      tables: {
        user_requests: {
          exists: userRequestsTables.length > 0,
          structure: userRequestsStructure
        },
        user: {
          exists: userTables.length > 0,
          structure: userStructure
        }
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
      error: error.message,
      stack: error.stack
    });
  }
} 