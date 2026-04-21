"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import ProductCard from '@/src/components/ProductCard';
import SidebarOrder from '@/src/components/SideBar';
import { Search, Loader2, ShoppingCart, X } from 'lucide-react';

/** * IMPORTANT: If SidebarOrder still shows an error below, 
 * make sure the component in @/src/components/SideBar.tsx 
 * is exported as: 
 * export default function SidebarOrder({ cart, setCart }: { cart: any[], setCart: Dispatch<SetStateAction<any[]>> }) 
 */

export default function OrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/products/available?t=${Date.now()}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    if (product.available <= 0) return;

    setCart((prev) => {
      const isExist = prev.find((item) => item._id === product._id);
      if (isExist) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const filteredProducts = products.filter((p: any) => 
    p.category?.toLowerCase() === activeCategory.toLowerCase() &&
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#252836] text-white overflow-hidden relative">
      
      {/* ─── Main Menu Section ─── */}
      <section className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar pb-24 lg:pb-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex justify-between items-center w-full lg:w-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Jaegar Resto</h1>
              <p className="text-gray-400 text-sm">Friday, 17 Apr 2026</p>
            </div>
            
            {/* Mobile Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="lg:hidden relative p-3 bg-[#1F1D2B] rounded-xl border border-gray-700 active:scale-95 transition-all"
            >
              <ShoppingCart size={20} className="text-[#EA7C69]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EA7C69] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#252836] font-bold">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EA7C69] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2D303E] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-[#EA7C69] outline-none transition-all placeholder:text-gray-500"
            />
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 sm:gap-8 border-b border-gray-800 mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pb-4 text-sm font-medium relative transition-colors ${
                activeCategory === cat ? 'text-[#EA7C69]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#EA7C69] rounded-full shadow-[0_0_8px_#EA7C69]" />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#EA7C69]" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-16 sm:gap-y-20 pb-10">
            {filteredProducts.map((product: any) => (
              <div 
                key={product._id} 
                onClick={() => addToCart(product)}
                className={`transition-transform active:scale-95 ${product.available > 0 ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
              >
                <ProductCard 
                  _id={product._id}
                  name={product.name}
                  price={product.price}
                  available={product.available}
                  imageUrl={product.imageUrl}
                  productData={product}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Cart Sidebar ─── */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#1F1D2B] shadow-2xl transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:w-[400px] lg:z-0 lg:shadow-none
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
          <span className="font-bold">Current Order</span>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 bg-[#2D303E] rounded-lg text-gray-400 active:scale-90"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* The Fix: Passing props to SidebarOrder */}
        <SidebarOrder cart={cart} setCart={setCart} />
      </div>

      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}