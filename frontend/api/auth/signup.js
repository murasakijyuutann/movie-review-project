import bcrypt from 'bcrypt';
import { db } from '../_db.js';
import { signToken } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const pool = db();
    const [dup] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (Array.isArray(dup) && dup.length) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 10));
    await pool.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);

    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.status(201).json({ message: 'User created', user, token });
  } catch (e) {
    console.error('SIGNUP ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
}
