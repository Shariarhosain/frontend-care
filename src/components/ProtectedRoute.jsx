import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

// Only for logged-in users. Pass role="admin" for admin-only pages.
export function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader full />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/notes" replace />;

  return children;
}

// Only for logged-out users (login / register pages).
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader full />;
  if (user) return <Navigate to="/notes" replace />;

  return children;
}
