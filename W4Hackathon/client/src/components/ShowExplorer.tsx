import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Clock, Eye } from 'lucide-react';

interface Show {
  _id: string;
  title: string;
  thumbnail: string;
  releaseDate: string;
  viewCount: number;
  duration?: string; 
}

const ShowRow = ({ title, items, type }: { title: string; items: Show[], type: 'trending' | 'new' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">{title}</h2>
        <div className="hidden md:flex items-center gap-4 bg-[#0F0F0F] border border-white/10 p-2 rounded-2xl">
          <button onClick={() => scroll('left')} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === 0 ? 'w-6 bg-red-600' : 'w-4 bg-[#333]'}`} />
            ))}
          </div>
          <button onClick={() => scroll('right')} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth px-4 pb-4">
        {items.map((show) => (
          <div 
            key={show._id} 
            className="flex-none w-[220px] md:w-[300px] bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 hover:border-red-600 transition-all group cursor-pointer"
            onClick={() => navigate(`/show/${show._id}`)}
          >
            {/* 1. Poster Image */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-5">
              <img 
                src={show.thumbnail} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={show.title} 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <Play fill="white" size={24} className="text-white" />
                 </div>
              </div>
            </div>

            {/* 2. Metadata Info Bar (Below Image) */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 bg-[#141414] px-2.5 py-1.5 rounded-full border border-white/5 text-[10px] text-white">
                <Clock size={12} className="text-[#999999]" />
                <span>{show.duration || 'S1 - 10 eps'}</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-[#141414] px-2.5 py-1.5 rounded-full border border-white/5 text-[10px] text-white">
                {type === 'trending' ? (
                  <>
                    <Eye size={12} className="text-[#999999]" />
                    <span>{show.viewCount || '0'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#999999]">Released:</span>
                    <span>{show.releaseDate ? new Date(show.releaseDate).getFullYear() : '2024'}</span>
                  </>
                )}
              </div>
            </div>

            {/* 3. Show Title */}
            
          </div>
        ))}
      </div>
    </div>
  );
};

const ShowExplorer: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/shows');
        setShows(res.data);
      } catch (err) {
        console.error("Error fetching shows:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  if (loading || shows.length === 0) return null;

  const trending = [...shows].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10);
  const newlyReleased = [...shows].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 10);
  const mustWatch = shows.slice().reverse().slice(0, 10);

  return (
    <section className="space-y-16 md:space-y-24 relative pt-10">
      <div className="absolute -top-6 left-4">
        <span className="bg-red-600 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-lg shadow-lg shadow-red-600/20">
          TV Shows
        </span>
      </div>
      
      <ShowRow title="Trending Shows" items={trending} type="trending" />
      <ShowRow title="Newly Released" items={newlyReleased} type="new" />
      <ShowRow title="Must Watch" items={mustWatch} type="new" />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ShowExplorer;