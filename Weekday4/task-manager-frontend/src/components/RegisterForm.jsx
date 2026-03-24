import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', { name, email, password });
      navigate('/login'); // Redirect to login after successful register
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input 
        className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
        type="text" 
        placeholder="Full Name" 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
        type="email" 
        placeholder="Email Address" 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button 
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200" 
        type="submit"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;