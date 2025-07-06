import { connectToDatabase } from '../../lib/db'; // ปรับ path ให้ถูกต้องตามโครงสร้างโปรเจกต์คุณ

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    const { method } = req;

    switch (method) {
      case 'GET':
        // Get all vehicles
        const [rows] = await connection.execute(`
          SELECT vehicle_id, name, model, status, location, driver, updated_at 
          FROM vehicles
          ORDER BY updated_at DESC
        `);
        res.status(200).json({ vehicles: rows });
        break;

      case 'POST':
        // Create new vehicle
        const { name, model, status, location, driver } = req.body;
        
        if (!name || !model) {
          return res.status(400).json({ message: 'Name and model are required' });
        }

        const [insertResult] = await connection.execute(`
          INSERT INTO vehicles (name, model, status, location, driver, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [name, model, status || 'active', location || '', driver || '']);

        res.status(201).json({ 
          message: 'Vehicle created successfully',
          vehicle_id: insertResult.insertId 
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API vehicles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
