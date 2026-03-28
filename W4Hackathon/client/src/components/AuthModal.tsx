import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', 
    subscriptionPlan: 'Basic Plan',
    cardNumber: '', expiry: '', cvv: '' 
  });
  
  const { login, signup, loading, error, setAuthModalOpen } = useAuthStore();
  const navigate = useNavigate();

  const plans = [
    { name: 'Basic Plan', monthly: '9.99', yearly: '99.99' },
    { name: 'Standard Plan', monthly: '12.99', yearly: '129.99' },
    { name: 'Premium Plan', monthly: '14.99', yearly: '149.99' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login({ email: formData.email, password: formData.password });
      if (success) setAuthModalOpen(false);
    } else {
      if (step === 1) setStep(2);
      else if (step === 2) setStep(3);
      else {
        // Send billingCycle along with other data
        const success = await signup({ ...formData, billingCycle });
        if (success) {
          setAuthModalOpen(false);
          navigate('/browse');
        }
      }
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 text-white">
      
      {/* HEADER */}
      <div className="p-8 text-center bg-[#141414] border-b border-white/5">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">StreamVibe</h2>
        <div className="flex justify-center gap-2 mt-2">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 w-8 rounded-full transition-all ${!isLogin && step >= s ? 'bg-red-600' : 'bg-white/10'}`} />
            ))}
        </div>
      </div>

      <div className="p-10">
        {error && <p className="mb-6 p-3 bg-red-600/10 text-red-500 rounded-xl text-xs text-center border border-red-600/20 font-bold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isLogin ? (
            <>
              <input type="email" placeholder="Email" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-red-600 transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Password" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-red-600 transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <input type="text" placeholder="Full Name" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none"
                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <input type="email" placeholder="Email" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none"
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  <input type="password" placeholder="Password" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right duration-300">
                  {/* TOGGLE */}
                  <div className="bg-black border border-white/10 p-1 rounded-xl flex items-center mb-4">
                    <button type="button" onClick={() => setBillingCycle('monthly')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${billingCycle === 'monthly' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500'}`}>Monthly</button>
                    <button type="button" onClick={() => setBillingCycle('yearly')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${billingCycle === 'yearly' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500'}`}>Yearly</button>
                  </div>
                  
                  {plans.map((plan) => (
                    <div key={plan.name} onClick={() => setFormData({...formData, subscriptionPlan: plan.name})}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${formData.subscriptionPlan === plan.name ? 'border-red-600 bg-red-600/5' : 'border-white/5 hover:border-white/20'}`}>
                      <div>
                        <p className="font-bold text-sm">{plan.name}</p>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">${billingCycle === 'monthly' ? plan.monthly : plan.yearly} / {billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
                      </div>
                      {formData.subscriptionPlan === plan.name && <CheckCircle size={18} className="text-red-600" />}
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2"><ShieldCheck size={14} className="text-green-500"/> Secure Payment</div>
                  <input type="text" placeholder="Card Number (Dummy)" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none"
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none"
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})} />
                    <input type="text" placeholder="CVV" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-red-600 outline-none"
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})} />
                  </div>
                </div>
              )}
            </>
          )}

          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-700 shadow-xl shadow-red-600/10 transition-all active:scale-[0.98]">
            {loading ? 'Processing...' : step === 3 || isLogin ? 'Confirm' : 'Next Step'}
          </button>
          
          {!isLogin && step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="w-full text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              <ArrowLeft size={10} className="inline mr-1"/> Back
            </button>
          )}
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-10 font-black uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors" 
           onClick={() => {setIsLogin(!isLogin); setStep(1);}}>
          {isLogin ? "Join the Vibe • Sign Up" : "Already a member? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;