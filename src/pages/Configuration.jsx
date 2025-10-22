import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  PersonAdd,
  Save
} from '@mui/icons-material';

const Configuration = () => {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'María Rodríguez',
    email: 'maria.rodriguez@cohispania.com',
    role: 'Scrum Master',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    dailyReminders: true,
    timezone: 'Europe/Madrid (GMT+1)'
  });

  const [users] = useState([
    { id: 1, name: 'Ana García', email: 'ana.garcia@cohispania.com', role: 'Developer', status: 'Activo' },
    { id: 2, name: 'Carlos López', email: 'carlos.lopez@cohispania.com', role: 'Developer', status: 'Activo' },
    { id: 3, name: 'María Rodríguez', email: 'maria.rodriguez@cohispania.com', role: 'Scrum Master', status: 'Activo' },
    { id: 4, name: 'Juan Martínez', email: 'juan.martinez@cohispania.com', role: 'QA', status: 'Activo' }
  ]);

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

  const handleSaveChanges = () => {
    console.log('Guardando cambios...', { personalInfo, preferences });
    // Aquí implementarías la lógica para guardar los cambios
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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Configuración
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona tu perfil y preferencias
          </Typography>
        </Box>
      </Box>

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
                  label="Nombre completo"
                  value={personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Correo electrónico"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  fullWidth
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label="Rol"
                    value={personalInfo.role}
                    onChange={(e) => handlePersonalInfoChange('role', e.target.value)}
                    fullWidth
                  />
                  <Chip 
                    label="Admin" 
                    color="error" 
                    size="small"
                  />
                </Box>

                <TextField
                  label="Nueva contraseña"
                  type="password"
                  value={personalInfo.newPassword}
                  onChange={(e) => handlePersonalInfoChange('newPassword', e.target.value)}
                  placeholder="Dejar en blanco para no cambiar"
                  fullWidth
                />

                <TextField
                  label="Confirmar contraseña"
                  type="password"
                  value={personalInfo.confirmPassword}
                  onChange={(e) => handlePersonalInfoChange('confirmPassword', e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferencias */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Preferencias
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Personaliza tu experiencia
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                      />
                    }
                    label=""
                  />
                </Box>

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
                      />
                    }
                    label=""
                  />
                </Box>

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
                      />
                    }
                    label=""
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="medium" mb={1}>
                    Zona horaria
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    >
                      <MenuItem value="Europe/Madrid (GMT+1)">Europe/Madrid (GMT+1)</MenuItem>
                      <MenuItem value="America/New_York (GMT-5)">America/New_York (GMT-5)</MenuItem>
                      <MenuItem value="Asia/Tokyo (GMT+9)">Asia/Tokyo (GMT+9)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón Guardar */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveChanges}
          sx={{ minWidth: 200 }}
        >
          Guardar cambios
        </Button>
      </Box>

      {/* Gestión de Usuarios */}
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
              sx={{ bgcolor: '#3f51b5' }}
            >
              Nuevo usuario
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell fontWeight="bold">Nombre</TableCell>
                  <TableCell fontWeight="bold">Email</TableCell>
                  <TableCell fontWeight="bold">Rol</TableCell>
                  <TableCell fontWeight="bold">Estado</TableCell>
                  <TableCell fontWeight="bold">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
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
                      <Chip
                        label={user.status}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
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
    </Box>
  );
};

export default Configuration;
