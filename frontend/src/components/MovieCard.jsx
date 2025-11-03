import { Link } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './HomePage';

export default function MovieCard({ id, original_title, posterPath, vote_count, vote_average }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 500); // Reset after animation
  };

  return (
    <Link to={`/movie/${id}`} className="block" onClick={handleClick}>
      <div className={`bg-gradient-to-br from-amber-100 via-amber-200 to-rose-200
                      p-4 rounded-xl shadow-md border border-amber-300/40
                      transition-all duration-300 hover:scale-[1.04]
                      hover:ring-2 hover:ring-rose-400/40 hover:ring-offset-1
                      hover:shadow-[0_0_20px_4px_rgba(251,113,133,0.3)]
                      animate-${clicked ? 'gemflash' : 'none'} hover:animate-shimmer`}>

        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={original_title}
          className="w-full h-60 object-cover rounded-lg shadow-inner"
        />

        <h2 className="mt-3 text-lg font-bold text-rose-800 drop-shadow-[0_0_6px_rgba(190,18,60,0.4)]">
          {original_title}
        </h2>

        <p className="text-amber-800 text-sm font-medium">
          👍 {vote_count.toLocaleString()} &nbsp; ⭐ {vote_average}
        </p>
      </div>
    </Link>
  );
}
