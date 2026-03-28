import React from 'react';
import { Play, Calendar, BarChart3 } from 'lucide-react';

interface MovieCardProps {
  movie: any;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      className="flex-none w-[160px] md:w-[220px] lg:w-[260px] group cursor-pointer space-y-4" 
      onClick={onClick}
    >
      {/* Aspect Ratio 2:3 for the "Longer" look */}
      <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10 bg-[#141414] p-2 md:p-3 transition-all duration-500 hover:border-red-600/50">
        <img 
          src={movie.thumbnail} 
          className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] transition-transform duration-700 group-hover:scale-110" 
          alt={movie.title} 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
             <Play fill="white" size={20} />
           </div>
        </div>
      </div>

      <div className="px-1 space-y-2">
        <h3 className="font-bold text-[10px] md:text-sm truncate uppercase tracking-widest text-gray-200 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between bg-[#1A1A1A] p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/5">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar size={10} className="text-red-600" />
            <span className="text-[9px] md:text-[10px] font-bold">
              {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '2024'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <BarChart3 size={10} />
            <span className="text-[9px] md:text-[10px] font-bold">{movie.viewCount || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;