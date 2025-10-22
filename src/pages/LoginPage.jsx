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
import PropTypes from "prop-types";

export function LoginPage({ onLogin }) {
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
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              id="email"
              label="Correo electrónico"
              type="email"
              placeholder="nombre@cohispania.com"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              fullWidth
            />

            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => onLogin("admin")}
              >
                Entrar como Admin
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => onLogin("user")}
              >
                Entrar como Desarrollador
              </Button>
            </Stack>

            <Typography variant="body2" align="center">
              <Link href="#" underline="hover">
                ¿Olvidaste tu contraseña?
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
