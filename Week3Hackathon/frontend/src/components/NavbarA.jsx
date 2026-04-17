import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart, toggleCart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center px-16 py-6 bg-white border-b border-gray-100">
      <h2 className="text-xl font-bold">Brand Name</h2>
      
      {/* Bag Icon */}
      <div className="relative cursor-pointer" onClick={toggleCart}>
        <img src="/mall.png" alt="Cart" className="h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white rounded-full px-2 text-xs">
            {cartCount}
          </span>
        )}
      </div>
    </nav>
  );
}