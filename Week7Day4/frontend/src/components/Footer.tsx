import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-20 px-10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-3 items-center">
        
        {/* LEFT LINKS */}
        <div className="flex flex-col gap-6 items-start">
          <Link href="/products" className="text-xs uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
            All
          </Link>
          <Link href="/category/woman" className="text-xs uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
            Woman
          </Link>
          <Link href="/category/men" className="text-xs uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
            Men
          </Link>
        </div>

        {/* CENTER LOGO */}
        <div className="flex justify-center">
          <div className="relative w-[300px] h-[120px]">
            <Image 
              src="/footer.png" 
              alt="Nike Ukraine" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* RIGHT LINKS */}
        <div className="flex flex-col gap-6 items-end text-right">
          <Link href="/category/workout" className="text-xs uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
            Workout
          </Link>
          <Link href="/category/run" className="text-xs uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
            Run
          </Link>
          <Link href="/category/football" className="text-xs uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
            Football
          </Link>
        </div>

      </div>
      
      {/* Optional: Small Copyright or Bottom Bar */}
      <div className="mt-20 pt-8 border-t border-white/10 text-center">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
          © 2026 Nike, Inc. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;