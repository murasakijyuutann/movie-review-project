// passport-setup.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ? LIMIT 1', [id]);
    done(null, rows[0] || false);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      const [users] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

      if (users.length) {
        // existing user
        return done(null, users[0]);
      } else {
          // new user, insert into DB
          const dummyPassword = 'google-oauth';
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password_hash, provider) VALUES (?, ?, ?, ?)',
            [name, email, dummyPassword, 'google']
            );

        const user = {
          id: result.insertId,
          name,
          email,
        };
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));
