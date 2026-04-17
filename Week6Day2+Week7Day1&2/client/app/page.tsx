'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2 } from 'lucide-react';
import Footer from '@/src/components/Footer';
import { useAuth } from '@/src/context/authContext';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:3000/api';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        const productData = Array.isArray(data) ? data : (data.data || []);
        setProducts(productData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Shared logic for checking auth
  const handleNavigation = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      toast.error('Please login to explore our collection!');
      router.push('/auth/login');
    }
  };

  const newArrivals = products.slice(0, 4);

  return (
    <>
      <div className="bg-white font-sans text-black">
        {/* HERO */}
        <section className="bg-[#F2F0F1] px-4 pt-10 md:px-16 lg:pt-0">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
            <div className="flex-1 space-y-6 lg:py-20">
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tighter">
                Find Clothes That Matches Your Style
              </h1>
              <p className="text-black/60 text-sm md:text-base max-w-lg">
                Browse through our diverse range of meticulously crafted garments.
              </p>
              <button
                onClick={() => handleNavigation('/shop')}
                className="w-full md:w-[210px] bg-black text-white py-4 rounded-full mt-4 hover:bg-zinc-800 transition-colors"
              >
                Shop Now
              </button>
            </div>
            <div className="flex-1 mt-10 lg:mt-0">
              <img src="/banner.jpg" alt="Fashion" />
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <h2 className="text-4xl font-black uppercase text-center mb-12">
            New Arrivals
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.salePrice || product.regularPrice}
                  oldPrice={product.salePrice ? product.regularPrice : null}
                  image={product.images?.[0]?.url || '/placeholder.png'}
                  onNavigate={() => handleNavigation(`/products/${product._id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}

// Updated ProductCard to use a button/div for controlled navigation
function ProductCard({ name, price, oldPrice, image, onNavigate }: any) {
  return (
    <div 
      onClick={onNavigate} 
      className="space-y-2 block cursor-pointer group"
    >
      <div className="overflow-hidden rounded-xl">
        <img 
          src={image} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
          alt={name}
        />
      </div>

      <h3 className="font-bold text-sm">{name}</h3>

      <div className="flex gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="fill-current" />
        ))}
      </div>

      <div className="font-bold">
        ₹{price}{' '}
        {oldPrice && (
          <span className="line-through text-gray-400 ml-2">
            ₹{oldPrice}
          </span>
        )}
      </div>
    </div>
  );
}