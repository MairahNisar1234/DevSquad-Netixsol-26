import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a2e5a] text-white">
      <div className="container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-1 mb-4">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#f5c518" />
              <path d="M8 22 Q12 14 18 16 Q24 18 28 14" stroke="#1a2e5a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <circle cx="12" cy="24" r="2.5" fill="#1a2e5a"/>
              <circle cx="24" cy="24" r="2.5" fill="#1a2e5a"/>
            </svg>
            <span className="text-white font-bold text-lg">Car</span>
            <span className="text-[#f5c518] font-bold text-lg">Deposit</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Mauris duis convallis porta pellentesque diam orci semper. Sit suscipit lacus risus commodo in lectus sed egestas. Mattis egestas sit viverra tincidunt lorem.
          </p>
        </div>

        <div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/car-auction" className="hover:text-white transition-colors">Car Auction</Link></li>
            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
        Copyright 2022 All Rights Reserved
      </div>
    </footer>
  );
}