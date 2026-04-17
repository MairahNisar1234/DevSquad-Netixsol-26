'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Star, SlidersHorizontal, Check, RotateCcw, Loader2, ChevronRight, ChevronUp, X } from 'lucide-react';
import { socket } from '@/lib/socket';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Footer from '@/src/components/Footer';
import Navbar from '@/src/components/layout/Navbar';

const API_BASE = 'http://localhost:3000/api';

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [absoluteMax, setAbsoluteMax] = useState(10000);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const productData = Array.isArray(data) ? data : (data.data || []);
      setProducts(productData);
      
      if (productData.length > 0) {
        const highest = Math.max(...productData.map((p: any) => p.regularPrice || 0));
        setAbsoluteMax(highest);
        setMaxPrice(highest);
      }
    } catch (err) {
      toast.error("Catalog sync failed. Checking connection...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    socket.connect();
    
    socket.on('productCreated', (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("New arrival added!", { icon: '✨', style: { borderRadius: '10px', background: '#000', color: '#fff' } });
    });

    return () => {
      socket.off('productCreated');
      socket.disconnect();
    };
  }, []);

  // --- DYNAMIC FILTER LOGIC ---
  const filters = useMemo(() => {
    const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'];
    const sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];
    
    const dynamicColors = Array.from(
      new Set(
        products
          .flatMap((p) => p.colors || [])
          .map((c: string) => c.trim())
          .filter(Boolean)
      )
    );

    return { categories, colors: dynamicColors, sizes };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = (p.salePrice || p.regularPrice) <= maxPrice;
      const matchColor = !selectedColor || p.colors?.some((c: string) => c.toLowerCase().trim() === selectedColor.toLowerCase().trim());
      const matchSize = !selectedSize || p.sizes?.includes(selectedSize);
      return matchCategory && matchPrice && matchColor && matchSize;
    });
  }, [products, selectedCategory, maxPrice, selectedColor, selectedSize]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedColor('');
    setSelectedSize('');
    setMaxPrice(absoluteMax);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h2 className="font-black text-xs uppercase tracking-widest">Filter System</h2>
        <button onClick={() => setIsFilterOpen(false)} className="lg:hidden p-2">
          <X size={20} />
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Category</p>
        <div 
          onClick={() => setSelectedCategory('All')}
          className={`flex justify-between items-center cursor-pointer transition-colors ${selectedCategory === 'All' ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}
        >
          <span className="text-sm uppercase tracking-tight">All Collections</span>
          <ChevronRight size={14} />
        </div>
        {filters.categories.map((cat) => (
          <div 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`flex justify-between items-center cursor-pointer transition-colors ${selectedCategory === cat ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}
          >
            <span className="text-sm uppercase tracking-tight">{cat}</span>
            <ChevronRight size={14} />
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="py-2 border-b border-gray-100">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Price Limit</h3>
        <input 
          type="range" min="0" max={absoluteMax} value={maxPrice} 
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black mb-4"
        />
        <div className="flex justify-between text-[10px] font-black uppercase">
          <span>₹0</span> <span>₹{maxPrice}</span>
        </div>
      </div>

      {/* Colors */}
      <div className="py-2 border-b border-gray-100">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Palette</h3>
        <div className="flex flex-wrap gap-2">
          {filters.colors.map((colorValue) => (
            <button 
              key={colorValue} 
              aria-label={`Filter by ${colorValue}`}
              onClick={() => setSelectedColor(selectedColor === colorValue ? '' : colorValue)}
              className={`w-7 h-7 rounded-full border border-gray-100 transition-all ${selectedColor === colorValue ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'}`}
              style={{ backgroundColor: colorValue }}
            />
          ))}
        </div>
      </div>

      <button 
        onClick={clearFilters}
        className="w-full border border-black text-black py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mt-4 hover:bg-black hover:text-white transition-all"
      >
        Reset Filters
      </button>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-black" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-black">
  
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link> 
          <ChevronRight size={10} /> 
          <span className="text-black">Catalog</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 h-fit sticky top-24">
            <FilterContent />
          </aside>

          {/* Mobile Filter Drawer */}
          <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${isFilterOpen ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsFilterOpen(false)} />
            <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 transition-transform duration-500 transform ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
              <FilterContent />
            </div>
          </div>

          <main className="flex-1">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
                  {selectedCategory === 'All' ? 'Collection' : selectedCategory}
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
                  {filteredProducts.length} Pieces Available
                </p>
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-4 bg-black text-white rounded-2xl"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
              {filteredProducts.map((product: any) => (
                <div key={product._id} className="group cursor-pointer" onClick={() => router.push(`/products/${product._id}`)}>
                  <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#F6F6F6] mb-6 relative">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} 
                      alt={product.name} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    {product.salePrice > 0 && (
                      <div className="absolute top-5 left-5 bg-white text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm">
                        Offer
                      </div>
                    )}
                  </div>
                  <div className="px-2">
                    <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 group-hover:underline underline-offset-4">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-black italic">₹{product.salePrice || product.regularPrice}</span>
                      {product.salePrice > 0 && (
                        <span className="text-xs font-bold text-gray-300 line-through">₹{product.regularPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-50 rounded-[3rem]">
                <RotateCcw size={40} className="mb-4 text-gray-200" />
                <p className="font-black uppercase tracking-widest text-[10px] text-gray-400">No matches found</p>
                <button onClick={clearFilters} className="mt-4 text-[10px] font-black uppercase tracking-widest underline underline-offset-8">
                  Refresh Catalog
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}