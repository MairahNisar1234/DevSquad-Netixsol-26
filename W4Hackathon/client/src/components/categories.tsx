import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dynamic API URL handling
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Updated to use the dynamic API_URL
        const [movieRes, showRes] = await Promise.all([
          axios.get(`${API_URL}/api/movies`),
          axios.get(`${API_URL}/api/shows`)
        ]);
        setMovies([...movieRes.data, ...showRes.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const dynamicCategoryData = useMemo(() => {
    // Flatten all genres and filter out any null/undefined values
    const allGenres = movies.flatMap(m => m.genre || []);
    const uniqueGenres = Array.from(new Set(allGenres));

    return uniqueGenres.map(genreName => {
      const genrePosters = movies
        .filter(m => m.genre?.some((g: string) => g === genreName)) // Better genre check
        .slice(0, 4)
        .map(m => m.thumbnail);
        
      return { name: genreName, images: genrePosters };
    }).filter(cat => cat.images.length > 0);
  }, [movies]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(2);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else if (window.innerWidth < 1440) setItemsPerPage(4);
      else setItemsPerPage(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(dynamicCategoryData.length / itemsPerPage);

  if (loading) return (
    <div className="bg-[#141414] py-20 text-center text-gray-600 animate-pulse">
      Loading Categories...
    </div>
  );

  if (dynamicCategoryData.length === 0) return null;

  return (
    <section className="bg-[#141414] px-4 sm:px-8 md:px-16 py-12 md:py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-white text-xl md:text-3xl lg:text-4xl font-bold mb-3  tracking-tight">
            Explore our wide variety of categories
          </h2>
          <p className="text-[#999999] text-xs md:text-sm lg:text-base font-light">
            Whether you're looking for a comedy to make you laugh or a drama to make you think.
          </p>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center gap-2 bg-[#0F0F0F] border border-[#262626] p-2 rounded-xl">
          <button 
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} 
            className={`p-2 bg-[#1A1A1A] rounded-lg border border-[#262626] transition-all ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#222222] text-white'}`}
          >
            ←
          </button>
          <div className="flex gap-1 px-2">
            {[...Array(totalPages)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-red-600' : 'w-1.5 bg-[#333333]'}`} 
              />
            ))}
          </div>
          <button 
            onClick={() => currentIndex < totalPages - 1 && setCurrentIndex(currentIndex + 1)} 
            className={`p-2 bg-[#1A1A1A] rounded-lg border border-[#262626] transition-all ${currentIndex === totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#222222] text-white'}`}
          >
            →
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out gap-4 lg:gap-5" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {dynamicCategoryData.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => navigate(`/browse?genre=${encodeURIComponent(cat.name)}`)}
              className="shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.33%-12px)] lg:w-[calc(25%-15px)] xl:w-[calc(20%-16px)] group bg-[#1A1A1A] border border-[#262626] p-3 md:p-5 rounded-2xl cursor-pointer hover:border-red-600/50 transition-all"
            >
              <div className="relative mb-3 md:mb-5">
                <div className="grid grid-cols-2 gap-1 md:gap-2 overflow-hidden rounded-xl">
                  {cat.images.map((img, idx) => (
                    <div key={idx} className="aspect-[4/5] bg-[#0F0F0F] overflow-hidden">
                      <img 
                        src={img} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" 
                        alt="" 
                      />
                    </div>
                  ))}
                </div>
                {/* Gradient overlay for that premium Figma look */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-white font-medium capitalize text-sm md:text-base">{cat.name}</span>
                <span className="text-white opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                   <ChevronRightIcon /> 
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple arrow icon for the card
const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

export default Categories;