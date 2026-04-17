'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, SlidersHorizontal, Check, RotateCcw, Loader2 } from 'lucide-react';
import { socket } from '@/lib/socket'; 
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000); // The filter value
  const [absoluteMax, setAbsoluteMax] = useState(10000); // The ceiling from DB
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/products');
      const data = await res.json();
      const productData = Array.isArray(data) ? data : (data.data || []);
      
      setProducts(productData);
      
      // Calculate the dynamic max price for the slider
      if (productData.length > 0) {
        const highest = Math.max(...productData.map((p: any) => p.regularPrice || 0));
        setAbsoluteMax(highest);
        setMaxPrice(highest);
      }
    } catch (err) {
      toast.error("Network error: Could not sync catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    socket.connect();

    socket.on('productCreated', (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("New arrival added to catalog!", { icon: '✨' });
    });

    socket.on('productUpdated', (updated) => {
      setProducts((prev) => prev.map(p => p._id === updated._id ? updated : p));
    });

    socket.on('productDeleted', (id) => {
      setProducts((prev) => prev.filter(p => p._id !== id));
    });

    return () => {
      socket.off('productCreated');
      socket.off('productUpdated');
      socket.off('productDeleted');
    };
  }, []);

  // 1. DYNAMIC FILTER EXTRACTION
  const filters = useMemo(() => {
    const categories = new Set<string>(['All']);
    const colors = new Set<string>();
    const sizes = new Set<string>();

    products.forEach(p => {
      if (p.category) categories.add(p.category);
      if (p.colors) p.colors.forEach((c: string) => colors.add(c.toLowerCase().trim()));
      if (p.sizes) p.sizes.forEach((s: string) => sizes.add(s.trim()));
    });

    return {
      categories: Array.from(categories),
      colors: Array.from(colors),
      sizes: Array.from(sizes).sort()
    };
  }, [products]);

  // 2. FILTERING LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = (p.salePrice || p.regularPrice) <= maxPrice;
      const matchColor = !selectedColor || 
        p.colors?.some((c: string) => c.toLowerCase().trim() === selectedColor.toLowerCase().trim());
      const matchSize = !selectedSize || 
        p.sizes?.some((s: string) => s.toLowerCase().trim() === selectedSize.toLowerCase().trim());

      return matchCategory && matchPrice && matchColor && matchSize;
    });
  }, [products, selectedCategory, maxPrice, selectedColor, selectedSize]);

  const handleProductClick = (productId: string) => {
    const token = localStorage.getItem('access_token');
    router.push(token ? `/products/${productId}` : `/auth/login?redirect=/products/${productId}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-slate-900" size={32} />
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Authenticating Collection</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-16 px-6 text-center">
        <h1 className="text-5xl font-black italic mb-2 tracking-tighter uppercase">Elite Garments</h1>
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-blue-500"></span>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Real-Time Luxury Inventory</p>
          <span className="w-8 h-[1px] bg-blue-500"></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-80 space-y-10 border border-slate-100 p-8 rounded-[2.5rem] h-fit sticky top-8">
          <div className="flex justify-between items-center border-b border-slate-50 pb-6">
            <h2 className="font-black text-xl uppercase tracking-tighter">Filters</h2>
            <SlidersHorizontal size={18} className="text-slate-900" />
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Price Ceiling</h3>
              <span className="font-black text-sm text-blue-600">${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={absoluteMax} 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300">
              <span>$0</span>
              <span>${absoluteMax}</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">Department</h3>
            <ul className="space-y-4">
              {filters.categories.map((cat) => (
                <li 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer text-xs font-black uppercase tracking-widest flex justify-between items-center transition-all ${
                    selectedCategory === cat ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat} 
                  <div className={`w-1 h-1 rounded-full bg-blue-600 transition-opacity ${selectedCategory === cat ? 'opacity-100' : 'opacity-0'}`} />
                </li>
              ))}
            </ul>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-black text-[10px] mb-6 uppercase tracking-[0.2em] text-slate-400">Color Palette</h3>
            <div className="flex flex-wrap gap-3">
              {filters.colors.map((hex) => (
                <button 
                  key={hex}
                  onClick={() => setSelectedColor(selectedColor === hex ? '' : hex)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    selectedColor === hex ? 'ring-2 ring-offset-2 ring-blue-600 scale-110 shadow-lg' : 'border-slate-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                >
                  {selectedColor === hex && (
                    <Check size={14} className={hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => { setSelectedCategory('All'); setSelectedColor(''); setSelectedSize(''); setMaxPrice(absoluteMax); }}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-xl shadow-slate-200"
          >
            <RotateCcw size={14} /> Reset Configuration
          </button>
        </aside>

        {/* MAIN CATALOG */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">The Catalog</h2>
              <p className="text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
                Showing {filteredProducts.length} curated pieces
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 border border-slate-100 rounded-full">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Live Sync Enabled</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product: any) => {
              const activeImage = selectedColor 
                ? product.images?.find((img: any) => img.color?.toLowerCase() === selectedColor.toLowerCase())?.url || product.images?.[0]?.url
                : product.images?.[0]?.url;

              return (
                <div 
                  key={product._id} 
                  onClick={() => handleProductClick(product._id)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-slate-50 mb-6 border border-slate-100">
                    <img 
                      src={activeImage || 'https://via.placeholder.com/400x500'} 
                      alt={product.name}
                      className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white text-black text-[10px] font-black px-8 py-4 rounded-2xl uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Explore Piece
                      </div>
                    </div>

                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-rose-600 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                        Only {product.stock} Left
                      </div>
                    )}
                  </div>

                  <div className="px-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm truncate">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="fill-slate-900 text-slate-900" />
                        <span className="text-[10px] font-black">4.9</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-blue-600">${product.regularPrice}</span>
                        {product.salePrice > 0 && (
                          <span className="text-[10px] font-bold text-slate-300 line-through">${product.salePrice}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{product.brandName}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <RotateCcw className="text-slate-200 mb-4" size={40} />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">No matches found for this configuration</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}