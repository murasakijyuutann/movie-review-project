import { db } from '../../../_db.js';
import { requireAuth } from '../../../_auth.js';

export default requireAuth(async (req, res, current) => {
  const id = Number(req.query.id);
  if (current.id !== id) return res.status(403).json({ message: 'Forbidden' });

  const pool = db();

  if (req.method === 'GET') {
    const [rows] = await pool.execute(
      'SELECT movie_id AS movieId, title, poster_url AS posterUrl, overview, created_at AS createdAt FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { movieId, title, posterUrl, overview } = req.body || {};
    if (!movieId || !title) return res.status(400).json({ message: 'movieId and title required' });

    try {
      await pool.execute(
        'INSERT INTO favorites (user_id, movie_id, title, poster_url, overview) VALUES (?, ?, ?, ?, ?)',
        [id, String(movieId), title, posterUrl || null, overview || null]
      );
      return res.status(201).json({ message: 'Saved to favorites' });
    } catch (e) {
      if (e?.code === 'ER_DUP_ENTRY') return res.status(200).json({ message: 'Already saved' });
      console.error('FAV ADD ERROR:', e);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
});
