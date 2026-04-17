"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useAddToCartMutation } from '@/src/components/services/apiService';

// IMPORT SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';

const SummerMood = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const summerShoes = products.slice(0, 6);

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
    <section id="product-list" className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-10 md:py-20 bg-white overflow-hidden">
      {/* HEADER SECTION */}
      <div className="text-center mb-8 md:mb-16">
        <p className="text-xs md:text-lg font-medium text-zinc-800 uppercase tracking-widest">At the moment</p>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter mt-1 md:mt-2 leading-none">
          SUMMERTIME MOOD
        </h1>
        <p className="text-sm md:text-xl text-zinc-600 mt-2">Fight the heat in a sunny look!</p>
      </div>

      {/* TOP BAR WITH FUNCTIONAL BUTTONS */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-lg md:text-2xl font-bold uppercase tracking-tight">Top sneakers</h2>
        <div className="flex gap-2">
          <button 
            ref={prevRef}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-30"
          >
            <FiArrowLeft size={18} />
          </button>
          <button 
            ref={nextRef}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30"
          >
            <FiArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* SWIPER SLIDER */}
      <div className="w-full relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.2} // Shows a peek of the next slide on mobile
          centeredSlides={false}
          onInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            480: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="w-full pb-10"
        >
          {summerShoes.map((product) => (
            <SwiperSlide key={product.id} className="h-full">
              <div 
                onClick={() => router.push(`/products/${product.id}`)}
                className="relative bg-[#eeeeee] rounded-[24px] md:rounded-[40px] p-6 md:p-10 h-[380px] sm:h-[450px] md:h-[500px] flex flex-col justify-between group overflow-hidden shadow-sm cursor-pointer transition-transform duration-300 hover:-translate-y-2"
              >
                {/* WATERMARK */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
                  <span className="text-[80px] sm:text-[120px] md:text-[160px] font-black text-black/[0.03] uppercase tracking-tighter -rotate-90">
                    NIKE
                  </span>
                </div>

                {/* IMAGE */}
                <div className="relative h-[180px] sm:h-[240px] md:h-[280px] w-full z-10 flex items-center justify-center transition-all duration-700 group-hover:scale-110 -rotate-[12deg] group-hover:rotate-0">
                  {product.picture?.url && (
                    <Image 
                      src={product.picture.url} 
                      alt={product.name} 
                      fill 
                      className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.1)] md:drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]" 
                    />
                  )}
                </div>

                {/* INFO */}
                <div className="relative z-10 flex justify-between items-end w-full">
                  <div className="space-y-1 max-w-[70%]">
                    <h3 className="text-base md:text-2xl font-black text-zinc-900 leading-tight uppercase truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm md:text-base font-bold text-zinc-500">${product.price}</p>
                  </div>
                  
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isAdding}
                    className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-all active:scale-90"
                  >
                    <FiShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SummerMood;