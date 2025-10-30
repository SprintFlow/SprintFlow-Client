import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SprintFlowLogo from "../components/SprintFlowLogo";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
        }}
      >
        {/* Logo animado */}
        <Box sx={{ mb: 4 }}>
          <SprintFlowLogo />
        </Box>

        {/* Subtítulo */}
        <Typography variant="h5" color="text.secondary" mb={4}>
          Gestiona tus sprints de manera eficiente
        </Typography>

        {/* Botón de login */}
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/login")}
          sx={{ minWidth: 200, py: 1.5 }}
        >
          Comenzar
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
