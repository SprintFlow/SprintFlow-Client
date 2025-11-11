import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Group,
  Assessment,
  Edit,
  Delete,
  TrendingUp,
  Speed,
  Warning,
  Person,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useSprintStore from "../store/SprintStore";
import axiosClient from '../utils/axiosClient';

export default function SprintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSprint, isLoading, fetchSprintById, deleteSprint } = useSprintStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [completions, setCompletions] = useState([]);
  const [completionsLoading, setCompletionsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Tema verde menta profesional con soporte para modo oscuro
  const customTheme = {
    primary: "#4CAF50",
    primaryDark: "#45A049",
    primaryLight: "#81C784",
    background: theme.palette.mode === 'dark' ? theme.palette.background.default : "#e6f2ed",
    cardBg: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#ffffff",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
    text: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
    // textSecondary: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.secondary,
    textSecondary: theme.palette.mode === 'dark' ? theme.palette.text.secondary : "#6b7280",
  };

  // Colores para estados de sprints
  const statusColors = {
    Activo: "#1976D2",
    Planificado: "#7B1FA2",
    Completado: "#2E7D32",
    "Completado Parcial": "#FF9800",
  };

  // Puntos de Fibonacci para la tabla
  const fibonacciPoints = [0.5, 1, 2, 3, 5, 8, 13, 21];

  // Función para calcular puntos planificados correctamente
  const calculateTotalPlannedPoints = (sprint) => {
    if (!sprint.plannedStories || sprint.plannedStories.length === 0) {
      return 0;
    }

    return sprint.plannedStories.reduce((total, story) => {
      return total + (story.score * story.quantity);
    }, 0);
  };

  // Función para calcular historias planificadas correctamente
  const calculateTotalPlannedStories = (sprint) => {
    if (!sprint.plannedStories || sprint.plannedStories.length === 0) {
      return 0;
    }

    return sprint.plannedStories.reduce((total, story) => {
      return total + story.quantity;
    }, 0);
  };

  // NUEVO: Función para validar y filtrar puntos completados
  const getValidCompletedPoints = () => {
    let totalValidPoints = 0;
    const validCompletions = [];

    completions.forEach(completion => {
      if (completion.completedStories) {
        let userValidPoints = 0;
        const validStories = [];

        completion.completedStories.forEach(story => {
          // Verificar si este tamaño de historia estaba planificado
          const plannedStory = currentSprint?.plannedStories?.find(
            planned => planned.score === story.score
          );
          
          if (plannedStory) {
            // Limitar la cantidad completada a la máxima planificada
            const maxAllowed = plannedStory.quantity;
            const completedCount = Math.min(story.completedCount || 0, maxAllowed);
            
            if (completedCount > 0) {
              userValidPoints += story.score * completedCount;
              validStories.push({
                ...story,
                completedCount: completedCount,
                maxAllowed: maxAllowed
              });
            }
          }
        });

        if (userValidPoints > 0) {
          totalValidPoints += userValidPoints;
          validCompletions.push({
            ...completion,
            totalAchievedPoints: userValidPoints,
            completedStories: validStories
          });
        }
      }
    });

    return { totalValidPoints, validCompletions };
  };

  // NUEVO: Calcular subtotales con validación
  const calculateSubtotals = () => {
    const planned = Array(8).fill(0);
    const completed = Array(8).fill(0);
    const plannedSubtotal = Array(8).fill(0);
    const completedSubtotal = Array(8).fill(0);

    // Calcular puntos planificados
    if (currentSprint?.plannedStories) {
      currentSprint.plannedStories.forEach(story => {
        const index = fibonacciPoints.indexOf(story.score);
        if (index !== -1) {
          planned[index] = story.quantity;
          plannedSubtotal[index] = story.score * story.quantity;
        }
      });
    }

    // Calcular puntos completados VÁLIDOS (solo los planificados)
    const { totalValidPoints, validCompletions } = getValidCompletedPoints();
    
    validCompletions.forEach(completion => {
      if (completion.completedStories) {
        completion.completedStories.forEach(story => {
          const index = fibonacciPoints.indexOf(story.score);
          if (index !== -1) {
            completed[index] += story.completedCount || 0;
            completedSubtotal[index] += story.score * (story.completedCount || 0);
          }
        });
      }
    });

    return { 
      planned, 
      completed, 
      plannedSubtotal, 
      completedSubtotal,
      totalValidPoints 
    };
  };

  // Fetch completions data
  const fetchCompletions = async (sprintId) => {
    try {
      setCompletionsLoading(true);
      console.log('🔄 [SPRINT-DETAIL] Iniciando carga de completions...');

      // USAR AXIOS CLIENT que ya maneja el token automáticamente
      const response = await axiosClient.get(`/completions/sprint/${sprintId}`);

      console.log('✅ [SPRINT-DETAIL] Datos recibidos:', response.data);
      console.log('👥 [SPRINT-DETAIL] Completions:', response.data.completions);

      setCompletions(response.data.completions || []);
    } catch (error) {
      console.error('❌ [SPRINT-DETAIL] Error:', error.response?.data || error.message);
      setCompletions([]);
    } finally {
      setCompletionsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSprintById(id).then(sprint => {
        if (sprint) {
          fetchCompletions(id);
        }
      });
    }
  }, [id, fetchSprintById]);

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const handleEdit = () => {
    navigate(`/edit-sprint/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSprint(id);
      setSnackbar({ open: true, message: 'Sprint eliminado exitosamente', severity: 'success' });
      setDeleteDialogOpen(false);
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar sprint', severity: 'error' });
    }
  };

  // Resto de funciones existentes...
  const calculateSprintStatus = (sprint) => {
    const today = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    let status;
    if (today < startDate) {
      status = "Planificado";
    } else if (today >= startDate && today <= endDate) {
      status = "Activo";
    } else {
      status = "Completado";
    }

    if (status === "Completado") {
      const plannedPoints = calculateTotalPlannedPoints(sprint);
      const completedPoints = getValidCompletedPoints().totalValidPoints;
      if (plannedPoints > 0 && completedPoints < plannedPoints) {
        return "Completado Parcial";
      }
    }

    return status;
  };

  const getSprintStatus = (sprint) => {
    return sprint.calculatedStatus || calculateSprintStatus(sprint);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getDaysElapsed = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (todayDay < startDay) return 0;
    if (todayDay > endDay) return calculateDuration(startDate, endDate);
    return Math.floor((todayDay - startDay) / (1000 * 60 * 60 * 24));
  };

  const getDaysRemaining = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (todayDay < startDay) return calculateDuration(startDate, endDate);
    if (todayDay > endDay) return 0;
    return Math.floor((endDay - todayDay) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getProgressPercentage = (sprint) => {
    const plannedPoints = calculateTotalPlannedPoints(sprint);
    const completedPoints = getValidCompletedPoints().totalValidPoints;
    if (plannedPoints === 0) return 0;
    return Math.min(100, Math.round((completedPoints / plannedPoints) * 100));
  };

  const getStatusColor = (status) => {
    const actualStatus = status.calculatedStatus || status;
    switch (actualStatus) {
      case "Activo":
        return "primary";
      case "Planificado":
        return "secondary";
      case "Completado":
        return "success";
      case "Completado Parcial":
        return "warning";
      default:
        return "default";
    }
  };

  const calculateVelocityMetrics = (sprint) => {
    const duration = calculateDuration(sprint.startDate, sprint.endDate);
    const daysElapsed = getDaysElapsed(sprint.startDate, sprint.endDate);
    const plannedPoints = calculateTotalPlannedPoints(sprint);
    const completedPoints = getValidCompletedPoints().totalValidPoints;

    const idealVelocity = duration > 0 ? (plannedPoints / duration).toFixed(1) : 0;
    const equivalentVelocity = daysElapsed > 0 ? (completedPoints / daysElapsed).toFixed(1) : 0;
    const interruptionDays = Math.max(0, daysElapsed - (completedPoints / (plannedPoints / duration)));

    const isOnTrack = equivalentVelocity >= idealVelocity;

    return {
      idealVelocity,
      equivalentVelocity,
      interruptionDays: Math.round(interruptionDays),
      isOnTrack
    };
  };

  const getRecentRecords = () => {
    const records = [];
    const { validCompletions } = getValidCompletedPoints();
    
    validCompletions.forEach(completion => {
      if (completion.completedStories) {
        completion.completedStories.forEach(story => {
          if (story.completedCount > 0) {
            records.push({
              developer: completion.userId?.name || 'Usuario',
              points: story.score * story.completedCount,
              story: `Completado: ${story.completedCount} de ${story.score}pts`,
              time: new Date(completion.updatedAt).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              date: completion.updatedAt
            });
          }
        });
      }
    });

    return records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const getDeveloperProgress = (sprint) => {
    if (!sprint.usersAssigned || !sprint.usersAssigned.length) return [];

    const { validCompletions } = getValidCompletedPoints();

    return sprint.usersAssigned.map((member) => {
      const user = member.userId || {};
      const userCompletion = validCompletions.find(c => c.userId?._id === user._id);
      const completedPoints = userCompletion?.totalAchievedPoints || 0;
      const totalSprintPoints = calculateTotalPlannedPoints(sprint);

      // Calcular porcentaje basado en el total del sprint
      const progressPercentage = totalSprintPoints > 0
        ? Math.min(100, (completedPoints / totalSprintPoints) * 100)
        : 0;

      return {
        id: user._id || member._id,
        name: user.name || `Usuario ${member._id}`,
        email: user.email || '',
        avatar: user.name ? user.name.charAt(0).toUpperCase() : 'U',
        completed: completedPoints,
        hours: member.hours || 0,
        role: user.role || 'Developer',
        completion: userCompletion,
        progressPercentage,
        totalSprintPoints
      };
    });
  };

  if (isLoading || !currentSprint) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: customTheme.background }}
      >
        <CircularProgress size={60} sx={{ color: customTheme.primary }} />
      </Box>
    );
  }

  const sprint = currentSprint;
  const sprintStatus = getSprintStatus(sprint);
  const duration = calculateDuration(sprint.startDate, sprint.endDate);
  const daysElapsed = getDaysElapsed(sprint.startDate, sprint.endDate);
  const daysRemaining = getDaysRemaining(sprint.startDate, sprint.endDate);

  // CORREGIDO: Usar las funciones corregidas para calcular puntos
  const plannedPoints = calculateTotalPlannedPoints(sprint);
  const { totalValidPoints: totalCompletedPoints } = getValidCompletedPoints();
  const totalPlannedStories = calculateTotalPlannedStories(sprint);
  const remainingPoints = Math.max(0, plannedPoints - totalCompletedPoints);

  const velocityMetrics = calculateVelocityMetrics(sprint);
  const recentRecords = getRecentRecords();
  const developerProgress = getDeveloperProgress(sprint);

  // Calcular subtotales para la nueva tabla
  const { planned, completed, plannedSubtotal, completedSubtotal } = calculateSubtotals();
  
  // Totales generales
  const totalPlannedCount = planned.reduce((sum, count) => sum + count, 0);
  const totalCompletedCount = completed.reduce((sum, count) => sum + count, 0);
  const totalPlannedSubtotal = plannedSubtotal.reduce((sum, points) => sum + points, 0);
  const totalCompletedSubtotal = completedSubtotal.reduce((sum, points) => sum + points, 0);

  const timeProgress = sprintStatus === "Completado" || sprintStatus === "Completado Parcial"
    ? 100
    : Math.min(100, (daysElapsed / duration) * 100);

  return (
    <Box sx={{
      minHeight: "100vh",
      backgroundColor: customTheme.background,
      width: "100vw",
      margin: 0,
      padding: 0,
      overflowX: 'hidden',
      color: customTheme.text,
    }}>
      {/* Container principal sin maxWidth para ocupar todo el ancho */}
      <Box sx={{
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}>
        {/* Header */}
        <Box
          sx={{
            background: customTheme.cardBg,
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: customTheme.primary,
                  color: customTheme.primary,
                  "&:hover": {
                    borderColor: customTheme.primaryDark,
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                  }
                }}
              >
                Volver al Dashboard
              </Button>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="h5" fontWeight="700" sx={{ color: customTheme.primary }}>
                  {sprint.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detalle completo del sprint - {totalCompletedPoints} pts completados de {plannedPoints} pts planificados
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={sprintStatus}
                color={getStatusColor(sprint)}
                sx={{
                  fontWeight: 700,
                  px: 2,
                  py: 2.5,
                  backgroundColor: statusColors[sprintStatus],
                  color: 'white'
                }}
              />
              <Button
                startIcon={<Edit />}
                variant="outlined"
                onClick={handleEdit}
                sx={{
                  textTransform: "none",
                  borderColor: customTheme.primary,
                  color: customTheme.primary,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: customTheme.primaryDark,
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                  }
                }}
              >
                Editar
              </Button>
              <Button
                startIcon={<Delete />}
                variant="outlined"
                onClick={handleDeleteClick}
                sx={{
                  textTransform: "none",
                  borderColor: "#f44336",
                  color: "#f44336",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#d32f2f",
                    backgroundColor: "rgba(244, 67, 54, 0.04)",
                  }
                }}
              >
                Eliminar
              </Button>
            </Box>
          </Box>
        </Box>

        {/* PRIMERA FILA: Tres tarjetas equilibradas */}
        <Box container sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          width: '100%',
          mb: 3
        }}>
          {/* 📊 Progreso del Sprint - Más compacto */}
          <Box sx={{
            flex: '1 1 calc(45% - 12px)',
            minWidth: { xs: '100%', md: 'calc(40% - 12px)' }
          }}>
            <Card
              elevation={0}
              sx={{
                background: customTheme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: customTheme.textPrimary }}>
                  Progreso del Sprint
                </Typography>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Progreso Temporal
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {daysElapsed} / {duration} días
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={timeProgress}
                    sx={{
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark' ? '#333' : "#E8F5E9",
                      "& .MuiLinearProgress-bar": {
                        background: customTheme.gradient,
                      },
                    }}
                  />
                </Box>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Puntos Completados
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {totalCompletedPoints} / {plannedPoints} pts
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (totalCompletedPoints / plannedPoints) * 100)}
                    sx={{
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark' ? '#333' : "#E8F5E9",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: totalCompletedPoints >= plannedPoints ? customTheme.primary : '#FF9800',
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1.5} sx={{
                      background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#F1F8E9",
                      borderRadius: 2,
                    }}>
                      <Typography variant="h5" fontWeight="700" sx={{ color: customTheme.primary }}>
                        {duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Totales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1.5} sx={{
                      background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#E8F5E9",
                      borderRadius: 2,
                    }}>
                      <Typography variant="h5" fontWeight="700" sx={{ color: "#26A69A" }}>
                        {daysElapsed}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Transcurridos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1.5} sx={{
                      background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#FFF9C4",
                      borderRadius: 2,
                    }}>
                      <Typography variant="h5" fontWeight="700" sx={{ color: "#F57F17" }}>
                        {daysRemaining}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Restantes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1.5} sx={{
                      background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#E3F2FD",
                      borderRadius: 2,
                    }}>
                      <Typography variant="h5" fontWeight="700" sx={{ color: "#42A5F5" }}>
                        {plannedPoints}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Puntos Totales
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* 🚀 Velocidad del Sprint */}
          <Box sx={{
            flex: '1 1 calc(25% - 12px)',
            minWidth: { xs: '100%', md: 'calc(25% - 12px)' }
          }}>
            <Card
              elevation={0}
              sx={{
                background: customTheme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: customTheme.textPrimary }}>
                  Velocidad del Sprint
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                  <Avatar sx={{ bgcolor: "#4CAF50", width: 36, height: 36 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Velocidad Ideal
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {velocityMetrics.idealVelocity} pts/día
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                  <Avatar sx={{ bgcolor: "#2196F3", width: 36, height: 36 }}>
                    <Speed />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Velocidad Equivalente
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {velocityMetrics.equivalentVelocity} pts/día
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: "#FF9800", width: 36, height: 36 }}>
                    <Warning />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Días con Interrupciones
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {velocityMetrics.interruptionDays} días
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: velocityMetrics.isOnTrack
                      ? theme.palette.mode === 'dark' ? '#1B5E20' : "#E8F5E9"
                      : theme.palette.mode === 'dark' ? '#E65100' : "#FFF3E0",
                    border: `1px solid ${velocityMetrics.isOnTrack ? '#4CAF50' : '#FF9800'}`
                  }}
                >
                  <Typography variant="body2" fontWeight="600" sx={{
                    color: velocityMetrics.isOnTrack
                      ? theme.palette.mode === 'dark' ? '#81C784' : "#2E7D32"
                      : theme.palette.mode === 'dark' ? '#FFB74D' : "#F57F17"
                  }}>
                    {velocityMetrics.isOnTrack
                      ? "✅ En camino de completar a tiempo"
                      : "⚠️ Necesita acelerar el ritmo"
                    }
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* ℹ️ Información General */}
          <Box sx={{
            flex: '1 1 calc(25% - 12px)',
            minWidth: { xs: '100%', md: 'calc(25% - 12px)' }
          }}>
            <Card
              elevation={0}
              sx={{
                background: customTheme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: customTheme.textPrimary }}>
                  Información General
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                  <Avatar sx={{ bgcolor: customTheme.primary, width: 36, height: 36 }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formatDate(sprint.startDate)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                  <Avatar sx={{ bgcolor: "#f44336", width: 36, height: 36 }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Fin
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formatDate(sprint.endDate)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: customTheme.primary, width: 36, height: 36 }}>
                    <Assessment />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Estado del Sprint
                    </Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ color: statusColors[sprintStatus] }}>
                      {sprintStatus}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "#7B1FA2", width: 36, height: 36 }}>
                    <Group />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Miembros del Equipo
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {sprint.usersAssigned?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* SEGUNDA FILA: Tabla de Puntos Completados como en la imagen */}
        <Box container sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                background: customTheme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: customTheme.textPrimary }}>
                  Puntos Completados
                </Typography>

                <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Puntuación</TableCell>
                        {fibonacciPoints.map(point => (
                          <TableCell key={point} align="center" sx={{ fontWeight: 700 }}>
                            {point}
                          </TableCell>
                        ))}
                        <TableCell align="center" sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f5f5f5' }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Fila Planificado */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Planificado</TableCell>
                        {planned.map((count, index) => (
                          <TableCell key={index} align="center">
                            <Chip
                              label={count}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontWeight: 600,
                                borderColor: theme.palette.mode === 'dark' ? '#555' : '#ddd'
                              }}
                            />
                          </TableCell>
                        ))}
                        <TableCell align="center" sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f5f5f5' }}>
                          <Chip
                            label={totalPlannedCount}
                            size="small"
                            sx={{
                              backgroundColor: customTheme.primaryLight,
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Fila Completado */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Completado</TableCell>
                        {completed.map((count, index) => (
                          <TableCell key={index} align="center">
                            <Chip
                              label={count}
                              size="small"
                              sx={{
                                backgroundColor: count > 0 ? customTheme.primaryLight :
                                  theme.palette.mode === 'dark' ? '#333' : "#f5f5f5",
                                color: count > 0 ? "white" : "text.secondary",
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                        ))}
                        <TableCell align="center" sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f5f5f5' }}>
                          <Chip
                            label={totalCompletedCount}
                            size="small"
                            sx={{
                              backgroundColor: totalCompletedCount > 0 ? customTheme.primary :
                                theme.palette.mode === 'dark' ? '#333' : "#f5f5f5",
                              color: totalCompletedCount > 0 ? "white" : "text.secondary",
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {/* NUEVA FILA: Subtotal Completado */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontStyle: 'italic' }}>Subtotal</TableCell>
                        {completedSubtotal.map((points, index) => (
                          <TableCell key={index} align="center">
                            <Typography variant="body2" fontWeight="600" sx={{ 
                              color: points > 0 ? '#2E7D32' : 'text.secondary' 
                            }}>
                              {points > 0 ? `${points} pts` : '-'}
                            </Typography>
                          </TableCell>
                        ))}
                        <TableCell align="center" sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f5f5f5' }}>
                          <Chip
                            label={`${totalCompletedSubtotal} pts`}
                            size="small"
                            sx={{
                              backgroundColor: '#2E7D32',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Fila de puntos pendientes */}
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Box
                    sx={{
                      p: 2,
                      background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#FFF3E0",
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#FFE0B2'}`,
                      minWidth: '200px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" fontWeight="600" color="text.secondary" gutterBottom>
                      Puntos Pendientes
                    </Typography>
                    <Typography variant="h5" fontWeight="800" sx={{ color: "#F57F17" }}>
                      {remainingPoints} pts
                    </Typography>
                  </Box>
                </Box>

                {/* Registros Recientes */}
                <Box mt={1}>
                  <Typography variant="h6" fontWeight="700" mb={2} sx={{ color: customTheme.textPrimary }}>
                    Registros Recientes
                  </Typography>
                  {recentRecords.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {recentRecords.map((record, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          p={1.5}
                          sx={{
                            background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#F8F9FA",
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e9ecef'}`
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{
                              width: 32,
                              height: 32,
                              bgcolor: customTheme.primary,
                              fontSize: '0.8rem'
                            }}>
                              {record.developer?.split(' ').map(n => n[0]).join('') || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {record.developer}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.story}
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Chip
                              label={`${record.points} pts`}
                              size="small"
                              sx={{
                                backgroundColor: customTheme.primary,
                                color: "white",
                                fontWeight: 600
                              }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                              {record.time}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#F8F9FA",
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e9ecef'}`
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {completionsLoading ? "Cargando registros..." : "No hay registros recientes. Los puntos completados por los desarrolladores aparecerán aquí."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Box>

        {/* TERCERA FILA: Progreso de Miembros y Observaciones */}
        <Box container sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          width: '100%',
          mb: 4
        }}>
          {/* 👥 Progreso de Miembros */}
          <Box sx={{
            flex: '1 1 calc(40%  - 12px)',
            minWidth: { xs: '100%', lg: 'calc(40% - 12px)' }
          }}>
            <Card
              elevation={0}
              sx={{
                background: customTheme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: customTheme.textPrimary }}>
                  Progreso de Miembros
                </Typography>

                {developerProgress.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {developerProgress.map((dev) => (
                      <Box
                        key={dev.id}
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                          borderRadius: 2,
                          background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#F8F9FA",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: customTheme.primary }}>
                            {dev.avatar}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body1" fontWeight="600">
                              {dev.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dev.role} • {dev.hours} horas asignadas
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="h6" fontWeight="700" sx={{ color: customTheme.primary }}>
                              {dev.completed} pts
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Completado
                            </Typography>
                          </Box>
                        </Box>

                        <Box mb={1}>
                          <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              Progreso
                            </Typography>
                            <Typography variant="caption" fontWeight="600">
                              {Math.round(dev.progressPercentage)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={dev.progressPercentage}
                            sx={{
                              height: 8,
                              borderRadius: 1,
                              backgroundColor: theme.palette.mode === 'dark' ? '#333' : "#E0E0E0",
                              "& .MuiLinearProgress-bar": {
                                background: customTheme.gradient,
                              },
                            }}
                          />
                        </Box>

                        {dev.completion?.notes && (
                          <Box mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Notas:</strong> {dev.completion.notes}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      background: theme.palette.mode === 'dark' ? '#1e1e1e' : "#F8F9FA",
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e9ecef'}`
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No hay miembros asignados a este sprint.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* 📋 Observaciones */}
          <Box sx={{
            flex: '1 1 calc(60% - 12px)',
            minWidth: { xs: '100%', lg: 'calc(60% - 12px)' }
          }}>
            <Card
              elevation={0}
              sx={{
                background: customTheme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight="700" mb={2} sx={{ color: customTheme.textPrimary }}>
                  Observaciones
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: '200px',
                    p: 2,
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    borderRadius: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : "#F8F9FA",
                    overflow: 'auto'
                  }}
                >
                  {sprint.observations ? (
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {sprint.observations}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      No hay observaciones registradas para este sprint.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: customTheme.cardBg,
          }
        }}
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el sprint "{sprint.name}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}