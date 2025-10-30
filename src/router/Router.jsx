import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";

import App from "../App";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Results from "../pages/Results";
import UserDashboard from "../pages/UserDashboard";
import Configuration from "../pages/Configuration";
import Home from "../pages/Home";
import CreateEditSprint from "../pages/CreateEditSprint";
import AdminDashboard from "../pages/AdminDashboard";
import SprintDetail from "../pages/SprintDetail";
import NotFoundPage from "../pages/NotFoundPage";


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
        element: <UserDashboard />,
      },
      {
        path: "/create-edit-sprint",
        element: <CreateEditSprint />,
      },
      { 
        path: "/sprint-detail/:id", 
        element: <SprintDetail /> 
      },
      {
        path: "/results",
        element: <Results />,
      },
      {
        path: "/admin-dashboard", 
        element: <AdminDashboard />,
      },
      {
        path: "/configuration",
        element: <Configuration />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
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