import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Dashboard, Settings, Assessment } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        textAlign: 'center'
      }}>
        {/* Logo y título principal */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" component="h1" fontWeight="bold" color="primary" mb={2}>
            SprintFlow
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={4}>
            Gestiona tus sprints de manera eficiente
          </Typography>
        </Box>

        {/* Tarjetas de navegación */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 3,
          width: '100%',
          maxWidth: '800px',
          mb: 4
        }}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
            onClick={() => navigate('/user-dashboard')}
          >
            <Dashboard color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visualiza el progreso de tus sprints
            </Typography>
          </Paper>

          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
            onClick={() => navigate('/results')}
          >
            <Assessment color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Resultados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analiza los resultados
            </Typography>
          </Paper>

          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
            onClick={() => navigate('/configuration')}
          >
            <Settings color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Configuración
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona tu perfil y preferencias
            </Typography>
          </Paper>
        </Box>

        {/* Botón principal */}
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/user-dashboard')}
          sx={{ minWidth: 200, py: 1.5 }}
        >
          Comenzar
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
