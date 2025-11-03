# 🎬 React Movie Review (Full‑Stack)

A modern movie discovery and review app. Browse popular titles, search TMDB, view details, sign up/login, save favorites, and write reviews — built with React + Vite on the frontend and Express + MySQL on the backend.


## ✨ Features

- Browse popular movies with infinite scroll
- Search by title (TMDB)
- Movie detail pages (poster, genres, rating, overview)
- Auth: email/password (session‑based) and optional Google OAuth
- User profile (My Page)
- Favorites: save/remove movies
- Reviews: create, edit, delete
- Protected routes, responsive UI, Tailwind styling


## 🧱 Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 19, Vite 7, React Router, Tailwind CSS |
| Backend    | Node.js, Express, express‑session, Passport |
| Database   | MySQL (AWS RDS or local) |
| Auth       | Session (optional Google OAuth 2.0) |
| External   | TMDB API (v3 key or v4 Bearer) |


## 📁 Project Structure

```
react-movie-review/
├─ frontend/
│  ├─ src/
│  │  ├─ components/ (HomePage, MovieDetail, Login, Signup, MyPage, …)
│  │  ├─ features/ (auth, reviews, user, …)
│  │  ├─ api/axios.ts (axios instance)
│  │  └─ App.jsx, main.jsx
│  ├─ vite.config.js (dev proxy to backend)
│  └─ .env (VITE_* variables only)
└─ server/
	 └─ server/
			├─ index.js (Express API)
			├─ passport-setup.js (OAuth wiring)
			└─ .env (server secrets, DB, CORS, etc.)
```


## ⚙️ Environment Variables

Frontend: `frontend/.env` (Vite only loads VITE_* keys)

```
VITE_TMDB_API_KEY=your_tmdb_v3_api_key
# Or use a v4 Bearer token instead of API key:
# VITE_TMDB_BEARER=eyJhbGciOi...

# Optional during dev; if omitted, frontend uses relative /api and the Vite proxy
VITE_API_BASE_URL=http://localhost:3001
```

Backend: `server/server/.env`

```
# Database
DB_HOST=mydb.czwaweqgeexp.ap-northeast-2.rds.amazonaws.com
DB_PORT=3306
DB_USER=<your-db-user>
DB_PASS=<your-db-pass>
DB_NAME=movie_app

# Optional RDS TLS
# DB_SSL=true
# DB_SSL_CA_PATH=C:\\path\\to\\rds-combined-ca-bundle.pem

# Server
PORT=3001
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=<random-strong-secret>
NODE_ENV=development

# OAuth (optional)
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

Important
- Keep non‑Vite secrets (DB, OAuth, session) out of the frontend. They belong only in `server/server/.env`.
- After editing env files, restart the dev servers.


## 🧪 Local Development

Open two terminals.

Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend
```bash
cd server/server
npm install
npm run dev
```

By default, Vite proxies `/api` and `/auth` to `http://localhost:3001`. If you set `VITE_API_BASE_URL`, the frontend will call that origin directly.


## 🗄️ Database Schema (MySQL)

The API expects these tables:

```sql
CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	movie_id VARCHAR(32) NOT NULL,
	title VARCHAR(255) NULL,
	poster_url VARCHAR(512) NULL,
	overview TEXT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE KEY uniq_user_movie (user_id, movie_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
	id INT AUTO_INCREMENT PRIMARY KEY,
	movie_id VARCHAR(32) NOT NULL,
	user_id INT NOT NULL,
	content TEXT NOT NULL,
	rating TINYINT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	INDEX idx_reviews_movie (movie_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```


## 🔌 API Endpoints (Summary)

Auth
- POST `/api/auth/signup` — create account
- POST `/api/auth/login` — login (session cookie)
- GET  `/api/auth/me` — current user (401 if not logged in)
- GET  `/api/auth/logout` — logout
- GET  `/api/auth/google` — start Google OAuth (optional)
- GET  `/api/auth/google/callback` — OAuth callback

Users
- GET  `/api/users/:id` — profile
- PUT  `/api/users/:id` — update name/email
- PUT  `/api/users/:id/password` — change password
- DELETE `/api/users/:id` — delete account

Favorites
- GET    `/api/users/:id/favorites`
- GET    `/api/users/:id/favorites/:movieId` (saved: true/false)
- POST   `/api/users/:id/favorites` ({ movieId, title, posterUrl, overview })
- DELETE `/api/users/:id/favorites/:movieId`

Reviews
- GET  `/api/movies/:movieId/reviews`
- POST `/api/movies/:movieId/reviews` ({ userId, content, rating? })
- PUT  `/api/reviews/:id` ({ userId, content, rating? })
- DELETE `/api/reviews/:id` ({ userId })

Utilities
- GET `/api/health`
- GET `/api/debug/dns` — resolves DB host
- GET `/api/debug/tcp` — raw TCP check to DB host:port
- GET `/api/debug/db` — simple DB query test


## 🎥 TMDB Usage

- Home and detail pages call TMDB v3 endpoints.
- You can auth via:
	- API Key (v3): add `api_key` query param
	- Bearer Token (v4): set `Authorization: Bearer <token>` header (no `api_key` param)

Set one of `VITE_TMDB_API_KEY` or `VITE_TMDB_BEARER` in `frontend/.env`.


## � Deployment Notes

- Set `NODE_ENV=production`, `SESSION_SECRET` to a strong value.
- `CORS_ORIGIN` should be your frontend URL in production.
- For AWS RDS MySQL:
	- Publicly accessible = Yes (if connecting from the internet) and SG inbound 3306 from your IP.
	- Or keep it private and reach it via an EC2 bastion/SSH tunnel.
	- If SSL is required, set `DB_SSL=true` and provide `DB_SSL_CA_PATH`.


## 🧰 Troubleshooting

TMDB 401 / no movies loading
- Ensure `frontend/.env` exists and Vite was restarted.
- Use either `VITE_TMDB_API_KEY` or `VITE_TMDB_BEARER`.

Cannot reach database (ETIMEDOUT)
- Check RDS “Publicly accessible” and Security Group inbound 3306 from your IP.
- Some networks block outbound 3306 — use an SSH tunnel via EC2 or switch networks.
- Use the debug endpoints: `/api/debug/dns`, `/api/debug/tcp`, `/api/debug/db`.

CORS/auth issues
- Confirm `CORS_ORIGIN` matches your frontend origin, and that the frontend sends `credentials: 'include'` for session routes.

Vite env not applied
- `.env` must live in `frontend/.env` (not under `src/`). Restart Vite after changes.


## 📄 License

MIT — feel free to use and adapt.


## 👥 Credits

- TMDB for the movie data and images.
- Contributors: Sunmyung Woo (and others).