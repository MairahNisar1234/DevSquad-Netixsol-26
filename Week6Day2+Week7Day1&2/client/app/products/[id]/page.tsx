'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Star,
  Minus,
  Plus,
  Check,
  Loader2,
  ChevronRight,
  X,
  SlidersHorizontal
} from 'lucide-react';

import { useCart } from '@/src/context/cartContext';
import { socket } from '@/lib/socket';
import toast from 'react-hot-toast';
import Footer from '@/src/components/Footer';
import Navbar from '@/src/components/layout/Navbar';
import Link from 'next/link';

type TabType = 'details' | 'reviews' | 'faqs';

export default function CustomerProductDetail() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<TabType>('reviews');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Large');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isOutOfStock = product?.stock <= 0;

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/products/${id}`
        );

        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setReviews(data.reviews || []);

          if (data?.images?.length > 0) {
            setSelectedColor(data.images[0].color);
            setMainImage(data.images[0].url);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    const handler = (data: any) => {
      if (data.productId === id) {
        setReviews(prev => [data.review, ...prev]);
        toast.success('New review posted!');
      }
    };

    socket.on('newReviewAdded', handler);
    return () => { socket.off('newReviewAdded', handler); };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (isOutOfStock) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const linkedImage = product?.images?.find((img: any) => img.color === color);
    if (linkedImage) setMainImage(linkedImage.url);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white font-sans overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

          {/* Breadcrumbs - Better Spacing */}
          <nav className="flex items-center gap-2 text-black/60 text-[12px] md:text-sm mb-8 md:mb-10">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-black capitalize font-medium">{product.category || 'Casual'}</span>
          </nav>

          {/* Main Content Grid - Items Centered Vertically */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Gallery Section - Better Layout for Small Screens */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar py-2 lg:py-0 lg:max-h-[600px]">
                {product.images?.map((img: any, i: number) => (
                  <div key={i}
                    onClick={() => { setMainImage(img.url); setSelectedColor(img.color); }}
                    className={`w-20 h-20 sm:w-24 sm:h-24 md:w-[152px] md:h-[167px] rounded-[15px] md:rounded-[20px] bg-[#F0EEED] overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${mainImage === img.url ? 'border-black' : 'border-transparent'}`}>
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>

              <div className="flex-1 w-full bg-[#F0EEED] rounded-[15px] md:rounded-[20px] overflow-hidden aspect-square lg:aspect-[0.85/1]">
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
            </div>

            {/* Product Info Section - Better Vertical Alignment */}
            <div className="flex flex-col h-full justify-center">
              {isOutOfStock && (
                <div className="mb-4">
                  <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider">
                    Out of Stock
                  </span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-4 text-black">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl md:text-3xl font-bold text-black">
                  ₹{product.salePrice || product.regularPrice}
                </span>
                {product.salePrice && product.salePrice < product.regularPrice && (
                  <span className="text-2xl md:text-3xl font-bold text-black/30 line-through">
                    ₹{product.regularPrice}
                  </span>
                )}
              </div>

              <p className="text-black/60 text-sm md:text-base mb-8 leading-relaxed max-w-xl">
                {product.description}
              </p>

              <div className="border-t border-black/10 pt-8 space-y-8">
                {/* Colors */}
                <div>
                  <p className="text-black/60 text-sm mb-4 font-medium">Select Colors</p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors?.length > 0 ? (
                      product.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-10 h-10 rounded-full border border-black/10 flex items-center justify-center transition-all ${
                            selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {selectedColor === color && (
                            <Check size={18} className={color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white' ? 'text-black' : 'text-white'} />
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">No color options available</p>
                    )}
                  </div>
                </div>

                {/* Quantity and Cart - Better Flex Wrap for Small Screens */}
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex items-center justify-between bg-[#F0F0F0] rounded-full px-6 py-4 w-full sm:w-36 md:w-44">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-black/50 transition-colors">
                      <Minus size={20} />
                    </button>
                    <span className="font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="hover:text-black/50 transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 bg-black text-white rounded-full font-bold uppercase text-sm md:text-base hover:bg-zinc-800 transition-all py-4 px-8 shadow-lg active:scale-95 ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}