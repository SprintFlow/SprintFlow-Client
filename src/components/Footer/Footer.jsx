// src/components/Footer/Footer.jsx
import React from "react";
import { Box, Typography, Divider, Link, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Footer() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const theme = useTheme();

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
        backgroundColor: theme.palette.background.paper,
        color: "text.secondary",
        textAlign: "center",
        py: 2,
        mt: "auto",
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60%',
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
    }
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} SprintFlow — Todos los derechos reservados.
      </Typography>
      <Typography variant="caption">
        Desarrollado por{" "}
        <Link href="/creators" underline="hover" color="primary">
          SprintFlow Team
        </Link>
      </Typography>
    </Box>
  );
}
