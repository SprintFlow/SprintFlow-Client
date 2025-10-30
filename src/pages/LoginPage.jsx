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
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await login({ email, password });

    if (result.success) {
      navigate("/"); // redirige al home o dashboard
    } else {
      setError(
        useAuthStore.getState().error ||
          "Credenciales inválidas o error en el servidor."
      );
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
                <TrackChangesIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" component="div">
                SprintFlow
              </Typography>
            </Stack>
          }
          subheader="Gestión ágil de sprints para Cohispania"
        />
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h5" component="h1" align="center">
              Iniciar sesión
            </Typography>

            <TextField
              id="email"
              label="Correo electrónico"
              type="email"
              placeholder="nombre@cohispania.com"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>

            <Typography variant="body2" align="center">
              <Link href="#" underline="hover">
                ¿Olvidaste tu contraseña?
              </Link>
            </Typography>

            <Typography variant="body2" align="center">
              ¿No tienes cuenta?{" "}
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate("/register")}
              >
                Regístrate aquí
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
