import { useState } from 'react';
import api from '../services/api.js'; 
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      // 2. Use 'api.post' which uses your Vercel baseURL automatically
      const res = await api.post('/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);
      
      // Redirect logic based on role
    switch(res.data.role) {
  case 'superadmin':
    navigate('/super-admin-dashboard'); // ✅ FIXED
    break;

  case 'admin':
    navigate('/admin-dashboard');
    break;

  case 'buyer':
  default:
    navigate('/');
    break;
}
    } catch (err) {
      // Improved error handling to capture the actual server message
      setError(err.response?.data?.message || "Connection to server failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-white p-10 md:p-16 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] w-full max-w-lg border border-amber-50">
        
        <Link to="/" className="text-amber-800 text-sm font-semibold hover:underline mb-8 block">
          ← Back to Home
        </Link>
        
        <h2 className="text-4xl font-serif text-[#282828] mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-10">Please enter your details to access your dashboard.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#282828] focus:border-transparent outline-none transition-all" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#282828] focus:border-transparent outline-none transition-all" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit"
            className="w-full bg-[#282828] text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-md active:scale-[0.98]"
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Not registered yet?{' '}
              <Link to="/register" className="text-amber-800 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}