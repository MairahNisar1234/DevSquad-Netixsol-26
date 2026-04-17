'use client';

import React, { useEffect, useState, useMemo, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  TrendingUp,
  Package,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ChevronRight,
  Clock,
  MoreVertical,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { toast, Toaster } from 'react-hot-toast';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';

export const dynamic = 'force-dynamic';

const BACKEND_URL = 'http://localhost:3000';
const API_BASE_URL = `${BACKEND_URL}/api`;

/* ================== PAGE WRAPPER ================== */
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
          <Loader2 className="animate-spin text-black" size={32} />
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}

/* ================== DASHBOARD ================== */
function AdminDashboard() {
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/orders`),
        fetch(`${API_BASE_URL}/products`),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.data || []);
      setProducts(Array.isArray(productsData) ? productsData : productsData.data || []);
    } catch (err) {
      console.error('Dashboard Error:', err);
      toast.error('Failed to sync with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, { transports: ['websocket'] });
    fetchDashboardData();

    socketRef.current.on('admin-new-order', () => {
      toast.success(`New Order Received!`, { icon: '💰' });
      fetchDashboardData();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  /* ================== REAL STATS ================== */
  const stats = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        const amount = Number(o.totalAmount) || 0;
        const status = o.status?.toLowerCase();
        acc.totalRevenue += amount;
        if (status === 'delivered') acc.completedCount += 1;
        else if (status === 'canceled' || status === 'cancelled') acc.returnCount += 1;
        else acc.activeCount += 1;
        return acc;
      },
      { totalRevenue: 0, activeCount: 0, completedCount: 0, returnCount: 0 }
    );
  }, [orders]);

  const chartData = useMemo(() => {
    const months: Record<string, number> = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'short' });
      months[monthYear] = (months[monthYear] || 0) + (Number(order.totalAmount) || 0);
    });
    return Object.keys(months).map(key => ({
      name: key.toUpperCase(),
      revenue: months[key]
    })).slice(-6);
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[#F8F9FA] pb-20 font-sans">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
            <TrendingUp size={32} />
            Command Center
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ml-1">
            Real-time Enterprise Analytics
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-500">
          <Calendar size={14} />
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} color="bg-black" trend="+14.2%" />
        <StatCard title="Active Orders" value={stats.activeCount} icon={<Package size={20} />} color="bg-orange-500" trend="+5.1%" />
        <StatCard title="Completed" value={stats.completedCount} icon={<CheckCircle size={20} />} color="bg-green-500" trend="+8.4%" />
        <StatCard title="Returns" value={stats.returnCount} icon={<AlertCircle size={20} />} color="bg-red-500" trend="-2.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Revenue Growth</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Monthly Financial Trajectory</p>
            </div>
            <div className="hidden sm:flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {['WEEK', 'MONTH', 'YEAR'].map((v) => (
                <button key={v} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${v === 'MONTH' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}>{v}</button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#999'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#999'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BEST SELLERS (Updated Styling) */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Best Sellers</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Top performing items</p>
            </div>
            <MoreVertical size={20} className="text-gray-300 cursor-pointer" />
          </div>
          <div className="space-y-6 flex-1">
            {products.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                  <img src={p.images?.[0]?.url || p.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs uppercase tracking-tight text-gray-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">₹{p.regularPrice.toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-xs">₹{p.salePrice || p.regularPrice}</p>
                  <p className="text-[8px] text-emerald-500 font-black uppercase tracking-tighter">99+ Sold</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/admin/products')} className="mt-8 w-full py-4 bg-black text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10">
            View Inventory
          </button>
        </div>
      </div>

      {/* RECENT PURCHASES TABLE (Stylized) */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-7 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Recent Purchases</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live transaction log</p>
          </div>
          <button onClick={() => router.push('/admin/orders')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                <th className="px-8 py-5 text-left">Product Detail</th>
                <th className="px-4 py-5 text-left">Order ID</th>
                <th className="px-4 py-5 text-left">Timeline</th>
                <th className="px-4 py-5 text-left">Customer</th>
                <th className="px-4 py-5 text-left">Status</th>
                <th className="px-8 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 6).map((order, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-black">
                        <Package size={16} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight text-gray-900">
                        {order.items?.[0]?.productName || "Standard Order"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-[11px] font-bold text-gray-400">#{order._id?.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-5 text-[11px] font-bold text-gray-500">
                    <div className="flex items-center gap-2"><Clock size={12}/> {new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-zinc-900 rounded-full shrink-0 flex items-center justify-center text-[8px] text-white font-bold">
                        {order.name?.charAt(0) || 'C'}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{order.name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                      order.status === 'canceled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-xs text-gray-900">₹{order.totalAmount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================== STYLIZED STAT CARD ================== */
function StatCard({ title, value, icon, color, trend }: any) {
  return (
    <div className="bg-white p-7 rounded-[35px] border border-gray-100 shadow-sm hover:border-black transition-all duration-300 group">
      <div className="flex items-center justify-between mb-5">
        <div className={`p-3.5 rounded-2xl text-white ${color} transition-transform group-hover:scale-110 shadow-xl shadow-gray-200`}>
          {icon}
        </div>
        <div className={`flex items-center text-[10px] font-black ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
           <ArrowUpRight size={14} /> {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{title}</p>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-black">{value}</h2>
      </div>
    </div>
  );
}