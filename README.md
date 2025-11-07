# 🎬 React Movie Review

> **A modern, full-stack movie discovery and review platform**

Explore trending movies, search the TMDB library, view detailed information, manage your favorites, and share reviews with the community. Built with modern web technologies including React 19, Vite, and serverless architecture.

---

## ⚠️ **Current Status**

> **🔧 Authentication System Under Maintenance**
> 
> Login and registration features are currently being upgraded to a serverless JWT-based architecture for improved scalability and security. During this transition period, authentication endpoints may be temporarily unavailable.
>
> **Expected Timeline:** Maintenance in progress  
> **Alternative Access:** Browse movies and view details without authentication

---


## ✨ Features

### Core Functionality
- 🎬 **Movie Discovery** — Browse trending and popular titles with infinite scroll
- 🔍 **Advanced Search** — Find movies by title with real-time results
- 📖 **Detailed Views** — Rich movie pages with posters, genres, ratings, cast, and synopsis
- ⭐ **User Favorites** — Save movies to your personal collection *(requires authentication)*
- ✍️ **Reviews & Ratings** — Write, edit, and delete reviews with custom ratings
- 🔐 **Secure Authentication** — JWT-based auth with email/password *(currently under maintenance)*
- 👤 **User Profiles** — Manage account settings, change passwords, view activity
- 🎨 **Modern UI** — Responsive design with Tailwind CSS and smooth animations

### Technical Highlights
- ⚡ **Lightning Fast** — Vite-powered development with Hot Module Replacement
- 🔒 **Secure** — JWT authentication, bcrypt password hashing, SQL injection protection
- 🌐 **Scalable** — Serverless architecture ready for Vercel deployment
- 📱 **Responsive** — Mobile-first design that works on all devices
- 🎯 **Type-Safe** — TypeScript integration for improved code quality


## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI framework with modern hooks and concurrent features |
| **Vite** | 7.0.4 | Next-generation build tool and dev server |
| **React Router** | 7.7.1 | Client-side routing and navigation |
| **Tailwind CSS** | 4.1.11 | Utility-first CSS framework |
| **Axios** | 1.11.0 | HTTP client with interceptors for JWT |

### Backend (Serverless)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime for serverless functions |
| **MySQL 2** | 3.11.0 | Database driver with connection pooling |
| **JWT** | 9.0.2 | JSON Web Tokens for stateless authentication |
| **bcrypt** | 5.1.1 | Password hashing with adaptive cost |

### Database & Infrastructure
| Component | Details |
|-----------|---------|
| **MySQL** | 8.0 on AWS RDS with TLS/SSL encryption |
| **Vercel** | Serverless deployment platform |
| **TMDB API** | The Movie Database API (v3) |

### Development Tools
- **ESLint** 9.30.1 — Code linting and style enforcement
- **dotenv** 17.2.1 — Environment variable management
- **Git** — Version control


## 📁 Project Structure

```
react-movie-review/
├── frontend/                      # Client-side React application
│   ├── api/                      # Serverless API functions (Vercel)
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login.js         # JWT login handler
│   │   │   ├── signup.js        # User registration
│   │   │   └── me.js            # Token verification
│   │   ├── users/               # User management
│   │   │   ├── [id].js          # Profile CRUD
│   │   │   └── [id]/
│   │   │       ├── password.js  # Password change
│   │   │       └── favorites/   # Favorites management
│   │   ├── movies/              # Movie-related endpoints
│   │   │   └── [movieId]/reviews.js
│   │   ├── reviews/             # Review CRUD
│   │   │   └── [id].js
│   │   ├── _db.js               # MySQL connection pool
│   │   ├── _auth.js             # JWT utilities & middleware
│   │   └── health.js            # Health check endpoint
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── HomePage.jsx     # Landing page with movie grid
│   │   │   ├── MovieDetail.jsx  # Movie detail view
│   │   │   ├── Login.jsx        # Login form
│   │   │   ├── Signup.jsx       # Registration form
│   │   │   ├── MyPage.jsx       # User profile dashboard
│   │   │   ├── NavBar.jsx       # Navigation bar
│   │   │   └── SearchResult.jsx # Search results page
│   │   ├── api/
│   │   │   └── axios.ts         # Axios instance with JWT interceptor
│   │   ├── App.jsx              # Root component with routing
│   │   ├── main.jsx             # Application entry point
│   │   └── index.css            # Global styles
│   ├── certs/                   # SSL certificates (AWS RDS CA bundle)
│   ├── public/                  # Static assets
│   ├── vite.config.js           # Vite configuration
│   ├── vercel.json              # Vercel deployment config
│   ├── package.json             # Frontend dependencies
│   └── .env                     # Frontend environment variables
│
├── server/                       # Legacy Express server (for reference)
│   └── server/
│       ├── index.js             # Express API (session-based)
│       ├── passport-setup.js    # OAuth configuration
│       └── .env                 # Server environment variables
│
└── README.md                    # This file
```


