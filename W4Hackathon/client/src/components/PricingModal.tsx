import React, { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planName: string, cycle: 'monthly' | 'yearly') => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [step, setStep] = useState<'plans' | 'payment'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const plans = [
    { 
      name: 'Basic', 
      monthly: '9.99', 
      yearly: '99.99', 
      desc: 'Enjoy an extensive library of movies and shows, featuring a range of content.' 
    },
    { 
      name: 'Standard', 
      monthly: '12.99', 
      yearly: '129.99', 
      desc: 'Access to a wider selection of movies and shows, including most new releases.' 
    },
    { 
      name: 'Premium', 
      monthly: '14.99', 
      yearly: '149.99', 
      desc: 'Access to a widest selection of movies and shows, including Offline Viewing.' 
    }
  ];

  const handlePlanClick = (name: string) => {
    setSelectedPlan(name);
    setStep('payment');
  };

  const handleDummySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectPlan(selectedPlan, billingCycle);
    setStep('plans'); 
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#0F0F0F] border border-white/5 w-full max-w-5xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={28} />
        </button>

        {step === 'plans' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="text-left">
                <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">Choose the plan that's right for you</h2>
                <p className="text-gray-500 text-sm max-w-xl">Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences.</p>
              </div>

              {/* Toggle Switch */}
              <div className="bg-black border border-white/10 p-1.5 rounded-2xl flex items-center">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${billingCycle === 'yearly' ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className="bg-[#141414] border border-white/5 p-10 rounded-[2.5rem] hover:border-red-600 transition-all flex flex-col justify-between group">
                  <div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{plan.name} Plan</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-8 h-12">{plan.desc}</p>
                    <p className="text-4xl font-black italic mb-10 flex items-baseline gap-1">
                      ${billingCycle === 'monthly' ? plan.monthly : plan.yearly}
                      <span className="text-[10px] text-gray-500 not-italic font-bold uppercase tracking-widest"> 
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handlePlanClick(plan.name)}
                      className="flex-1 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/10"
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto py-10">
            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-red-600/10 rounded-full text-red-600 mb-4">
                <CreditCard size={32} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Complete Payment</h2>
              <p className="text-gray-500 text-sm mt-2">
                Confirming <span className="text-red-600 font-bold">{selectedPlan}</span> ({billingCycle})
              </p>
            </div>

            <form onSubmit={handleDummySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">Card Number</label>
                <input type="text" placeholder="4444 4444 4444 4444" required className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-red-600 text-white font-mono" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">Expiry</label>
                  <input type="text" placeholder="MM/YY" required className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-red-600 text-white"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-2 tracking-widest">CVV</label>
                  <input type="text" placeholder="123" required className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-red-600 text-white"/>
                </div>
              </div>

              <button className="w-full bg-red-600 py-5 mt-6 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-600/20">
                <Lock size={18} /> Unlock {selectedPlan}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep('plans')}
                className="w-full text-gray-500 text-[10px] uppercase font-black tracking-widest hover:text-white transition-colors mt-4"
              >
                Go Back to Plans
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingModal;