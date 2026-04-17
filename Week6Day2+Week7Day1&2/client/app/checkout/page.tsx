'use client';

import React, { useState, Suspense } from 'react';
import { useCart } from '@/src/context/cartContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CreditCard, MapPin , CheckCircle} from 'lucide-react';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/Footer';

// Keeping your specific Next.js config
export const dynamic = 'force-dynamic';

// Inner component to handle logic and use searchParams safely
function CheckoutContent() {
  const router = useRouter();
  const { cart = [], clearCart } = useCart();
  const searchParams = useSearchParams();
  const pointsUsed = Number(searchParams.get('pointsUsed')) || 0;

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.salePrice || item.regularPrice) * item.quantity, 0);
  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = 15;
  const total = Math.max(subtotal - discount + deliveryFee - pointsUsed, 0);
  const earnedPoints = Math.floor(total / 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const cleanCard = formData.cardNumber.replace(/\D/g, '');

    if (formData.fullName.length < 3) return showToast("Please enter your full name.");
    if (cleanPhone.length < 10) return showToast("Invalid phone number.");
    if (formData.address.length < 10) return showToast("Address is too short.");
    if (cleanCard.length < 13) return showToast("Invalid card details.");

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: "customer@example.com", 
          phoneNumber: cleanPhone,
          address: formData.address,
          paymentMethod: 'Card',
          lastFourDigits: cleanCard.slice(-4),
          items: cart.map((item: any) => ({
            productId: item._id,
            productName: item.name,
            quantity: item.quantity,
            size: item.size || 'M', 
            color: item.color || 'Default',
            priceAtPurchase: item.salePrice || item.regularPrice
          })),
          totalAmount: total
        })
      });

      if (res.ok) {
        clearCart();
        setOrderSuccess(true);
        setTimeout(() => router.push('/'), 3000);
      } else {
        const err = await res.json();
        showToast(err.message || "Order failed.");
      }
    } catch {
      showToast("Server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
        <CheckCircle size={60} className="text-emerald-500 animate-bounce" />
        <h1 className="text-4xl font-black uppercase">Order Confirmed</h1>
        <p className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold">You earned {earnedPoints} Points!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black uppercase mb-8">Secure Checkout</h1>
      
      {toast && (
        <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${toast.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-black text-white'}`}>
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-black uppercase text-sm flex items-center gap-2"><MapPin size={18}/> Shipping</h2>
            <input placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" required />
            <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" required />
            <textarea placeholder="Complete Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none h-32" required />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-black uppercase text-sm flex items-center gap-2"><CreditCard size={18}/> Payment</h2>
            <input placeholder="Card Number" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="MM/YY" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} className="bg-gray-50 p-4 rounded-2xl outline-none" required />
              <input placeholder="CVV" type="password" value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value})} className="bg-gray-50 p-4 rounded-2xl outline-none" required />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h2 className="font-black uppercase text-xl mb-6">Summary</h2>
          <div className="space-y-3 pb-6 border-b border-gray-50">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">₹{subtotal}</span></div>
            <div className="flex justify-between text-sm text-red-500"><span>Discount (20%)</span><span className="font-bold">-₹{discount}</span></div>
            {pointsUsed > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Points Used</span><span className="font-bold">-₹{pointsUsed}</span></div>}
            <div className="flex justify-between text-sm"><span>Delivery Fee</span><span className="font-bold">₹{deliveryFee}</span></div>
          </div>
          <div className="flex justify-between items-center py-6">
            <span className="font-black text-2xl uppercase">Total</span>
            <span className="font-black text-3xl">₹{total}</span>
          </div>
          <button disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center">
            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

// MAIN DEFAULT EXPORT
export default function Page() {
  return (
    <>
     
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={30} /></div>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
}