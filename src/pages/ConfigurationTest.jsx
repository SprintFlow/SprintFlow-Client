import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ConfigurationTest = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Configuración - Versión de Prueba</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Esta es una versión simplificada para verificar que la ruta funciona.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate(-1)}
        sx={{ mt: 2 }}
      >
        Volver
      </Button>
    </Box>
  );
};

export default ConfigurationTest;
