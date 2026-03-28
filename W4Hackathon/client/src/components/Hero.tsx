import React from 'react';
// @ts-ignore
import logo2 from '../assets/logo2.png'; 
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {

  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      // If logged in, go to the movie streaming page
      navigate('/browse');
    } else {
      // If logged out, show the Noon-style login pop-up
      setAuthModalOpen(true);
    }
  };
  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-32 bg-transparent font-sans">
      
      {/* 1. THE LOGO (Placed ABOVE the text) */}
      <div className="mb-12 transition-transform hover:scale-105 duration-500">
        <img 
          src={logo2} 
          alt="StreamVibe Design" 
          // Adjust width to match your Figma's 'Abstract Design' size
          className="w-40 md:w-80 h-100 object-contain opacity-90" 
        />
      </div>

      {/* 2. MAIN HEADING */}
      <h1 className="text-white text-5xl md:text-[64px] font-bold mb-6 tracking-tight leading-[1.1]">
        The Best Streaming Experience
      </h1>
      
      {/* 3. SUBTEXT */}
      <p className="text-[#999999] max-w-4xl mx-auto text-sm md:text-base font-normal mb-12 leading-relaxed px-4">
        StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more.
      </p>
      
      {/* 4. CALL TO ACTION BUTTON */}
      <button onClick={handleAction} className="bg-[#E50914] hover:bg-[#C40812] text-white px-10 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-600/20">
        <span className="text-2xl">▶</span> Start Watching Now
      </button>

    </div>
  );
};

export default Hero;