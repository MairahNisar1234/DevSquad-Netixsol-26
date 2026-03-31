'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand */}
        <Link href="/" className="text-xl font-black tracking-tighter text-blue-600">
          DEVSQUAD
        </Link>

        {/* Right Side: Links */}
        <div className="flex items-center gap-8">
        
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black">Articles</Link>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black">Tutorials</Link>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">
            Join Community
          </button>
        </div>

      </div>
    </nav>
  );
}