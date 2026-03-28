import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldAlert, ShieldCheck, Search, Mail, Shield } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Get the Backend URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getAuthToken = () => {
    const rawData = localStorage.getItem('streamvibe-storage');
    if (!rawData) return null;
    try {
      const parsed = JSON.parse(rawData);
      return parsed.state?.token || null;
    } catch (e) {
      return null;
    }
  };

  const fetchUsers = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 2. Use dynamic API_URL
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(userData);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    const token = getAuthToken();

    if (window.confirm(`Are you sure you want to ${newStatus} this user?`)) {
      try {
        // 3. Use dynamic API_URL for status update
        await axios.put(`${API_URL}/api/users/${id}/status`, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers((prev: any) => prev.map((u: any) => u._id === id ? { ...u, status: newStatus } : u));
      } catch (err) {
        alert("Failed to update user status. Check your admin permissions.");
      }
    }
  };

  const filteredUsers = users.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-red-600 font-black uppercase tracking-widest text-xs">Initializing Secure Directory...</p>
    </div>
  );

  return (
    <div className="max-w-[95%] mx-auto py-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-600 rounded-3xl shadow-lg shadow-red-600/20">
            <Shield className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Identity Vault</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Management Console</p>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="bg-[#141414] border border-white/5 py-4 pl-12 pr-6 rounded-[1.5rem] outline-none focus:border-red-600 w-full md:w-96 transition-all text-sm text-white shadow-2xl"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="p-8">Identity</th>
                <th className="p-8">Privilege</th>
                <th className="p-8">Active Plan</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user: any) => (
                <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center font-black text-red-600 text-xl border border-white/5 uppercase">
                        {user.name ? user.name[0] : '?'}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{user.name}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'admin' 
                      ? 'bg-red-600/10 text-red-500 border-red-600/20' 
                      : 'bg-white/5 text-gray-500 border-white/5'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-200">{user.subscriptionPlan || 'Free Tier'}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter italic">{user.billingCycle || 'N/A'}</span>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'blocked' ? 'bg-red-600 shadow-[0_0_10px_rgba(229,0,0,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'blocked' ? 'text-red-600' : 'text-green-500'}`}>
                        {user.status || 'active'}
                      </span>
                    </div>
                  </td>

                  <td className="p-8 text-right">
                    <button 
                      onClick={() => toggleStatus(user._id, user.status || 'active')}
                      className={`p-4 rounded-2xl transition-all ${
                        user.status === 'blocked' 
                        ? 'bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white border border-green-600/20' 
                        : 'bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20'
                      }`}
                    >
                      {user.status === 'blocked' ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;