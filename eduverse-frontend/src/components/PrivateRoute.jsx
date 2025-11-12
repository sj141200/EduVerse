import { useAuth } from '../context/AuthContext.jsx';
import { Navigate, useLocation } from 'react-router-dom';

// PrivateRoute now supports an `allowedRoles` prop (array of strings).
// If `allowedRoles` is provided and the logged-in user's role is not in the list,
// the user is redirected to their role-specific dashboard.
function PrivateRoute({ children, allowedRoles } = {}) {
  const { token, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return null; // keep simple; could render a spinner
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no role restriction provided, just allow authenticated users
  if (!allowedRoles || allowedRoles.length === 0) return children;

  const userRole = user?.role;
  if (!userRole) {
    // If we don't have a user role for some reason, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to user's dashboard if they try to access a route for another role
    if (userRole === 'instructor') return <Navigate to="/ins/dashboard" replace />;
    if (userRole === 'student') return <Navigate to="/st/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
