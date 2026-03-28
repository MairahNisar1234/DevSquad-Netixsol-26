import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCards';

interface MovieRowProps {
  title: string;
  items: any[];
  onMovieClick: (id: string) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, items, onMovieClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">{title}</h2>
        <div className="flex items-center gap-3 bg-[#141414] p-2 rounded-2xl border border-white/5">
           <button onClick={() => scroll('left')} className="p-2 text-gray-400 hover:bg-white/5 rounded-xl border border-white/5"><ChevronLeft size={18}/></button>
           <div className="w-8 h-1 bg-[#333] rounded-full overflow-hidden">
             <div className="w-1/2 h-full bg-red-600 rounded-full" />
           </div>
           <button onClick={() => scroll('right')} className="p-2 text-gray-400 hover:bg-white/5 rounded-xl border border-white/5"><ChevronRight size={18}/></button>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar scroll-smooth px-2">
        {items.map((movie) => (
          <MovieCard key={movie._id} movie={movie} onClick={() => onMovieClick(movie._id)} />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;