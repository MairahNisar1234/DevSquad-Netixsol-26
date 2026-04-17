import { Link, useNavigate } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');


   const handleRedirect = () => {
    navigate('/login');
  };


  return (
    <nav className="flex justify-between items-center px-16 py-6 bg-white border-b border-gray-100 font-sans">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
       
        <span><img src="/psychiatry.png"></img></span>
        <h2 className="text-xl font-bold tracking-tight text-[#282828]">FALAHI & CO.</h2>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex gap-10 text-[14px] font-semibold uppercase tracking-wider text-[#282828]">
        <Link to="/login" className="hover:opacity-70 transition">Tea Collections</Link>
        <Link to="/#" className="hover:opacity-70 transition">Accessories</Link>
        <Link to="/#" className="hover:opacity-70 transition">Blog</Link>
        <Link to="/#" className="hover:opacity-70 transition">Contact Us</Link>
        
        {/* Conditional Seller Link */}
        {userRole === 'seller' && (
          <Link to="/seller-dashboard" className="text-amber-700 font-bold underline decoration-2 underline-offset-4">
            Dashboard
          </Link>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center flex-row gap-6">
   
          <span onClick={handleRedirect} className="cursor-pointer" ><img src="/person.png"></img></span>
          <span onClick={handleRedirect} className="cursor-pointer"><img src="/search.png"></img></span>
          <span onClick={handleRedirect} className="cursor-pointer"><img src="/mall.png"></img></span> 
      </div>
    </nav>
  );
}