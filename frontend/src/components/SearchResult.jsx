// src/components/SearchResult.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TMDB_BASE = 'https://api.themoviedb.org/3';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchResult() {
  const params = useQuery();
  const navigate = useNavigate();

  // Support both ?q= and ?query=
  const term = (params.get('q') || params.get('query') || '').trim();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page when term changes
  useEffect(() => setPage(1), [term]);

  useEffect(() => {
    setErr('');
    setResults([]);

    if (!term) return;

    const bearer = import.meta.env.VITE_TMDB_BEARER;
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    if (!bearer && !apiKey) {
      setErr('Missing TMDB credentials. Set VITE_TMDB_API_KEY or VITE_TMDB_BEARER in your .env.');
      return;
    }

    const controller = new AbortController();
    const headers = bearer ? { Authorization: `Bearer ${bearer}` } : {};
    const url = new URL(`${TMDB_BASE}/search/movie`);
    url.searchParams.set('query', term);
    url.searchParams.set('include_adult', 'false');
    url.searchParams.set('language', 'en-US');
    url.searchParams.set('page', String(page));
    if (!bearer && apiKey) url.searchParams.set('api_key', apiKey);

    setLoading(true);
    fetch(url, { headers, signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`TMDB error ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setResults(Array.isArray(data.results) ? data.results : []);
        setTotalPages(Math.max(1, Number(data.total_pages || 1)));
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setErr(e.message || 'Search failed');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [term, page]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    // keep the URL stable (?q=term) while paging
  };

  // If the user typed from the NavBar after landing here,
  // keep the search box in sync by updating the URL.
  const onNewSearch = (e) => {
    e.preventDefault();
    const next = new FormData(e.currentTarget).get('q')?.toString().trim() || '';
    if (!next) return;
    navigate(`/search?q=${encodeURIComponent(next)}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Inline search bar (optional convenience) */}
      <form onSubmit={onNewSearch} className="mb-6">
        <div className="relative">
          <input
            name="q"
            defaultValue={term}
            placeholder="Search movies…"
            className="w-full bg-white/10 text-white placeholder-white/60 rounded-lg pl-10 pr-28 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <svg className="absolute left-3 top-3.5 h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="7" strokeWidth="2"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
          </svg>
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-4 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
          >
            Search
          </button>
        </div>
      </form>

      {!term && (
        <div className="text-white/80">Type something to search for movies.</div>
      )}

      {term && loading && (
        <div className="text-white/80 animate-pulse">Searching “{term}”…</div>
      )}

      {term && err && (
        <div className="text-red-400">⚠ {err}</div>
      )}

      {term && !loading && !err && results.length === 0 && (
        <div className="text-white/80">No results for “{term}”. Try another keyword.</div>
      )}

      {/* Results grid */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((m) => (
          <Link
            key={`${m.id}-${m.release_date || ''}`}
            to={`/movie/${m.id}`}
            className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-indigo-400/50 transition"
          >
            {m.poster_path ? (
              <img
                alt={m.title}
                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                className="w-full h-72 object-cover group-hover:opacity-90"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-72 flex items-center justify-center text-white/50 bg-gradient-to-br from-gray-800/50 to-indigo-900/40">
                No image
              </div>
            )}
            <div className="p-3">
              <div className="text-white font-semibold line-clamp-2">{m.title || 'Untitled'}</div>
              <div className="text-white/60 text-sm mt-1">
                {m.release_date ? new Date(m.release_date).getFullYear() : '—'}
                {typeof m.vote_average === 'number' && (
                  <span className="ml-2">★ {m.vote_average.toFixed(1)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {term && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              page <= 1 ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Prev
          </button>
          <span className="text-white/80">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className={`px-4 py-2 rounded-lg font-semibold ${
              page >= totalPages ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
