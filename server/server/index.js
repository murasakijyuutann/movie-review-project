import 'dotenv/config';
import express from 'express';
import './passport-setup.js'; // load passport config
import fs from 'fs';
import session from 'express-session';
import passport from 'passport';
import dns from 'dns/promises';
import net from 'net';
import helmet from 'helmet';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { body, validationResult, param } from 'express-validator';

const requireLogin = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Login required' });
  }
  next();
};

const app = express();

// --- DB pool ---
const sslConfig = (() => {
  if (process.env.DB_SSL === 'true') {
    try {
      if (process.env.DB_SSL_CA_PATH) {
        return { ca: fs.readFileSync(process.env.DB_SSL_CA_PATH) };
      }
      // Use default trusted store with TLSv1.2+ if no CA provided
      return { minVersion: 'TLSv1.2' };
    } catch (e) {
      console.warn('DB_SSL enabled but failed to load CA:', e);
      return { minVersion: 'TLSv1.2' };
    }
  }
  return undefined;
})();

const pool = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
  ssl: sslConfig,
});

// Eager connectivity probe (logs only)
(async () => {
  try {
    const [r] = await pool.query('SELECT 1 as ok');
    console.log('DB connectivity OK →', r && r[0] ? r[0] : r);
  } catch (e) {
    console.error('DB connectivity check failed:', e?.code || e);
  }
})();

// middleware order matters
app.use(helmet());
app.use(express.json());               // ← must be here
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
      : ['http://localhost:5173']),
    credentials: true,
  })
);

// ✅ Moved up to enable session-aware routes
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/mypage', requireLogin, (req, res) => {
  res.json(req.user);
});


