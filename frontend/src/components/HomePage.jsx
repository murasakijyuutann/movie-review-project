import { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from "./MovieCard";
import axios from 'axios';

export default function HomePage({ logoutMsg }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const observer = useRef();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const bearer = import.meta.env.VITE_TMDB_BEARER;

  useEffect(() => {
    const fetchMovies = () => {
      setLoading(true);
      axios
        .get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            ...(bearer ? {} : { api_key: apiKey }),
            language: 'en-EN',
            page: page,
          },
          headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined,
        })
        .then((response) => {
          setMovies((prev) => [...prev, ...response.data.results]);
        })
        .catch((error) => {
          console.error('Error fetching movies:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchMovies();
  }, [apiKey, bearer, page]);

  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-gray-900 text-white px-6 py-10 space-y-10 font-sans relative overflow-hidden">

      {/* Twinkling Stars Background (optional add your own effects or images too) */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none z-0 animate-pulse" />

      <h1 className="relative text-4xl font-bold text-center text-indigo-300 tracking-widest drop-shadow-[0_0_10px_rgba(99,102,241,0.6)] z-10 animate-fade-in-up">
        ✨ Movie Explorer ✨
      </h1>

      {logoutMsg && (
        <div className="relative mb-4 p-4 bg-yellow-500/20 text-yellow-200 rounded-lg z-10 animate-fade-in">
          {logoutMsg}
        </div>
      )}

      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-10">
        {movies.map((movie, index) => {
          const card = (
            <MovieCard
              id={movie.id}
              key={movie.id}
              original_title={movie.original_title}
              posterPath={movie.poster_path}
              vote_average={movie.vote_average}
              vote_count={movie.vote_count}
            />
          );

          return index === movies.length - 1 ? (
            <div ref={lastMovieRef} key={movie.id}>
              {card}
            </div>
          ) : (
            card
          );
        })}
      </div>

      {loading && (
        <div className="text-center text-indigo-400 mt-10 animate-pulse z-10 relative">
          Fetching more stars from the galaxy...
        </div>
      )}

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-full shadow-xl z-50 animate-fade-in transition-opacity"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}
