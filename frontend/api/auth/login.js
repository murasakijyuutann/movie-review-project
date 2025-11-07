import bcrypt from 'bcrypt';
import { db } from '../_db.js';
import { signToken } from '../_auth.js';

const looksLikeEmail = (s) => /\S+@\S+\.\S+/.test(s);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { email, emailOrUsername, password } = req.body || {};
    const id = email ?? emailOrUsername;
    if (!id || !password) return res.status(400).json({ message: 'Missing credentials' });

    const pool = db();
    let q = 'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 2';
    let p = [id];
    if (!looksLikeEmail(id)) { q = 'SELECT id, name, email, password_hash FROM users WHERE name = ? LIMIT 2'; p = [id]; }

    const [rows] = await pool.execute(q, p);
    if (!Array.isArray(rows) || rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    if (!looksLikeEmail(id) && rows.length > 1) return res.status(400).json({ message: 'Multiple users share that username. Use your email.' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.json({ message: 'Logged in', user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    console.error('LOGIN ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
}
