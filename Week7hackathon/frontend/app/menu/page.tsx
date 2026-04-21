"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, Percent, PieChart, MessageSquare, 
  Bell, Settings, LogOut, Search, ChevronDown, Menu, X 
} from 'lucide-react';
import UserProductCard from '@/src/components/UserProductCard';
import PaymentSidebar from '@/src/components/payment';
import CustomizationModal from '@/src/components/CustomizationModal';
import Navbar from '@/src/components/Navbar';

export default function UserDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderType, setOrderType] = useState('Dine In');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];
  const orderOptions = ['Dine In', 'To Go', 'Delivery'];

  const handleRemoveFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/products/available');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (searchTerm.trim() !== "") return matchesSearch;
    return p.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="flex h-screen bg-[#252836] overflow-hidden text-white font-sans relative">
      
      {/* ─── Sidebar (Desktop Always, Mobile Drawer) ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-24 bg-[#1F1D2B] flex flex-col items-center py-6 gap-2 border-r border-gray-800 transition-transform duration-300
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="bg-[#EA7C69] w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl mb-6 shadow-lg shadow-black/20">J</div>
        <nav className="flex flex-col w-full items-center gap-1">
          <SidebarIcon icon={<Home size={22} />} active onClick={() => setIsSidebarOpen(false)} />
          <SidebarIcon icon={<Percent size={22} />} onClick={() => setIsSidebarOpen(false)} />
          <SidebarIcon icon={<PieChart size={22} />} onClick={() => setIsSidebarOpen(false)} />
          <SidebarIcon icon={<MessageSquare size={22} />} onClick={() => setIsSidebarOpen(false)} />
          <SidebarIcon icon={<Bell size={22} />} onClick={() => setIsSidebarOpen(false)} />
          <SidebarIcon icon={<Settings size={22} />} onClick={() => setIsSidebarOpen(false)} />
        </nav>
        <div className="mt-auto pb-4">
          <button className="p-4 text-[#EA7C69] hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={22} />
          </button>
        </div>
        {/* Mobile Close Button */}
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-[-40px] bg-[#1F1D2B] p-2 rounded-r-lg border-y border-r border-gray-800">
          <X size={20} />
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar 
          cartCount={cart.length} 
          onCartClick={() => setIsPaymentOpen(!isPaymentOpen)} 
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-[#1F1D2B] rounded-lg border border-gray-700">
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Jaegar Resto</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-auto group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search menu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#2D303E] border border-gray-700 rounded-xl pl-12 pr-6 py-3 text-sm w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-[#EA7C69] text-white"
              />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex gap-6 sm:gap-8 border-b border-gray-800 mb-8 sm:mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchTerm(''); }}
                className={`pb-4 text-xs sm:text-sm font-semibold relative transition-colors ${
                  activeCategory === cat && searchTerm === '' ? 'text-[#EA7C69]' : 'text-white hover:text-[#EA7C69]'
                }`}
              >
                {cat}
                {activeCategory === cat && searchTerm === '' && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#EA7C69] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Sub Header (Dropdown + Title) */}
          <div className="flex justify-between items-center mb-10 sm:mb-16">
            <h2 className="text-lg sm:text-xl font-bold">Choose Dishes</h2>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-[#1F1D2B] border border-gray-700 px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-medium hover:bg-[#2D303E] transition-all min-w-[120px] sm:min-w-[140px] justify-between"
              >
                 <ChevronDown size={16} className={`${isDropdownOpen ? 'rotate-180' : ''} transition-all`} />
                 <span>{orderType}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-full bg-[#1F1D2B] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {orderOptions.map((option) => (
                    <button
                      key={option}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-[#EA7C69] hover:text-white transition-colors"
                      onClick={() => {
                        setOrderType(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid - Optimized for Mobile (1 col) to Desktop (3 col) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-16 sm:gap-y-20 pb-20">
            {filteredProducts.map((product: any) => (
              <UserProductCard 
                key={product._id}
                {...product}
                onAddToCart={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Sidebar for Payment (Drawer handles responsiveness internally usually, otherwise it will slide in) */}
      <PaymentSidebar 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        orderType={orderType}
        cart={cart}
        onRemove={(idx: number) => handleRemoveFromCart(idx)}
        onClearCart={() => setCart([])}
      />

      {selectedProduct && (
        <CustomizationModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(customizedData: any) => {
            setCart(prev => [...prev, customizedData]);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

function SidebarIcon({ icon, active = false, onClick }: { icon: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <div className="relative w-full flex justify-center py-2 transition-all">
      {active && (
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#EA7C69] rounded-l-lg shadow-[-4px_0_15px_rgba(234,124,105,0.4)]" />
      )}
      <button 
        onClick={onClick}
        className={`p-4 rounded-xl ${active ? 'bg-[#EA7C69] text-white shadow-xl shadow-[#EA7C69]/30' : 'text-[#EA7C69] hover:bg-[#252836]'}`}
      >
        {icon}
      </button>
    </div>
  );
}