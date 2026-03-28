import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, setAuthModalOpen } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-black/60 backdrop-blur-md px-6 md:px-16 py-5 flex items-center justify-between">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="StreamVibe" className="h-10" />
        <span className="text-white font-bold text-xl">StreamVibe</span>
      </Link>

      {/* NAV LINKS (Middle) */}
      <div className="hidden md:flex items-center bg-black border border-[#262626] rounded-xl px-2 py-1">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/movies">Movies & Shows</NavLink>
        <NavLink to="/support">Support</NavLink>
        <NavLink to="/subscriptions">Subscriptions</NavLink>
      </div>

      {/* AUTH ACTIONS (Right) */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            {/* Show Dashboard Link ONLY if Admin */}
            {user.role === 'admin' && (
              <Link 
                to="/admin/stats" 
                className="flex items-center gap-2 bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
              >
                <LayoutDashboard size={18} />
                <span className="hidden lg:block text-sm font-bold">Dashboard</span>
              </Link>
            )}
            
            <div className="flex items-center gap-2 text-white bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#262626]">
              <User size={18} />
              <span className="text-sm font-medium">{user.name}</span>
            </div>

            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="bg-red-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

// Helper for NavLink styling
const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="px-6 py-3 text-gray-400 hover:text-white rounded-lg transition-all text-sm font-medium">
    {children}
  </Link>
);

export default Navbar;