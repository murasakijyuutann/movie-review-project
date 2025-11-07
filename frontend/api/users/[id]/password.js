import bcrypt from 'bcrypt';
import { db } from '../../../_db.js';
import { requireAuth } from '../../../_auth.js';

export default requireAuth(async (req, res, current) => {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  const id = Number(req.query.id);
  if (current.id !== id) return res.status(403).json({ message: 'Forbidden' });

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });

  const pool = db();
  const [rows] = await pool.execute('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [id]);
  if (!Array.isArray(rows) || rows.length === 0) return res.status(404).json({ message: 'User not found' });

  const ok = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

  const hash = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_ROUNDS || 10));
  await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id]);

  res.json({ message: 'Password updated' });
});
