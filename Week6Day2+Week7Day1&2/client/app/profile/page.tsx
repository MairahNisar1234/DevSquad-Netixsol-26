'use client';

import React, { useState, useEffect } from 'react';
import { Award, ArrowUpRight, ArrowDownLeft, Zap, Loader2, Info } from 'lucide-react';
import Footer from '@/src/components/Footer';
import Navbar from '@/src/components/layout/Navbar';

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
          setLoading(false);
          return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };
        const API_BASE = 'http://localhost:3000/api';

        // Parallel fetching for better performance
        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE}/auth/profile`, { headers }),
          fetch(`${API_BASE}/orders/user/my-orders`, { headers })
        ]);

        if (profileRes.ok) setUserData(await profileRes.json());
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
        
      } catch (err) {
        console.error("Loyalty data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPointsSpent = orders.reduce((acc, order) => {
    return acc + (Number(order.summary?.pointsUsed) || 0);
  }, 0);

  const currentBalance = userData?.loyaltyPoints || 0;
  const lifetimeEarned = currentBalance + totalPointsSpent;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-black" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
  
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-4 rotate-3">
            <Zap size={28} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">Elite Rewards</h1>
          <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">Membership ID: #{userData?._id?.slice(-6) || '000000'}</p>
        </div>

        {/* --- POINTS DASHBOARD --- */}
        <div className="space-y-4 mb-12">
          
          {/* Main Balance Card */}
          <div className="bg-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Available Balance</span>
                <Award className="text-emerald-400" size={24} />
              </div>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-7xl font-black tracking-tighter">{currentBalance}</span>
                <span className="text-lg font-bold text-emerald-400 uppercase tracking-widest">Points</span>
              </div>
              
              <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tier Status</p>
                  <p className="text-sm font-black uppercase tracking-tight">Gold Member</p>
                </div>
                <button className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  View Benefits
                </button>
              </div>
            </div>
            {/* Animated Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-700" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F9F9F9] rounded-[2rem] p-6 border border-gray-100">
              <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-4">
                <ArrowDownLeft size={18} />
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Spent</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{totalPointsSpent}</p>
            </div>

            <div className="bg-[#F9F9F9] rounded-[2rem] p-6 border border-gray-100">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <ArrowUpRight size={18} />
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Lifetime Earned</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{lifetimeEarned}</p>
            </div>
          </div>
        </div>

        {/* --- HISTORY SECTION --- */}
        <div>
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Transaction Log</h3>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase cursor-help">
              <Info size={12} />
              <span>How it works</span>
            </div>
          </div>

          <div className="space-y-2">
            {orders.filter(o => (o.summary?.pointsUsed || 0) > 0).length > 0 ? (
              orders
                .filter(o => o.summary?.pointsUsed > 0)
                .map((order) => (
                <div key={order._id} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[1.5rem] hover:border-black transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 text-[10px] font-black border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                      #{order._id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-gray-900">Redemption</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-red-500">-{order.summary.pointsUsed}</span>
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">Points</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">No spending history found</p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Teaser */}
        <div className="mt-12 bg-emerald-50 rounded-[2rem] p-8 flex items-center justify-between border border-emerald-100">
            <div className="max-w-[60%]">
                <p className="text-emerald-900 font-black text-lg leading-tight uppercase tracking-tighter">Refer a friend, get 500 PTS</p>
                <p className="text-emerald-700/60 text-xs mt-1 font-medium">Your circle deserves the best too.</p>
            </div>
            <button className="bg-emerald-500 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                Invite
            </button>
        </div>

      </div>
      <Footer />
    </div>
  );
}