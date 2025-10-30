import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const auth = isAuthenticated || checkAuth();

  if (!auth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
