// src/components/Footer/Footer.jsx
import React from "react";
import { Box, Typography, Divider, Link } from "@mui/material";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Footer() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Rutas donde NO debe mostrarse el footer
  const noFooterRoutes = ["/", "/login", "/register", "/forgot-password"];

  // No mostrar footer si:
  // 1. No está autenticado O
  // 2. Está en una ruta de autenticación
  if (!isAuthenticated || noFooterRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#8cc8b5",
        color: "text.secondary",
        textAlign: "center",
        py: 2,
        mt: "auto",
        borderTop: "1px solid #48724dff",
      }}
    >
      <Divider sx={{ mb: 1 }} />
      <Typography variant="body2">
        © {new Date().getFullYear()} SprintFlow — Todos los derechos reservados.
      </Typography>
      <Typography variant="caption">
        Desarrollado por{" "}
        <Link href="#" underline="hover" color="primary">
          Cohispania Team
        </Link>
      </Typography>
    </Box>
  );
}
