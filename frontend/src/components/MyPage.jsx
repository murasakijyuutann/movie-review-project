import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPage({ user }) {
  const [profile, setProfile] = useState({ id: user.id, name: user.name || '', email: user.email || '' });
  const [favs, setFavs] = useState([]);
  const [visible, setVisible] = useState(4);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwdBusy, setPwdBusy] = useState(false);
  const navigate = useNavigate();
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${base}/api/users/${user.id}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile({ id: data.id, name: data.name, email: data.email });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const res = await fetch(`${base}/api/users/${user.id}/favorites`);
        if (res.ok) {
          const data = await res.json();
          setFavs(data);
          setVisible(Math.min(4, data.length));
        }
      } catch {}
    })();
  }, [user?.id]);

  const removeFav = async (movieId) => {
    try {
      const res = await fetch(`${base}/api/users/${profile.id}/favorites/${movieId}`, { method: 'DELETE' });
      if (res.ok) {
        setFavs((prev) => {
          const next = prev.filter((f) => f.movieId !== String(movieId));
          setVisible((v) => Math.min(v, next.length));
          return next;
        });
      }
    } catch {}
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      const res = await fetch(`${base}/api/users/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data?.message || 'Update failed');
        return;
      }
      setMsg('✅ Profile updated');
      setProfile({ id: data.user.id, name: data.user.name, email: data.user.email });
    } catch (e) {
      setErr('Network error');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (pwd.newPassword.length < 6) return setErr('New password must be at least 6 characters');
    if (pwd.newPassword !== pwd.confirm) return setErr('New password and confirm do not match');

    try {
      setPwdBusy(true);
      const res = await fetch(`${base}/api/users/${profile.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setErr(data?.message || 'Password change failed');
      setMsg('✅ Password updated');
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) {
      setErr('Network error');
    } finally {
      setPwdBusy(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${base}/api/auth/logout`, { credentials: 'include' });
    } catch {}
    navigate('/login');
  };

  if (!user) return null;
  if (loading) return <div className="text-white p-6">Loading…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-6">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-full max-w-2xl shadow-lg border border-indigo-400/30 space-y-8">
        <h2 className="text-2xl font-bold text-indigo-200">My Page</h2>

        {(err || msg) && (
          <div className={`p-3 rounded ${err ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {err || msg}
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg transition font-semibold">
              Save Profile
            </button>
            <button type="button" onClick={logout} className="px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
              Logout
            </button>
          </div>
        </form>

        <form onSubmit={changePassword} className="space-y-4">
          <h3 className="text-lg text-indigo-200 font-semibold">Change password</h3>
          <input
            type="password"
            placeholder="Current password"
            value={pwd.currentPassword}
            onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={pwd.newPassword}
            onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={pwd.confirm}
            onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            disabled={pwdBusy}
            className={`w-full text-white py-3 rounded-lg transition font-semibold ${pwdBusy ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
          >
            {pwdBusy ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="text-lg text-indigo-200 font-semibold">My favorites</h3>
          {favs.length === 0 ? (
            <p className="text-white/70">No favorites yet. Go to a movie page and click “Save to Favorites”.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favs.slice(0, visible).map((f) => (
                  <div
                    key={f.movieId}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/movie/${f.movieId}`)}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/movie/${f.movieId}`)}
                    className="bg-white/10 rounded-lg overflow-hidden shadow border border-white/10 hover:border-indigo-400/50 cursor-pointer group"
                    title={`Open ${f.title}`}
                  >
                    {f.posterUrl ? (
                      <img
                        src={f.posterUrl}
                        alt={f.title}
                        className="w-full h-44 object-cover group-hover:opacity-90"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-44 flex items-center justify-center text-white/60">
                        No image
                      </div>
                    )}

                    <div className="p-3">
                      <div className="text-white font-semibold line-clamp-2 group-hover:underline">{f.title}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFav(f.movieId); }}
                        className="mt-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                {visible < favs.length && (
                  <button
                    onClick={() => setVisible((v) => Math.min(v + 4, favs.length))}
                    className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 font-semibold"
                  >
                    Show more ({favs.length - visible})
                  </button>
                )}
                {favs.length > 4 && visible >= Math.min(favs.length, 4) && (
                  <button
                    onClick={() => setVisible(4)}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                  >
                    Show less
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
