'use client';

import React, { useEffect, useState } from 'react';
import { Search, Loader2, ChevronDown, Package, User, CreditCard, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/src/context/socketContext';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

interface OrderItem {
  productName: string;
  quantity: number;
}

interface Order {
  _id: string;
  name: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();
  const { socket } = useSocket();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/orders`;
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      const fetchedOrders = Array.isArray(data) ? data : (data.data || []);
      setAllOrders(fetchedOrders);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // ✅ SOCKET LISTENERS
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = () => {
      toast.success("New Order Received!", { icon: '📦' });
      fetchOrders();
    };

    const handleStatusUpdate = (updatedOrder: Order) => {
      setAllOrders(prev =>
        prev.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    };

    socket.on('admin-new-order', handleNewOrder);
    socket.on('orderStatusUpdated', handleStatusUpdate);

    return () => {
      socket.off('admin-new-order', handleNewOrder);
      socket.off('orderStatusUpdated', handleStatusUpdate);
    };
  }, [socket]);

  // ✅ SEARCH FILTER
  useEffect(() => {
    const filtered = allOrders.filter(order =>
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item =>
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setOrders(filtered);
  }, [searchTerm, allOrders]);

  const handleStatusChange = async (
  e: React.ChangeEvent<HTMLSelectElement>,
  orderId: string
) => {
  e.stopPropagation();
  const newStatus = e.target.value;

  const token = localStorage.getItem('access_token');

  if (!token) {
    toast.error("You are not logged in");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ FIX
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const updatedOrder = await res.json();

      setAllOrders(prev =>
        prev.map(o => (o._id === orderId ? updatedOrder : o))
      );

      toast.success("Order status updated");
    } else {
      toast.error("Unauthorized or failed");
    }
  } catch {
    toast.error("Network error");
  }
};

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
              <Package />
              Order Management
            </h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">
              Real-time store activity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-black"
              />
            </div>

            {/* ✅ FILTER FIXED */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-black text-white rounded-xl text-sm font-bold uppercase cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white" size={14} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-black mb-4" size={40} />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Loading Orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => router.push(`/admin/orders/${order._id}`)}
                className="group bg-white border rounded-3xl p-5 hover:shadow-xl cursor-pointer"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex gap-4 flex-1">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg uppercase">
                        {order.items?.[0]?.productName || "Multiple Items"}
                      </h4>
                      <p className="text-xs text-gray-400">
                        #{order._id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-4 mt-3">
                        <div className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                          <User size={12} /> {order.name}
                        </div>
                        <div className="text-xs font-bold bg-green-50 px-2 py-1 rounded text-green-600">
                          <CreditCard size={12} /> ₹{order.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ STATUS DROPDOWN FIXED */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(e, order._id)}
                        className={`
                          appearance-none pl-4 pr-10 py-2 rounded-2xl text-xs font-black uppercase border-2
                          ${order.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                          ${order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                          ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2" size={14} />
                    </div>

                    <ChevronRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-black">No orders found</h3>
          </div>
        )}
      </div>
    </div>
  );
}