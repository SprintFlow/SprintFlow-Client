import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Settings,
  EmojiEvents,
  Assignment,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthServices from '../services/AuthServices';
import useAuthStore from '../store/authStore';

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Obtener usuario desde el store (localStorage)
  const { user: userFromStore } = useAuthStore();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [userFromStore]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Si tenemos usuario en el store, usarlo como base
      if (userFromStore) {
        // Intentar obtener estadísticas del backend
        try {
          const userData = await AuthServices.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Si falla, usar solo los datos del store sin estadísticas
          console.warn('No se pudieron cargar estadísticas, usando datos del localStorage');
          setUser({
            ...userFromStore,
            statistics: {
              totalPoints: 0,
              completedStories: 0,
              activeStories: 0
            }
          });
        }
      } else {
        setError('No hay usuario autenticado');
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setError('Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    navigate('/configuration');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Scrum Master':
        return 'error';
      case 'Developer':
        return 'primary';
      case 'QA':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="warning">
          No se pudo cargar el perfil del usuario
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton sx={{ mr: 2 }} onClick={handleGoBack}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Mi Perfil
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información del Perfil */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
              >
                {getInitials(user.name)}
              </Avatar>

              <Typography variant="h5" fontWeight="bold" mb={1}>
                {user.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                {user.email}
              </Typography>

              <Chip
                label={user.role}
                color={getRoleColor(user.role)}
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEditProfile}
                  fullWidth
                >
                  Editar Perfil
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => navigate('/configuration')}
                  fullWidth
                >
                  Configuración
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Estadísticas */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Total de Puntos */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmojiEvents sx={{ color: 'warning.main', mr: 1, fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Puntos Totales
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {user.statistics?.totalPoints || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Historias Completadas */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assignment sx={{ color: 'success.main', mr: 1, fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Historias Completadas
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {user.statistics?.completedStories || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Historias Activas */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ color: 'info.main', mr: 1, fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Historias Activas
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {user.statistics?.activeStories || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Información Adicional */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Información de la Cuenta
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        ID de Usuario
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.id}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Rol en el Equipo
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.role}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email de Contacto
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.email}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Estado de la Cuenta
                      </Typography>
                      <Chip 
                        label="Activa" 
                        color="success" 
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Actividad Reciente (Placeholder para futuras mejoras) */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Actividad Reciente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No hay actividad reciente para mostrar
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;