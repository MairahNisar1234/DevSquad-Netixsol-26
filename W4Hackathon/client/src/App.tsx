import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Components
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import BackgroundGrid from './components/BackgroundGrid'; // Your picture grid
import Hero from './components/Hero';
import Categories from './components/categories';
import Devices from './components/Devices';
import FAQ from './components/FAQ';
import Browse from './pages/Browse'; 
import MovieView from './pages/MovieView'; 
import Footer from './components/Footer';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import Stats from './pages/Admin/Stats';
import AddMovie from './pages/Admin/AddMovie';
import AddShow from './pages/Admin/AddShow'; 
import ManageMovies from './pages/Admin/ManageMovies';
import ManageShows from './pages/Admin/AddShow'; 
import UserManagement from './pages/Admin/userManagement'; 
import TrailBanner from './components/TrailBanner';

import SubscriptionSection from './components/subscriptionSection';

// --- ROUTE GUARDS ---
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  const isAuthModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const location = useLocation();

  // 1. Define Boolean helpers for cleaner logic
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isBrowsePage = location.pathname.startsWith('/browse') || location.pathname.startsWith('/movie');

  return (
    <main className="relative bg-[#141414] min-h-screen font-sans overflow-x-hidden text-white">
      
      {/* 2. THE BACKGROUND GRID: Only render on Home Page */}
      {isHomePage && <BackgroundGrid />}

      {/* 3. THE NAVBAR LOGIC */}
      {/* If it's not admin, show Navbar. You can pass a prop to Navbar to change its style for Home vs Browse */}
      {!isAdminPage && <Navbar isTransparent={isHomePage} />}

      <Routes>
        {/* LANDING PAGE (Home) */}
        <Route path="/" element={
          <>
            <Hero />
            <div className="relative z-30 bg-[#141414]">
              <Categories />
              <Devices />
              <FAQ />
              <SubscriptionSection/>
              <TrailBanner/>
              <Footer/>
            </div>
          </>
        } />

        {/* BROWSE & PLAYER (No Grid Here) */}
        <Route path="/browse" element={<Browse />} />
        <Route path="/movie/:id" element={<MovieView />} />

        {/* ADMIN PORTAL */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/stats" replace />} />
          <Route path="stats" element={<Stats />} />
          <Route path="add" element={<AddMovie />} />
          <Route path="manage" element={<ManageMovies />} />
          <Route path="add-show" element={<AddShow />} />
          <Route path="manage-shows" element={<ManageShows />} />
          <Route path="users" element={<UserManagement />} /> 
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
            onClick={() => setAuthModalOpen(false)}
          />
          <div className="relative z-[210] w-full max-w-lg">
            <AuthModal />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;