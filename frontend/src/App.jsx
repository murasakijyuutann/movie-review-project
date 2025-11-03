import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import MyPage from './components/MyPage';
import SearchResult from './components/SearchResult';
import MovieDetail from './components/MovieDetail'; // ✅ IMPORT ADDED

function Layout({ user }) {
  return (
    <>
      <NavBar user={user} />
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-gray-900 text-white pt-24 p-8">
        <Outlet />
      </div>
    </>
  );
}


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_ROOT = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_ROOT}/api/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);

          // ✅ Redirect to /mypage only if URL has auth-related hash (optional)
          const isFromGoogleLogin = document.referrer.includes('accounts.google.com') ||
                                    window.location.search.includes('code=');
          if (isFromGoogleLogin) {
            navigate('/mypage');
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, API_ROOT]);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login setUser={setUser} />} />
        <Route path="signup" element={<Signup />} />
        <Route path="search" element={<SearchResult />} />
        <Route path="mypage" element={<MyPage user={user} />} />
        <Route path="movie/:id" element={<MovieDetail />} /> {/* ✅ MISSING ROUTE ADDED */}
      </Route>
    </Routes>
  );
}
