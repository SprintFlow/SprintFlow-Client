import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Badge
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Edit,
  Delete,
  PersonAdd,
  PhotoCamera
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import useAuthStore from '../store/authStore';

const Configuration = () => {
  const navigate = useNavigate();
  
  // Obtener usuario y métodos desde el store (localStorage)
  const { user: currentUser, updateUser } = useAuthStore();
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    role: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    dailyReminders: true
  });

  // Estados para el backend
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Colores del tema verde profesional (igual que AdminDashboard)
  const theme = {
    primary: "#4CAF50",
    primaryDark: "#45A049",
    primaryLight: "#81C784",
    background: "#e6f2ed",
    cardBg: "#ffffff",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
  };

  // Cargar datos del usuario actual al montar el componente
  useEffect(() => {
    loadCurrentUser();
    loadUsers();
  }, [currentUser]);

  const loadCurrentUser = () => {
    if (currentUser) {
      setPersonalInfo({
        fullName: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        avatar: currentUser.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await UserService.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      // No mostrar error si no tiene permisos de admin
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    // Validar contraseñas si se están cambiando
    if (personalInfo.newPassword || personalInfo.confirmPassword) {
      if (!personalInfo.currentPassword) {
        setError('Debes proporcionar tu contraseña actual para cambiarla');
        return;
      }
      
      if (personalInfo.newPassword !== personalInfo.confirmPassword) {
        setError('Las contraseñas nuevas no coinciden');
        return;
      }

      if (personalInfo.newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      let hasProfileChanges = false;
      let hasPasswordChanges = false;

      // Verificar si hay cambios en el perfil
      const nameChanged = personalInfo.fullName !== currentUser?.name;
      const emailChanged = personalInfo.email !== currentUser?.email;
      const avatarChanged = personalInfo.avatar !== (currentUser?.avatar || '');

      hasProfileChanges = nameChanged || emailChanged || avatarChanged;

      // Actualizar perfil básico (nombre, email y avatar) si hay cambios
      if (hasProfileChanges) {
        const profileData = {
          name: personalInfo.fullName,
          email: personalInfo.email,
          avatar: personalInfo.avatar
        };
        
        console.log('Guardando perfil:', { 
          nameChanged, 
          emailChanged, 
          avatarChanged,
          avatarLength: personalInfo.avatar?.length 
        });
        
        await UserService.updateProfile(profileData);
        
        // Actualizar el store de Zustand con la nueva información
        updateUser({
          name: personalInfo.fullName,
          email: personalInfo.email,
          avatar: personalInfo.avatar
        });
      }

      // Cambiar contraseña si se proporcionó
      if (personalInfo.newPassword) {
        await UserService.changePassword({
          currentPassword: personalInfo.currentPassword,
          newPassword: personalInfo.newPassword,
          confirmPassword: personalInfo.confirmPassword
        });
        hasPasswordChanges = true;
      }

      // Mostrar mensaje de éxito si hubo algún cambio
      if (hasProfileChanges || hasPasswordChanges) {
        setSuccess('Cambios guardados exitosamente');
      } else {
        setError('No hay cambios para guardar');
      }
      
      // Limpiar campos de contraseña
      setPersonalInfo(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setError('Error al guardar los cambios: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Manejar Enter para guardar cambios
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSaveChanges();
    }
  };

  // Convertir imagen a Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar cambio de avatar (desde input file o drag & drop)
  const handleAvatarChange = async (file) => {
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2MB');
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      console.log('Avatar convertido a Base64:', {
        length: base64.length,
        preview: base64.substring(0, 50) + '...'
      });
      handlePersonalInfoChange('avatar', base64);
      setError(''); // Limpiar cualquier error previo
    } catch (error) {
      console.error('Error al convertir imagen:', error);
      setError('Error al procesar la imagen');
    }
  };

  // Manejar drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Manejar drop de imagen
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    handleAvatarChange(file);
  };

  // Manejar click en el botón de cámara
  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      handleAvatarChange(file);
    };
    input.click();
  };

  const handleNewUser = async () => {
    const name = prompt('Nombre del nuevo usuario:');
    const email = prompt('Email del nuevo usuario:');
    const role = prompt('Rol del nuevo usuario (Developer/Scrum Master/QA):') || 'Developer';
    
    if (name && email) {
      try {
        setLoading(true);
        setError('');
        await UserService.create({
          name,
          email,
          role,
          password: 'temporal123'
        });
        
        await loadUsers();
        setSuccess('Usuario agregado exitosamente');
      } catch (error) {
        console.error('Error al crear usuario:', error);
        setError('Error al crear usuario: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditUser = async (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      const newName = prompt('Nuevo nombre:', user.name);
      const newEmail = prompt('Nuevo email:', user.email);
      const newRole = prompt('Nuevo rol:', user.role);
      
      if (newName && newEmail && newRole) {
        try {
          setLoading(true);
          setError('');
          await UserService.update(userId, {
            name: newName,
            email: newEmail,
            role: newRole
          });
          
          await loadUsers();
          setSuccess('Usuario actualizado exitosamente');
        } catch (error) {
          console.error('Error al actualizar usuario:', error);
          setError('Error al actualizar usuario: ' + (error.response?.data?.message || error.message));
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u._id === userId);
    if (user && window.confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
      try {
        setLoading(true);
        setError('');
        await UserService.delete(userId);
        await loadUsers();
        setSuccess('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setError('Error al eliminar usuario: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
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

  const isAdmin = currentUser?.isAdmin || currentUser?.role === 'Scrum Master';

  if (loading && users.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ backgroundColor: theme.background }}
      >
        <CircularProgress size={60} sx={{ color: theme.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      backgroundColor: theme.background,
      py: 3,
      width: '100vw',
      overflowX: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      {/* Container principal */}
      <Box sx={{ 
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
      }}>
        {/* Header */}
        <Box
          sx={{
            background: theme.cardBg,
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            border: `1px solid #e0e0e0`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                sx={{ 
                  color: theme.primaryDark,
                  mb: 0.5
                }}
              >
                Configuración
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Gestiona tu cuenta y preferencias
              </Typography>
            </Box>
            <IconButton 
              onClick={handleGoBack}
              sx={{
                backgroundColor: theme.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.primaryDark,
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
        </Box>

        {/* Mostrar mensajes */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
            }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
            }} 
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Información Personal */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  fontWeight="700" 
                  mb={1}
                  sx={{ color: theme.primaryDark }}
                >
                  Información Personal
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Actualiza tus datos de perfil
                </Typography>

                {/* Avatar Section */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <IconButton
                          sx={{
                            backgroundColor: theme.primary,
                            color: 'white',
                            width: 40,
                            height: 40,
                            '&:hover': {
                              backgroundColor: theme.primaryDark,
                            },
                          }}
                          onClick={handleAvatarClick}
                          disabled={loading}
                        >
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      }
                    >
                      <Avatar
                        src={personalInfo.avatar}
                        alt={personalInfo.fullName}
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: '3rem',
                          backgroundColor: theme.primary,
                          border: `4px solid ${theme.primary}`,
                        }}
                      >
                        {!personalInfo.avatar && personalInfo.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ mt: 1, textAlign: 'center' }}
                  >
                    Click o arrastra una imagen aquí
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Nombre Completo"
                    value={personalInfo.fullName}
                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                    fullWidth
                    disabled={loading}
                  />

                  <TextField
                    label="Correo electrónico"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    fullWidth
                    disabled={loading}
                  />

                  <TextField
                    label="Rol"
                    value={personalInfo.role}
                    fullWidth
                    disabled
                    helperText="Contacta a un administrador para cambiar tu rol"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cambiar Contraseña */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  fontWeight="700" 
                  mb={1}
                  sx={{ color: theme.primaryDark }}
                >
                  Cambiar Contraseña
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Actualiza tu contraseña de acceso
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Contraseña Actual"
                    type="password"
                    value={personalInfo.currentPassword}
                    onChange={(e) => handlePersonalInfoChange('currentPassword', e.target.value)}
                    onKeyPress={handleKeyPress}
                    fullWidth
                    disabled={loading}
                  />

                  <TextField
                    label="Nueva Contraseña"
                    type="password"
                    value={personalInfo.newPassword}
                    onChange={(e) => handlePersonalInfoChange('newPassword', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mínimo 6 caracteres"
                    fullWidth
                    disabled={loading}
                  />

                  <TextField
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    value={personalInfo.confirmPassword}
                    onChange={(e) => handlePersonalInfoChange('confirmPassword', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Repite la nueva contraseña"
                    fullWidth
                    disabled={loading}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Preferencias */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  fontWeight="700" 
                  mb={1}
                  sx={{ color: theme.primaryDark }}
                >
                  Preferencias
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Personaliza tu experiencia
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium" mb={1}>
                        Tema de la aplicación
                      </Typography>
                      <Typography variant="caption" color="text.secondary" mb={2} display="block">
                        Cambia entre modo claro y oscuro
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.theme === 'dark'}
                            onChange={(e) => handlePreferenceChange('theme', e.target.checked ? 'dark' : 'light')}
                            disabled={loading}
                          />
                        }
                        label={preferences.theme === 'dark' ? 'Oscuro' : 'Claro'}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium" mb={1}>
                        Notificaciones por email
                      </Typography>
                      <Typography variant="caption" color="text.secondary" mb={2} display="block">
                        Recibe actualizaciones de sprint
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.emailNotifications}
                            onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                            disabled={loading}
                          />
                        }
                        label={preferences.emailNotifications ? 'Activas' : 'Desactivadas'}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium" mb={1}>
                        Recordatorios diarios
                      </Typography>
                      <Typography variant="caption" color="text.secondary" mb={2} display="block">
                        Daily stand-up automático
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.dailyReminders}
                            onChange={(e) => handlePreferenceChange('dailyReminders', e.target.checked)}
                            disabled={loading}
                          />
                        }
                        label={preferences.dailyReminders ? 'Activos' : 'Desactivados'}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Botón Guardar */}
        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Save />}
            onClick={handleSaveChanges}
            disabled={loading}
            sx={{ 
              minWidth: 250,
              background: theme.gradient,
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              "&:hover": {
                background: theme.gradientAlt,
              },
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>

        {/* Gestión de Usuarios - Solo visible para admin */}
        {isAdmin && users.length > 0 && (
          <Card 
            sx={{ 
              mt: 4,
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              border: `1px solid #e0e0e0`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="700"
                    sx={{ color: theme.primaryDark }}
                  >
                    Gestión de Usuarios
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administra los miembros del equipo
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleNewUser}
                  disabled={loading}
                  sx={{
                    background: theme.gradient,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      background: theme.gradientAlt,
                    },
                  }}
                >
                  Nuevo Usuario
                </Button>
              </Box>

              <TableContainer 
                component={Paper} 
                sx={{ 
                  boxShadow: 'none', 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Rol</strong></TableCell>
                      <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditUser(user._id)}
                            disabled={loading}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={loading || user._id === currentUser?.id}
                            title={user._id === currentUser?.id ? 'No puedes eliminar tu propio usuario' : 'Eliminar usuario'}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Configuration;
