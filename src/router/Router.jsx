import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";

import App from "../App"; 
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Results from "../pages/Results";
// import AdminProfile from "../pages/AdminProfile";
// import UserProfile from "../pages/UserProfile";
import UserDashboard from "../pages/UserDashboard";
import CreateEditSprint from "../pages/CreateEditSprint"

const routerSprint = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, 
        element: <App />,
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
        path: "/results",
        element: <Results />,
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