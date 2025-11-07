import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api/axios';

import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import MyPage from './components/MyPage';
import SearchResult from './components/SearchResult';
import MovieDetail from './components/MovieDetail'; // ✅ IMPORT ADDED

function Layout({ user, setUser }) {
  return (
    <>
      <NavBar user={user} setUser={setUser} />
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
  // JWT bootstrap: if token exists, verify it and fetch user

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }
        const { data } = await api.get('/auth/me');
        const u = data?.user || data; // tolerate {user} or user
        if (u) {
          setUser(u);
        } else {
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
          console.error('Auth bootstrap failed', err);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} setUser={setUser} />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login setUser={setUser} />} />
        <Route path="signup" element={<Signup setUser={setUser} />} />
        <Route path="search" element={<SearchResult />} />
        <Route path="mypage" element={<MyPage user={user} setUser={setUser} />} />
        <Route path="movie/:id" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
}
