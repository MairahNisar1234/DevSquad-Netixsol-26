"use client";
import React from 'react';
import { Trash2 } from 'lucide-react';

export default function SidebarOrder({ cart, setCart }: any) {
  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  const removeItem = (id: string) => {
    setCart(cart.filter((item: any) => item._id !== id));
  };

  return (
    <aside className="w-full lg:w-[400px] bg-[#1F1D2B] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-800 h-full lg:sticky lg:top-0">
      <div className="p-4 sm:p-6 flex flex-col flex-1 overflow-hidden">
        <h2 className="text-xl font-bold mb-4 text-white">Orders #34562</h2>
        
        {/* Order Type Tabs - Scrollable on very small screens */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap active:scale-95 transition-transform">Dine In</button>
          <button className="border border-gray-700 text-primary px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap active:scale-95 transition-transform">To Go</button>
          <button className="border border-gray-700 text-primary px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap active:scale-95 transition-transform">Delivery</button>
        </div>

        {/* Column Headers */}
        <div className="flex justify-between text-xs sm:text-sm font-semibold border-b border-gray-800 pb-4 mb-4 text-white">
          <span className="flex-[2]">Item</span>
          <span className="flex-1 text-center">Qty</span>
          <span className="flex-1 text-right">Price</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar min-h-[200px]">
          {cart.length > 0 ? (
            cart.map((item: any) => (
              <div key={item._id} className="flex items-center gap-2 sm:gap-4 group">
                <div className="flex-[2] flex gap-2 min-w-0">
                  <img src={item.imageUrl} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" alt="" />
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-xs text-textGray">$ {item.price}</p>
                  </div>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className="bg-[#2D303E] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm border border-gray-700 text-white">
                    {item.quantity}
                  </div>
                </div>
                
                <div className="flex-1 text-right font-medium text-white text-xs sm:text-sm">
                  $ {(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeItem(item._id)} 
                  className="text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
              <p className="text-sm">Empty plate...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Calculation - Sticky at bottom */}
      <div className="mt-auto p-4 sm:p-6 border-t border-gray-800 space-y-3 sm:space-y-4 bg-[#1F1D2B] mb-20 md:mb-0">
        <div className="flex justify-between text-xs sm:text-sm text-textGray">
          <span>Discount</span>
          <span className="text-white">$ 0.00</span>
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-textGray">
          <span>Sub total</span>
          <span className="text-white font-bold">$ {subtotal.toFixed(2)}</span>
        </div>
        
        <button 
          disabled={cart.length === 0}
          className="w-full bg-primary text-white py-3 sm:py-4 rounded-xl font-bold shadow-primary hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
        >
          Continue to Payment
        </button>
      </div>
    </aside>
  );
}