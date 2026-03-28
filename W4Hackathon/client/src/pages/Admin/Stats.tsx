import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Film, ShieldAlert, Activity, TrendingUp } from 'lucide-react';

const Stats = () => {
  const [data, setData] = useState({
    totalMovies: 0,
    totalUsers: 0,
    blockedUsers: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // 1. Get the Backend URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;

  // 2. Consistent Token Retrieval
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

  useEffect(() => {
    const fetchStats = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 3. Hit your new live admin stats endpoint
        const res = await axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Calculating Analytics...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20">
            <Activity className="text-red-600" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">Platform Pulse</h1>
            <p className="text-gray-500 font-medium">Real-time ecosystem metrics and activity.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">System Operational</span>
        </div>
      </div>
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Total Library" 
          value={data.totalMovies} 
          color="border-red-600" 
          icon={<Film className="text-red-600" size={24} />} 
          label="Movies & Shows"
        />
        <StatCard 
          title="Active Users" 
          value={data.totalUsers} 
          color="border-blue-600" 
          icon={<Users className="text-blue-600" size={24} />} 
          label="Registered Identities"
        />
        <StatCard 
          title="Restricted" 
          value={data.blockedUsers} 
          color="border-orange-600" 
          icon={<ShieldAlert className="text-orange-600" size={24} />} 
          label="Policy Violations"
        />
      </div>

      {/* RECENT ACTIVITY LOGS */}
      <div className="bg-[#141414] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
               <TrendingUp size={20} className="text-red-600" /> Recent Activity
            </h2>
            <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Refresh Logs</button>
        </div>
        
        <div className="space-y-3">
            {data.recentActivity.length > 0 ? (
                data.recentActivity.map((log: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-125 transition-transform" />
                            <p className="text-sm font-medium text-gray-300 tracking-tight">{log.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter bg-white/5 px-3 py-1 rounded-lg">
                            {new Date(log.time).toLocaleTimeString()}
                        </span>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-600 font-bold uppercase text-xs tracking-[0.2em]">
                    No recent events recorded.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  color: string;
  icon: React.ReactNode;
  label: string;
}

const StatCard = ({ title, value, color, icon, label }: StatCardProps) => (
  <div className={`bg-[#141414] p-8 rounded-[2.5rem] border-b-4 ${color} flex flex-col gap-6 transition-all hover:-translate-y-2 shadow-xl border border-white/5`}>
    <div className="flex justify-between items-center">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            {icon}
        </div>
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{title}</span>
    </div>
    <div>
      <p className="text-5xl font-black text-white tracking-tighter">{value.toLocaleString()}</p>
      <p className="text-[10px] font-bold mt-1 text-gray-500 uppercase tracking-[0.2em]">{label}</p>
    </div>
  </div>
);

export default Stats;