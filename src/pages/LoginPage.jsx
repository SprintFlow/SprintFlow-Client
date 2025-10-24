import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(formData);
    
    if (result.success) {
      navigate("/user-dashboard");
    }
  };

  // Función para login demo (mantener funcionalidad original)
  const handleDemoLogin = async (type) => {
    const demoCredentials = {
      email: type === "admin" ? "admin@cohispania.com" : "dev@cohispania.com",
      password: "demo123",
    };
    
    const result = await login(demoCredentials);
    
    if (result.success) {
      navigate(type === "admin" ? "/admin-dashboard" : "/user-dashboard");
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f0f7ff, #e0f2fe)", // Gradiente similar al original
        p: 4,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 450, boxShadow: 6 }}>
        <CardHeader
          sx={{ textAlign: "center", pb: 0 }}
          title={
            <Stack alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <TrackChangesIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" component="h1">
                SprintFlow
              </Typography>
            </Stack>
          }
          subheader="Gestión ágil de sprints para Cohispania"
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                name="email"
                label="Correo electrónico"
                type="email"
                placeholder="nombre@cohispania.com"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                name="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
              />

              <Stack spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
                </Button>
                
                <Typography variant="body2" align="center" sx={{ py: 1 }}>
                  O usar acceso demo:
                </Typography>
                
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                >
                  Entrar como Admin
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => handleDemoLogin("user")}
                  disabled={isLoading}
                >
                  Entrar como Desarrollador
                </Button>
              </Stack>

              <Stack spacing={1} sx={{ pt: 1 }}>
                <Typography variant="body2" align="center">
                  <Link href="#" underline="hover">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Typography>
                <Typography variant="body2" align="center">
                  ¿No tienes cuenta?{" "}
                  <Link component={RouterLink} to="/register" underline="hover">
                    Regístrate aquí
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
