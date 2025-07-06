import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();

    const [rows] = await connection.execute(`
      SELECT 
        id, vehicle_id, maintenance_type, description, status, 
        scheduled_date, completed_date, cost, technician, notes, 
        created_at, updated_at
      FROM maintenance
      ORDER BY created_at DESC
    `);

    res.status(200).json({ maintenance: rows });
  } catch (error) {
    console.error('API maintenance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
