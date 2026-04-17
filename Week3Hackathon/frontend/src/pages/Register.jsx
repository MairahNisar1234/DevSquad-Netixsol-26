import { useState } from 'react';
// 1. Import your custom api instance
import api from '../services/api.js'; 
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const allowedRoles = ['buyer', 'seller'];
      const role = allowedRoles.includes(formData.role) ? formData.role : 'buyer';

      // 2. Use 'api.post' for the Vercel endpoint
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role
      });

      // Redirect to login after successful signup
      navigate('/login');
    } catch (err) {
      // 3. Capture specific server error messages
      setError(err.response?.data?.message || "Registration failed! Account might already exist.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg border border-amber-50">
        <h2 className="text-3xl font-serif mb-2 text-[#282828]">Create Account</h2>
        <p className="text-gray-500 mb-8 text-sm">Join our community of tea enthusiasts.</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#282828] outline-none transition-all" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required
          />
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#282828] outline-none transition-all" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#282828] outline-none transition-all" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required
          />
          
          <div className="pt-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Account Type</label>
            <select 
              className="w-full p-4 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#282828] outline-none cursor-pointer appearance-none transition-all" 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="buyer">I want to Buy Tea</option>
              <option value="seller">I want to Sell Tea</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          
          <button 
            type="submit"
            className="w-full bg-[#282828] text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-md active:scale-[0.98] mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-800 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}