import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Film, Users, LogOut, 
  ShieldCheck, PlusCircle, Tv, ListVideo 
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-50 flex min-h-screen bg-[#0A0A0A] text-white">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#141414] border-r border-white/5 flex flex-col p-8 sticky top-0 h-screen shadow-2xl">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-red-600 p-2.5 rounded-xl shadow-lg shadow-red-600/40">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none">STREAM</span>
            <span className="text-[10px] font-bold text-red-600 tracking-[0.3em] uppercase">Admin Portal</span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-hide">
          
          {/* DASHBOARD SECTION */}
          <div className="space-y-2">
            <SidebarLink to="/admin/stats" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          </div>

          {/* --- MOVIE MANAGEMENT --- */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-4 mb-3">Movie Library</h4>
            <SidebarLink to="/admin/manage" icon={<Film size={20} />} label="Manage Movies" />
            <SidebarLink to="/admin/add" icon={<PlusCircle size={20} />} label="Add New Movie" />
          </div>

          {/* --- NEW: SHOW MANAGEMENT --- */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-4 mb-3">TV Series</h4>
            <SidebarLink to="/admin/manage-shows" icon={<ListVideo size={20} />} label="Manage Shows" />
            <SidebarLink to="/admin/add-show" icon={<Tv size={20} />} label="Add New Show" />
          </div>
          
          {/* SETTINGS SECTION */}
          <div className="space-y-2">
             <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-4 mb-3">System</h4>
            <SidebarLink to="/admin/users" icon={<Users size={20} />} label="User Management" />
          </div>

        </nav>

        {/* BOTTOM SECTION */}
        <div className="pt-6 border-t border-white/5 mt-auto">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 p-4 text-gray-500 hover:text-red-500 hover:bg-red-600/10 rounded-2xl transition-all font-bold group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-12 overflow-y-auto bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm tracking-wide ${
        isActive 
          ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
          : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
    >
      <span className="flex-shrink-0">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

export default AdminLayout;