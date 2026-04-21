"use client";
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { DollarSign, Bookmark, Users, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/orders');
        const rawData = Array.isArray(res.data) ? res.data : (res.data.orders || []);
        setOrders(rawData);
      } catch (err) {
        console.error("❌ API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = useMemo(() => 
    orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)
  , [orders]);

  const totalCustomers = useMemo(() => {
    const ids = orders.map(o => o.userId?.$oid || o._id?.$oid || o._id).filter(Boolean);
    return new Set(ids).size;
  }, [orders]);

  const chartData = useMemo(() => {
    const dineIn = orders.filter(o => o.orderType === 'Dine In').length || 0;
    const toGo = orders.filter(o => o.orderType === 'To Go').length || 0;
    const delivery = orders.filter(o => o.orderType === 'Delivery').length || 0;

    return [
      { name: 'Dine In', value: dineIn || 0, color: '#FF7CA3' },
      { name: 'To Go', value: toGo || 0, color: '#FFB572' },
      { name: 'Delivery', value: delivery || 0, color: '#65B0F6' },
    ];
  }, [orders]);

  return (
    // ✅ Changed max-w to w-full and added padding for small screens
    <div className="w-full max-w-[1200px] mx-auto p-4 lg:p-0 flex flex-col lg:flex-row gap-8 overflow-x-hidden">
      
      {/* LEFT COLUMN - STATS & TABLE */}
      <div className="flex-1 min-w-0">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm">{new Date().toDateString()}</p>
        </header>

        {/* ✅ Stats Grid: 1 col on mobile, 3 on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toFixed(2)}`} 
            icon={<DollarSign className="text-[#EA7C69]" />} 
            trend="+32.40%"
          />
          <StatCard 
            title="Total Orders" 
            value={orders.length} 
            icon={<Bookmark className="text-orange-400" />} 
            trend={orders.length > 0 ? "Live" : "Empty"}
          />
          <StatCard 
            title="Total Customers" 
            value={totalCustomers} 
            icon={<Users className="text-blue-400" />} 
            trend="+2.4%"
          />
        </div>

        <div className="bg-[#1F1D2B] rounded-2xl p-4 md:p-6 border border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">Order Report</h2>
            <button className="w-full sm:w-auto px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition">
              Filter Order
            </button>
          </div>

          {/* ✅ Table wrapper for horizontal scroll on tiny screens */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800 text-sm">
                  <th className="pb-4 font-medium">Customer ID</th>
                  <th className="pb-4 font-medium">Menu Items</th>
                  <th className="pb-4 font-medium">Total Payment</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-800/50">
                {!loading && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <tr key={order._id?.$oid || order._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 text-gray-400 font-mono text-xs">
                        #{(order._id?.$oid || order._id).toString().slice(-6)}
                      </td>
                      <td className="py-4 text-gray-200">
                        {order.items?.map((i: any) => i.name).join(', ') || 'No Items'}
                      </td>
                      <td className="py-4 font-bold text-[#EA7C69]">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="py-20 text-center text-gray-500">No active orders.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - THE CIRCLE THING */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-[#1F1D2B] rounded-2xl p-6 border border-gray-800 h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Most Type of Order</h2>
            <button className="flex items-center gap-1 text-sm border border-gray-700 px-2 py-1 rounded-md text-gray-400">
              Today <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm text-white font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {orders.filter(o => o.orderType === item.name).length} customers
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-[#1F1D2B] p-5 md:p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-[#252836] rounded-xl">{icon}</div>
        <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-green-400' : 'text-gray-500'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
      </div>
    </div>
  );
}