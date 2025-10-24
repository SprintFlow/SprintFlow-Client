import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Results from "../pages/Results";
import UserDashboard from "../pages/UserDashboard";
import Configuration from "../pages/Configuration";
import Home from "../pages/Home";
import CreateEditSprint from "../pages/CreateEditSprint";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

const routerSprint = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, 
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/user-dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-edit-sprint",
        element: (
          <ProtectedRoute>
            <CreateEditSprint />
          </ProtectedRoute>
        ),
      },
      {
        path: "/results",
        element: (
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-dashboard", 
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/configuration",
        element: (
          <ProtectedRoute>
            <Configuration />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "admin-profile",
      //   element: <AdminProfile />,
      // },
      // {
      //   path: "user-profile",
      //   element: <UserProfile />,
      // }
    ]
}]);

export default routerSprint;