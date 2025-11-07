// src/components/NavBar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  // Keep URL-driven state like search only; auth state comes from props

  const logout = async () => {
    // Stateless JWT logout: clear client-side token and user
  try { localStorage.removeItem('token'); } catch { /* ignore */ }
  try { localStorage.removeItem('user'); } catch { /* ignore */ }
    setUser?.(null);
    navigate('/login');
  };

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}&query=${encodeURIComponent(term)}`);
    setQ('');
  };

  const linkBase = 'px-4 py-2 rounded-lg font-semibold transition hover:opacity-90';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-indigo-950 to-black border-b border-white/10 shadow-lg">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-3">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-indigo-300 hover:text-indigo-400 flex items-center gap-1">
          🎬 <span className="drop-shadow">MovieApp</span>
        </Link>

        {/* Left links */}
        <div className="hidden sm:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-300 hover:bg-indigo-800'}`
            }
          >
            Home
          </NavLink>
        </div>

        {/* Center: Search box */}
        <form onSubmit={onSearch} className="flex-1 mx-2">
          <div className="relative max-w-xl mx-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies…"
              className="w-full bg-indigo-900/60 text-indigo-100 placeholder-indigo-400 rounded-lg pl-10 pr-24 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 opacity-70 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="2"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
            </svg>
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right: Auth-aware links */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink
                to="/mypage"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`
                }
              >
                My Page
              </NavLink>
              <button
                onClick={logout}
                className={`${linkBase} bg-gray-600 text-white`}
                title={`Logout ${user?.name || ''}`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`
                }
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-indigo-300 border border-indigo-400 hover:bg-indigo-800'
                  }`
                }
              >
                Log In
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
