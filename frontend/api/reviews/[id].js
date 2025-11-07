import { db } from '../../_db.js';
import { requireAuth } from '../../_auth.js';

export default requireAuth(async (req, res, user) => {
  const reviewId = Number(req.query.id);
  const pool = db();

  if (req.method === 'PUT') {
    const { content, rating } = req.body || {};
    if (!content) return res.status(400).json({ message: 'content required' });

    const [own] = await pool.execute('SELECT user_id FROM reviews WHERE id = ? LIMIT 1', [reviewId]);
    if (!Array.isArray(own) || own.length === 0) return res.status(404).json({ message: 'Review not found' });
    if (own[0].user_id !== user.id) return res.status(403).json({ message: 'Not your review' });

    const r = rating != null ? Number(rating) : null;
    await pool.execute('UPDATE reviews SET content = ?, rating = ?, updated_at = NOW() WHERE id = ?', [content, r, reviewId]);

    return res.json({ message: 'Review updated' });
  }

  if (req.method === 'DELETE') {
    const [own] = await pool.execute('SELECT user_id FROM reviews WHERE id = ? LIMIT 1', [reviewId]);
    if (!Array.isArray(own) || own.length === 0) return res.status(404).json({ message: 'Review not found' });
    if (own[0].user_id !== user.id) return res.status(403).json({ message: 'Not your review' });

    await pool.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
    return res.json({ message: 'Review deleted' });
  }

  res.status(405).json({ message: 'Method not allowed' });
});
