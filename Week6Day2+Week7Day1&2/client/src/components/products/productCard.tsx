'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { socket } from '@/lib/socket';

interface ProductImage {
  url: string;
  color: string;
}

interface ProductProps {
  product: {
    _id: string;
    name: string;
    category: string;
    regularPrice: number;
    salePrice?: number;
    stock: number;
    images: ProductImage[];
  };
}

const ProductCard: React.FC<ProductProps> = ({ product: initialProduct }) => {
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (updatedProduct: any) => {
      if (updatedProduct._id === product._id) {
        setProduct(updatedProduct);
      }
    };
    socket.on('productUpdated', handleUpdate);
    return () => {
      socket.off('productUpdated', handleUpdate);
    };
  }, [product._id]);

  const displayImage = product.images?.[0]?.url || 'https://via.placeholder.com/400';
  
  // Calculate discount percentage if salePrice exists
  const discount = product.salePrice && product.salePrice > 0 
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100) 
    : null;

  return (
    <Link href={`/products/${product._id}`} className="group cursor-pointer block">
      {/* 1. Large Image Container with soft gray background */}
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#F0EEED] mb-4">
        <img 
          src={displayImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 2. Product Details */}
      <div className="space-y-1">
        {/* Name */}
        <h3 className="font-bold text-base md:text-lg text-black truncate">
          {product.name}
        </h3>

        {/* Rating - Hardcoded 4.5/5 to match style */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[#FFC633]">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={16} className="fill-current" />
            ))}
            <Star size={16} className="fill-current opacity-50" />
          </div>
          <span className="text-sm text-gray-500">4.5/<span className="text-gray-400">5</span></span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-xl md:text-2xl font-bold">
            ${product.salePrice || product.regularPrice}
          </span>
          
          {product.salePrice && product.salePrice > 0 && (
            <>
              <span className="text-xl md:text-2xl font-bold text-gray-300 line-through">
                ${product.regularPrice}
              </span>
              <span className="bg-[#FF3333]/10 text-[#FF3333] text-xs font-bold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;