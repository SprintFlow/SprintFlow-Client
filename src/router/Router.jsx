import { createBrowserRouter } from "react-router-dom";import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SprintForm from "../pages/SprintForm";
import DashboardUser from "../pages/DashboardUser";
import Results from "../pages/Results";
import AdminProfile from "../pages/AdminProfile";
import UserProfile from "../pages/UserProfile";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/user" element={<DashboardUser />} />
        <Route path="/sprint" element={<SprintForm />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
      <Footer />
    </>
  );
}