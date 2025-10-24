import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Verificar si el usuario está autenticado
  if (!isAuthenticated || !checkAuth()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
