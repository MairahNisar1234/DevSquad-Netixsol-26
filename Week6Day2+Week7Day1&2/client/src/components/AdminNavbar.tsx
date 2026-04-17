'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function AdminNavbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b" />}>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') || '';

  const [query, setQuery] = useState(initialSearch);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // keep input synced with URL
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // debounce router updates (IMPORTANT FIX)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set('search', query);
      } else {
        params.delete('search');
      }

      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <header className="h-16 md:h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 relative">

      {/* Search */}
      <div
        className={`
          flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 
          transition-all duration-300
          ${isSearchOpen
            ? 'absolute left-4 right-4 top-2 bottom-2 z-10 bg-white'
            : 'hidden md:flex w-64'
          }
        `}
      >
        <Search size={14} className="text-gray-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="text-xs bg-transparent outline-none w-full"
        />

        {isSearchOpen && (
          <button onClick={() => setIsSearchOpen(false)} className="md:hidden">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="md:hidden p-2"
      >
        <Search size={18} />
      </button>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold">Administrator</p>
          <p className="text-[10px] text-gray-400 uppercase">Panel Access</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0B2447] text-white flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}