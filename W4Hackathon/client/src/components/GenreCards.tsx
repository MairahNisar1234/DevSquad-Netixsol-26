import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GenreCardProps {
  genre: string;
  images: string[];
  isTop10?: boolean;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, images, isTop10 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/browse?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex-none w-[200px] md:w-[260px] bg-[#1A1A1A] p-4 rounded-[2rem] border border-white/5 hover:border-red-600/30 transition-all group cursor-pointer"
    >
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-[#0F0F0F] border border-white/5">
            {images[idx] ? (
              <img 
                src={images[idx]} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                alt="" 
              />
            ) : (
              <div className="w-full h-full bg-[#141414]" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {isTop10 && (
            <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
              Top 10 In
            </span>
          )}
          <h3 className="font-bold text-sm md:text-base tracking-tight capitalize">{genre}</h3>
        </div>
        <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export default GenreCard;