import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Play, ChevronRight, ChevronLeft, SearchX, X, Plus, Clock, Eye, Star 
} from 'lucide-react';
import GenreCard from '../components/GenreCards';
import ShowExplorer from '../components/ShowExplorer';
import Footer from '../components/Footer';
import TrailBanner from '../components/TrailBanner';

const Browse: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const API_URL = import.meta.env.VITE_API_URL ;

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search')?.toLowerCase() || '';
  const genreParam = queryParams.get('genre'); 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/movies`);
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [API_URL]);

  const getGenreThumbnails = (genreName: string) => {
    return movies
      .filter(m => m.genre?.some((g: string) => g.toLowerCase() === genreName.toLowerCase()))
      .slice(0, 4)
      .map(m => m.thumbnail);
  };

  const finalFilteredMovies = useMemo(() => {
    let filtered = [...movies];
    if (genreParam && genreParam !== 'All') {
      filtered = filtered.filter(m => 
        m.genre?.some((g: string) => g.toLowerCase() === genreParam.toLowerCase())
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm) || 
        m.genre?.some((g: string) => g.toLowerCase().includes(searchTerm))
      );
    }
    return filtered;
  }, [movies, searchTerm, genreParam]);

  const isFiltering = !!searchTerm || (!!genreParam && genreParam !== 'All');
  const currentMovie = movies[currentHeroIndex];

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-red-600 font-black italic animate-pulse text-5xl tracking-tighter uppercase">STREAMVIBE</span>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 animate-loading-bar w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <div className="bg-[#0F0F0F] min-h-screen text-white pb-20 font-sans selection:bg-red-600/30">
      
      {/* 1. HERO SECTION */}
      {currentMovie && !isFiltering && (
        <div className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden flex flex-col items-center justify-end pb-12 md:pb-24 px-6 text-center">
          <img 
            key={currentMovie._id}
            src={currentMovie.thumbnail} 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4] transition-opacity duration-1000" 
            alt="Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
          
          <div className="relative z-10 max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight uppercase leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {currentMovie.title}
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto line-clamp-2 font-light">
              {currentMovie.description}
            </p>
            
            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/movie/${currentMovie._id}`)} 
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-red-600/20"
                >
                  <Play fill="currentColor" size={18} /> Play Now
                </button>
                <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex gap-2">
                {movies.slice(0, 4).map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'w-8 bg-red-600' : 'w-4 bg-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN CONTENT */}
      <div className={`px-4 md:px-12 ${!isFiltering ? 'mt-12 md:mt-16' : 'pt-32'} relative z-20 space-y-24`}>
        
        {!isFiltering ? (
          <>
            <FigmaSlider title="Our Genres" type="genres">
              {['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'].map(g => (
                <GenreCard key={g} genre={g} images={getGenreThumbnails(g)} />
              ))}
            </FigmaSlider>

            <FigmaSlider title="Trending Now" type="trending">
              {movies.slice(0, 10).map(movie => (
                <MovieCard key={movie._id} movie={movie} type="trending" />
              ))}
            </FigmaSlider>

            <FigmaSlider title="Must Watch" type="new-release">
              {[...movies].reverse().slice(0, 10).map(movie => (
                <MovieCard key={movie._id} movie={movie} type="new-release" />
              ))}
            </FigmaSlider>
            
            <div className="py-10 border-t border-white/5">
                <ShowExplorer />
            </div>
          </>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-bold uppercase tracking-tight">Search Results</h2>
               <span className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black">{finalFilteredMovies.length} found</span>
            </div>
            {finalFilteredMovies.length > 0 ? (
              <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {finalFilteredMovies.map(movie => <MovieCard key={movie._id} movie={movie} type="new-release" />)}
              </section>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <SearchX size={64} className="mb-4 opacity-20" />
                <p className="text-xl font-medium">No results found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
        .animate-loading-bar { animation: loading-bar 1.5s infinite linear; }
      `}</style>
    </div>
    <TrailBanner/>
    <Footer/>
    </>
  );
};

// --- SLIDER WRAPPER ---
const FigmaSlider = ({ title, children, type }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDash, setActiveDash] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setActiveDash(Math.min(3, Math.round(progress * 3))); 
    }
  };

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{title}</h2>
        <div className="hidden md:flex items-center gap-4 bg-[#0F0F0F] border border-white/10 p-2 rounded-2xl">
          <button onClick={() => scroll('left')} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activeDash === i ? 'w-6 bg-red-600' : 'w-4 bg-[#333]'}`} />
            ))}
          </div>
          <button onClick={() => scroll('right')} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
      >
        {React.Children.map(children, child => (
          <div className={`flex-none snap-start ${type === 'genres' ? '' : 'w-[220px] md:w-[280px]'}`}>
            {child}
          </div>
        ))}
      </div>
    </section>
  );
};

// --- FIGMA ACCURATE MOVIE CARD ---
const MovieCard = ({ movie, type }: { movie: any, type: 'trending' | 'new-release' }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 hover:border-red-600/50 transition-all group cursor-pointer"
    >
      {/* 1. Poster Image */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-5">
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>

      {/* 2. Metadata Info Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-[#141414] px-2.5 py-1.5 rounded-full border border-white/5 text-[10px] text-white">
          <Clock size={12} className="text-[#999999]" />
          <span>{movie.duration || '2h 15m'}</span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-[#141414] px-2.5 py-1.5 rounded-full border border-white/5 text-[10px] text-white">
          {type === 'trending' ? (
            <>
              <Eye size={12} className="text-[#999999]" />
              <span>{movie.viewCount > 1000 ? (movie.viewCount / 1000).toFixed(1) + 'K' : movie.viewCount}</span>
            </>
          ) : (
            <>
              <Star size={12} fill="#E50000" className="text-[#E50000] border-none" />
              <span>{movie.rating}</span>
            </>
          )}
        </div>
      </div>

      {/* 3. Movie Title (Added back) */}
      <h3 className="text-sm font-bold text-white truncate group-hover:text-red-600 transition-colors">
        {movie.title}
      </h3>
    </div>
  );
};

export default Browse;