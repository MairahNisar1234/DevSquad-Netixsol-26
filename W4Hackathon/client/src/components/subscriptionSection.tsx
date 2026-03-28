import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const SubscriptionSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const plans = [
    { 
      name: 'Basic Plan', 
      monthly: '9.99', 
      yearly: '99.99', 
      desc: 'Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.' 
    },
    { 
      name: 'Standard Plan', 
      monthly: '12.99', 
      yearly: '129.99', 
      desc: 'Access to a wider selection of movies and shows, including most new releases and exclusive content.' 
    },
    { 
      name: 'Premium Plan', 
      monthly: '14.99', 
      yearly: '149.99', 
      desc: 'Access to a widest selection of movies and shows, including all new releases and Offline Viewing' 
    }
  ];

  const handlePlanSelection = (planName: string) => {
    if (!user) {
      navigate('/signup');
    } else {
      navigate('/subscriptions', { state: { selectedPlan: planName, cycle: billingCycle } });
    }
  };

  return (
    <section className="bg-[#0F0F0F] text-white py-20 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header & Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose the plan that's right for you</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!
            </p>
          </div>

          <div className="bg-black p-2 rounded-xl flex border border-white/10 self-start">
            <button 
              onClick={() => setBillingCycle('monthly')} 
              className={`px-6 py-3 rounded-md text-sm transition-all ${
                billingCycle === 'monthly' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')} 
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                billingCycle === 'yearly' ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className="p-8 md:p-12 bg-[#141414] border border-white/10 hover:border-red-600/50 transition-all duration-500 flex flex-col h-full rounded-[2rem]"
            >
              <h3 className="text-xl md:text-2xl font-normal mb-4">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-10 flex-grow leading-relaxed">
                {plan.desc}
              </p>
              
              {/* Updated Price Section: Smaller and Not Bold */}
              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-normal">
                  ${billingCycle === 'monthly' ? plan.monthly : plan.yearly}
                </span>
                <span className="text-gray-500 text-sm font-light ml-1">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex-1 py-4 bg-[#1A1A1A] border border-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded-xl"
                >
                  Start Free Trial
                </button>
                <button 
                  onClick={() => handlePlanSelection(plan.name)}
                  className="flex-1 py-4 bg-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/10"
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;