import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const handleSellClick = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/login');
    } else if (role === 'seller') {
      navigate('/seller-dashboard');
    } else if (role === 'superadmin' || role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      alert("Only registered sellers can add products!");
    }
  };

  const handleBrowseClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/products'); // buyer dashboard or products page
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-16 py-12 gap-20">
      {/* Left Side: Image */}
      <div className="w-full md:w-1/2">
        <div className="relative overflow-hidden rounded-sm shadow-sm">
          <img 
            src="/hero.jpg" 
            alt="Tea varieties on spoons" 
            className="w-[628px] h-[628px] object-cover"
          />
        </div>
      </div>

      {/* Right Side: Text */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        <h1 className="text-5xl font-medium text-[#282828] leading-tight mb-6">
          Every day is unique, <br /> just like our tea
        </h1>
        
        <div className="max-w-md space-y-4 mb-10">
          <p className="text-gray-600 leading-relaxed text-sm">
            Experience authentic, hand-picked tea blends delivered directly to your doorstep.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm">
            Join our community of tea lovers and explore global flavors today.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={handleBrowseClick}
            className="bg-[#282828] text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
          >
            Browse Teas
          </button>
          <button 
            onClick={handleSellClick}
            className="border border-[#282828] text-[#282828] bg-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#282828] hover:text-white transition-all"
          >
            Sell Products
          </button>
        </div>
      </div>
    </section>
  );
}