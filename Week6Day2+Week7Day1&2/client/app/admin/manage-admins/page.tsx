'use client';

import React, { useState, useEffect, Suspense } from 'react'; 
import { 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  MoreVertical, 
  Search,
  Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

// --- 1. YOUR ORIGINAL COMPONENT (RENAMED) ---
function ManageAdminsContent() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/auth/all-users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const userList = Array.isArray(data) ? data : (data.users || data.data || []);
      const administrativeUsers = userList.filter((user: any) => 
        user.role === 'admin' || user.role === 'superadmin'
      );
      setAdmins(administrativeUsers);
    } catch (err) {
      console.error("Fetch error:", err);
      setAdmins([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Admin removed successfully");
        fetchAdmins();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const filteredAdmins = Array.isArray(admins) 
    ? admins.filter(a => 
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0B2447]" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Admin Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Control system access and permissions</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#0B2447] text-white px-5 py-3 rounded-xl font-bold text-[10px] sm:text-xs tracking-widest hover:bg-[#162a4d] transition-all shadow-lg shadow-blue-900/20 w-full sm:w-auto">
          <UserPlus size={16} /> ADD NEW ADMIN
        </button>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-2xl mb-6 border border-gray-100 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50/30">
                <th className="px-4 sm:px-8 py-4">Admin User</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Loyalty</th>
                <th className="px-4 sm:px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    No Administrative Users Found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin._id?.$oid || admin._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 sm:px-8 py-5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E7E7E3] shrink-0 flex items-center justify-center text-[#0B2447] text-xs sm:text-sm font-bold">
                          {admin.name?.[0] || 'A'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">{admin.name}</p>
                          <p className="text-[10px] sm:text-[11px] text-gray-400 flex items-center gap-1 truncate">
                            <Mail size={10} className="shrink-0" /> {admin.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap ${
                        admin.role === 'superadmin' ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'
                      }`}>
                        <ShieldCheck size={10} className="sm:w-3 sm:h-3" /> {admin.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                        <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500" /> ACTIVE
                      </span>
                    </td>
                    <td className="px-4 py-5 text-[10px] sm:text-xs text-gray-500 font-bold uppercase whitespace-nowrap">
                      {admin.loyaltyPoints || 0} PTS
                    </td>
                    <td className="px-4 sm:px-8 py-5 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button className="p-1.5 sm:p-2 text-gray-400 hover:text-[#0B2447] transition-colors">
                          <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button 
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
                          disabled={admin.role === 'superadmin'}
                          onClick={() => handleDelete(admin._id?.$oid || admin._id)}
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ManageAdminsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0B2447]" size={32} />
      </div>
    }>
      <ManageAdminsContent />
    </Suspense>
  );
}