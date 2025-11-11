import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner
  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

export default PrivateRoute;
