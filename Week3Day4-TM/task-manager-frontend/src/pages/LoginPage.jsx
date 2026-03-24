import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert("Login failed. Check your email/password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-100 p-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl shadow-blue-200/50">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;