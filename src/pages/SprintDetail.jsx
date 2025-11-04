import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
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

export default function SprintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSprint, isLoading, fetchSprintById, deleteSprint } = useSprintStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [completions, setCompletions] = useState([]);
  const [completionsLoading, setCompletionsLoading] = useState(true);

  // Tema verde menta profesional
  const theme = {
    primary: "#4CAF50",
    primaryDark: "#45A049",
    primaryLight: "#81C784",
    background: "#e6f2ed",
    cardBg: "#ffffff",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
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

  // Fetch completions data
  const fetchCompletions = async (sprintId) => {
    try {
      setCompletionsLoading(true);
      const response = await fetch(`/api/completions/sprint/${sprintId}`);
      if (response.ok) {
        const data = await response.json();
        setCompletions(data.completions || []);
      } else {
        setCompletions([]);
      }
    } catch (error) {
      console.error("Error fetching completions:", error);
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

  // Función para calcular estado automático
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

    // Si está completado, verificar si alcanzó los puntos planificados
    if (status === "Completado") {
      const plannedPoints = sprint.plannedTotalPoints || 0;
      const completedPoints = completions.reduce((sum, c) => sum + (c.totalAchievedPoints || 0), 0);

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
    // total de días incluyendo inicio y fin
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Días que han pasado desde el inicio (solo días completos)
  const getDaysElapsed = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Normalizar a medianoche
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (todayDay < startDay) return 0; // antes de empezar
    if (todayDay > endDay) return calculateDuration(startDate, endDate); // sprint terminado

    // días completos que han pasado, hoy no cuenta
    return Math.floor((todayDay - startDay) / (1000 * 60 * 60 * 24));
  };

  // Días restantes incluyendo hoy
  const getDaysRemaining = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Normalizar a medianoche
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (todayDay < startDay) return calculateDuration(startDate, endDate); // sprint no empezado
    if (todayDay > endDay) return 0; // sprint terminado

    return Math.floor((endDay - todayDay) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getProgressPercentage = (sprint) => {
    const plannedPoints = sprint.plannedTotalPoints || 0;
    const completedPoints = completions.reduce((sum, c) => sum + (c.totalAchievedPoints || 0), 0);
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

  // Cálculos para la sección de Velocidad
  const calculateVelocityMetrics = (sprint) => {
    const duration = calculateDuration(sprint.startDate, sprint.endDate);
    const daysElapsed = getDaysElapsed(sprint.startDate, sprint.endDate);
    const plannedPoints = sprint.plannedTotalPoints || 0;
    const completedPoints = completions.reduce((sum, c) => sum + (c.totalAchievedPoints || 0), 0);

    // Velocidad ideal (puntos por día según planificación)
    const idealVelocity = duration > 0 ? (plannedPoints / duration).toFixed(1) : 0;

    // Velocidad equivalente (puntos por día realmente completados)
    const equivalentVelocity = daysElapsed > 0 ? (completedPoints / daysElapsed).toFixed(1) : 0;

    // Días con interrupciones (días sin progreso)
    const interruptionDays = Math.max(0, daysElapsed - (completedPoints / (plannedPoints / duration)));

    return {
      idealVelocity,
      equivalentVelocity,
      interruptionDays: Math.round(interruptionDays)
    };
  };

  // Calcular puntos completados por tamaño basado en los datos reales
  const getCompletedPointsBySize = (sprint) => {
    const planned = Array(8).fill(0);
    const completed = Array(8).fill(0);

    // Calcular puntos planificados
    if (sprint.plannedStories) {
      sprint.plannedStories.forEach(story => {
        const index = fibonacciPoints.indexOf(story.score);
        if (index !== -1) {
          planned[index] = story.quantity;
        }
      });
    }

    // Calcular puntos completados basado en los completions
    completions.forEach(completion => {
      if (completion.completedStories) {
        completion.completedStories.forEach(story => {
          const index = fibonacciPoints.indexOf(story.score);
          if (index !== -1) {
            completed[index] += story.completedCount || 0;
          }
        });
      }
    });

    return { planned, completed };
  };

  // Obtener registros recientes de puntos desde los completions
  const getRecentRecords = () => {
    const records = [];

    completions.forEach(completion => {
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

    // Ordenar por fecha más reciente y limitar a 5 registros
    return records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  // Calcular progreso individual de desarrolladores
  const getDeveloperProgress = (sprint) => {
    if (!sprint.usersAssigned || !sprint.usersAssigned.length) return [];

    return sprint.usersAssigned.map((member) => {
      const user = member.userId || {};
      const userCompletion = completions.find(c => c.userId?._id === user._id);
      const completedPoints = userCompletion?.totalAchievedPoints || 0;

      return {
        id: user._id || member._id,
        name: user.name || `Usuario ${member._id}`,
        email: user.email || '',
        avatar: user.name ? user.name.charAt(0).toUpperCase() : 'U',
        completed: completedPoints,
        hours: member.hours || 0, // Horas reales del sprint
        role: user.role || 'Developer',
        completion: userCompletion
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
        sx={{ backgroundColor: theme.background }}
      >
        <CircularProgress size={60} sx={{ color: theme.primary }} />
      </Box>
    );
  }

  const sprint = currentSprint;
  const sprintStatus = getSprintStatus(sprint);
  const duration = calculateDuration(sprint.startDate, sprint.endDate);
  const daysElapsed = getDaysElapsed(sprint.startDate);
  const daysRemaining = getDaysRemaining(sprint.startDate, sprint.endDate);
  const pointsProgress = getProgressPercentage(sprint);
  const velocityMetrics = calculateVelocityMetrics(sprint);
  const pointsData = getCompletedPointsBySize(sprint);
  const recentRecords = getRecentRecords();
  const developerProgress = getDeveloperProgress(sprint);
  const totalCompletedPoints = completions.reduce((sum, c) => sum + (c.totalAchievedPoints || 0), 0);

  // Calcular progreso temporal CORREGIDO
  const timeProgress = sprintStatus === "Completado" || sprintStatus === "Completado Parcial"
    ? 100
    : Math.min(100, (daysElapsed / duration) * 100);

  return (
    <Box sx={{
      minHeight: "100vh",
      backgroundColor: theme.background,
      width: "100vw",
      margin: 0,
      padding: 0,
      overflowX: 'hidden'
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
            background: theme.cardBg,
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            border: `1px solid #e0e0e0`,
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
                  borderColor: theme.primary,
                  color: theme.primary,
                  "&:hover": {
                    borderColor: theme.primaryDark,
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                  }
                }}
              >
                Volver al Dashboard
              </Button>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: theme.primary }}>
                  {sprint.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detalle completo del sprint - {totalCompletedPoints} pts completados
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
                  borderColor: theme.primary,
                  color: theme.primary,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: theme.primaryDark,
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

        {/* PRIMERA FILA: Tres tarjetas en la misma línea */}
        <Grid container spacing={3} mb={3}>
          {/* 📊 Progreso del Sprint */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  📊 Progreso del Sprint
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
                      backgroundColor: "#E8F5E9",
                      "& .MuiLinearProgress-bar": {
                        background: theme.gradient,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    {timeProgress.toFixed(1)}% del tiempo transcurrido
                  </Typography>
                </Box>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Puntos Completados
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {totalCompletedPoints} / {sprint.plannedTotalPoints} puntos
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pointsProgress}
                    sx={{
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: "#E8F5E9",
                      "& .MuiLinearProgress-bar": {
                        background: theme.gradient,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    {pointsProgress}% completado
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Cuadros de métricas */}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#F1F8E9", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: theme.primary }}>
                        {duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Totales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#E8F5E9", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: "#26A69A" }}>
                        {daysElapsed}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Transcurridos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#FFF9C4", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: "#F57F17" }}>
                        {daysRemaining}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Restantes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#E3F2FD", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: "#42A5F5" }}>
                        {sprint.plannedTotalPoints}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Puntos Totales
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* 🚀 Velocidad del Sprint */}
          <Grid item xs={12} md={3}>
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  🚀 Velocidad del Sprint
                </Typography>

                {/* Velocidad Ideal */}
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: "#4CAF50", width: 40, height: 40 }}>
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

                {/* Velocidad Equivalente */}
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: "#2196F3", width: 40, height: 40 }}>
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

                {/* Días con Interrupciones */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: "#FF9800", width: 40, height: 40 }}>
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

                {/* Indicador de Rendimiento */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: velocityMetrics.equivalentVelocity >= velocityMetrics.idealVelocity
                      ? "#E8F5E9"
                      : "#FFF3E0"
                  }}
                >
                  <Typography variant="body2" fontWeight="600" sx={{
                    color: velocityMetrics.equivalentVelocity >= velocityMetrics.idealVelocity
                      ? "#2E7D32"
                      : "#F57F17"
                  }}>
                    {velocityMetrics.equivalentVelocity >= velocityMetrics.idealVelocity
                      ? "✅ En camino de completar a tiempo"
                      : "⚠️ Necesita acelerar el ritmo"
                    }
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ℹ️ Información General */}
          <Grid item xs={12} md={3}>
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  ℹ️ Información General
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: theme.primary, width: 40, height: 40 }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {formatDate(sprint.startDate)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: "#f44336", width: 40, height: 40 }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Fin
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {formatDate(sprint.endDate)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: theme.primary, width: 40, height: 40 }}>
                    <Assessment />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Estado del Sprint
                    </Typography>
                    <Typography variant="body1" fontWeight="600" sx={{ color: statusColors[sprintStatus] }}>
                      {sprintStatus}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "#7B1FA2", width: 40, height: 40 }}>
                    <Group />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Miembros del Equipo
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {sprint.usersAssigned?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SEGUNDA FILA: Historias Planificadas y Puntos Completados */}
        <Grid container spacing={3} mb={3}>
          {/* 📝 Historias Planificadas */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  📝 Historias Planificadas
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Puntuación</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Cantidad
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Subtotal
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sprint.plannedStories?.map((story, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip
                              label={`${story.score} pts`}
                              size="small"
                              sx={{
                                backgroundColor: "#E8F5E9",
                                color: theme.primary,
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6" fontWeight="600">
                              {story.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" fontWeight="700" sx={{ color: theme.primary }}>
                              {(story.score * story.quantity).toFixed(1)} pts
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#F1F8E9" }}>
                        <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                          TOTAL
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h5" fontWeight="800" sx={{ color: theme.primary }}>
                            {sprint.plannedTotalPoints} pts
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 📈 Puntos Completados */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  📈 Puntos Completados
                </Typography>

                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Puntuación</TableCell>
                        {fibonacciPoints.map(point => (
                          <TableCell key={point} align="center" sx={{ fontWeight: 700 }}>
                            {point}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Planificado</TableCell>
                        {pointsData.planned.map((count, index) => (
                          <TableCell key={index} align="center">
                            <Chip
                              label={count}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Completado</TableCell>
                        {pointsData.completed.map((count, index) => (
                          <TableCell key={index} align="center">
                            <Chip
                              label={count}
                              size="small"
                              sx={{
                                backgroundColor: count > 0 ? theme.primaryLight : "#f5f5f5",
                                color: count > 0 ? "white" : "text.secondary",
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box mt={3}>
                  <Typography variant="h6" fontWeight="700" mb={2} sx={{ color: theme.primary }}>
                    📋 Registros Recientes
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
                            background: "#F8F9FA",
                            borderRadius: 1,
                            border: "1px solid #e9ecef"
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.primary, fontSize: '0.8rem' }}>
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
                                backgroundColor: theme.primary,
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
                        background: "#F8F9FA",
                        borderRadius: 1,
                        border: "1px solid #e9ecef"
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
        </Grid>

        {/* TERCERA FILA: Progreso de Miembros y Observaciones */}
        <Grid container spacing={3}>
          {/* 👥 Progreso de Miembros */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  👥 Progreso de Miembros
                </Typography>

                {developerProgress.length > 0 ? (
                  <Grid container spacing={2}>
                    {developerProgress.map((dev) => (
                      <Grid item xs={12} sm={6} key={dev.id}>
                        <Box
                          sx={{
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            background: "#F8F9FA",
                            height: '100%'
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: theme.primary }}>
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
                          </Box>

                          {/* Barra de progreso opcional - solo si quieres mostrar progreso vs algún objetivo */}
                          <LinearProgress
                            variant="determinate"
                            value={dev.completed > 0 ? Math.min(100, (dev.completed / (dev.hours || 1)) * 10) : 0}
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              backgroundColor: "#E0E0E0",
                              "& .MuiLinearProgress-bar": {
                                background: theme.gradient,
                              },
                            }}
                          />

                          <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              Puntos completados
                            </Typography>
                            <Typography variant="caption" fontWeight="600" sx={{ color: theme.primary }}>
                              {dev.completed} pts
                            </Typography>
                          </Box>

                          {/* Solo mostrar chip de completado */}
                          <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                            <Chip
                              label={`Completado: ${dev.completed}pts`}
                              size="small"
                              variant="outlined"
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
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      background: "#F8F9FA",
                      borderRadius: 2,
                      border: "1px solid #e9ecef"
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No hay miembros asignados a este sprint.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 📋 Observaciones */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid #e0e0e0`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight="700" mb={2} sx={{ color: theme.primary }}>
                  📋 Observaciones
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: '200px',
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    backgroundColor: "#F8F9FA",
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
          </Grid>
        </Grid>
      </Box>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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