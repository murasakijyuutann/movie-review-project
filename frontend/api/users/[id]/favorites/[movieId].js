import { db } from '../../../../_db.js';
import { requireAuth } from '../../../../_auth.js';

export default requireAuth(async (req, res, current) => {
  const id = Number(req.query.id);
  const movieId = String(req.query.movieId);
  if (current.id !== id) return res.status(403).json({ message: 'Forbidden' });

  const pool = db();

  if (req.method === 'GET') {
    const [rows] = await pool.execute(
      'SELECT 1 FROM favorites WHERE user_id = ? AND movie_id = ? LIMIT 1',
      [id, movieId]
    );
    return res.json({ saved: Array.isArray(rows) && rows.length > 0 });
  }

  if (req.method === 'DELETE') {
    await pool.execute('DELETE FROM favorites WHERE user_id = ? AND movie_id = ?', [id, movieId]);
    return res.json({ message: 'Removed from favorites' });
  }

  res.status(405).json({ message: 'Method not allowed' });
});
