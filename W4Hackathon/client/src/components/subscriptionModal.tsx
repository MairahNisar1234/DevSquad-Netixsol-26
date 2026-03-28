import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const SubscriptionModal = ({ isOpen, onClose, onSuccess }: any) => {
  const { user, token, setSubscription } = useAuthStore();
  const [step, setStep] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  if (!isOpen) return null;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return alert("Please log in again.");

    try {
      const res = await axios.put(`http://localhost:5000/api/auth/${user._id}/subscribe`, {
        plan: selectedPlan.name,
        billingCycle: billingCycle
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSubscription(selectedPlan.name);
      alert(`${selectedPlan.name} Activated Successfully!`);
      onSuccess(selectedPlan.name);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Subscription failed.");
    }
  };

  const plans = [
    { name: 'Basic Plan', monthly: '9.99', yearly: '99.99', desc: 'Standard library access.' },
    { name: 'Standard Plan', monthly: '12.99', yearly: '129.99', desc: 'HD streaming available.' },
    { name: 'Premium Plan', monthly: '14.99', yearly: '149.99', desc: '4K + Offline viewing.' }
  ];

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="bg-[#0F0F0F] w-full max-w-4xl rounded-[2rem] border border-white/10 p-10 relative text-white">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X /></button>

        {step === 1 ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold uppercase italic">Choose Plan</h2>
              <div className="bg-black p-1 rounded-xl flex border border-white/10">
                <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-2 rounded-lg text-xs ${billingCycle === 'monthly' ? 'bg-[#1A1A1A]' : 'text-gray-500'}`}>Monthly</button>
                <button onClick={() => setBillingCycle('yearly')} className={`px-4 py-2 rounded-lg text-xs ${billingCycle === 'yearly' ? 'bg-[#1A1A1A]' : 'text-gray-500'}`}>Yearly</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {plans.map(p => (
                <div key={p.name} className="p-6 rounded-2xl bg-[#141414] border border-white/5 hover:border-red-600 transition-all">
                  <h3 className="font-bold mb-2">{p.name}</h3>
                  <p className="text-3xl font-black italic mb-6">${billingCycle === 'monthly' ? p.monthly : p.yearly}</p>
                  <button onClick={() => { setSelectedPlan(p); setStep(2); }} className="w-full py-3 bg-red-600 rounded-xl text-xs font-bold uppercase">Select</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold text-center italic uppercase">Payment Details</h2>
            <div className="bg-white/5 p-3 rounded-lg text-center text-xs text-gray-400">PLAN: {selectedPlan.name} (${billingCycle})</div>
            <input required type="text" placeholder="Card Number" className="w-full bg-black border border-white/10 p-4 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="MM/YY" className="w-full bg-black border border-white/10 p-4 rounded-xl" />
              <input required type="text" placeholder="CVV" className="w-full bg-black border border-white/10 p-4 rounded-xl" />
            </div>
            <button type="submit" className="w-full bg-red-600 py-4 rounded-xl font-bold uppercase flex items-center justify-center gap-2">
              <Lock size={16} /> Activate Plan
            </button>
            <button onClick={() => setStep(1)} className="w-full text-gray-500 text-xs uppercase">Back</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;