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
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  console.log("useAuthStore:", useAuthStore());
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (!result.success) {
      setError("Error al registrarse. Inténtalo de nuevo.");
    } else {
      navigate("/"); // o directamente al dashboard
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
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                id="name"
                label="Nombre completo"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                id="email"
                label="Correo electrónico"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                id="password"
                label="Contraseña"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                id="confirmPassword"
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                fullWidth
              />

              {error && (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                onClick={handleRegister}
              >
                Registrarse
              </Button>

              <Typography variant="body2" align="center">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  component="button"
                  underline="hover"
                  onClick={() => navigate("/login")}
                >
                  Inicia sesión
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
