"use client";
import React, { useState } from 'react';
import { X, CreditCard, Landmark, Wallet, Trash2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface PaymentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  onRemove: (idx: number) => void;
  onClearCart: () => void;
  orderType: string;
}

export default function PaymentSidebar({ 
  isOpen, 
  onClose, 
  cart = [], 
  onRemove, 
  onClearCart, 
  orderType 
}: PaymentSidebarProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart?.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + (price * qty);
  }, 0) || 0;

  const handleConfirmOrder = async () => {
    if (!cart || cart.length === 0) return;
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price,
          notes: item.orderNote || item.summary || "Standard", 
          customizations: item.customizedRecipe
        })),
        totalAmount: subtotal,
        orderType: orderType || "Dine In",
        status: 'Pending',
        orderDate: new Date()
      };

      await axios.post('http://localhost:3000/api/orders', orderData);
      
      alert("Order Successfully Placed!");
      onClearCart();
      setShowPayment(false);
      onClose();
    } catch (err) {
      console.error("Order failed:", err);
      alert("Error saving order. Check your backend schema.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[150] flex justify-end">
      {/* Background Overlay Click to Close (Mobile) */}
      <div className="absolute inset-0 md:hidden" onClick={onClose} />

      <div className={`relative bg-[#1F1D2B] h-full flex transition-all duration-300 shadow-2xl overflow-hidden
        ${showPayment ? 'max-w-full md:max-w-5xl' : 'max-w-full md:max-w-md'} w-full`}>
        
        {/* PANEL 1: CONFIRMATION (CART) */}
        <div className={`flex-1 flex flex-col p-4 sm:p-6 border-r border-gray-800 transition-all duration-300
          ${showPayment ? 'hidden md:flex' : 'flex'}`}>
          
          <header className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-xl sm:text-2xl font-bold text-white">Confirmation</h2>
               <span className="text-[#EA7C69] text-[10px] font-bold uppercase tracking-widest">{orderType}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <X size={24} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div key={idx} className="bg-[#2D303E]/30 p-3 sm:p-4 rounded-2xl border border-gray-800">
                  <div className="flex justify-between mb-2 gap-2">
                    <div className="flex gap-3 min-w-0">
                      <img src={item.imageUrl} className="w-10 h-10 rounded-full object-cover shrink-0" alt={item.name} />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-[#EA7C69] text-xs">${Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-white font-bold text-sm shrink-0">
                      ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 text-[10px] sm:text-[11px] text-gray-400 bg-[#1F1D2B] p-2 rounded-lg border border-gray-800 italic truncate">
                      {item.orderNote ? `Note: ${item.orderNote}` : (item.summary || "Standard Recipe")}
                    </div>
                    <button 
                      onClick={() => onRemove(idx)} 
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800 space-y-4 shrink-0">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs sm:text-sm uppercase tracking-wider">Subtotal</span>
              <span className="text-white text-xl sm:text-2xl font-bold">${subtotal.toFixed(2)}</span>
            </div>

            {!showPayment && (
              <button 
                onClick={() => setShowPayment(true)}
                disabled={cart.length === 0}
                className="w-full bg-[#EA7C69] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#EA7C69]/30 disabled:opacity-50 active:scale-95 transition-all"
              >
                Continue to Payment
              </button>
            )}
          </div>
        </div>

        {/* PANEL 2: PAYMENT INFO */}
        {showPayment && (
          <div className="absolute inset-0 md:relative md:inset-auto w-full md:w-[420px] p-6 sm:p-8 bg-[#1F1D2B] flex flex-col border-l border-gray-800 z-10">
            <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => setShowPayment(false)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Payment</h2>
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs mb-6 sm:mb-8 ml-10 md:ml-0">Choose method and finalize order</p>
            
            <div className="space-y-6 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <div>
                <label className="text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest block mb-4">Payment Method</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-3 sm:p-4 border border-[#EA7C69] rounded-2xl flex flex-col items-center gap-2 text-[#EA7C69] bg-[#2D303E] cursor-pointer">
                    <CreditCard size={20} /><span className="text-[9px] sm:text-[10px] font-bold">Card</span>
                  </div>
                  <div className="p-3 sm:p-4 border border-gray-800 rounded-2xl flex flex-col items-center gap-2 text-gray-500 hover:border-gray-600 transition-colors cursor-pointer">
                    <Landmark size={20} /><span className="text-[9px] sm:text-[10px] font-bold">Bank</span>
                  </div>
                  <div className="p-3 sm:p-4 border border-gray-800 rounded-2xl flex flex-col items-center gap-2 text-gray-500 hover:border-gray-600 transition-colors cursor-pointer">
                    <Wallet size={20} /><span className="text-[9px] sm:text-[10px] font-bold">Cash</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Cardholder Name</label>
                  <input placeholder="Cardholder Name" className="w-full bg-[#2D303E] border border-gray-800 rounded-xl p-3 sm:p-4 text-white text-sm outline-none focus:border-[#EA7C69] transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Card Number</label>
                  <input placeholder="Card Number" className="w-full bg-[#2D303E] border border-gray-800 rounded-xl p-3 sm:p-4 text-white text-sm outline-none focus:border-[#EA7C69] transition-all" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Expiry Date</label>
                    <input placeholder="MM/YY" className="w-full bg-[#2D303E] border border-gray-800 rounded-xl p-3 sm:p-4 text-white text-sm outline-none focus:border-[#EA7C69] transition-all" />
                  </div>
                  <div className="w-1/2 space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">CVV</label>
                    <input placeholder="CVV" type="password" className="w-full bg-[#2D303E] border border-gray-800 rounded-xl p-3 sm:p-4 text-white text-sm outline-none focus:border-[#EA7C69] transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-6 pt-4 border-t border-gray-800 shrink-0">
              <button 
                onClick={() => setShowPayment(false)} 
                className="hidden md:block flex-1 py-4 rounded-2xl border border-[#EA7C69] text-[#EA7C69] font-bold hover:bg-[#EA7C69]/5 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="flex-[2] md:flex-1 py-4 rounded-2xl bg-[#EA7C69] text-white font-bold shadow-lg shadow-[#EA7C69]/30 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}