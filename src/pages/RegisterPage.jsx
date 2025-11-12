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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SprintFlowLogo from "../components/SprintFlowLogo";

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const securityQuestions = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿En qué ciudad naciste?",
    "¿Cuál es el nombre de tu mejor amigo de la infancia?",
    "¿Cuál es tu comida favorita?",
    "¿Cómo se llamaba tu primer profesor?",
    "¿Cuál es el nombre de tu película favorita?",
    "¿En qué calle vivías de niño?",
    "¿Cuál es el segundo nombre de tu madre?"
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecurityAnswer, setShowSecurityAnswer] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleClickShowSecurityAnswer = () => {
    setShowSecurityAnswer(!showSecurityAnswer);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!form.securityQuestion || !form.securityAnswer.trim()) {
      setError("Por favor selecciona una pregunta de seguridad y proporciona una respuesta");
      return;
    }

    if (form.securityAnswer.trim().length < 2) {
      setError("La respuesta de seguridad debe tener al menos 2 caracteres");
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      securityQuestion: form.securityQuestion,
      securityAnswer: form.securityAnswer.trim()
    });

    if (result.success) {
      navigate("/"); 
    } else {
      setError(
        useAuthStore.getState().error || "Error al registrarse. Inténtalo de nuevo."
      );
    }
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
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          transform: "scale(1)",
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
        <Card sx={{ 
          width: "100%", 
          maxWidth: 420,
          boxShadow: 6,
          overflow: "visible",
        }}>
          <CardHeader
            sx={{ 
              textAlign: "center", 
              pb: 0,
              pt: 1,
            }}
            title={
              <Stack alignItems="center" spacing={0.5}>
                <Avatar sx={{ 
                  bgcolor: greenS, 
                  width: 44, 
                  height: 44,
                }}>
                  <PersonAddIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <Typography variant="h6" color="text.primary">
                  Crear una cuenta
                </Typography>
              </Stack>
            }
          />
          <CardContent sx={{ py: 1, px: 2 }}>
            <Box component="form" noValidate>
              <Stack spacing={1} sx={{ mt: 0.5 }}>
                <TextField
                  id="name"
                  label="Nombre completo"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  id="password"
                  label="Contraseña"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="confirmPassword"
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth required size="small">
                  <InputLabel id="security-question-label">
                    Pregunta de seguridad
                  </InputLabel>
                  <Select
                    labelId="security-question-label"
                    id="securityQuestion"
                    name="securityQuestion"
                    value={form.securityQuestion}
                    label="Pregunta de seguridad"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Selecciona una pregunta</em>
                    </MenuItem>
                    {securityQuestions.map((question, index) => (
                      <MenuItem key={index} value={question}>
                        {question}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  id="securityAnswer"
                  label="Respuesta de seguridad"
                  name="securityAnswer"
                  type={showSecurityAnswer ? "text" : "password"}
                  value={form.securityAnswer}
                  onChange={handleChange}
                  placeholder="Tu respuesta secreta"
                  fullWidth
                  required
                  size="small"
                  helperText="Esta respuesta te permitirá recuperar tu contraseña."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle security answer visibility"
                          onClick={handleClickShowSecurityAnswer}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                        >
                          {showSecurityAnswer ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && (
                  <Typography color="error" align="center" variant="body2" sx={{ mt: 0.5 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  fullWidth
                  sx={{
                    mt: 1.5,
                    mb: 0.5,
                    backgroundColor: greenS,
                    '&:hover': { backgroundColor: greenShover },
                  }}
                  onClick={handleRegister}
                  disabled={!form.securityQuestion || !form.securityAnswer}
                >
                  Registrarse
                </Button>

                <Typography variant="body2" align="center" sx={{ mt: 0.5 }}>
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    component="button"
                    underline="hover"
                    color="primary"
                    onClick={() => navigate("/")}
                  >
                    Inicia sesión
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}