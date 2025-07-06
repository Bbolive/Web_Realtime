import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
      SELECT 
        uh.id, uh.start_time, uh.end_time, uh.distance, uh.purpose, uh.notes, uh.created_at,
        v.name AS vehicle_name,
        u.full_name AS driver_name
      FROM usage_history uh
      LEFT JOIN vehicles v ON uh.vehicle_id = v.vehicle_id
      LEFT JOIN user u ON uh.driver_id = u.user_id
      ORDER BY uh.created_at DESC
    `);

    res.status(200).json({ usage_history: rows });
  } catch (error) {
    console.error('API usage_history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
