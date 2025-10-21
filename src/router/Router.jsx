import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";

import App from "../App"; 
// import Login from "../pages/Login";
// import Register from "../pages/Register";
import Results from "../pages/Results";
// import AdminProfile from "../pages/AdminProfile";
// import UserProfile from "../pages/UserProfile";
import UserDashboard from "../pages/UserDashboard";
import Configuration from "../pages/Configuration";
import Home from "../pages/Home";

const routerSprint = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, 
        element: <Home />,
      },
      {
        path: "/user-dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/results",
        element: <Results />,
      },
      {
        path: "/configuration",
        element: <Configuration />,
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