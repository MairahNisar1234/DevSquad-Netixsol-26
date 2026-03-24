import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-100 p-4">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl shadow-blue-200/50">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Join us to start managing your tasks.</p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};
export default RegisterPage;