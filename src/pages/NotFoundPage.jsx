import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import SprintFlowLogo from "../components/SprintFlowLogo";
import useAuthStore from "../store/authStore";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  console.log("🔴 404 Page - Debug Info:");
  console.log("   - Ruta intentada:", location.pathname);
  console.log("   - isAuthenticated:", isAuthenticated);
  console.log("   - user:", user);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <SprintFlowLogo />
        </Box>
        <Typography variant="h3" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </Typography>
        <Typography variant="caption" color="text.secondary" mb={2}>
          Ruta: {location.pathname}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
}
