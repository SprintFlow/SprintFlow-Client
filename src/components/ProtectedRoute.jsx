import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar
 * @param {boolean} props.requireAdmin - Si la ruta requiere permisos de admin
 * @param {boolean} props.requireUser - Si la ruta requiere ser usuario normal (opcional)
 */
export const ProtectedRoute = ({ children, requireAdmin = false, requireUser = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log("🛡️ ProtectedRoute - Verificando acceso:");
  console.log("   - Ruta actual:", window.location.pathname);
  console.log("   - isAuthenticated:", isAuthenticated);
  console.log("   - user:", user);
  console.log("   - requireAdmin:", requireAdmin);
  console.log("   - requireUser:", requireUser);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log("🔒 No autenticado - Redirigiendo a login");
    return <Navigate to="/" replace />;
  }

  // Si requiere admin pero el usuario no lo es, redirigir a su dashboard
  if (requireAdmin && !user?.isAdmin) {
    console.log("🚫 No es admin - Redirigiendo a user-dashboard");
    return <Navigate to="/user-dashboard" replace />;
  }

  // ✅ CORREGIDO: Solo redirigir si la ruta requiere ser usuario NO admin
  // y el usuario actual ES admin
  if (requireUser && user?.isAdmin) {
    console.log("👨💼 Es admin en ruta exclusiva de usuario - Redirigiendo a admin-dashboard");
    return <Navigate to="/admin-dashboard" replace />;
  }

  console.log("✅ Acceso permitido");
  return children;
};

export default ProtectedRoute;