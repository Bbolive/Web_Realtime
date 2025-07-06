import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    
    // ตรวจสอบตารางทั้งหมด
    const [tables] = await connection.execute(`
      SHOW TABLES
    `);
    
    const tableInfo = {};
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      
      try {
        // ดูโครงสร้างตาราง
        const [columns] = await connection.execute(`
          DESCRIBE ${tableName}
        `);
        
        // ดูจำนวนข้อมูล
        const [countResult] = await connection.execute(`
          SELECT COUNT(*) as count FROM ${tableName}
        `);
        
        tableInfo[tableName] = {
          columns: columns.map(col => ({
            field: col.Field,
            type: col.Type,
            null: col.Null,
            key: col.Key,
            default: col.Default,
            extra: col.Extra
          })),
          rowCount: countResult[0].count
        };
      } catch (error) {
        tableInfo[tableName] = {
          error: error.message
        };
      }
    }
    
    await connection.end();
    
    return res.status(200).json({
      message: 'ตรวจสอบโครงสร้างตารางสำเร็จ',
      database: 'golfcarts',
      tables: tableInfo
    });
    
  } catch (error) {
    console.error('Check tables error:', error);
    return res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการตรวจสอบตาราง',
      error: error.message
    });
  }
} 