// --- Health check ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/debug/db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT DATABASE() db, CURRENT_USER() user');
    res.json({ ok: true, rows });
  } catch (e) {
    console.error('DB TEST ERROR:', e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Extra diagnostics: DNS and TCP to DB host
app.get('/api/debug/dns', async (req, res) => {
  try {
    const host = process.env.DB_HOST;
    if (!host) return res.status(400).json({ ok: false, error: 'Missing DB_HOST' });
    const addrs = await dns.lookup(host, { all: true });
    res.json({ ok: true, host, addresses: addrs });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get('/api/debug/tcp', async (req, res) => {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT || 3306);
  if (!host) return res.status(400).json({ ok: false, error: 'Missing DB_HOST' });

  const start = Date.now();
  const socket = new net.Socket();
  socket.setTimeout(5000);

  const result = await new Promise((resolve) => {
    socket.once('connect', () => {
      const ms = Date.now() - start;
      socket.destroy();
      resolve({ ok: true, ms });
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve({ ok: false, error: 'TIMEOUT' });
    });
    socket.once('error', (err) => {
      resolve({ ok: false, error: err.code || String(err) });
    });
    socket.connect(port, host);
  });

  res.json({ host, port, ...result });
});

// --- Signup endpoint ---
app.post(
  '/api/auth/signup',
  // Validate input
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  async (req, res) => {
    try {
        const errors = validationResult(req);
        console.log('SIGNUP BODY →', req.body);            // ← add this line
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Duplicate email check
      const [dup] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
      if (Array.isArray(dup) && dup.length) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      // Hash password
      const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
      const hash = await bcrypt.hash(password, rounds);

      // Insert
      await pool.execute(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, hash]
      );

      // Return created user (safe fields)
      const [rows] = await pool.execute(
        'SELECT id, name, email, created_at FROM users WHERE email = ? LIMIT 1',
        [email]
      );

      res.status(201).json({ message: 'User created', user: Array.isArray(rows) ? rows[0] : null });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
    }
);

const looksLikeEmail = (s) => /\S+@\S+\.\S+/.test(s);

app.post(
  '/api/auth/login',
  [
    body('password').isLength({ min: 6 }),
    body().custom((value) => {
      const id = value.email ?? value.emailOrUsername;
      if (!id) throw new Error('Email or username is required');
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
      }

      const identifier = req.body.email ?? req.body.emailOrUsername;
      const pwd = req.body.password;

      let query = 'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 2';
      let params = [identifier];

      if (!looksLikeEmail(identifier)) {
        query = 'SELECT id, name, email, password_hash FROM users WHERE name = ? LIMIT 2';
        params = [identifier];
      }

      const [rows] = await pool.execute(query, params);

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      if (!looksLikeEmail(identifier) && rows.length > 1) {
        return res.status(400).json({ message: 'Multiple users share that username. Use your email.' });
      }

      const user = rows[0];
      const ok = await bcrypt.compare(pwd, user.password_hash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

      // ✅ Save to session
      req.login({ id: user.id, name: user.name, email: user.email }, (err) => {
        if (err) {
          console.error('SESSION LOGIN ERROR:', err);
          return res.status(500).json({ message: 'Login failed' });
        }
        return res.json({ message: 'Logged in', user: { id: user.id, name: user.name, email: user.email } });
      });
    } catch (e) {
      console.error('LOGIN ERROR:', e);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/** Get user profile (safe fields) */
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    if (!Array.isArray(rows) || rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error('GET USER ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

/** Update name/email */
app.put(
  '/api/users/:id',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });

      const { name, email } = req.body;

      // email uniqueness (exclude self)
      const [dup] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1',
        [email, req.params.id]
      );
      if (Array.isArray(dup) && dup.length) return res.status(409).json({ message: 'Email already in use' });

      await pool.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);

      const [rows] = await pool.execute(
        'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1',
        [req.params.id]
      );
      res.json({ message: 'Profile updated', user: rows[0] });
    } catch (e) {
      console.error('UPDATE USER ERROR:', e);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/** Change password */
app.put(
  '/api/users/:id/password',
  [
    body('currentPassword').isLength({ min: 6 }),
    body('newPassword').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });

      const { currentPassword, newPassword } = req.body;

      const [rows] = await pool.execute(
        'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
        [req.params.id]
      );
      if (!Array.isArray(rows) || rows.length === 0) return res.status(404).json({ message: 'User not found' });

      const ok = await bcrypt.compare(currentPassword, rows[0].password_hash);
      if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

      const hash = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_ROUNDS || 10));
      await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.params.id]);

      res.json({ message: 'Password updated' });
    } catch (e) {
      console.error('CHANGE PASSWORD ERROR:', e);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/** (Optional) Delete account */
app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Account deleted' });
  } catch (e) {
    console.error('DELETE USER ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------- Favorites API (🆕) ----------------

// List favorites
app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT movie_id AS movieId, title, poster_url AS posterUrl, overview, created_at AS createdAt FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    console.error('FAV LIST ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if one movie is saved (handy for detail page)
app.get('/api/users/:id/favorites/:movieId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT 1 FROM favorites WHERE user_id = ? AND movie_id = ? LIMIT 1',
      [req.params.id, String(req.params.movieId)]
    );
    res.json({ saved: Array.isArray(rows) && rows.length > 0 });
  } catch (e) {
    console.error('FAV CHECK ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add favorite
app.post(
  '/api/users/:id/favorites',
  [
    body('movieId').trim().notEmpty().withMessage('movieId required'),
    body('title').trim().notEmpty().withMessage('title required'),
    body('posterUrl').optional().isString(),
    body('overview').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });

      const { movieId, title, posterUrl, overview } = req.body;
      await pool.execute(
        'INSERT INTO favorites (user_id, movie_id, title, poster_url, overview) VALUES (?, ?, ?, ?, ?)',
        [req.params.id, String(movieId), title, posterUrl || null, overview || null]
      );

      res.status(201).json({ message: 'Saved to favorites' });
    } catch (e) {
      // Duplicate = already saved → treat as success
      if (e?.code === 'ER_DUP_ENTRY') return res.status(200).json({ message: 'Already saved' });
      console.error('FAV ADD ERROR:', e);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Remove favorite
app.delete('/api/users/:id/favorites/:movieId', async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
      [req.params.id, String(req.params.movieId)]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (e) {
    console.error('FAV DELETE ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});
// ---------------- end Favorites API ----------------

// ---------------- Reviews API ----------------
// List reviews for a movie (with author name)
app.get('/api/movies/:movieId/reviews', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.user_id AS userId, u.name AS author,
              r.content, r.rating, r.created_at AS createdAt
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.movie_id = ?
       ORDER BY r.created_at DESC`,
      [String(req.params.movieId)]
    );
    res.json(rows);
  } catch (e) {
    console.error('REVIEW LIST ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a review (logged-in user only)
app.post(
  '/api/movies/:movieId/reviews',
  [
    body('userId').isInt({ min: 1 }),
    body('content').trim().isLength({ min: 1, max: 2000 }),
    body('rating').optional().isInt({ min: 1, max: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });

      const userId = Number(req.body.userId);
      const movieId = String(req.params.movieId);
      const { content } = req.body;
      const rating = req.body.rating != null ? Number(req.body.rating) : null;

      // verify user exists
      const [u] = await pool.execute('SELECT id, name FROM users WHERE id = ? LIMIT 1', [userId]);
      if (!Array.isArray(u) || u.length === 0) return res.status(401).json({ message: 'Not logged in' });

      const [result] = await pool.execute(
        'INSERT INTO reviews (user_id, movie_id, content, rating) VALUES (?, ?, ?, ?)',
        [userId, movieId, content, rating]
      );

      // return the created review shape like list returns
      res.status(201).json({
        id: result.insertId,
        userId,
        author: u[0].name,
        content,
        rating,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('REVIEW CREATE ERROR:', e);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a review (only the author)
app.delete(
  '/api/reviews/:id',
  [param('id').isInt({ min: 1 }), body('userId').isInt({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });

      const reviewId = Number(req.params.id);
      const userId = Number(req.body.userId);

      const [rows] = await pool.execute('SELECT user_id FROM reviews WHERE id = ? LIMIT 1', [reviewId]);
      if (!Array.isArray(rows) || rows.length === 0) return res.status(404).json({ message: 'Review not found' });

      if (rows[0].user_id !== userId) return res.status(403).json({ message: 'Not your review' });

      await pool.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
      res.json({ message: 'Review deleted' });
    } catch (e) {
      console.error('REVIEW DELETE ERROR:', e);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// ---------------- end Reviews API ----------------

// Edit a review (only the author can edit)

app.put(
  '/api/reviews/:id',
  [
    param('id').isInt({ min: 1 }),
    body('userId').isInt({ min: 1 }),
    body('content').trim().isLength({ min: 1, max: 2000 }),
    body('rating').optional({ nullable: true }).isInt({ min: 1, max: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() });
      }

      const reviewId = Number(req.params.id);
      const userId = Number(req.body.userId);
      const content = req.body.content.trim();
      const rating = req.body.rating != null ? Number(req.body.rating) : null;

      // Owner check
      const [own] = await pool.execute('SELECT user_id FROM reviews WHERE id = ? LIMIT 1', [reviewId]);
      if (!Array.isArray(own) || own.length === 0) return res.status(404).json({ message: 'Review not found' });
      if (own[0].user_id !== userId) return res.status(403).json({ message: 'Not your review' });

      await pool.execute('UPDATE reviews SET content = ?, rating = ?, updated_at = NOW() WHERE id = ?', [
        content,
        rating,
        reviewId,
      ]);

      // Return the same shape as list items
      const [rows] = await pool.execute(
        `SELECT r.id, r.user_id AS userId, u.name AS author, r.content, r.rating,
                r.created_at AS createdAt, r.updated_at AS updatedAt
         FROM reviews r JOIN users u ON u.id = r.user_id
         WHERE r.id = ? LIMIT 1`,
        [reviewId]
      );

      return res.json(rows[0]);
    } catch (e) {
      console.error('REVIEW EDIT ERROR:', e);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);


// ✅ Add this block
app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

// Start OAuth flow
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle callback from Google
app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    console.log('[✔] Google Login Success:', req.user);
    res.redirect('http://localhost:5173/mypage');
  }
);


// Logout route
app.get('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/');
  });
});

// --- Start ---
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
