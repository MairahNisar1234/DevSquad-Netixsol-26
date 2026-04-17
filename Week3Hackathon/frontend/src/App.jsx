import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Ensure provider wraps the routes
import CartSidebar from './components/CartSidebar';   // Sidebar is now global
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/productDeatils';
import CartPage from './pages/Cart';
import SuperAdminDashboard from './pages/super-admin-dashboard';
import PaymentPage from './pages/Payment';
import AdminDashboard from './pages/admin-dashboard'; // Ensure this path is correct

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Sidebar is global, so it can be opened from any page's Navbar */}
        <CartSidebar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;