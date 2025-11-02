import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Results from "../pages/Results";
import UserDashboard from "../pages/UserDashboard";
import Configuration from "../pages/Configuration";
import CreateEditSprint from "../pages/CreateEditSprint";
import AdminDashboard from "../pages/Admindashboard";
import SprintDetail from "../pages/SprintDetail";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPoints from "../pages/RegisterPoints";
import ProtectedRoute from "../components/ProtectedRoute";

const routerSprint = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      // ========== RUTAS DE USUARIO (Developer) ==========
      {
        path: "user-dashboard",
        element: (
          <ProtectedRoute requireAdmin={false} requireUser={true}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "register-points",
        element: (
          <ProtectedRoute requireAdmin={false} requireUser={true}>
            <RegisterPoints />
          </ProtectedRoute>
        ),
      },
      // ========== RUTAS DE ADMIN ==========
      {
        path: "admin-dashboard",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-edit-sprint",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <CreateEditSprint />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-edit-sprint/:id",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <CreateEditSprint />
          </ProtectedRoute>
        ),
      },
      {
        path: "configuration",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <Configuration />
          </ProtectedRoute>
        ),
      },
      // ========== RUTAS COMPARTIDAS (Autenticadas) ==========
      {
        path: "sprint-detail/:id",
        element: (
          <ProtectedRoute> {/* ✅ SIN requireAdmin ni requireUser - acceso para todos los autenticados */}
            <SprintDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "results",
        element: (
          <ProtectedRoute> {/* ✅ SIN requireAdmin ni requireUser - acceso para todos los autenticados */}
            <Results />
          </ProtectedRoute>
        ),
      },
      // ========== 404 ==========
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default routerSprint;