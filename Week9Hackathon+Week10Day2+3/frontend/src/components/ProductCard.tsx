"use client";
import Image from "next/image";
import { ArrowUpRight, Activity } from "lucide-react";

export interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <Image
          src={product.image_url || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={product.title}
          fill
          unoptimized 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Modern Glassmorphic Tag */}
        <div className="absolute top-4 left-4 bg-white/70 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
            Rs. {product.price}
          </span>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>
        
        
      </div>
    </div>
  );
}