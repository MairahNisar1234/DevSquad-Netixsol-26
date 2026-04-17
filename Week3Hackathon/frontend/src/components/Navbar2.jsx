import { Link, useNavigate } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="flex justify-between items-center px-16 py-6 bg-white border-b border-gray-100 font-sans">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
       
        <span><img src="./public/psychiatry.png"></img></span>
        <h2 className="text-xl font-bold tracking-tight text-[#282828]">Brand Name</h2>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex gap-10 text-[14px] font-semibold uppercase tracking-wider text-[#282828]">
        <Link to="/collections" className="hover:opacity-70 transition">Tea Collections</Link>
        <Link to="/accessories" className="hover:opacity-70 transition">Accessories</Link>
        <Link to="/blog" className="hover:opacity-70 transition">Blog</Link>
        <Link to="/contact" className="hover:opacity-70 transition">Contact Us</Link>
        
        {/* Conditional Seller Link */}
        
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Search Icon Placeholder */}
        
        <button className="text-[#282828] hover:scale-110 transition">
            
           
          <span><img src="./public/search.png"></img></span>
     
          <span><img src="./public/box.png"></img></span>
          
        </button>

        {!isLoggedIn ? (
          <Link to="/login" className="text-[#282828] hover:scale-110 transition">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
          </Link>
        ) : (
          <button onClick={handleLogout} className=" bg-black text-white font-Montserrat text-sm font-semibold uppercase tracking-tighter py-2 px-6">
            Logout
          </button>
        )}

        {/* Bag Icon */}
        <Link to="/cart" className="text-[#282828] hover:scale-110 transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        </Link>
      </div>
    </nav>
  );
}