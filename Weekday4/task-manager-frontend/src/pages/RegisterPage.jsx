import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      {/* Centered Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">
            Join us to start managing your tasks efficiently.
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Footer Link */}
        <p className="text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-600 font-bold hover:underline transition"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;