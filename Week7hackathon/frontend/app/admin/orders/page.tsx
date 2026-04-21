"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Check, X, ChevronDown, ChevronUp, 
  Package, Clock, User 
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/orders');
      const sortedOrders = res.data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const loadingToast = toast.loading(`Updating order to ${newStatus}...`);
    try {
      await axios.patch(`http://localhost:3000/api/orders/${id}/status`, { status: newStatus });
      setOrders(prev => prev.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order #${id.slice(-4)} marked as ${newStatus}`, { id: loadingToast });
    } catch (err) {
      toast.error("Update failed. Check backend connection.", { id: loadingToast });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-gray-400 animate-pulse">
      <Package className="mr-2 animate-bounce" /> Loading live order feed...
    </div>
  );

  return (
    // ✅ Added padding-x for mobile and overflow safety
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-10 overflow-x-hidden">
      
      {/* ✅ Responsive Header: Stacks on mobile */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-gray-400 text-sm mt-1">Review and process incoming POS requests</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="w-full md:w-auto bg-[#252836] border border-gray-700 px-6 py-3 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-all active:scale-95"
        >
          Refresh Feed
        </button>
      </header>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-[#1F1D2B] py-20 px-4 rounded-3xl border border-dashed border-gray-800 text-center">
            <Package className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-500">No orders found in the system.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order._id} 
              className={`bg-[#1F1D2B] rounded-2xl border transition-all duration-300 overflow-hidden ${
                expandedId === order._id ? 'border-[#EA7C69] bg-[#EA7C69]/[0.02]' : 'border-gray-800'
              }`}
            >
              {/* --- MAIN ROW --- */}
              <div className="p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                
                {/* ID & Time Section */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className={`shrink-0 p-3 rounded-xl ${
                    order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 
                    order.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    <Package size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white uppercase tracking-tight truncate">Order #{order._id.slice(-6)}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className="hidden sm:inline opacity-30">|</span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </div>

                {/* Price & Actions Section */}
                <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-8 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-800">
                  <div className="text-left lg:text-right">
                    <p className="text-xl font-bold text-[#EA7C69]">${order.totalAmount.toFixed(2)}</p>
                    <button 
                      onClick={() => toggleExpand(order._id)}
                      className="text-xs text-gray-400 flex items-center gap-1 hover:text-[#EA7C69] mt-1 transition-colors"
                    >
                      {expandedId === order._id ? <><ChevronUp size={14}/> Hide</> : <><ChevronDown size={14}/> Details</>}
                    </button>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    {order.status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(order._id, 'Completed')}
                          className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/20 font-bold text-sm"
                        >
                          <Check size={18} /> <span className="hidden sm:inline">Accept</span>
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(order._id, 'Rejected')}
                          className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800/50 text-gray-500 rounded-xl border border-gray-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                        Processed
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* --- DROPDOWN DETAILS (Responsive Grid) --- */}
              {expandedId === order._id && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-gray-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    
                    {/* Kitchen Items List */}
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Kitchen Ticket</h4>
                      <ul className="space-y-2">
                        {order.items?.map((item: any, idx: number) => (
                          <li key={idx} className="flex justify-between items-center bg-[#252836] p-3 rounded-xl border border-gray-700/50">
                            <span className="text-gray-200 font-medium text-sm">{item.name}</span>
                            <span className="bg-[#EA7C69]/10 text-[#EA7C69] px-2.5 py-1 rounded-lg text-xs font-bold">x{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Customer & Total Section */}
                    <div className="flex flex-col justify-between gap-6">
                      <div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Customer Info</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#252836] p-4 rounded-xl border border-gray-700/50">
                          <div className="w-8 h-8 rounded-full bg-[#EA7C69]/20 flex items-center justify-center text-[#EA7C69] shrink-0">
                             <User size={16} />
                          </div>
                          <span className="font-medium truncate">{order.customerName || "Dine-in Customer"}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-[#EA7C69]/5 rounded-2xl border border-[#EA7C69]/10 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Total Amount</p>
                          <p className="text-2xl font-black text-white">${order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Status</p>
                          <p className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded inline-block">PAID</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    Pending: { color: "text-orange-500 bg-orange-500/10", label: "● Pending" },
    Completed: { color: "text-green-500 bg-green-500/10", label: "✓ Completed" },
    Rejected: { color: "text-red-400 bg-red-400/10", label: "✕ Rejected" },
  };
  
  const current = configs[status] || { color: "text-gray-400 bg-gray-400/10", label: status };
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${current.color}`}>
      {current.label}
    </span>
  );
}