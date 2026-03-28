import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, LogOut, Search, Bell, Menu, X } from 'lucide-react';
import logoSrc from '../assets/logo.png';

interface NavbarProps {
  isTransparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isTransparent: initialTransparent }) => {
  const { user, logout, setAuthModalOpen } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for Home Page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (initialTransparent) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [initialTransparent]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${searchQuery.trim()}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Determine background based on page type and scroll position
  const navBgClass = initialTransparent 
    ? (isScrolled ? 'bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent')
    : 'bg-[#0F0F0F] border-b border-white/10';

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-16 py-5 transition-all duration-300 font-sans ${navBgClass}`}>
      
      {/* LOGO */}
      <Link to="/" className={`flex items-center gap-2 cursor-pointer group ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
        <img src={logoSrc} alt="StreamVibe" className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform" />
        <span className="text-white text-xl md:text-2xl font-bold tracking-tight">StreamVibe</span>
      </Link>

      {/* PILL NAVIGATION (Active link styling added) */}
      {user?.role !== 'admin' && (
        <div className="hidden lg:flex border border-[#262626] bg-[#0F0F0F]/60 backdrop-blur-md rounded-2xl p-1.5 items-center gap-1">
          <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/browse" active={location.pathname === '/browse'}>Movies & Shows</NavLink>
          <NavLink to="/support" active={location.pathname === '/support'}>Support</NavLink>
          <NavLink to="/subscriptions" active={location.pathname === '/subscriptions'}>Subscriptions</NavLink>
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className={`flex items-center gap-2 md:gap-6 ${isSearchOpen ? 'w-full md:w-auto' : ''}`}>
        
        {/* SEARCH */}
        <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'flex-1 bg-[#1A1A1A] border border-[#262626] rounded-xl px-4 py-2' : ''}`}>
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <input 
                autoFocus
                className="bg-transparent border-none outline-none text-white text-sm w-full"
                placeholder="Search movies, shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)}>
                <X size={18} className="text-gray-400 hover:text-white" />
              </button>
            </form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="hover:scale-110 transition-transform p-2 text-white">
              <Search size={22} />
            </button>
          )}
        </div>

        {!isSearchOpen && (
          <>
            {user?.role !== 'admin' && (
              <button className="hover:scale-110 transition-transform p-2 text-white hidden sm:block">
                <Bell size={22} />
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/stats" 
                    className="flex items-center gap-2 bg-red-600 text-white px-3 md:px-4 py-2 rounded-xl hover:bg-red-700 transition-all group shadow-lg shadow-red-600/20"
                  >
                    <LayoutDashboard size={18} />
                    <span className="text-sm font-bold hidden md:inline">Admin</span>
                  </Link>
                )}

                <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#262626] pl-2 pr-2 md:pr-4 py-1.5 rounded-full hover:border-white/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-white text-sm font-semibold hidden sm:block">
                    {user.name.split(' ')[0]}
                  </span>
                </div>

                <button onClick={handleLogout} className="text-[#BFBFBF] hover:text-red-500 transition-colors p-2">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-red-600/20"
              >
                Login
              </button>
            )}

            <button 
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed top-[72px] left-0 w-full h-screen bg-[#0F0F0F] z-[99] flex flex-col p-8 gap-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white font-bold border-b border-white/5 pb-4">Home</Link>
          <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white font-bold border-b border-white/5 pb-4">Movies & Shows</Link>
          <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white font-bold border-b border-white/5 pb-4">Support</Link>
          <Link to="/subscriptions" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white font-bold border-b border-white/5 pb-4">Subscriptions</Link>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, active }: { to: string, children: React.ReactNode, active?: boolean }) => (
  <Link 
    to={to} 
    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active 
        ? 'bg-white/10 text-white' 
        : 'text-[#BFBFBF] hover:text-white hover:bg-white/5'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;