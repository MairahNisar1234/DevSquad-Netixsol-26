import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;