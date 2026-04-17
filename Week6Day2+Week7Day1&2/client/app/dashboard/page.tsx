'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Zap, Loader2, User, Camera, Package, ChevronRight, X } from 'lucide-react';
import Footer from '@/src/components/Footer';
import Navbar from '@/src/components/layout/Navbar';
import toast from 'react-hot-toast';
import { useSocket } from '@/src/context/socketContext';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const { socket } = useSocket();
  const BASE_URL = 'http://localhost:3000/api';

  const avatarGallery = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        setLoading(false);
        setOrdersLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      try {
        const profileRes = await fetch(`${BASE_URL}/auth/profile`, { headers });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData);
        }

        const ordersRes = await fetch(`${BASE_URL}/orders/my-orders`, { headers });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
        setOrdersLoading(false);
      }
    };
    fetchData();
  }, []);

  // REAL-TIME SOCKET LISTENER
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (updatedOrder: any) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
      toast.success(`Order #${updatedOrder._id.slice(-8)} is now ${updatedOrder.status.toUpperCase()}`, {
        icon: '🚚',
        style: { borderRadius: '15px', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
      });
    };

    socket.on('orderStatusUpdated', handleStatusUpdate);
    return () => { socket.off('orderStatusUpdated', handleStatusUpdate); };
  }, [socket]);

  const handleAvatarUpdate = async (url: string) => {
    const token = localStorage.getItem('access_token');
    const loadingToast = toast.loading('Updating avatar...');
    try {
      const res = await fetch(`${BASE_URL}/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: url }),
      });
      if (res.ok) {
        setUser({ ...user, avatar: url });
        setIsAvatarModalOpen(false);
        toast.success('Avatar updated!', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Failed to update', { id: loadingToast });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black" size={32} /></div>;

  return (
    <div className="min-h-screen bg-white">
     
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-4 rotate-3"><Zap size={28} /></div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Dashboard</h1>
        </div>

        <div className="bg-black rounded-[40px] p-8 md:p-10 text-white mb-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/10 bg-zinc-900 flex items-center justify-center transition-transform group-hover:scale-105">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" /> : <User size={40} className="text-white/20" />}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-xl border-4 border-black text-black"><Camera size={16} /></div>
            </div>
            <div className="text-center md:text-left flex-1">
              <p className="text-green-400 text-[10px] uppercase font-black tracking-[0.2em]">Verified Member</p>
              <h3 className="text-3xl font-black uppercase tracking-tight">{user?.name || 'User'}</h3>
              <p className="text-white/60 text-sm">{user?.email}</p>
              <div className="flex gap-2 mt-4 flex-wrap justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">POINTS: {user?.loyaltyPoints || 0}</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">ROLE: {user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 mb-6"><Package size={24} /> My Orders</h2>
          {ordersLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-200" /></div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const isOpen = openOrderId === order._id;
                return (
                  <div key={order._id} className={`bg-white border rounded-[30px] transition-all overflow-hidden ${isOpen ? 'border-black shadow-xl' : 'border-gray-100'}`}>
                    <div className="p-6 cursor-pointer flex justify-between items-center" onClick={() => setOpenOrderId(isOpen ? null : order._id)}>
                      <div className="flex gap-5 items-center">
                        <div className="w-12 h-12 bg-gray-100 text-black rounded-2xl flex items-center justify-center font-black">{index + 1}</div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase">Ref: #{order._id.slice(-8)}</p>
                          <h4 className="font-bold text-sm text-black">{order.items[0]?.productName || "Purchase"}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-black text-lg text-black">₹{order.totalAmount}</p>
                          <p className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {order.status}
                          </p>
                        </div>
                        <ChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    {isOpen && (
                      <div className="px-8 pb-8 pt-2 bg-gray-50/50 border-t border-gray-100">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between py-3 border-b border-dashed last:border-0">
                            <span className="text-sm font-bold">{item.productName} (x{item.quantity})</span>
                            <span className="text-sm font-black">₹{item.priceAtPurchase}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-20 border-2 border-dashed border-gray-100 rounded-[40px]"><p className="text-gray-400 font-bold uppercase text-xs">No orders found</p></div>
          )}
        </div>

        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsAvatarModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={24} /></button>
              <h3 className="text-2xl font-black uppercase mb-2">Choose Avatar</h3>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {avatarGallery.map((url, i) => (
                  <button key={i} onClick={() => handleAvatarUpdate(url)} className="aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-black transition-all hover:scale-110 bg-gray-50">
                    <img src={url} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button onClick={() => setIsAvatarModalOpen(false)} className="w-full py-4 bg-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}