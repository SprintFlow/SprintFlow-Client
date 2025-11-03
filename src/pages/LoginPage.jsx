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
import SprintFlowLogo from "../components/SprintFlowLogo";
import LoadingOverlay from "../components/LoadingOverlay";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Obtener el usuario actualizado del store
        const currentUser = useAuthStore.getState().user;
        
        // Redirigir según el rol del usuario
        if (currentUser?.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setError(
          useAuthStore.getState().error ||
            "Credenciales inválidas o error en el servidor."
        );
      }
    } finally { // Garantiza que loading se desactive
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  // Color verde de la "S" animada
  const greenS = "#4CAF50";
  const greenShover = "#45A049";
  const backgroundMint = "#e6f2ed";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        width: "100vw",
        backgroundColor: backgroundMint,
        overflow: "hidden",
      }}
    >
      {/* LoadingOverlay sobre toda la página */}
      <LoadingOverlay open={isLoading} />

      {/* Lado izquierdo: animación */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <SprintFlowLogo />
      </Box>

      {/* Lado derecho: formulario */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          p: 2,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 450, boxShadow: 6 }}>
          <CardHeader
            sx={{ textAlign: "center", pb: 0 }}
            title={
              <Stack alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: greenS, width: 56, height: 56 }}>
                  <TrackChangesIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h4" component="h1" color="text.primary">
                  SprintFlow
                </Typography>
              </Stack>
            }
            subheader="Gestión ágil de sprints para Cohispania"
          />
          <CardContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                id="email"
                label="Correo electrónico"
                type="email"
                placeholder="nombre@cohispania.com"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
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
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />

              {error && (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              )}

              <Stack spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleLogin}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: greenS,
                    "&:hover": { backgroundColor: greenShover },
                  }}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </Stack>

              <Typography variant="body2" align="center">
                <Link href="#" underline="hover" color="primary">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Typography>

              <Typography variant="body2" align="center">
                ¿No tienes cuenta?{" "}
                <Link
                  component="button"
                  underline="hover"
                  color="primary"
                  onClick={() => navigate("/register")}
                  disabled={isLoading}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}