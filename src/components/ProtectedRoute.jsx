import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar
 * @param {boolean} props.requireAdmin - Si la ruta requiere permisos de admin
 */
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si requiere admin pero el usuario no lo es, redirigir a su dashboard
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  // Si es admin intentando acceder a ruta de usuario, redirigir a admin dashboard
  if (!requireAdmin && user?.isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;