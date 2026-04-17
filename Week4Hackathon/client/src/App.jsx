import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans">
      <Navbar />

      {/* BACKGROUND POSTER GRID (The "Figma" Backdrop) */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="grid grid-cols-5 md:grid-cols-8 gap-3 p-4">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#1a1a1a] border border-[#262626] rounded-xl shadow-2xl"></div>
          ))}
        </div>
        {/* Dark radial gradient to make the center text pop */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-32 px-6">
         <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-10 cursor-pointer hover:scale-110 transition">
            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2"></div>
         </div>
         
         <h1 className="text-white text-5xl md:text-6xl font-extrabold text-center max-w-4xl leading-tight mb-6">
            The Best Streaming Experience
         </h1>
         
         <p className="text-[#999999] text-center max-w-3xl text-lg font-light mb-10">
            StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere.
         </p>

         <button className="bg-[#e50914] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition">
            ▶ Start Watching Now
         </button>
      </div>
    </div>
  );
}

export default App;