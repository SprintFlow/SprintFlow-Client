import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import RegisterPage from "../pages/RegisterPage";
import Results from "../pages/Results";
import UserDashboard from "../pages/UserDashboard";
import Configuration from "../pages/Configuration";
import ConfigurationTest from "../pages/ConfigurationTest";
import CreateSprint from "../pages/CreateSprint";
import EditSprint from "../pages/EditSprint";
import AdminDashboard from "../pages/Admindashboard";
import SprintDetail from "../pages/SprintDetail";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/ProtectedRoute";
import CreatorsPage from '../pages/CreatorsPage';

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
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
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
        path: "create-sprint",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <CreateSprint />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-sprint/:id",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <EditSprint />
          </ProtectedRoute>
        ),
      },

      // ========== RUTAS COMPARTIDAS (Autenticadas) ==========
      {
        path: "configuration",
        element: (
          <ProtectedRoute>
            <Configuration />
          </ProtectedRoute>
        ),
      },
      {
        path: "sprint-detail/:id",
        element: (
          <ProtectedRoute>
            <SprintDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "results",
        element: (
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        ),
      },
      {
        path: "creators",
        element: (
         <ProtectedRoute>
            <CreatorsPage />
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
], {
  // ✅ Agregar esta configuración
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  }
});

export default routerSprint;