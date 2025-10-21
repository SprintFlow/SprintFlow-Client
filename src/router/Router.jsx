import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";

import App from "../App"; 
import Login from "../pages/Login";
import Register from "../pages/Register";
import Results from "../pages/Results";
import AdminProfile from "../pages/AdminProfile";
import UserProfile from "../pages/UserProfile";
import UserDashboard from "../pages/UserDashboard";

const routerSprint = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, 
        element: <App />,
      },
      {
        path: "user-dashboard",
        element: <UserDashboard />,
      },
      {
        path: "results",
        element: <Results />,
      },
      {
        path: "admin-profile",
        element: <AdminProfile />,
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <h1>404 - Page not found</h1>,
  },
]);

export default routerSprint;