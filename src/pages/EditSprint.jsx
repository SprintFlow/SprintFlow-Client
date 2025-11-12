import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Divider,
  Avatar,
  Grid,
  IconButton,
  useTheme,
  alpha,
  Snackbar,
} from "@mui/material";
import { ArrowBack, Save, Group, Assignment, Info, Add, Remove, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import useSprintStore from "../store/SprintStore";

// Tema adaptable (modo claro/oscuro) - IDENTICO A CREATESPRINT
const getThemeStyles = (theme) => ({
  primary: "#4CAF50",
  primaryDark: "#45A049",
  primaryLight: "#81C784",
  background: theme.palette.mode === 'dark' 
    ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" 
    : "#e6f2ed",
  cardBg: theme.palette.mode === 'dark' ? "#2D3748" : "#ffffff",
  gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
  gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
  textPrimary: theme.palette.mode === 'dark' ? "#FFFFFF" : "#1A202C",
  textSecondary: theme.palette.mode === 'dark' ? "#A0AEC0" : "#718096",
  border: theme.palette.mode === 'dark' ? "1px solid #4A5568" : "1px solid #E2E8F0",
  shadow: theme.palette.mode === 'dark' 
    ? "0 4px 24px rgba(0, 0, 0, 0.3)" 
    : "0 4px 24px rgba(0, 0, 0, 0.06)",
});

// Escala Fibonacci
const FIBONACCI_SCALE = [
  { points: 0.5, weight: 1.0 },
  { points: 1, weight: 1.1 },
  { points: 2, weight: 1.2 },
  { points: 3, weight: 1.3 },
  { points: 5, weight: 1.5 },
  { points: 8, weight: 1.8 },
  { points: 13, weight: 2.1 },
  { points: 21, weight: 2.5 },
];

export default function EditSprint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentSprint, fetchSprintById, updateSprint } = useSprintStore();

  const styles = getThemeStyles(theme);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [sprintData, setSprintData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    observations: "",
  });

  const [storyPoints, setStoryPoints] = useState({
    0.5: 0, 1: 0, 2: 0, 3: 0, 5: 0, 8: 0, 13: 0, 21: 0,
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userHours, setUserHours] = useState({});

  // Cargar sprint
  useEffect(() => {
    const loadSprint = async () => {
      try {
        setLoadingData(true);
        await fetchSprintById(id);
      } catch (err) {
        setError("No se pudo cargar el sprint");
        setSnackbarOpen(true);
      } finally {
        setLoadingData(false);
      }
    };
    loadSprint();
  }, [id, fetchSprintById]);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await UserService.getAll();
        setAvailableUsers(users);
      } catch (err) {
        setError("No se pudieron cargar los usuarios");
        setSnackbarOpen(true);
      }
    };
    fetchUsers();
  }, []);

  // Llenar formulario
  useEffect(() => {
    if (currentSprint) {
      setSprintData({
        name: currentSprint.name || "",
        startDate: currentSprint.startDate?.split('T')[0] || "",
        endDate: currentSprint.endDate?.split('T')[0] || "",
        observations: currentSprint.observations || "",
      });

      const newStoryPoints = { 0.5: 0, 1: 0, 2: 0, 3: 0, 5: 0, 8: 0, 13: 0, 21: 0 };
      if (currentSprint.plannedStories) {
        currentSprint.plannedStories.forEach((story) => {
          newStoryPoints[story.score] = story.quantity;
        });
      }
      setStoryPoints(newStoryPoints);

      if (currentSprint.usersAssigned) {
        const userIds = currentSprint.usersAssigned.map((u) => u.userId._id || u.userId);
        const hours = {};
        currentSprint.usersAssigned.forEach((u) => {
          const userId = u.userId._id || u.userId;
          hours[userId] = u.hours;
        });
        setSelectedUsers(userIds);
        setUserHours(hours);
      }
    }
  }, [currentSprint]);

  const getSprintDuration = () => {
    if (!sprintData.startDate || !sprintData.endDate) return 0;
    const start = new Date(sprintData.startDate);
    const end = new Date(sprintData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateIdealVelocity = () => {
    return FIBONACCI_SCALE.reduce((total, fib) => {
      const count = storyPoints[fib.points] || 0;
      return total + (fib.points * count * fib.weight);
    }, 0);
  };

  const calculateTotalPoints = () => {
    return FIBONACCI_SCALE.reduce((total, fib) => {
      return total + (fib.points * (storyPoints[fib.points] || 0));
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSprintData((prev) => ({ ...prev, [name]: value }));
  };

  // NUEVO: Manejar cambio de puntos con botones +/-
  const handleStoryPointIncrement = (points, increment) => {
    setStoryPoints((prev) => ({
      ...prev,
      [points]: Math.max(0, (prev[points] || 0) + increment),
    }));
  };

  // Función para input manual (sin flechas)
  const handleStoryPointChange = (points, value) => {
    const newValue = parseInt(value) || 0;
    setStoryPoints((prev) => ({
      ...prev,
      [points]: Math.max(0, newValue),
    }));
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        const newSelected = prev.filter((id) => id !== userId);
        const newHours = { ...userHours };
        delete newHours[userId];
        setUserHours(newHours);
        return newSelected;
      } else {
        setUserHours((h) => ({ ...h, [userId]: 40 }));
        return [...prev, userId];
      }
    });
  };

  // NUEVO: Manejar horas con botones +/-
  const handleHoursIncrement = (userId, increment) => {
    setUserHours((prev) => ({
      ...prev,
      [userId]: Math.max(0, Math.min(80, (prev[userId] || 40) + increment)),
    }));
  };

  // Función para input manual de horas (sin flechas)
  const handleHoursChange = (userId, hours) => {
    const newHours = parseInt(hours) || 0;
    setUserHours((prev) => ({ 
      ...prev, 
      [userId]: Math.max(0, Math.min(80, newHours)) 
    }));
  };

  const handleBack = () => {
    navigate(`/sprint-detail/${id}`);
  };

  const handleSave = async () => {
    // Validaciones específicas con mensajes detallados
    if (!sprintData.name) {
      setError("El nombre del sprint es obligatorio");
      setSnackbarOpen(true);
      return;
    }

    if (!sprintData.startDate || !sprintData.endDate) {
      setError("Las fechas de inicio y fin son obligatorias");
      setSnackbarOpen(true);
      return;
    }

    if (new Date(sprintData.startDate) >= new Date(sprintData.endDate)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      setSnackbarOpen(true);
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Debes seleccionar al menos un miembro del equipo");
      setSnackbarOpen(true);
      return;
    }

    if (calculateTotalPoints() === 0) {
      setError("Debes planificar al menos una historia con puntuacion");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const plannedStories = FIBONACCI_SCALE
        .filter((fib) => storyPoints[fib.points] > 0)
        .map((fib) => ({
          score: fib.points,
          quantity: storyPoints[fib.points],
        }));

      const usersAssigned = selectedUsers.map((userId) => ({
        userId,
        hours: userHours[userId] || 0,
      }));

      const payload = {
        ...sprintData,
        status: currentSprint.status,
        plannedStories,
        usersAssigned,
      };

      await updateSprint(id, payload);
      setSuccess("Sprint actualizado exitosamente");
      setSnackbarOpen(true);
      
      setTimeout(() => {
        navigate(`/sprint-detail/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setError(`Error: ${err.message || "Error al actualizar sprint"}`);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const totalPoints = calculateTotalPoints();
  const idealVelocity = calculateIdealVelocity();
  const duration = getSprintDuration();

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: styles.background }}>
        <CircularProgress size={60} sx={{ color: styles.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      background: styles.background,
      width: "100vw",
      margin: 0,
      padding: 0,
      overflowX: 'hidden'
    }}>
      <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
        {/* Header */}
        <Box sx={{
          width: "97%",
          background: styles.cardBg,
          borderRadius: 2,
          p: 3,
          mb: 3,
          boxShadow: styles.shadow,
          border: styles.border,
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: styles.primary,
                  color: styles.primary,
                  "&:hover": {
                    borderColor: styles.primaryDark,
                    backgroundColor: alpha(styles.primary, 0.04),
                  }
                }}
              >
                Volver al Detalle
              </Button>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="h4" fontWeight="700" color= "#27AE60">
                  Editar Sprint
                </Typography>
                <Typography variant="body2" sx={{ color: styles.textSecondary }}>
                  Modifica la configuracion del sprint
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Snackbar para errores y exito */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={success ? "success" : "error"}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <Close fontSize="small" />
              </IconButton>
            }
            sx={{
              width: '100%',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: styles.shadow,
            }}
          >
            {success || error}
          </Alert>
        </Snackbar>

        <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
          <Grid container spacing={3}>
            {/* COLUMNA IZQUIERDA */}
            <Grid item xs={12} lg={8}>
              {/* Informacion del Sprint */}
              <Card elevation={0} sx={{
                background: styles.cardBg,
                borderRadius: 2,
                boxShadow: styles.shadow,
                border: styles.border,
                mb: 3,
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: styles.primary }}>
                      <Info />
                    </Avatar>
                    <Typography variant="h6" fontWeight="700" sx={{ color: styles.textPrimary }}>
                      Informacion del Sprint
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                      label="Nombre del Sprint *"
                      name="name"
                      value={sprintData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Sprint Q1 2025 - Desarrollo de nuevas funcionalidades"
                      required
                      fullWidth
                      error={error && error.includes("nombre")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: styles.primary },
                          "&.Mui-focused fieldset": { borderColor: styles.primary },
                        }
                      }}
                    />

                    <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
                      <TextField
                        label="Fecha de Inicio *"
                        name="startDate"
                        type="date"
                        value={sprintData.startDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        fullWidth
                        error={error && error.includes("fecha")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: styles.primary },
                            "&.Mui-focused fieldset": { borderColor: styles.primary },
                          }
                        }}
                      />
                      <TextField
                        label="Fecha de Fin *"
                        name="endDate"
                        type="date"
                        value={sprintData.endDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        fullWidth
                        error={error && error.includes("fecha")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: styles.primary },
                            "&.Mui-focused fieldset": { borderColor: styles.primary },
                          }
                        }}
                      />
                    </Box>

                    {duration > 0 && (
                      <Alert severity="info" sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? alpha(styles.primary, 0.1) 
                          : "#E8F5E9" 
                      }}>
                        <Typography variant="body2" fontWeight="600">
                          Duracion del sprint: {duration} dias
                        </Typography>
                      </Alert>
                    )}

                    <TextField
                      label="Observaciones"
                      name="observations"
                      multiline
                      minRows={3}
                      value={sprintData.observations}
                      onChange={handleInputChange}
                      placeholder="Objetivos especificos, dependencias, riesgos identificados..."
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: styles.primary },
                          "&.Mui-focused fieldset": { borderColor: styles.primary },
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Historias Planificadas - CON BOTONES +/- Y TABLA FIJA */}
              <Card elevation={0} sx={{
                background: styles.cardBg,
                borderRadius: 2,
                boxShadow: styles.shadow,
                border: styles.border,
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: styles.primary }}>
                      <Assignment />
                    </Avatar>
                    <Typography variant="h6" fontWeight="700" sx={{ color: styles.textPrimary }}>
                      Historias Planificadas
                    </Typography>
                  </Box>

                  {/* Indicador visual si faltan puntos */}
                  {error && error.includes("historia") && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        border: `1px solid #f44336`,
                        backgroundColor: alpha('#f44336', 0.1),
                      }}
                    >
                      <Typography variant="body2" fontWeight="600">
                        {error}
                      </Typography>
                    </Alert>
                  )}

                  {/* TABLA FIJA - SIN SCROLL HORIZONTAL */}
                  <TableContainer 
                    component={Paper} 
                    variant="outlined" 
                    sx={{ 
                      mb: 3,
                      backgroundColor: theme.palette.mode === 'dark' ? '#2D3748' : '#FFFFFF',
                      width: '100%',
                      overflow: 'hidden',
                      tableLayout: 'fixed'
                    }}
                  >
                    <Table sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 700, 
                            color: styles.textPrimary,
                            width: '140px',
                            px: 1
                          }}>
                            Puntuacion
                          </TableCell>
                          {FIBONACCI_SCALE.map((fib) => (
                            <TableCell 
                              key={fib.points} 
                              align="center" 
                              sx={{ 
                                fontWeight: 700, 
                                color: styles.textPrimary,
                                px: 1
                              }}
                            >
                              <Chip
                                label={fib.points}
                                size="small"
                                sx={{
                                  backgroundColor: styles.primary,
                                  color: "white",
                                  fontWeight: 600,
                                  minWidth: '40px'
                                }}
                              />
                            </TableCell>
                          ))}
                          <TableCell 
                            align="center" 
                            sx={{ 
                              fontWeight: 700, 
                              color: styles.textPrimary,
                              width: '80px',
                              px: 1
                            }}
                          >
                            Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: styles.textPrimary,
                            px: 1
                          }}>
                            Nº Historias
                          </TableCell>
                          {FIBONACCI_SCALE.map((fib) => (
                            <TableCell key={fib.points} align="center" sx={{ px: 0.5 }}>
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleStoryPointIncrement(fib.points, -1)}
                                  disabled={storyPoints[fib.points] <= 0}
                                  sx={{
                                    color: styles.primary,
                                    border: `1px solid ${styles.primary}`,
                                    borderRadius: 1,
                                    width: 28,
                                    height: 28,
                                    minWidth: 28,
                                    '&:hover': {
                                      backgroundColor: alpha(styles.primary, 0.1),
                                    }
                                  }}
                                >
                                  <Remove fontSize="small" />
                                </IconButton>
                                
                                <TextField
                                  type="number"
                                  inputProps={{
                                    min: 0,
                                    style: { 
                                      textAlign: "center", 
                                      fontWeight: 600,
                                      padding: '4px 2px',
                                      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                        display: 'none',
                                      },
                                      '-moz-appearance': 'textfield',
                                    }
                                  }}
                                  value={storyPoints[fib.points]}
                                  onChange={(e) => handleStoryPointChange(fib.points, e.target.value)}
                                  sx={{ 
                                    width: 50,
                                    '& .MuiOutlinedInput-root': {
                                      height: 28,
                                      '& input': {
                                        padding: '4px 2px',
                                        fontSize: '14px',
                                        '&[type=number]': {
                                          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                            display: 'none',
                                          },
                                          '-moz-appearance': 'textfield',
                                        }
                                      },
                                      '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#4A5568' : '#E2E8F0',
                                      }
                                    }
                                  }}
                                  variant="outlined"
                                  size="small"
                                />
                                
                                <IconButton
                                  size="small"
                                  onClick={() => handleStoryPointIncrement(fib.points, 1)}
                                  sx={{
                                    color: 'white',
                                    backgroundColor: styles.primary,
                                    borderRadius: 1,
                                    width: 28,
                                    height: 28,
                                    minWidth: 28,
                                    '&:hover': {
                                      backgroundColor: styles.primaryDark,
                                    }
                                  }}
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          ))}
                          <TableCell 
                            align="center" 
                            sx={{ 
                              fontWeight: 700, 
                              fontSize: 16, 
                              color: styles.textPrimary,
                              px: 1
                            }}
                          >
                            {FIBONACCI_SCALE.reduce((sum, fib) => sum + (storyPoints[fib.points] || 0), 0)}
                          </TableCell>
                        </TableRow>

                        <TableRow sx={{ 
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? alpha('#FFFFFF', 0.05) 
                            : "#F8F9FA" 
                        }}>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: styles.textPrimary,
                            px: 1
                          }}>
                            Ponderado
                          </TableCell>
                          {FIBONACCI_SCALE.map((fib) => (
                            <TableCell 
                              key={fib.points} 
                              align="center" 
                              sx={{ 
                                color: styles.textSecondary, 
                                fontWeight: 600,
                                px: 1
                              }}
                            >
                              {fib.weight.toFixed(1)}
                            </TableCell>
                          ))}
                          <TableCell />
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: styles.textPrimary,
                            px: 1
                          }}>
                            Subtotal Puntos
                          </TableCell>
                          {FIBONACCI_SCALE.map((fib) => {
                            const count = storyPoints[fib.points] || 0;
                            const subtotal = fib.points * count;
                            return (
                              <TableCell 
                                key={fib.points} 
                                align="center" 
                                sx={{ 
                                  fontWeight: 700, 
                                  color: styles.textPrimary,
                                  px: 1
                                }}
                              >
                                {subtotal.toFixed(1)}
                              </TableCell>
                            );
                          })}
                          <TableCell 
                            align="center" 
                            sx={{ 
                              fontWeight: 700, 
                              fontSize: 18, 
                              color: styles.primary,
                              px: 1
                            }}
                          >
                            {totalPoints.toFixed(1)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box display="flex" gap={3} flexDirection={{ xs: "column", sm: "row" }}>
                    <Box sx={{
                      flex: 1,
                      p: 2,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? alpha(styles.primary, 0.1) 
                        : "#E8F5E9",
                      borderRadius: 2,
                      border: `1px solid ${styles.primaryLight}`
                    }}>
                      <Typography variant="body2" fontWeight="600" sx={{ color: styles.primaryDark }}>
                        Total Puntos Planificados
                      </Typography>
                      <Typography variant="h6" fontWeight="700" sx={{ color: styles.textPrimary }}>
                        {totalPoints.toFixed(1)} puntos
                      </Typography>
                    </Box>
                    <Box sx={{
                      flex: 1,
                      p: 2,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? alpha('#2196F3', 0.1) 
                        : "#E3F2FD",
                      borderRadius: 2,
                      border: `1px solid #90CAF9`
                    }}>
                      <Typography variant="body2" fontWeight="600" sx={{ color: "#1565C0" }}>
                        Velocidad Ideal (ponderada)
                      </Typography>
                      <Typography variant="h6" fontWeight="700" sx={{ color: styles.textPrimary }}>
                        {idealVelocity.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* COLUMNA DERECHA */}
            <Grid item xs={12} lg={4}>
              {/* Equipo Asignado - CON BOTONES +/- PARA HORAS */}
              <Card elevation={0} sx={{
                background: styles.cardBg,
                borderRadius: 2,
                boxShadow: styles.shadow,
                border: styles.border,
                mb: 3,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: styles.primary }}>
                      <Group />
                    </Avatar>
                    <Typography variant="h6" fontWeight="700" sx={{ color: styles.textPrimary }}>
                      Equipo Asignado
                    </Typography>
                  </Box>

                  {/* Alerta especifica para equipo si hay error */}
                  {error && error.includes("miembro") && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        border: `1px solid #f44336`,
                        backgroundColor: alpha('#f44336', 0.1),
                      }}
                    >
                      <Typography variant="body2" fontWeight="600">
                        {error}
                      </Typography>
                    </Alert>
                  )}

                  {availableUsers.length === 0 ? (
                    <Box display="flex" justifyContent="center" py={3}>
                      <CircularProgress sx={{ color: styles.primary }} />
                    </Box>
                  ) : (
                    <Grid container spacing={1.5}>
                      {availableUsers.map((user) => {
                        const isSelected = selectedUsers.includes(user._id);
                        return (
                          <Grid item xs={6} sm={4} key={user._id}>
                            <Box sx={{
                              p: 1.5,
                              border: styles.border,
                              borderRadius: 2,
                              backgroundColor: isSelected 
                                ? (theme.palette.mode === 'dark' ? alpha(styles.primary, 0.1) : "#F1F8E9") 
                                : (theme.palette.mode === 'dark' ? '#4A5568' : "#F8F9FA"),
                              transition: "all 0.2s",
                              height: '120px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              "&:hover": {
                                backgroundColor: isSelected 
                                  ? (theme.palette.mode === 'dark' ? alpha(styles.primary, 0.15) : "#E8F5E9") 
                                  : (theme.palette.mode === 'dark' ? '#2D3748' : "#F1F1F1"),
                              }
                            }}>
                              <Box>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isSelected}
                                      onChange={() => handleUserToggle(user._id)}
                                      size="small"
                                      sx={{
                                        color: styles.primary,
                                        "&.Mui-checked": { color: styles.primary },
                                      }}
                                    />
                                  }
                                  label={
                                    <Box>
                                      <Typography
                                        fontWeight="600"
                                        fontSize="0.8rem"
                                        lineHeight="1.2"
                                        sx={{
                                          color: styles.textPrimary,
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        {user.name}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: styles.textSecondary,
                                          display: '-webkit-box',
                                          WebkitLineClamp: 1,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        {user.role}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Box>

                              {isSelected && (
                                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                                  <Typography variant="caption" fontWeight="600" fontSize="0.7rem" sx={{ color: styles.textPrimary }}>
                                    Horas:
                                  </Typography>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleHoursIncrement(user._id, -5)}
                                      disabled={(userHours[user._id] || 40) <= 0}
                                      sx={{
                                        color: styles.primary,
                                        border: `1px solid ${styles.primary}`,
                                        borderRadius: 0.5,
                                        width: 20,
                                        height: 20,
                                        fontSize: '12px',
                                        '&:hover': {
                                          backgroundColor: alpha(styles.primary, 0.1),
                                        }
                                      }}
                                    >
                                      <Remove fontSize="inherit" />
                                    </IconButton>
                                    
                                    <TextField
                                      type="number"
                                      inputProps={{
                                        min: 0,
                                        max: 80,
                                        style: {
                                          textAlign: "center",
                                          fontWeight: 600,
                                          fontSize: '0.7rem',
                                          padding: '2px 4px',
                                          width: '35px',
                                          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                            display: 'none',
                                          },
                                          '-moz-appearance': 'textfield',
                                        }
                                      }}
                                      value={userHours[user._id] || 40}
                                      onChange={(e) => handleHoursChange(user._id, e.target.value)}
                                      variant="outlined"
                                      size="small"
                                      sx={{ 
                                        width: 50,
                                        '& .MuiOutlinedInput-root': {
                                          '& input': {
                                            '&[type=number]': {
                                              '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                                display: 'none',
                                              },
                                              '-moz-appearance': 'textfield',
                                            }
                                          }
                                        }
                                      }}
                                    />
                                    
                                    <IconButton
                                      size="small"
                                      onClick={() => handleHoursIncrement(user._id, 5)}
                                      disabled={(userHours[user._id] || 40) >= 80}
                                      sx={{
                                        color: 'white',
                                        backgroundColor: styles.primary,
                                        borderRadius: 0.5,
                                        width: 20,
                                        height: 20,
                                        fontSize: '12px',
                                        '&:hover': {
                                          backgroundColor: styles.primaryDark,
                                        }
                                      }}
                                    >
                                      <Add fontSize="inherit" />
                                    </IconButton>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}

                  {selectedUsers.length > 0 && (
                    <Alert severity="success" sx={{
                      mt: 2,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? alpha(styles.primary, 0.1) 
                        : "#E8F5E9",
                      border: `1px solid ${styles.primaryLight}`
                    }}>
                      <Typography variant="body2" fontWeight="600" sx={{ color: styles.textPrimary }}>
                        <strong>Equipo seleccionado:</strong> {selectedUsers.length} miembros
                      </Typography>
                      <Typography variant="body2" sx={{ color: styles.textPrimary }}>
                        <strong>Total horas:</strong> {Object.values(userHours).reduce((sum, h) => sum + h, 0)} horas
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Botones */}
              <Box display="flex" justifyContent="space-between" gap={2}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: styles.primary,
                    color: styles.primary,
                    px: 4,
                    py: 1.2,
                    "&:hover": {
                      borderColor: styles.primaryDark,
                      backgroundColor: alpha(styles.primary, 0.04)
                    },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    background: styles.gradient,
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.25)",
                    px: 4,
                    py: 1.2,
                    "&:hover": {
                      background: styles.gradientAlt,
                      boxShadow: "0 6px 16px rgba(76, 175, 80, 0.35)"
                    },
                    "&.Mui-disabled": {
                      background: "#e0e0e0",
                      color: "#9e9e9e",
                    }
                  }}
                >
                  {loading ? "Actualizando..." : "Actualizar Sprint"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}