## ⚙️ Environment Configuration

### Frontend Environment Variables

Create `frontend/.env`:

```env
# TMDB API Configuration (required)
VITE_TMDB_API_KEY=your_tmdb_v3_api_key

# Optional: TMDB v4 Bearer Token (alternative to API key)
# VITE_TMDB_BEARER=eyJhbGciOi...

# API Base URL (for local development)
# Use /api for Vite proxy or full URL for direct connection
VITE_API_BASE_URL=/api
```

### Serverless Function Environment Variables

For **Vercel deployment**, configure these in the Vercel dashboard:

```env
# Database Configuration (AWS RDS MySQL)
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=movie_app

# SSL/TLS Configuration (required for AWS RDS)
DB_SSL=true
DB_SSL_CA_PATH=/var/task/certs/global-bundle.pem

# JWT Configuration (required)
JWT_SECRET=generate_long_random_string_here

# bcrypt Configuration
BCRYPT_ROUNDS=10
```

### Local Development Environment

For **local serverless testing** with Vercel CLI, create `frontend/.env.local`:

```env
# Copy all variables from above
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=movie_app
DB_SSL=true
# For local development, use absolute path to cert
DB_SSL_CA_PATH=C:/Users/your-path/react-movie-review/frontend/certs/global-bundle.pem
JWT_SECRET=your_jwt_secret
BCRYPT_ROUNDS=10
```

### Security Notes

- ⚠️ **Never commit `.env` or `.env.local` files** — they contain sensitive credentials
- ✅ Use `.env.example` files to document required variables without exposing secrets
- ✅ Rotate `JWT_SECRET` regularly in production
- ✅ Use strong, unique passwords for database access
- ✅ Restrict database access by IP whitelist in AWS RDS Security Groups


## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **MySQL** 8.0 (AWS RDS recommended)
- **TMDB API Key** — [Get one here](https://www.themoviedb.org/settings/api)
- **Vercel CLI** (optional, for local serverless testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/react-movie-review.git
   cd react-movie-review
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create frontend environment file
   cp .env.example .env
   # Edit .env and add your TMDB API key
   ```

4. **Set up the database**
   - Create MySQL database named `movie_app`
   - Run the schema SQL (see Database Schema section below)
   - Update database credentials in environment variables

### Local Development

#### Option A: Vite Dev Server (Frontend Only)

For frontend development without authentication:

```bash
cd frontend
npm run dev
```

Vite will start at `http://localhost:5173`

> **Note:** Authentication features won't work without the backend running

#### Option B: Full-Stack with Vercel Dev (Recommended)

For testing serverless functions locally:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Create local environment file
cp .env .env.local
# Edit .env.local and add database credentials

# Start Vercel dev server (runs serverless functions)
vercel dev
```

Vercel dev starts at `http://localhost:3000`

Then in a **separate terminal**, update `vite.config.js` to proxy to port 3000:

```javascript
proxy: {
  '/api': 'http://localhost:3000', // Vercel dev
}
```

And start Vite:

```bash
cd frontend
npm run dev
```

### Building for Production

```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`


## 🗄️ Database Schema

Run the following SQL to set up the required tables in MySQL:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id VARCHAR(32) NOT NULL,
  title VARCHAR(255) NULL,
  poster_url VARCHAR(512) NULL,
  overview TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_movie (user_id, movie_id),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id VARCHAR(32) NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  rating TINYINT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reviews_movie (movie_id),
  INDEX idx_reviews_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Database Notes

- **UTF-8 Support:** Uses `utf8mb4` for full Unicode support (emojis, international characters)
- **Indexes:** Optimized queries for user lookups, movie reviews, and favorites
- **Cascading Deletes:** Removing a user automatically deletes their favorites and reviews
- **Rating Validation:** Reviews support ratings from 1-10


## 🔌 API Documentation

### Authentication Endpoints

> ⚠️ **Currently Under Maintenance** — These endpoints are being upgraded

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/signup` | Create new user account | No |
| `POST` | `/api/auth/login` | Login with email/password | No |
| `GET` | `/api/auth/me` | Verify JWT and get current user | Yes |

**Request Example (Login):**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response Example:**
```json
{
  "message": "Logged in",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/:id` | Get user profile | Yes |
| `PUT` | `/api/users/:id` | Update name/email | Yes (own profile) |
| `PUT` | `/api/users/:id/password` | Change password | Yes (own profile) |
| `DELETE` | `/api/users/:id` | Delete account | Yes (own profile) |

---

### Favorites Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/:id/favorites` | Get user's favorite movies | Yes |
| `GET` | `/api/users/:id/favorites/:movieId` | Check if movie is favorited | Yes |
| `POST` | `/api/users/:id/favorites` | Add movie to favorites | Yes |
| `DELETE` | `/api/users/:id/favorites/:movieId` | Remove favorite | Yes |

**Request Example (Add Favorite):**
```json
POST /api/users/1/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "movieId": "550",
  "title": "Fight Club",
  "posterUrl": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "overview": "A ticking-time-bomb insomniac..."
}
```

---

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/movies/:movieId/reviews` | Get all reviews for a movie | No |
| `POST` | `/api/movies/:movieId/reviews` | Create new review | Yes |
| `PUT` | `/api/reviews/:id` | Update review | Yes (own review) |
| `DELETE` | `/api/reviews/:id` | Delete review | Yes (own review) |

**Request Example (Create Review):**
```json
POST /api/movies/550/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Amazing movie with a twist ending!",
  "rating": 9
}
```

---

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check & environment validation |

**Response Example:**
```json
{
  "ok": true,
  "env": {
    "hasDbHost": true,
    "hasJwtSecret": true,
    "dbSsl": "true"
  }
}
```


## 🎥 TMDB Integration

This application uses [The Movie Database (TMDB)](https://www.themoviedb.org/) API to fetch movie data, including:

- Trending and popular movies
- Movie details (title, poster, genres, cast, overview, ratings)
- Search functionality
- High-quality poster images

### Getting a TMDB API Key

1. Create a free account at [TMDB](https://www.themoviedb.org/signup)
2. Navigate to Settings → API
3. Request an API key (choose "Developer" option)
4. Add your API key to `frontend/.env`:
   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   ```

### TMDB v4 Bearer Token (Optional)

Alternatively, you can use a TMDB v4 Bearer token:

```env
VITE_TMDB_BEARER=your_bearer_token_here
```

### Usage Notes

- Frontend components make direct calls to TMDB API
- No backend proxy for TMDB data (reduces server load)
- Rate limits: 50 requests per second (TMDB free tier)
- Images are served via TMDB CDN: `https://image.tmdb.org/t/p/w500/`


## 🚢 Deployment

### Vercel Deployment (Recommended)

This project is optimized for deployment on Vercel with serverless functions.

#### Prerequisites
- Vercel account ([sign up free](https://vercel.com/signup))
- GitHub repository with your code
- MySQL database (AWS RDS recommended)

#### Deployment Steps

1. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Root Directory**
   - In project settings → General
   - Set **Root Directory** to `frontend`
   - This ensures Vercel finds the `api/` folder with serverless functions

3. **Add Environment Variables**
   - Navigate to Settings → Environment Variables
   - Add the following for **Production** and **Preview**:
   
   ```env
   DB_HOST=your-rds-endpoint.rds.amazonaws.com
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=movie_app
   DB_SSL=true
   DB_SSL_CA_PATH=/var/task/certs/global-bundle.pem
   JWT_SECRET=generate_random_64_char_string
   BCRYPT_ROUNDS=10
   ```

4. **Generate JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

5. **Deploy**
   - Push to your main branch
   - Vercel automatically deploys
   - Check deployment logs for any errors

6. **Verify Deployment**
   - Visit `https://your-app.vercel.app/api/health`
   - Should return: `{ "ok": true, "env": { ... } }`

#### AWS RDS Configuration

For production database access:

1. **Security Group Settings**
   - Allow inbound MySQL (port 3306) from `0.0.0.0/0` (or Vercel IPs)
   - Enable "Publicly Accessible" for Vercel access

2. **SSL/TLS Configuration**
   - AWS RDS requires SSL by default
   - CA bundle is included at `frontend/certs/global-bundle.pem`
   - `vercel.json` bundles certs with functions

#### Post-Deployment

- Update `VITE_API_BASE_URL` in frontend env (if needed)
- Test authentication flow end-to-end
- Monitor Vercel function logs for errors
- Set up custom domain (optional)

### Alternative Deployment Options

- **Netlify:** Supports serverless functions (requires adapter)
- **Railway:** Full-stack deployment with persistent database
- **Traditional VPS:** Deploy frontend + Express server together


## 🔧 Troubleshooting

### Authentication Issues

**Problem:** Login/signup returns 404 or network error

> ⚠️ Authentication system is currently under maintenance. This is expected behavior during the upgrade period.

**Solution:** Wait for maintenance to complete, or test with local serverless functions using `vercel dev`

---

### TMDB API Issues

**Problem:** Movies not loading, 401 Unauthorized errors

**Solutions:**
- ✅ Verify `VITE_TMDB_API_KEY` is set in `frontend/.env`
- ✅ Restart Vite dev server after changing `.env`
- ✅ Check API key is valid at [TMDB API Settings](https://www.themoviedb.org/settings/api)
- ✅ Ensure you're not hitting rate limits (50 req/sec)

**Problem:** Images not displaying

**Solution:** Check browser console for CORS errors. TMDB images should load from `image.tmdb.org`

---

### Database Connection Issues

**Problem:** `ETIMEDOUT`, `ECONNREFUSED`, or connection errors

**Solutions:**
- ✅ Verify AWS RDS Security Group allows inbound port 3306
- ✅ Check "Publicly Accessible" is enabled (or use VPN/tunnel)
- ✅ Confirm database credentials in environment variables
- ✅ Test connection using MySQL client:
  ```bash
  mysql -h your-endpoint.rds.amazonaws.com -u root -p movie_app
  ```

**Problem:** SSL/TLS handshake errors

**Solutions:**
- ✅ Ensure `DB_SSL=true` is set
- ✅ Verify CA bundle path:
  - Local: absolute path to `global-bundle.pem`
  - Vercel: `/var/task/certs/global-bundle.pem`
- ✅ Check certificate file exists and is readable

---

### Vercel Deployment Issues

**Problem:** Functions returning 404 after deployment

**Solutions:**
- ✅ Verify Root Directory is set to `frontend` in Vercel project settings
- ✅ Check deployment logs for function detection
- ✅ Ensure `vercel.json` exists in `frontend/` directory
- ✅ Redeploy after changing settings

**Problem:** Environment variables not working

**Solutions:**
- ✅ Add variables in Vercel Dashboard → Settings → Environment Variables
- ✅ Set for both Production and Preview environments
- ✅ Redeploy after adding variables (not automatic)
- ✅ Test with `/api/health` endpoint to verify

**Problem:** Database connection works locally but not on Vercel

**Solutions:**
- ✅ AWS RDS Security Group must allow `0.0.0.0/0` or specific Vercel IPs
- ✅ RDS must be "Publicly Accessible" (or use VPC with Vercel Pro)
- ✅ Double-check `DB_HOST` doesn't include protocol (no `mysql://`)

---

### Local Development Issues

**Problem:** Vite shows "Failed to fetch" for API calls

**Solutions:**
- ✅ Check Vite proxy configuration in `vite.config.js`
- ✅ Ensure backend is running (Express or `vercel dev`)
- ✅ Verify `VITE_API_BASE_URL` matches proxy target
- ✅ Check browser console for CORS errors

**Problem:** `vercel dev` fails to start

**Solutions:**
- ✅ Run `npm i -g vercel` to install/update CLI
- ✅ Ensure `.env.local` exists with database credentials
- ✅ Check port 3000 isn't already in use
- ✅ Try `vercel dev --listen 3001` for different port

---

### General Tips

- 📝 Check browser DevTools console for client-side errors
- 📝 Check Vercel function logs for server-side errors
- 📝 Use `/api/health` endpoint to verify environment configuration
- 📝 Test API endpoints with Postman or curl before debugging frontend
- 📝 Clear browser localStorage if auth state seems stuck: `localStorage.clear()`


## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of changes"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Code Standards

- Follow existing code style and conventions
- Write descriptive commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

### Reporting Issues

- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide error messages and screenshots
- Mention your environment (OS, Node version, etc.)

---

## 🔒 Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please **do not** open a public issue. Instead:

- Email security concerns to your-email@example.com
- Provide detailed information about the vulnerability
- Allow time for a fix before public disclosure

### Security Best Practices

This project implements:
- ✅ JWT-based authentication with secure token storage
- ✅ bcrypt password hashing with adaptive cost factor
- ✅ SQL injection prevention via parameterized queries
- ✅ Environment variable isolation for secrets
- ✅ TLS/SSL encryption for database connections
- ✅ Input validation and sanitization

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 React Movie Review Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Authors & Acknowledgments

### Development Team
- **Sunmyung Woo** — Lead Developer & Project Maintainer

### Special Thanks
- **The Movie Database (TMDB)** — For providing comprehensive movie data and imagery
- **Vercel** — For serverless deployment platform and infrastructure
- **AWS** — For RDS MySQL hosting
- **React Team** — For the amazing frontend library
- **Tailwind CSS** — For the utility-first CSS framework

### Open Source Libraries

This project wouldn't be possible without these excellent open-source libraries:
- React, React Router, Vite
- Axios, JWT, bcrypt
- Tailwind CSS, React Icons
- MySQL2, and many more

---

## 📞 Support & Contact

- **Documentation:** You're reading it! 📖
- **Issues:** [GitHub Issues](https://github.com/your-username/react-movie-review/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/react-movie-review/discussions)
- **Email:** your-email@example.com

---

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ Core movie browsing and search
- ✅ User authentication (JWT-based)
- ✅ Favorites management
- ✅ Review system with ratings
- ✅ Responsive UI with Tailwind
- ✅ Serverless deployment ready

### Planned Features (v1.1)
- 🔄 Social features (follow users, share reviews)
- 🔄 Advanced search filters (genre, year, rating)
- 🔄 Watchlist functionality
- 🔄 Email verification for new accounts
- 🔄 Password reset via email
- 🔄 Review upvoting/downvoting
- 🔄 User profile avatars

### Future Considerations (v2.0)
- 💭 Real-time notifications
- 💭 Movie recommendations based on favorites
- 💭 Discussion forums per movie
- 💭 Integration with streaming services
- 💭 Mobile app (React Native)
- 💭 AI-powered review summaries

---

## ⭐ Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🍴 Forking for your own projects
- 🐛 Reporting bugs or suggesting features
- 💬 Sharing with others who might find it helpful

---

<div align="center">

**Made with ❤️ by the React Movie Review Team**

[Report Bug](https://github.com/your-username/react-movie-review/issues) · 
[Request Feature](https://github.com/your-username/react-movie-review/issues) · 
[Documentation](https://github.com/your-username/react-movie-review)

</div>