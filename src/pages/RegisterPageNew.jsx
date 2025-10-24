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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) clearError();
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    
    if (result.success) {
      navigate("/user-dashboard");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f0f7ff, #e0f2fe)",
        p: 4,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 450, boxShadow: 6 }}>
        <CardHeader
          sx={{ textAlign: "center", pb: 0 }}
          title={
            <Stack alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <PersonAddIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" component="h1">
                Crear una cuenta
              </Typography>
            </Stack>
          }
          subheader="Únete a SprintFlow para empezar a gestionar tus proyectos"
        />
        <CardContent>
          {(error || validationError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || validationError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                name="name"
                label="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
                fullWidth
                required
              />
              <TextField
                name="email"
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                fullWidth
                required
              />
              <TextField
                name="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                helperText="Mínimo 6 caracteres"
              />
              <TextField
                name="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Crear cuenta"}
              </Button>

              <Typography variant="body2" align="center">
                ¿Ya tienes una cuenta?{" "}
                <Link component={RouterLink} to="/login" underline="hover">
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
