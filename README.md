# 🎬 React Movie Review

> **Modern movie discovery application built with React 19 and TMDB API**

A frontend showcase demonstrating modern React development: concurrent rendering, custom hooks, responsive design with Tailwind CSS, and external API integration. Browse and search through 1M+ movies from The Movie Database with a clean, mobile-first interface.

**🔗 Live Demo:** *(Deploy and add URL here)*
**💻 Tech Stack:** React 19 · Vite · React Router · Tailwind CSS · Axios · TMDB API
**👤 Developer:** Sunmyung Woo

---

## 🎯 Quick Start

```bash
git clone https://github.com/murasakijyuutann/react-movie-review.git
cd react-movie-review/frontend
npm install

# Get free API key: https://www.themoviedb.org/settings/api
# Create .env file
echo "VITE_TMDB_API_KEY=your_api_key_here" > .env

npm run dev  # Starts at http://localhost:5173
```

---


## ✨ Features

- **🎬 Movie Discovery** — Browse trending and popular movies with smooth infinite scroll pagination
- **🔍 Real-time Search** — Find movies instantly as you type with debounced search across 1M+ titles
- **📖 Detailed Movie Pages** — Rich information including cast, genres, ratings, synopsis, and high-quality posters
- **📱 Responsive Design** — Mobile-first UI that adapts seamlessly from phone to desktop
- **⚡ Fast Performance** — Optimized React rendering with Vite's lightning-fast HMR during development

## 🏗️ Frontend Architecture

**What I Learned Building This:** This project demonstrates modern React patterns and best practices:

- **React 19 Features** — Leveraged concurrent rendering and automatic batching for smooth UI updates
- **Custom Hooks** — Built reusable hooks for API calls, infinite scroll, and debounced search
- **Component Architecture** — Organized components for reusability and maintainability (presentational vs container patterns)
- **Tailwind CSS** — Utility-first styling for rapid UI development and consistent design system
- **API Integration** — Axios instance configuration with interceptors and error handling for TMDB API

### Key Frontend Challenges Solved

1. **Infinite Scroll** — Implemented intersection observer pattern to load movies dynamically as user scrolls
2. **Search Debouncing** — Optimized search performance to reduce API calls while maintaining responsive UX
3. **Image Loading** — Handled TMDB CDN integration with fallback images and lazy loading
4. **Routing** — Client-side navigation with React Router for seamless single-page app experience
5. **State Management** — Managed complex UI state across components without external state library


## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI framework with hooks and concurrent rendering |
| **Vite** | 7.0.4 | Build tool and dev server with HMR |
| **React Router** | 7.7.1 | Client-side routing and navigation |
| **Tailwind CSS** | 4.1.11 | Utility-first CSS framework |
| **Axios** | 1.11.0 | HTTP client for TMDB API integration |
| **TMDB API** | v3 | Movie database with 1M+ titles |

### Development Tools
- **ESLint** 9.30.1 — Code linting and style enforcement
- **Git** — Version control


## 📁 Project Structure

```
react-movie-review/frontend/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx         # Landing page with trending movies
│   │   ├── MovieDetail.jsx      # Detailed movie information page
│   │   ├── SearchResult.jsx     # Search results with filtering
│   │   ├── NavBar.jsx           # Navigation component
│   │   └── ...                  # Additional UI components
│   ├── api/
│   │   └── axios.ts             # Axios instance configuration for TMDB
│   ├── App.jsx                  # Root component with routing
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global Tailwind styles
├── public/                      # Static assets
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
└── .env                         # TMDB API key (not committed)
```


## ⚙️ Configuration

### TMDB API Setup

1. **Get a free API key:**
   - Create account at [TMDB](https://www.themoviedb.org/signup)
   - Navigate to Settings → API
   - Request API key (choose "Developer" option)

2. **Create `.env` file in `frontend/` directory:**

```env
VITE_TMDB_API_KEY=your_tmdb_v3_api_key_here
```

3. **Start developing:**

```bash
npm run dev
```

### API Usage Notes

- Frontend makes direct API calls to TMDB (no backend proxy needed)
- Free tier includes 50 requests/second
- Images served via TMDB CDN: `https://image.tmdb.org/t/p/w500/`
- ⚠️ Never commit your `.env` file — add it to `.gitignore`


## 📸 Screenshots

*(Add screenshots of your application here to show the UI)*

---

## 🚀 Development

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher

### Local Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev  # http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

This project is ready to deploy on any static hosting platform:

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel --prod
```

**Netlify:**
```bash
npm run build
# Drag and drop `dist/` folder to Netlify
```

**GitHub Pages / Cloudflare Pages:**
- Build command: `npm run build`
- Output directory: `dist`

Don't forget to add `VITE_TMDB_API_KEY` as an environment variable in your deployment platform settings!


## 🎯 Future Enhancements

This project has a backend foundation in place for future full-stack features:

- **User Authentication** — JWT-based auth with bcrypt password hashing
- **Favorites System** — Save movies to personal collections
- **Review System** — Write and share movie reviews with ratings
- **User Profiles** — Account management and activity tracking

The backend code (serverless functions with MySQL) exists in the `/api` directory and can be deployed when database infrastructure is set up.


## 🔧 Troubleshooting

### TMDB API Issues

**Problem:** Movies not loading, 401 Unauthorized

**Solutions:**
- ✅ Verify `VITE_TMDB_API_KEY` is set in `frontend/.env`
- ✅ Restart Vite dev server after changing `.env`
- ✅ Check API key validity at [TMDB API Settings](https://www.themoviedb.org/settings/api)
- ✅ Ensure you're not exceeding rate limits (50 req/sec)

**Problem:** Images not displaying

**Solution:** Check browser console for CORS errors. TMDB images load from `image.tmdb.org`

---

### Build/Deployment Issues

**Problem:** Build fails or app doesn't work after deployment

**Solutions:**
- ✅ Verify environment variable `VITE_TMDB_API_KEY` is set in deployment platform
- ✅ Check build output for errors: `npm run build`
- ✅ Test production build locally: `npm run preview`
- ✅ Ensure all dependencies are in `package.json`, not just devDependencies

---

## 🔒 Best Practices

This project demonstrates:
- ✅ Environment variable management for API keys
- ✅ Component-based architecture for maintainability
- ✅ Responsive design patterns
- ✅ Performance optimization (debouncing, lazy loading)
- ✅ Clean code practices and ESLint integration

---

## 📄 License

MIT License - Copyright (c) 2025 Sunmyung Woo

---

## 📞 Contact

**Sunmyung Woo** — [GitHub](https://github.com/murasakijyuutann) · [Email](mailto:fishyboyxx@protonmail.com)

Project Link: [https://github.com/murasakijyuutanne/react-movie-review](https://github.com/murasakijyuutann/react-movie-review)

---

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for comprehensive movie data API
- [Vercel](https://vercel.com/) for serverless deployment platform
- [AWS RDS](https://aws.amazon.com/rds/) for managed MySQL hosting