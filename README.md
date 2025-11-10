# React Movie Review

**A modern movie discovery application built with React 19 and The Movie Database (TMDB) API**

[![React](https://img.shields.io/badge/React-19.1.0-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live Demo:** [https://movie-review-project-tau.vercel.app/]
**Repository:** [github.com/murasakijyuutann/react-movie-review](https://github.com/murasakijyuutann/react-movie-review)

---

## Overview

React Movie Review is a responsive web application that enables users to discover, search, and explore detailed information about movies from The Movie Database's collection of over 1 million titles. Built as a modern React frontend showcase, the application demonstrates current best practices in component architecture, state management, performance optimization, and third-party API integration.

**Key Technologies:** React 19, Vite, React Router, Tailwind CSS, Axios, TMDB API v3

---

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

---

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- TMDB API key ([obtain here](https://www.themoviedb.org/settings/api))

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/murasakijyuutann/react-movie-review.git
cd react-movie-review/frontend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file in the frontend directory with:
# VITE_TMDB_API_KEY=your_api_key_here

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Features

### Core Functionality

- **Movie Discovery**: Browse trending and popular movies with infinite scroll pagination
- **Advanced Search**: Real-time search with debouncing across the complete TMDB catalog
- **Detailed Information**: Comprehensive movie pages displaying cast, genres, ratings, synopsis, and high-resolution imagery
- **Responsive Design**: Mobile-first architecture optimized for all screen sizes
- **Performance Optimized**: Efficient rendering utilizing React 19's concurrent features and Vite's build optimizations

---

## Technical Architecture

### Frontend Implementation

This application demonstrates production-ready React development patterns:

#### React 19 Integration
- Concurrent rendering for improved user experience
- Automatic batching for optimized state updates
- Modern hooks architecture (useState, useEffect, useCallback, useMemo)

#### Custom Hooks Architecture
- Reusable hooks for API integration, infinite scroll, and debounced search
- Separation of concerns between business logic and presentation
- Type-safe hook interfaces

#### Component Design
- Clear distinction between presentational and container components
- Composable, maintainable component hierarchy
- Modular architecture for scalability

#### Styling Strategy
- Tailwind CSS utility-first approach for rapid development
- Consistent design system implementation
- Responsive breakpoint management for mobile-first design

#### API Integration
- Centralized Axios instance with interceptors
- Comprehensive error handling and retry logic
- Request/response transformation middleware

### Key Technical Solutions

#### Infinite Scroll Implementation
- Intersection Observer API for performance-efficient scroll detection
- Dynamic content loading with skeleton loading states
- Memory-efficient pagination management

#### Search Optimization
- Debounced input handling to minimize API requests
- Loading and error state management
- Optimized re-rendering with React memoization

#### Image Optimization
- Lazy loading with Intersection Observer
- TMDB CDN integration with multiple resolution support
- Fallback image handling for missing assets

#### Client-Side Routing
- React Router v7 for seamless SPA navigation
- Code splitting for optimized bundle sizes
- Browser history API integration

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI framework with hooks and concurrent rendering |
| **Vite** | 7.0.4 | Build tool and dev server with HMR |
| **React Router** | 7.7.1 | Client-side routing and navigation |
| **Tailwind CSS** | 4.1.11 | Utility-first CSS framework |
| **Axios** | 1.11.0 | HTTP client for TMDB API integration |
| **TMDB API** | v3 | Movie database with 1M+ titles |

### Development Tools
- **ESLint** 9.30.1 - Code linting and style enforcement
- **Git** - Version control

---

## Project Structure

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

---

## Configuration

### TMDB API Setup

#### 1. Obtain API Key

- Create an account at [TMDB](https://www.themoviedb.org/signup)
- Navigate to **Settings → API**
- Request an API key (select "Developer" option)
- Copy your API Read Access Token (v3 auth)

#### 2. Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_TMDB_API_KEY=your_tmdb_v3_api_key_here
```

**Security Note:** Never commit the `.env` file to version control. Ensure it is listed in `.gitignore`.

#### 3. Start Development

```bash
npm run dev
```

### API Usage Information

- The application makes direct API calls to TMDB (no backend proxy required)
- Free tier provides 50 requests/second
- Images are served via TMDB CDN: `https://image.tmdb.org/t/p/w500/`
- API documentation: [TMDB API Docs](https://developers.themoviedb.org/3)

---

## Development

### Local Development Commands

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev  # Available at http://localhost:5173

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint
```

### Development Workflow

1. Make changes to source files in `src/`
2. View changes instantly with Vite's Hot Module Replacement (HMR)
3. Run ESLint to ensure code quality
4. Test production build with `npm run preview` before deployment

---

## Deployment

### Supported Platforms

This application can be deployed to any static hosting service.

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

**Environment Variables:** Add `VITE_TMDB_API_KEY` in Vercel project settings.

#### Netlify

```bash
npm run build
# Upload the dist/ folder to Netlify
```

**Environment Variables:** Add `VITE_TMDB_API_KEY` in Netlify site settings.

#### GitHub Pages / Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:** Configure `VITE_TMDB_API_KEY` in platform settings

### Deployment Checklist

- [ ] Set `VITE_TMDB_API_KEY` environment variable
- [ ] Configure build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Test production build locally before deploying
- [ ] Verify API key validity and rate limits

---

## Future Enhancements

The project architecture supports expansion to full-stack capabilities:

### Planned Features

- **User Authentication**: JWT-based authentication with secure password hashing (bcrypt)
- **Favorites System**: Personal movie collections with CRUD operations
- **Review System**: User-generated reviews with rating functionality
- **User Profiles**: Account management and activity tracking
- **Social Features**: Follow users, share reviews, and create watchlists

**Note:** Backend infrastructure (serverless functions with MySQL) exists in the `/api` directory and can be deployed once database infrastructure is provisioned.

---

## Troubleshooting

### TMDB API Issues

#### Movies not loading (401 Unauthorized)

**Solutions:**
- Verify `VITE_TMDB_API_KEY` is correctly set in `frontend/.env`
- Restart the Vite dev server after modifying `.env`
- Confirm API key validity at [TMDB API Settings](https://www.themoviedb.org/settings/api)
- Check that rate limits (50 req/sec) are not exceeded

#### Images not displaying

**Solution:** Check browser console for CORS errors. TMDB images are served from `image.tmdb.org` and should load without CORS issues. Verify network connectivity and CDN availability.

### Build/Deployment Issues

#### Build fails or app malfunctions after deployment

**Solutions:**
- Verify `VITE_TMDB_API_KEY` is set in deployment platform environment variables
- Review build output for errors: `npm run build`
- Test production build locally: `npm run preview`
- Ensure all dependencies are listed in `package.json` dependencies (not devDependencies for production builds)
- Clear build cache and rebuild: `rm -rf dist node_modules && npm install && npm run build`

### Common Development Issues

#### Hot Module Replacement (HMR) not working

**Solution:** Restart the Vite dev server. Check for syntax errors in recently modified files.

#### Tailwind styles not applying

**Solution:** Verify Tailwind configuration in `tailwind.config.js` and ensure CSS is imported in `main.jsx`.

---

## Best Practices Demonstrated

This project implements industry-standard development practices:

- **Security**: Environment variable management for sensitive API keys
- **Architecture**: Component-based architecture for maintainability and scalability
- **Design**: Mobile-first responsive design patterns
- **Performance**: Debouncing, lazy loading, code splitting, and memoization
- **Code Quality**: ESLint integration, consistent formatting, and clear documentation
- **Version Control**: Git workflow with meaningful commits
- **API Integration**: Error handling, loading states, and retry logic

---

## License

MIT License - Copyright (c) 2025 Sunmyung Woo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Contact

**Sunmyung Woo**

- GitHub: [@murasakijyuutann](https://github.com/murasakijyuutann)
- Email: fishyboyxx@protonmail.com
- Project Repository: [github.com/murasakijyuutann/react-movie-review](https://github.com/murasakijyuutann/react-movie-review)

---

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) - Comprehensive movie data API
- [Vercel](https://vercel.com/) - Serverless deployment platform
- [AWS RDS](https://aws.amazon.com/rds/) - Managed MySQL hosting for future backend features
- [React Team](https://react.dev/) - React 19 framework and documentation
- [Vite Team](https://vitejs.dev/) - Next-generation frontend tooling
