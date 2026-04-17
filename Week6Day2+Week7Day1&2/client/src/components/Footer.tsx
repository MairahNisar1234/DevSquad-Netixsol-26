'use client';

import React from 'react';
import Link from 'next/link';
// We use generic functional icons that Lucide supports
import { 
  X, 
 
  Mail,
  Globe,
  CircleUserRound
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">

      {/* Newsletter Banner */}
      <div className="bg-black rounded-[2rem] mx-4 sm:mx-8 lg:mx-16 my-10 px-10 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-white font-black text-3xl sm:text-4xl uppercase leading-tight max-w-xs">
            STAY UPTO DATE ABOUT<br />OUR LATEST OFFERS
          </h2>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-sm outline-none bg-white text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
            <button className="w-full bg-white text-black font-bold text-sm py-3.5 rounded-full hover:bg-gray-100 transition-colors uppercase tracking-wide">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="text-black font-black text-2xl tracking-tight uppercase block mb-4">
              SHOP.CO
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-[200px]">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            
            {/* NEW SOCIAL ICONS FALLBACK */}
            <div className="flex items-center gap-3">
              <a href="#" title="X (Twitter)" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors">
                <X size={14} /> {/* Modern Twitter Replacement */}
              </a>
              <a href="#" title="Social" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors">
                <CircleUserRound size={14} /> {/* Generic Profile/Facebook Fallback */}
              </a>
              
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-black uppercase text-xs tracking-widest text-black mb-5">Company</h3>
            <ul className="space-y-3">
              {['About', 'Features', 'Works', 'Career'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-black uppercase text-xs tracking-widest text-black mb-5">Help</h3>
            <ul className="space-y-3">
              {['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="font-black uppercase text-xs tracking-widest text-black mb-5">FAQ</h3>
            <ul className="space-y-3">
              {['Account', 'Manage Deliveries', 'Orders', 'Payments'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-black uppercase text-xs tracking-widest text-black mb-5">Resources</h3>
            <ul className="space-y-3">
              {['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-col sm:row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex items-center gap-2">
            <div className="h-7 px-2 bg-white border border-gray-100 rounded flex items-center justify-center">
               <span className="text-[9px] font-black italic text-blue-900">VISA</span>
            </div>
            <div className="h-7 px-2 bg-white border border-gray-100 rounded flex items-center justify-center gap-0.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 -ml-1.5" />
            </div>
            <div className="h-7 px-3 bg-white border border-gray-100 rounded flex items-center justify-center">
               <span className="text-[9px] font-black text-black">PAYPAL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}