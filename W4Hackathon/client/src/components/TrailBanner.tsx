import React from 'react';
import BackgroundGrid from './backgrid'; 
import { useAuthStore } from '../store/useAuthStore';

const TrialBanner: React.FC = () => {
  const { setAuthModalOpen } = useAuthStore();

  return (
    /* Changed py-20 to pt-4 pb-20 to reduce top spacing and removed max-w-7xl */
    <section className="relative w-full px-4 pt-4 pb-20">
      {/* Main Container: Removed max-width constraints to take full width */}
      <div className="relative overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0F0F0F] min-h-[300px] flex items-center shadow-2xl w-full">
        
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 left-[20%] z-0 opacity-40">
            <BackgroundGrid />
          </div>

          {/* REFINED GRADIENT */}
          <div 
            className="absolute inset-0 z-10" 
            style={{
              background: 'linear-gradient(90deg, #0F0F0F 0%, rgba(15, 15, 15, 0.9) 10%, rgba(180, 0, 0, 0.09) 100%)' 
            }}
          />

          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#0F0F0F] via-transparent to-[#0F0F0F] opacity-60" />
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-30 w-full flex flex-col lg:flex-row items-center justify-between gap-12 p-10 md:px-20 md:py-14 text-center lg:text-left">
          
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
              Start your free trial today!
            </h2>
            <p className="text-gray-500 text-sm md:text-lg leading-relaxed font-medium">
              This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.
            </p>
          </div>

          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-700" />
            
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="relative bg-[#E50000] hover:bg-red-700 text-white font-black py-4 px-10 rounded-xl transition-all duration-300 transform active:scale-95 shadow-2xl shadow-red-900/40 text-[10px] uppercase tracking-[0.25em]"
            >
              Start a Free Trial
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrialBanner;