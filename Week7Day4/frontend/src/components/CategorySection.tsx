"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategorySectionProps {
  products: any[];
}

const CategorySection = ({ products = [] }: CategorySectionProps) => {
  // Filter for products that have a discount and take the first two
  const discountedProducts = products
    .filter(p => p.discountPrice !== null && p.discountPrice > 0)
    .slice(0, 2);

  const categoryItems = [
    { name: 'Workout', image: '/work.png', slug: 'workout' },
    { name: 'Run', image: '/runn.png', slug: 'run' },
    { name: 'Football', image: '/foot.png', slug: 'football' },
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto bg-white py-8 sm:py-10 md:py-16 overflow-x-hidden">
      
      {/* Section Title */}
      <h2 className="text-xs sm:text-sm md:text-xl font-bold mb-5 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-8 uppercase tracking-widest text-zinc-900">
        Buy by category
      </h2>

      {/* ── CATEGORY GRID ── */}
      <div className="flex flex-col w-full mb-10 sm:mb-14 md:mb-16">
        {categoryItems.map((cat, index) => {
          // Logic for the zig-zag layout (Run image on left, text on right)
          const isReversed = index === 1;

          return (
            <div 
              key={cat.slug} 
              className={`flex flex-col md:flex-row w-full ${isReversed ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Desktop-only text card */}
              <Link
                href={`/products?category=${cat.slug}`}
                className="hidden md:flex w-1/2 h-[450px] items-center justify-center bg-white border-y border-zinc-100 cursor-pointer group overflow-hidden"
              >
                <h3 className="text-4xl font-black italic uppercase tracking-[0.2em] transition-transform group-hover:scale-110">
                  {cat.name}
                </h3>
              </Link>

              {/* Image card */}
              <Link
                href={`/products?category=${cat.slug}`}
                className="relative h-[220px] xs:h-[260px] sm:h-[320px] md:h-[450px] w-full md:w-1/2 cursor-pointer overflow-hidden group"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Mobile overlay text - matches your mobile view image */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center md:hidden">
                  <h3 className="text-white text-3xl xs:text-4xl sm:text-5xl font-black italic uppercase tracking-[0.15em] drop-shadow-lg">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── SLOGAN (Centered, Smaller, No Line Breaks) ── */}
      <div className="text-center py-10 sm:py-14 md:py-20 px-4">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-tighter text-zinc-900">
          Looks good. Runs good. Feels good.
        </h2>
      </div>

      {/* ── DISCOUNT CARDS (Bigger Shoes) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8">
        {discountedProducts.length > 0 ? (
          discountedProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="block cursor-pointer">
              <div className="bg-[#f3f3f3] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 flex justify-between items-center h-[200px] sm:h-[300px] relative overflow-hidden group shadow-sm transition-all hover:shadow-md">
                
                {/* Text side */}
                <div className="z-10 flex flex-col justify-center max-w-[45%]">
                  <span className="text-[#ff4d4d] font-bold text-sm sm:text-lg uppercase leading-tight">
                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% Discount
                  </span>
                  <p className="text-zinc-500 font-medium text-xs sm:text-sm mt-1 mb-6">
                    on your first purchase
                  </p>
                  <div className="inline-block w-fit px-5 py-2.5 bg-black text-white rounded-lg transition-transform group-hover:scale-105">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Shop now</span>
                  </div>
                </div>

                {/* Image side - Scaled up significantly to match reference */}
                <div className="relative w-[55%] h-full z-10 transition-transform duration-700 group-hover:scale-110 translate-x-4">
                  {product.picture?.url && (
                    <Image
                      src={product.picture.url}
                      alt={product.name}
                      fill
                      sizes="30vw"
                      className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] scale-125 sm:scale-150"
                    />
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-10 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
            <p className="text-zinc-400">No discounted products available.</p>
          </div>
        )}
      </div>

    </section>
  );
};

export default CategorySection;