"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetProductsQuery } from '@/src/components/services/apiService';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';

import Navbar from '@/src/components/Navbar';
import MembershipBanner from '@/src/components/MembershipSection';
import Footer from '@/src/components/Footer';

// Wrapping in a helper component to handle useSearchParams safely with Next.js Suspense
function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category'); 

  const { data: products = [], isLoading } = useGetProductsQuery();

  const filteredProducts = products.filter((product: any) => {
    if (!categoryFilter || categoryFilter.toLowerCase() === 'all') return true;
    return product.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center font-black italic text-2xl md:text-4xl animate-pulse text-zinc-300">
      LOADING...
    </div>
  );

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-16 px-4 sm:px-8 md:px-16 bg-[#f8f8f8]">
      <div className="max-w-[1440px] mx-auto">
        
        {/* HEADER - Fluid Typography */}
        <header className="mb-10 md:mb-16">
          <h1 className="italic font-black text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-black leading-[0.8] mb-4">
            {categoryFilter ? categoryFilter : "Sneakers"}
          </h1>
          <div className="flex items-center justify-between border-b border-black pb-4">
            <p className="text-black font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Collection / {categoryFilter || "All"}
            </p>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              {filteredProducts.length} Items
            </p>
          </div>
        </header>

        {/* PRODUCT GRID - Single col on mobile, 2 on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {filteredProducts.map((product: any) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group block">
              <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 sm:p-10 md:p-14 h-[350px] sm:h-[420px] md:h-[500px] flex justify-between items-center shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                
                {/* LEFT SIDE: TEXT - Adjusted widths for better image space */}
                <div className="z-10 flex flex-col justify-center h-full w-[50%] sm:w-[45%]">
                  <span className="text-[#ff4d4d] italic font-black text-4xl sm:text-5xl md:text-7xl uppercase leading-none mb-2">
                    NEW
                  </span>
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase leading-tight tracking-tighter text-black break-words">
                    {product.name}
                  </h3>
                  
                  {/* Fluid Button Size */}
                  <div className="mt-6 md:mt-10 w-10 h-10 md:w-16 md:h-16 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <FiArrowUpRight className="text-xl md:text-3xl" />
                  </div>
                </div>

                {/* RIGHT SIDE: IMAGE - Absolute on small, relative on large */}
                <div className="relative w-[50%] sm:w-[55%] h-full flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6">
                  {product.picture?.url && (
                    <Image 
                      src={product.picture.url} 
                      alt={product.name} 
                      fill
                      priority
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] md:drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-zinc-300 font-black italic text-5xl md:text-8xl uppercase tracking-tighter leading-none">
              Nothing <br /> Found
            </p>
            <Link href="/products" className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold uppercase mt-8 hover:scale-105 transition-transform">
              View All Sneakers
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// MAIN EXPORT
export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="h-screen flex items-center justify-center italic font-black">LOADING...</div>}>
        <ProductsContent />
      </Suspense>
      <MembershipBanner />
      <Footer />
    </>
  );
}