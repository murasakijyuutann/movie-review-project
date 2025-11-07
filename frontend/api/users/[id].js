import { db } from '../../_db.js';
import { requireAuth } from '../../_auth.js';

export default requireAuth(async (req, res, current) => {
  const id = Number(req.query.id);
  const pool = db();

  if (req.method === 'GET') {
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1', [id]);
    if (!Array.isArray(rows) || rows.length === 0) return res.status(404).json({ message: 'User not found' });
    return res.json(rows[0]);
  }

  if (req.method === 'PUT') {
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: 'Missing fields' });
    if (current.id !== id) return res.status(403).json({ message: 'Forbidden' });

    const [dup] = await pool.execute('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [email, id]);
    if (Array.isArray(dup) && dup.length) return res.status(409).json({ message: 'Email already in use' });

    await pool.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1', [id]);
    return res.json({ message: 'Profile updated', user: rows[0] });
  }

  if (req.method === 'DELETE') {
    if (current.id !== id) return res.status(403).json({ message: 'Forbidden' });
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ message: 'Account deleted' });
  }

  res.status(405).json({ message: 'Method not allowed' });
});
