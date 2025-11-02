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
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Group,
  Assessment,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useSprintStore from "../store/SprintStore";

export default function SprintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSprint, isLoading, fetchSprintById, deleteSprint } = useSprintStore();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Tema verde menta profesional (IGUAL que AdminDashboard)
  const theme = {
    primary: "#4CAF50",
    primaryDark: "#45A049",
    primaryLight: "#81C784",
    background: "#e6f2ed",
    cardBg: "#ffffff",
    sprintCardBg: "#e6f2ed",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
  };

  useEffect(() => {
    if (id) {
      fetchSprintById(id);
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
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const getDaysElapsed = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diff = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Activo":
        return "success";
      case "Planificado":
        return "info";
      case "Completado":
        return "default";
      default:
        return "default";
    }
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
  const duration = calculateDuration(sprint.startDate, sprint.endDate);
  const daysElapsed = getDaysElapsed(sprint.startDate);
  const daysRemaining = getDaysRemaining(sprint.endDate);
  const progress = sprint.status === "Activo" ? (daysElapsed / duration) * 100 : sprint.status === "Completado" ? 100 : 0;

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      backgroundColor: theme.background,
      width: "100%",
      margin: 0,
      padding: 0,
    }}>
      <Box sx={{ 
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}>
        {/* Header */}
        <Box
          sx={{
            background: theme.cardBg,
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
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
                  Detalle completo del sprint
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={sprint.status}
                color={getStatusColor(sprint.status)}
                sx={{ fontWeight: 700, px: 2, py: 2.5 }}
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

        {/* Información Principal */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            {/* Progreso del Sprint */}
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
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
                    value={progress}
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
                    {progress.toFixed(1)}% del tiempo transcurrido
                  </Typography>
                </Box>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Puntos Completados
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      0 / {sprint.plannedTotalPoints} puntos
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={0}
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
                    0% completado
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

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

            {/* Historias Planificadas */}
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
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

          <Grid item xs={12} md={4}>
            {/* Información del Sprint */}
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  ℹ️ Información General
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: theme.primary }}>
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
                  <Avatar sx={{ bgcolor: "#f44336" }}>
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

                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: theme.primary }}>
                    <Assessment />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Estado del Sprint
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {sprint.status}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Equipo Asignado */}
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: theme.primary }}>
                  👥 Equipo Asignado
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  {sprint.usersAssigned?.map((member, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={2}
                      sx={{ background: "#F1F8E9", borderRadius: 2 }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: theme.primary }}>
                          {member.userId?.name?.charAt(0).toUpperCase() || index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {member.userId?.name || `Miembro ${index + 1}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.userId?.email || 'Sin email'}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={`${member.hours}h`} 
                        size="small" 
                        sx={{
                          backgroundColor: theme.primary,
                          color: "white",
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight="600">
                    Total de Horas
                  </Typography>
                  <Typography variant="h5" fontWeight="700" sx={{ color: theme.primary }}>
                    {sprint.usersAssigned?.reduce((sum, m) => sum + m.hours, 0) || 0}h
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Observaciones */}
            {sprint.observations && (
              <Card
                elevation={0}
                sx={{
                  background: theme.cardBg,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="700" mb={2} sx={{ color: theme.primary }}>
                    📋 Observaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sprint.observations}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: theme.primary, fontWeight: 700 }}>
          ¿Eliminar Sprint?
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el sprint "{sprint.name}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: theme.primary }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            sx={{ 
              bgcolor: "#f44336",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
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