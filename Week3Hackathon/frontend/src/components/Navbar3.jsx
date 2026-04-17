import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 1. Import useCart

export default function Navbar() {
  const navigate = useNavigate();
  const { cart, toggleCart } = useCart(); // 2. Destructure cart and toggleCart
  
  // Calculate total items in cart
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const userRole = localStorage.getItem('role');

  return (
    <nav className="flex justify-between items-center px-16 py-6 bg-white border-b border-gray-100 font-sans">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span><img src="/psychiatry.png" alt="Logo" className="h-8" /></span>
        <h2 className="text-xl font-bold tracking-tight text-[#282828]">Brand Name</h2>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex gap-10 text-[14px] font-semibold uppercase tracking-wider text-[#282828]">
        <Link to="/collections" className="hover:opacity-70 transition">Tea Collections</Link>
        <Link to="/accessories" className="hover:opacity-70 transition">Accessories</Link>
        <Link to="/blog" className="hover:opacity-70 transition">Blog</Link>
        <Link to="/contact" className="hover:opacity-70 transition">Contact Us</Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center flex-row gap-6 cursor-pointer">
        <img src="/person.png" alt="User" className="h-6" />
        <img src="/search.png" alt="Search" className="h-6" />
        
        {/* Cart Icon with Badge */}
   
<div className="relative cursor-pointer" onClick={toggleCart}>
  <img src="/mall.png" alt="Cart" className="h-6" />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
      {cartCount}
    </span>
  )}
</div>
      </div>
    </nav>
  );
}