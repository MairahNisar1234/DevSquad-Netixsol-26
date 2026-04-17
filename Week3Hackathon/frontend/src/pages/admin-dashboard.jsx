import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import ProductForm from '../components/productForm.jsx';
// Use the custom axios instance that points to Vercel and handles auth
import api from '../services/api.js'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, totalStock: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // The 'api' instance automatically attaches the Bearer token from localStorage
      const [orderRes, prodRes, userRes] = await Promise.all([
        api.get('/orders/all'),
        api.get('/products/all-admin'), 
        api.get('/users')
      ]);

      const orderData = orderRes.data || [];
      const productList = prodRes.data || [];
      
      setOrders(orderData);
      setProducts(productList);
      setUsers(userRes.data || []);
      
      // Revenue Calculation
      const revenue = orderData.reduce((sum, o) => sum + (o.total || 0), 0);

      // Total Inventory Calculation
      const totalStock = productList.reduce((total, p) => {
        const productStock = p.variants?.reduce((s, v) => {
          return s + (v.stock ? Number(v.stock) : 0);
        }, 0) || 0;
        return total + productStock;
      }, 0);

      setStats({ 
        totalOrders: orderData.length, 
        revenue, 
        totalStock 
      });
      
    } catch (err) {
      console.error("Fetch error details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/users/${id}/status`, { isBlocked: !currentStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) { 
      alert("Error deleting product"); 
    }
  };

  const refreshList = async () => {
    // Small delay to allow DB consistency before refresh
    await new Promise(resolve => setTimeout(resolve, 300));
    await fetchData(); 
  };

  if (loading) return <div className="p-10 text-center font-sans">Loading Dashboard...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        <h1 className="text-3xl font-bold mb-8 font-sans">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Revenue" value={`€${stats.revenue.toFixed(2)}`} />
          <StatCard title="Total Inventory" value={`${stats.totalStock} items`} />
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-10 p-1 bg-gray-200/50 w-fit rounded-xl">
          {['orders', 'products', 'users'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-8 py-2.5 rounded-lg capitalize font-[600] text-[13px] tracking-wide transition-all duration-300
                ${activeTab === tab 
                  ? 'bg-white text-black shadow-md scale-100' 
                  : 'text-gray-500 hover:text-black hover:bg-white/50 scale-95'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'orders' ? (
          <OrderTable orders={orders} onUpdate={fetchData} /> 
        ) : activeTab === 'products' ? (
          <div className="space-y-8">
            <ProductForm onProductAdded={refreshList} />
            <div className="bg-white p-6 rounded shadow border">
               <table className="w-full text-left">
                 <tbody>
                   {products.map(p => (
                     <tr key={p._id} className="group border-b border-gray-50 hover:bg-black/[0.02] transition-colors cursor-default">
                       <td className="py-5 px-4">
                         <div className="font-[600] text-gray-900 group-hover:translate-x-1 transition-transform duration-300">
                           {p.name}
                         </div>
                       </td>
                       <td className="py-5 px-4 text-gray-500 font-medium italic">
                         €{p.variants?.[0]?.price || 0}
                       </td>
                       <td className="py-5 px-4">
                         <span className={`px-3 py-1 rounded-full text-[11px] font-bold 
                           ${p.variants?.reduce((acc, v) => acc + (Number(v.stock) || 0), 0) < 10 
                             ? 'bg-red-50 text-red-600' 
                             : 'bg-green-50 text-green-600'}`}>
                           {p.variants?.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)} IN STOCK
                         </span>
                       </td>
                       <td className="py-5 px-4 text-right">
                         <button 
                           onClick={() => deleteProduct(p._id)} 
                           className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 font-bold uppercase text-[10px] tracking-widest transition-all"
                         >
                           Remove
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        ) : (
          <UserTable users={users} onToggle={toggleUserStatus} />
        )}
      </div>
    </>
  );
};

/* --- UI Sub-Components --- */

const UserTable = ({ users, onToggle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50">
        <tr className="text-[11px] uppercase tracking-[2px] text-gray-400 border-b border-gray-100">
          <th className="p-5 font-[600]">User Account</th>
          <th className="p-5 font-[600]">Account Status</th>
          <th className="p-5 font-[600] text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="group border-b border-gray-50 hover:bg-black/[0.01] transition-colors">
            <td className="p-5">
              <div className="font-medium text-gray-900">{u.email}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: {u._id.slice(-6)}</div>
            </td>
            <td className="p-5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${u.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className={`text-[12px] font-semibold ${u.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                  {u.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </td>
            <td className="p-5 text-right">
              <button 
                onClick={() => onToggle(u._id, u.isBlocked)} 
                className={`text-[11px] font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 transition-colors
                  ${u.isBlocked ? 'text-green-600 hover:text-green-800' : 'text-red-400 hover:text-red-600'}`}
              >
                {u.isBlocked ? "Unblock User" : "Restrict Access"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <p className="text-[11px] font-[600] uppercase tracking-[2px] text-gray-400 group-hover:text-black transition-colors">
      {title}
    </p>
    <h2 className="text-3xl font-[700] mt-2 text-[#1a1a1a] tracking-tight">{value}</h2>
    <div className="w-8 h-[2px] bg-black mt-4 group-hover:w-full transition-all duration-500"></div>
  </div>
);

const OrderTable = ({ orders, onUpdate }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50">
        <tr className="text-[10px] uppercase tracking-[2px] text-gray-400 border-b border-gray-100">
          <th className="p-6 font-[700]">Order Details</th>
          <th className="p-6 font-[700]">Amount</th>
          <th className="p-6 font-[700]">Status</th>
          <th className="p-6 font-[700] text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((o) => (
            <tr key={o._id} className="group border-b border-gray-50 hover:bg-black/[0.01] transition-all duration-300">
              <td className="p-6">
                <div className="flex flex-col">
                  <span className="font-[600] text-gray-900 group-hover:text-black transition-colors">
                    {o.user?.email || "Guest Customer"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tighter">
                    REF: #{o._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">€{(o.total || 0).toFixed(2)}</span>
                  <span className="text-[10px] text-gray-400 uppercase">Includes Tax</span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${o.status === 'Approved' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-[800] tracking-widest uppercase border
                    ${o.status === 'Approved' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {o.status}
                  </span>
                </div>
              </td>
              <td className="p-6 text-right">
                <div className="flex justify-end gap-3 items-center">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors">
                    Details
                  </button>
                  {o.status === 'Pending' && (
                    <button 
                      onClick={async () => { 
                        await api.patch(`/orders/${o._id}`, { status: 'Approved' }); 
                        onUpdate(); 
                      }} 
                      className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 bg-black text-white px-5 py-2 rounded-lg text-[10px] font-[800] uppercase tracking-widest hover:bg-gray-800 shadow-lg transition-all duration-300"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="p-20 text-center">
              <p className="text-gray-400 uppercase tracking-widest text-xs">No transactions recorded yet</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;