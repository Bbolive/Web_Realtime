import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await connectToDatabase();
    const { method } = req;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Vehicle ID is required' });
    }

    switch (method) {
      case 'PUT':
        // Update vehicle
        const { name, model, status, location, driver } = req.body;
        
        if (!name || !model) {
          return res.status(400).json({ message: 'Name and model are required' });
        }

        const [updateResult] = await connection.execute(`
          UPDATE vehicles 
          SET name = ?, model = ?, status = ?, location = ?, driver = ?, updated_at = NOW()
          WHERE vehicle_id = ?
        `, [name, model, status || 'active', location || '', driver || '', id]);

        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle updated successfully' });
        break;

      case 'DELETE':
        // Delete vehicle
        const [deleteResult] = await connection.execute(`
          DELETE FROM vehicles WHERE vehicle_id = ?
        `, [id]);

        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API vehicle operation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 