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
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Edit,
  Delete,
  PersonAdd
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

      let profileUpdated = false;

      // Actualizar perfil básico (nombre y email)
      if (personalInfo.fullName !== currentUser?.name || personalInfo.email !== currentUser?.email) {
        const profileData = {
          name: personalInfo.fullName,
          email: personalInfo.email
        };
        await UserService.updateProfile(profileData);
        
        // Actualizar el store de Zustand con la nueva información
        updateUser({
          name: personalInfo.fullName,
          email: personalInfo.email
        });
        
        profileUpdated = true;
      }

      // Cambiar contraseña si se proporcionó
      if (personalInfo.newPassword) {
        await UserService.changePassword({
          currentPassword: personalInfo.currentPassword,
          newPassword: personalInfo.newPassword,
          confirmPassword: personalInfo.confirmPassword
        });
      }

      setSuccess('Cambios guardados exitosamente');
      
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

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4
      }}>
        <IconButton sx={{ mr: 2 }} onClick={handleGoBack}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Configuración
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona tu cuenta y preferencias
          </Typography>
        </Box>
      </Box>

      {/* Mostrar mensajes */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Información Personal */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Información Personal
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Actualiza tus datos de perfil
              </Typography>

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
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
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
                  fullWidth
                  disabled={loading}
                />

                <TextField
                  label="Nueva Contraseña"
                  type="password"
                  value={personalInfo.newPassword}
                  onChange={(e) => handlePersonalInfoChange('newPassword', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  fullWidth
                  disabled={loading}
                />

                <TextField
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  value={personalInfo.confirmPassword}
                  onChange={(e) => handlePersonalInfoChange('confirmPassword', e.target.value)}
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
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
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
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSaveChanges}
          disabled={loading}
          sx={{ minWidth: 250 }}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>

      {/* Gestión de Usuarios - Solo visible para admin */}
      {isAdmin && users.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
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
              >
                Nuevo Usuario
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
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
  );
};

export default Configuration;
