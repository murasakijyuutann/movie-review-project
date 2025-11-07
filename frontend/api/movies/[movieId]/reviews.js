import { db } from '../../../_db.js';
import { requireAuth } from '../../../_auth.js';

export default async function handler(req, res) {
  const movieId = String(req.query.movieId);
  const pool = db();

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT r.id, r.user_id AS userId, u.name AS author,
                r.content, r.rating, r.created_at AS createdAt
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         WHERE r.movie_id = ?
         ORDER BY r.created_at DESC`,
        [movieId]
      );
      return res.json(rows);
    } catch (e) {
      console.error('REVIEW LIST ERROR:', e);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    return requireAuth(async (req2, res2, user) => {
      try {
        const { content, rating } = req2.body || {};
        if (!content) return res2.status(400).json({ message: 'content required' });

        const r = rating != null ? Number(rating) : null;
        await pool.execute(
          'INSERT INTO reviews (user_id, movie_id, content, rating) VALUES (?, ?, ?, ?)',
          [user.id, movieId, content, r]
        );

        return res2.status(201).json({
          userId: user.id,
          author: user.name,
          content,
          rating: r,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error('REVIEW CREATE ERROR:', e);
        return res2.status(500).json({ message: 'Server error' });
      }
    })(req, res);
  }

  res.status(405).json({ message: 'Method not allowed' });
}
