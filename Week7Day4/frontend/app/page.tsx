"use client"; 
import React from 'react';
import Navbar from "@/src/components/Navbar";
import HeroBanner from "@/src/components/HeroBanner";
import FeaturedProducts from "@/src/components/FeaturedProducts";
import SummerMood from "@/src/components/summerMood";
import CategorySection from "@/src/components/CategorySection";
import MembershipBanner from "@/src/components/MembershipSection";
import Footer from "@/src/components/Footer";
import { useGetProductsQuery } from "@/src/components/services/apiService"; 

export default function Home() {
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();

  if (productsLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        {/* Animated Loading State */}
        <div className="w-16 h-16 border-4 border-zinc-100 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-black font-black italic uppercase tracking-tighter text-2xl animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      <Navbar />

      {/* w-full: Ensures no horizontal overflow.
         flex-col: Forces sections to stack correctly on mobile.
         gap: Added responsive gap to prevent sections from looking cluttered on small screens.
      */}
      <main className="w-full flex flex-col gap-0 md:gap-0 overflow-x-hidden">
        
        {/* 1. Hero: Full width, no padding */}
        <HeroBanner />
        
        {/* 2. Featured: Needs space at bottom because of the 'hanging' cards */}
        <div className="mt-[-20px] md:mt-0">
           <FeaturedProducts products={products} />
        </div>
        
        {/* 3. SummerMood: Background is white, so it flows naturally */}
        <SummerMood products={products} />
        
        {/* 4. Category Section: The big images section */}
        <CategorySection products={products} />

        {/* 5. Membership: The call to action */}
        <MembershipBanner />
      </main>

      <Footer />
    </div>
  );
}