import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function NotFoundPage() {
  const navigate = useNavigate();

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
        <ReportProblemIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
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
