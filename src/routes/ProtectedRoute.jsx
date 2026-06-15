import { Navigate, Outlet, useLocation } from 'react-router-dom';
import SessionLoading from '../components/shared/SessionLoading';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <SessionLoading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
