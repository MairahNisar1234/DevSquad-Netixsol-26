import React from 'react';
import Image from 'next/image';

const MembershipBanner = () => {
  return (
    <section className="w-full bg-white">
      {/* Section Title */}
      <div className="max-w-[1440px] mx-auto px-8 mb-6 mt-20">
        <h2 className="text-3xl font-bold uppercase tracking-tighter">
          MORE NIKE PRODUCTS
        </h2>
      </div>

      {/* The Banner Image Section */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Background Image */}
        <Image 
          src="/ukraine.png" 
          alt="Nike Membership" 
          fill 
          sizes="100vw"
          className="object-cover object-center"
        />
        
        {/* Overlay for text visibility */}
        <div className="absolute inset-0 bg-black/20 z-10" />

        {/* Content Overlay */}
        <div className="absolute inset-0 max-w-[1440px] mx-auto px-10 flex flex-col justify-center items-start z-20 text-white">
          <div className="max-w-[500px]">
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              YOUR NIKE <br /> MEMBERSHIP
            </h3>
            <p className="text-lg font-medium text-white/90 my-6">
              Join our members and show your love with <span className="font-extrabold text-white">Nike By You!</span>
            </p>
            <button className="bg-white text-black px-10 py-3 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all">
              Join Us
            </button>
          </div>
        </div>
      </div>

      {/* Glory Section */}
      <div className="text-center py-20 bg-white">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-4">
          THANKS FOR WATCHING
        </p>
        <h4 className="text-5xl font-black italic uppercase tracking-tighter mb-8">
          Glory to Ukraine
        </h4>
        <div className="text-5xl" role="img" aria-label="Ukraine Flag">
          🇺🇦
        </div>
      </div>
    </section>
  );
};

export default MembershipBanner;