// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const authed = !!localStorage.getItem('user'); // simple “logged in” check
  const location = useLocation();

  if (!authed) {
    // send them to /login and remember where they were going
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
