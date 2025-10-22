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
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // Un icono más apropiado para el registro
import PropTypes from "prop-types";

export function RegisterPage({ onRegister }) {
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
                autoComplete="name"
                autoFocus
                fullWidth
              />
              <TextField
                id="email"
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                fullWidth
              />
              <TextField
                id="password"
                label="Contraseña"
                name="password"
                type="password"
                fullWidth
              />
              <TextField
                id="confirmPassword"
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                onClick={(e) => {
                  e.preventDefault(); // Previene el envío real por ahora
                  onRegister();
                }}
              >
                Registrarse
              </Button>

              <Typography variant="body2" align="center">
                <Link href="/login" underline="hover">
                  ¿Ya tienes una cuenta? Inicia sesión
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

RegisterPage.propTypes = {
  onRegister: PropTypes.func.isRequired,
};
