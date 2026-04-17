"use client";
import React from 'react';
import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';
import { useAddToCartMutation } from '@/src/components/services/apiService';
import { useRouter } from 'next/navigation';

const FeaturedProducts = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const featured = products.filter(p =>
    p.name.includes("Air Jordan 1 Mid") || p.name.includes("Air Max 200 SE")
  );

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    try {
      await addToCart(product).unwrap();
      alert("Added to bag!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center mb-16 xs:mb-20 sm:mb-28 md:mb-[220px]">

      {/* ── BACKGROUND ── */}
      <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[380px] md:h-[520px] overflow-hidden">
        <Image
          src="/back.png"
          alt="Nike Background"
          fill
          sizes="100vw"
          className="object-cover object-top blur-[8px]"
          priority
        />
        {/* Nike logo — smaller on tiny screens */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90 pb-6 sm:pb-10 md:pb-20">
          <img
            src="/nike.png"
            alt="Nike"
            className="w-[28%] xs:w-[30%] sm:w-[28%] max-w-[160px] sm:max-w-[200px] md:max-w-[250px]"
          />
        </div>
      </div>

      {/* ── CARDS ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6
                      -mt-16 xs:-mt-20 sm:-mt-28 md:-mt-44">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 xs:gap-20 sm:gap-24 md:gap-8 lg:gap-12">
          {featured.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
              className="relative group cursor-pointer"
            >
              {/* ── WHITE CARD ── */}
              <div className="
                bg-white rounded-[24px] sm:rounded-[28px] md:rounded-[32px]
                p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10
                h-[190px] xs:h-[210px] sm:h-[240px] md:h-[260px] lg:h-[280px]
                flex flex-col justify-center
                shadow-xl sm:shadow-2xl border border-gray-100
                transition-all duration-300 group-hover:shadow-zinc-200
              ">
                <span className="text-[#ff4d4d] italic font-black text-2xl xs:text-3xl md:text-4xl mb-1 tracking-tighter">
                  NEW
                </span>
                <h2 className="
                  text-zinc-800 font-bold
                  text-sm xs:text-base md:text-lg
                  uppercase
                  max-w-[120px] xs:max-w-[140px] md:max-w-[160px]
                  leading-tight
                  mb-4 xs:mb-5 sm:mb-6 md:mb-8
                ">
                  {product.name}
                </h2>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={isAdding}
                  className="
                    w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12
                    bg-white rounded-full flex items-center justify-center
                    shadow-md border border-gray-100
                    group-hover:bg-black group-hover:text-white
                    transition-all disabled:opacity-50
                  "
                >
                  <FiArrowUpRight size={18} className="xs:hidden" />
                  <FiArrowUpRight size={20} className="hidden xs:block sm:hidden" />
                  <FiArrowUpRight size={22} className="hidden sm:block" />
                </button>
              </div>

              {/* ── FLOATING SHOE ── */}
              <div className="
                absolute
                -top-12 -right-1
                xs:-top-14 xs:-right-1
                sm:-top-16 sm:-right-2
                md:-top-20 md:-right-3
                lg:-top-24 lg:-right-4

                w-[160px] h-[160px]
                xs:w-[185px] xs:h-[185px]
                sm:w-[210px] sm:h-[210px]
                md:w-[260px] md:h-[260px]
                lg:w-[310px] lg:h-[310px]

                transition-all duration-700
                -rotate-[15deg]
                group-hover:-rotate-[5deg]
                group-hover:scale-110
              ">
                <Image
                  src={product.picture.url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 375px) 160px, (max-width: 640px) 210px, (max-width: 768px) 260px, 310px"
                  className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.22)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;