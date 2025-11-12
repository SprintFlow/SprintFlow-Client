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
  IconButton,
  InputAdornment,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await login({ email, password });

      if (result && typeof result.success !== "undefined") {
        if (result.success) {
          const currentUser = useAuthStore.getState().user;
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
        return;
      }

      // Fallback: direct backend request with httpOnly cookies
      try {
        const res = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Credenciales inválidas o error en el servidor.");
          return;
        }

        const maybeSetUser = useAuthStore.getState().setUser;
        if (typeof maybeSetUser === "function" && data.user) {
          maybeSetUser(data.user);
        }

        if (data.user?.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } catch (fallbackErr) {
        console.error("Fallback login error:", fallbackErr);
        setError("Error en la conexión con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

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
      <LoadingOverlay open={isLoading} />

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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                <Link
                  component="button"
                  underline="hover"
                  color="primary"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
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