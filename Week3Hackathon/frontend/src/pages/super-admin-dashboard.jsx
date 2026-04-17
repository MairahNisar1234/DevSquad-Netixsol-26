import { useEffect, useState } from 'react';
// 1. Import your custom api instance
import api from '../services/api.js'; 
import Navbar from '../components/Navbar.jsx';

const SuperAdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, totalStock: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 2. Use api instance for all calls (token is handled in api.js interceptor)
        const [orderRes, prodRes, userRes] = await Promise.all([
          api.get('/orders/all'),
          api.get('/products'),
          api.get('/users')
        ]);

        // Axios results are in .data
        const orderData = Array.isArray(orderRes.data) ? orderRes.data : [];
        const totalRev = orderData.reduce((sum, o) => sum + (o.total || 0), 0);
        
        const productList = prodRes.data.products || [];
        const totalStock = productList.reduce((total, p) => {
          return total + (p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0);
        }, 0);

        setOrders(orderData);
        setUsers(Array.isArray(userRes.data) ? userRes.data : []);
        setStats({ totalOrders: orderData.length, revenue: totalRev, totalStock });
      } catch (err) {
        console.error("Dashboard Sync Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Removed token from dependency as api instance handles it

  const handleStatusUpdate = async (id, status) => {
    try {
      // 3. Simplified PATCH request
      const response = await api.patch(`/orders/${id}`, { status });
      if (response.status === 200) {
        setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const toggleBlockStatus = async (userId, currentStatus) => {
    try {
      const response = await api.patch(`/users/${userId}/status`, { isBlocked: !currentStatus });
      if (response.status === 200) {
        setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !currentStatus } : u));
      }
    } catch (err) {
      console.error("User status toggle failed:", err);
    }
  };

  if (loading) return <div className="p-20 text-center font-sans uppercase tracking-widest text-gray-400">Synchronizing...</div>;

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen font-sans animate-in fade-in duration-700">
        <header className="mb-12">
          <h1 className="text-[28px] font-[800] text-black uppercase tracking-tight">Superadmin Overview</h1>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-[1px]">Global System Management</p>
        </header>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Total Revenue" value={`€${stats.revenue.toFixed(2)}`} />
          <StatCard title="Current Stock" value={`${stats.totalStock} Items`} />
        </div>

        {/* User Management Section */}
        <SectionHeader title="User & Admin Management" subtitle="Manage permissions and access levels" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] uppercase tracking-[2px] text-gray-400 border-b border-gray-100">
                <th className="p-6 font-[700]">Account</th>
                <th className="p-6 font-[700]">Role</th>
                <th className="p-6 font-[700]">Status</th>
                <th className="p-6 font-[700] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="group border-b border-gray-50 hover:bg-black/[0.01] transition-all">
                  <td className="p-6">
                    <div className="font-[600] text-gray-900">{u.email}</div>
                    <div className="text-[10px] text-gray-400 font-mono">UID: {u._id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className={`text-[12px] font-bold ${u.isBlocked ? 'text-red-500' : 'text-green-600'}`}>
                        {u.isBlocked ? "BLOCKED" : "ACTIVE"}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => toggleBlockStatus(u._id, u.isBlocked)}
                      className={`opacity-0 group-hover:opacity-100 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${u.isBlocked ? 'bg-green-600 text-white shadow-lg' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      {u.isBlocked ? 'Restore' : 'Restrict'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders Section */}
        <SectionHeader title="Recent Transactions" subtitle="Approve or Reject store orders" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] uppercase tracking-[2px] text-gray-400 border-b border-gray-100">
                <th className="p-6 font-[700]">Customer</th>
                <th className="p-6 font-[700]">Total</th>
                <th className="p-6 font-[700]">Status</th>
                <th className="p-6 font-[700] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="group border-b border-gray-50 hover:bg-black/[0.01] transition-all">
                  <td className="p-6 font-[600] text-gray-900">{o.user?.email || "Guest"}</td>
                  <td className="p-6 font-bold text-gray-800">€{o.total?.toFixed(2)}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                      o.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                      o.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {o.status === 'Pending' ? (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                        <button onClick={() => handleStatusUpdate(o._id, 'Approved')} className="bg-black text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 shadow-md">Approve</button>
                        <button onClick={() => handleStatusUpdate(o._id, 'Rejected')} className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Reusable Sub-components
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
    <p className="text-[11px] font-[700] uppercase tracking-[2px] text-gray-400 group-hover:text-black">{title}</p>
    <h2 className="text-3xl font-[800] mt-2 text-black">{value}</h2>
    <div className="w-6 h-[2px] bg-black mt-4 group-hover:w-12 transition-all"></div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-[16px] font-[800] text-black uppercase tracking-wide">{title}</h2>
    <p className="text-gray-400 text-[11px] uppercase tracking-wider">{subtitle}</p>
  </div>
);

export default SuperAdminDashboard;