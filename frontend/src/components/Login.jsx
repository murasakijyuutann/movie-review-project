import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await api.post('/auth/login', form);
      if (!data?.token || !data?.user) {
        setError('Login failed');
        return;
      }
      // persist token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // api instance reads token from localStorage via interceptor
      setUser?.(data.user);
      navigate('/mypage');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Network error';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   window.open(`/api/auth/google`, '_self');
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-xl w-full max-w-md shadow-lg space-y-6 border border-indigo-400/30"
      >
        <h2 className="text-2xl font-bold text-indigo-200 text-center">Sign In</h2>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white"
        />

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>

        {/* <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
        >
          Sign in with Google
        </button> */}
      </form>
    </div>
  );
}
