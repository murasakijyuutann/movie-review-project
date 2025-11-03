import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const movieId = String(id);
  const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editBusy, setEditBusy] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error('Missing ID from URL');
      return;
    }

    const fetchMovieDetail = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: { api_key: apiKey, language: 'en-US' }, // ✅ FIXED
        });
        setMovie(res.data);
        setNotFound(false);
      } catch (error) {
        console.error('Movie not found or error fetching:', error);
        setNotFound(true);
      }
    };

    fetchMovieDetail();
  }, [id, apiKey]);

  useEffect(() => {
    if (!user) return;
    fetch(`${base}/api/users/${user.id}/favorites/${movieId}`)
      .then((r) => r.json())
      .then((d) => setSaved(!!d.saved))
      .catch(() => {});
  }, [movieId, user?.id]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${base}/api/movies/${movieId}/reviews`);
        if (r.ok) setReviews(await r.json());
      } catch {
        /* ignore */
      }
    })();
  }, [movieId]);

  const toggleFavorite = async () => {
    if (!user) {
      const go = window.confirm('Log in to save favorites?');
      if (go) navigate('/login');
      return;
    }

    if (saved) {
      await fetch(`${base}/api/users/${user.id}/favorites/${movieId}`, { method: 'DELETE' });
      setSaved(false);
    } else {
      await fetch(`${base}/api/users/${user.id}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          title: movie?.title || movie?.name || 'Untitled',
          posterUrl: movie?.poster_path ? `${TMDB_IMG}${movie.poster_path}` : null,
          overview: movie?.overview || null,
        }),
      });
      setSaved(true);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      if (window.confirm('ログインしてレビューを書きますか？')) navigate('/login');
      return;
    }
    if (!content.trim()) return;

    try {
      setBusy(true);
      const r = await fetch(`${base}/api/movies/${movieId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          content: content.trim(),
          rating: rating ? Number(rating) : null,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        alert(data?.message || 'Failed to submit review');
        return;
      }
      setReviews((prev) => [data, ...prev]);
      setContent('');
      setRating(0);
    } catch {
      alert('Network error');
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setEditContent(r.content);
    setEditRating(r.rating || 0);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditContent('');
    setEditRating(0);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!user || !editId || !editContent.trim()) return;

    try {
      setEditBusy(true);
      const r = await fetch(`${base}/api/reviews/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          content: editContent.trim(),
          rating: editRating ? Number(editRating) : null,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        alert(data?.message || 'Failed to update review');
        return;
      }
      setReviews((prev) => prev.map((x) => (x.id === editId ? { ...x, ...data } : x)));
      cancelEdit();
    } catch {
      alert('Network error');
    } finally {
      setEditBusy(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!user || !window.confirm('このレビューを削除しますか？')) return;

    try {
      const r = await fetch(`${base}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        alert(data?.message || 'Failed to delete');
        return;
      }
      setReviews((prev) => prev.filter((x) => x.id !== reviewId));
    } catch {
      alert('Network error');
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white p-8 text-xl">
        🎬 Movie with that ID does not exist.
      </div>
    );
  }

  if (!movie) return <div className="text-white p-4">Loading...</div>;

  const { title, poster_path, genres = [], vote_average, overview } = movie;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white p-8 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <img
          src={poster_path ? `${TMDB_IMG}${poster_path}` : '/fallback.jpg'}
          alt={title}
          className="w-full max-w-md mx-auto rounded-lg shadow-2xl ring-2 ring-indigo-400/50 transition-transform hover:scale-105 duration-300"
        />
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-4xl font-extrabold tracking-wide text-indigo-300 drop-shadow-[0_1px_5px_rgba(99,102,241,0.8)]">
            {title}
          </div>
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              saved ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white`}
          >
            {saved ? 'Saved ★' : 'Save to Favorites ☆'}
          </button>
          <div className="text-indigo-100 text-sm tracking-wide uppercase">
            {genres.map((g) => g.name).join(' • ')}
          </div>
          <p className="text-yellow-300 font-semibold text-lg">⭐ {vote_average} / 10</p>
          <p className="text-gray-200 leading-relaxed border-l-4 border-indigo-500 pl-4 italic">{overview}</p>
        </div>
      </div>

      {user ? (
        <form onSubmit={submitReview} className="mt-6 space-y-3 bg-white/10 p-4 rounded-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="この映画の感想を書いてください…"
            className="w-full bg-white/20 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={3}
            maxLength={2000}
            required
          />
          <div className="flex items-center gap-3">
            <label className="text-white/80">Rating (1–10):</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rating || ''}
              onChange={(e) => setRating(e.target.value)}
              className="w-20 bg-white/20 text-white p-2 rounded"
            />
            <button
              type="submit"
              disabled={busy}
              className={`ml-auto px-4 py-2 rounded-md font-semibold text-white ${
                busy ? 'bg-indigo-400' : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {busy ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 text-white/70">ログインするとレビューを書けます。</div>
      )}

      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold text-indigo-200">Reviews</h3>
        {reviews.length === 0 ? (
          <div className="text-white/70">No reviews yet.</div>
        ) : (
          reviews.map((r) => {
            const mine = user && r.userId === user.id;
            const isEditing = editId === r.id;

            return (
              <div key={r.id} className="bg-white/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold">{r.author}</div>
                  <div className="text-white/60 text-sm">
                    {r.rating ? `★ ${r.rating}` : ''}
                    <span className="ml-2">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                      {r.updatedAt && r.updatedAt !== r.createdAt ? ' · edited' : ''}
                    </span>
                  </div>
                </div>

                {!isEditing ? (
                  <p className="text-white/90 mt-2 whitespace-pre-wrap">{r.content}</p>
                ) : (
                  <form onSubmit={saveEdit} className="mt-3 space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-white/20 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      rows={3}
                      maxLength={2000}
                      required
                    />
                    <div className="flex items-center gap-3">
                      <label className="text-white/80">Rating (1–10):</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editRating || ''}
                        onChange={(e) => setEditRating(e.target.value)}
                        className="w-20 bg-white/20 text-white p-2 rounded"
                      />
                      <div className="ml-auto flex gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={editBusy}
                          className={`px-4 py-2 rounded font-semibold text-white ${
                            editBusy ? 'bg-indigo-400' : 'bg-indigo-500 hover:bg-indigo-600'
                          }`}
                        >
                          {editBusy ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {mine && !isEditing && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(r)}
                      className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteReview(r.id)}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
