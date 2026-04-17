'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/src/context/cartContext';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/Footer';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [userPoints, setUserPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Fetch User Loyalty Points
  useEffect(() => {
    // Inside useEffect
const fetchPoints = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const res = await fetch('http://localhost:3000/api/auth/profile', { // Use localhost or env variable
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    console.log("👤 Profile Data Received:", data); // DEBUG: Check what the backend actually sends

    // Safer extraction
    const points = data.loyaltyPoints ?? data.user?.loyaltyPoints ?? 0;
    
    console.log("⭐ Points set to:", points);
    setUserPoints(points);
  } catch (err) {
    console.error("❌ Points fetch failed:", err);
  }
};
    fetchPoints();
  }, []);

  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 3500);
      return () => clearTimeout(t);
    }
  }, [alert]);

  // 2. SMART CALCULATION LOGIC
  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.salePrice || item.regularPrice) * item.quantity, 0);
  const discount = Math.round(subtotal * 0.2); 
  const deliveryFee = 15;
  const currentTotalBeforePoints = subtotal - discount + deliveryFee;

  const pointsNeeded = Math.min(userPoints, currentTotalBeforePoints);
  const pointsValue = usePoints ? pointsNeeded : 0;
  const total = currentTotalBeforePoints - pointsValue;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setAlert({ type: 'error', message: 'Please enter a promo code.' });
      return;
    }
    setAlert({ type: 'error', message: `Code "${promoCode}" is invalid or expired.` });
  };

 const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setAlert({ type: 'error', message: 'Please login to checkout' });
        return;
      }

      // 1. DATA SANITIZATION (Matching Mongoose Schema)
      const sanitizedItems = cart.map((item: any) => ({
        productId: item._id, // CHANGED: Changed '_id' to 'productId'
        name: item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(item.salePrice || item.regularPrice || 0),
        size: item.size || 'N/A'
      }));

      const payload = {
        items: sanitizedItems,
        pointsUsed: Number(pointsValue) || 0,
        totalAmount: Number(total) || 0 // Ensure this matches your Order schema key exactly
      };

      console.log("📦 Sending finalized payload to DB & Stripe:", payload);

      // 2. API CALL
      const response = await fetch('http://localhost:3000/api/orders/checkout/stripe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Database validation failed');
      }

      if (data.url) {
        window.location.href = data.url; 
      }
    } catch (err: any) {
      console.error("🔥 Error:", err);
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag size={38} className="text-gray-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-400 mt-2 text-sm">Looks like you haven't added anything yet.</p>
          </div>
          <Link href="/" className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors">
            Start Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pb-10 md:pb-20">
        {alert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold bg-white border border-gray-100 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            {alert.type === 'success' ? <CheckCircle size={18} className="text-green-500 shrink-0" /> : <AlertCircle size={18} className="text-red-400 shrink-0" />}
            <p className={alert.type === 'success' ? 'text-green-800' : 'text-red-700'}>{alert.message}</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10">
          <nav className="text-[10px] md:text-xs text-gray-400 mb-6 flex items-center gap-1.5 uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span className="text-black font-black">Cart</span>
          </nav>

          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 md:mb-10 uppercase tracking-tighter">Your Bag</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3 space-y-4">
              <div className="border border-gray-100 rounded-2xl md:rounded-3xl overflow-hidden divide-y divide-gray-50 shadow-sm">
                {cart.map((item: any) => (
                  <div key={`${item._id}-${item.size}`} className="flex gap-4 p-4 md:p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="w-20 h-24 md:w-28 md:h-36 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img src={item.images?.[0]?.url || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-gray-900 text-xs md:text-sm uppercase tracking-tight truncate leading-tight">{item.name}</h3>
                          <p className="text-[10px] md:text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">Size: <span className="text-black">{item.size}</span></p>
                        </div>
                        <button onClick={() => removeFromCart(item._id, item.size)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors shrink-0 rounded-lg hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-black text-gray-900 text-base md:text-lg">₹{item.salePrice || item.regularPrice}</span>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-1.5 md:py-2">
                          <button onClick={() => updateQuantity(item._id, item.size, -1)} className="text-gray-400 hover:text-black transition-colors"><Minus size={14} /></button>
                          <span className="font-black text-xs md:text-sm w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.size, 1)} className="text-gray-400 hover:text-black transition-colors"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
              <div className="bg-gray-50/50 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-6 border border-gray-100">
                <h2 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-widest">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-black">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm text-red-500">
                    <span className="font-medium">Discount (-20%)</span>
                    <span className="font-black">-₹{discount}</span>
                  </div>
                  {usePoints && (
                    <div className="flex justify-between text-xs md:text-sm text-emerald-600">
                      <span className="font-medium">Loyalty Credit Used</span>
                      <span className="font-black">-₹{pointsValue}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500 font-medium">Delivery Fee</span>
                    <span className="font-black">₹{deliveryFee}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5 flex justify-between items-center">
                  <span className="text-sm md:text-base font-black uppercase tracking-tight">Total Payable</span>
                  <span className="text-2xl md:text-3xl font-black tracking-tighter">₹{total > 0 ? total : 0}</span>
                </div>

                <div className="flex gap-2">
                  <input type="text" placeholder="PROMO CODE" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold outline-none focus:ring-2 focus:ring-black/5 uppercase tracking-widest transition-all" />
                  <button onClick={handleApplyPromo} className="px-6 py-3 bg-black text-white rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95">Apply</button>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-black text-white py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98] disabled:bg-gray-400"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Checkout Now <ArrowRight size={16} /></>}
                </button>

                {userPoints > 0 && (
                  <button onClick={() => setUsePoints(!usePoints)} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${usePoints ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100'}`}>
                    <span>Redeem {userPoints} Points</span>
                    <div className={`w-8 h-4 md:w-10 md:h-5 rounded-full p-0.5 flex items-center ${usePoints ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                      <div className={`bg-white w-3 h-3 md:w-4 md:h-4 rounded-full transition-transform ${usePoints ? 'translate-x-4 md:translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}