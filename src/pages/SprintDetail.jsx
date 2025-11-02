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
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Group,
  Assessment,
  Edit,
  Delete,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useSprintStore from "../store/SprintStore";
import useAuthStore from "../store/authStore";

export default function SprintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentSprint, 
    isLoading, 
    error, 
    fetchSprintById, 
    deleteSprint,
    clearError 
  } = useSprintStore();
  const { user } = useAuthStore();
  
  const [deleteDialog, setDeleteDialog] = useState({ open: false, sprint: null });
  const [isAdmin, setIsAdmin] = useState(false);

  // Tema verde profesional
  const theme = {
    primary: "#4CAF50",
    primaryDark: "#45A049",
    primaryLight: "#81C784",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    cardBg: "rgba(255, 255, 255, 0.95)",
  };

  useEffect(() => {
    console.log("📥 SprintDetail - ID recibido:", id);
    console.log("👤 Usuario:", user);
    
    // Verificar si el usuario es admin
    setIsAdmin(user?.role === 'admin' || user?.isAdmin);
    
    if (id) {
      console.log("🔄 Cargando sprint con ID:", id);
      fetchSprintById(id);
    }
    
    return () => {
      clearError();
    };
  }, [id, user, fetchSprintById, clearError]);

  // Debug
  console.log("📊 SprintDetail - Estado actual:");
  console.log("   - currentSprint:", currentSprint);
  console.log("   - isLoading:", isLoading);
  console.log("   - error:", error);
  console.log("   - isAdmin:", isAdmin);

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const handleEditSprint = () => {
    navigate(`/create-edit-sprint/${id}`);
  };

  const handleDeleteSprint = async () => {
    try {
      await deleteSprint(id);
      setDeleteDialog({ open: false, sprint: null });
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

  const openDeleteDialog = () => {
    setDeleteDialog({ open: true, sprint: currentSprint });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, sprint: null });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const getDaysElapsed = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const today = new Date();
    const diff = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status === 'planned' ? 'Planificado' : 
                            status === 'active' ? 'Activo' :
                            status === 'completed' ? 'Completado' : status;
    
    switch (normalizedStatus) {
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

  // ✅ FUNCIÓN PARA CORREGIR ESTADOS (igual que en AdminDashboard)
  const getCorrectedStatus = (sprint) => {
    if (!sprint) return "Planificado";
    
    const today = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    
    // Normalizar status
    const normalizedStatus = sprint.status === 'planned' ? 'Planificado' : 
                            sprint.status === 'active' ? 'Activo' :
                            sprint.status === 'completed' ? 'Completado' : sprint.status;
    
    if (normalizedStatus === 'Activo' || normalizedStatus === 'Completado') {
      return normalizedStatus;
    }
    
    if (today >= startDate && today <= endDate) {
      return 'Activo';
    } else if (today > endDate) {
      return 'Completado';
    } else {
      return 'Planificado';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} sx={{ color: "#4CAF50" }} />
      </Box>
    );
  }

  if (!currentSprint && !isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", background: theme.background, py: 4 }}>
        <Box sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
          <Alert severity="error">
            No se pudo cargar el sprint solicitado.
          </Alert>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Volver al Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  if (!currentSprint) {
    return null;
  }

  const duration = calculateDuration(currentSprint.startDate, currentSprint.endDate);
  const daysElapsed = getDaysElapsed(currentSprint.startDate);
  const daysRemaining = getDaysRemaining(currentSprint.endDate);
  const progress = getCorrectedStatus(currentSprint) === "Activo" ? 
    (daysElapsed / duration) * 100 : 
    getCorrectedStatus(currentSprint) === "Completado" ? 100 : 0;

  const correctedStatus = getCorrectedStatus(currentSprint);

  return (
    <Box sx={{ minHeight: "100vh", background: theme.background, py: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
        {/* Header */}
        <Box
          sx={{
            background: theme.cardBg,
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
                variant="outlined"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Volver al Dashboard
              </Button>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="h4" fontWeight="800" sx={{ color: "#4CAF50" }}>
                  {currentSprint.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detalle completo del sprint
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={correctedStatus}
                color={getStatusColor(currentSprint.status)}
                sx={{ fontWeight: 700, px: 2, py: 2.5, fontSize: "0.875rem" }}
              />
              
              {/* Solo mostrar botones de edición/eliminación para admins */}
              {isAdmin && (
                <>
                  <Tooltip title="Editar Sprint">
                    <Button
                      startIcon={<Edit />}
                      variant="contained"
                      onClick={handleEditSprint}
                      sx={{
                        textTransform: "none",
                        background: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #45A049 0%, #66BB6A 100%)",
                        }
                      }}
                    >
                      Editar
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar Sprint">
                    <Button
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      onClick={openDeleteDialog}
                      sx={{ textTransform: "none" }}
                    >
                      Eliminar
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}
        </Box>

        {/* Información Principal */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            {/* Progreso del Sprint */}
            <Card
              elevation={0}
              sx={{
                background: theme.cardBg,
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: "#4CAF50" }}>
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
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #4CAF50 0%, #81C784 100%)",
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
                      0 / {currentSprint.plannedTotalPoints} puntos
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={0}
                    sx={{
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
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
                    <Box textAlign="center" p={2} sx={{ background: "#E8F5E9", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: "#4CAF50" }}>
                        {duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Totales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#E8F5E9", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: "#4CAF50" }}>
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
                      <Typography variant="h4" fontWeight="700" sx={{ color: "#1976D2" }}>
                        {currentSprint.plannedTotalPoints}
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
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: "#4CAF50" }}>
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
                      {currentSprint.plannedStories?.map((story, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip 
                              label={`${story.score} pts`} 
                              sx={{ 
                                backgroundColor: "#4CAF50",
                                color: 'white',
                                fontWeight: 600
                              }} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6" fontWeight="600">
                              {story.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" fontWeight="700" sx={{ color: "#4CAF50" }}>
                              {(story.score * story.quantity).toFixed(1)} pts
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#E8F5E9" }}>
                        <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                          TOTAL
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h5" fontWeight="800" sx={{ color: "#4CAF50" }}>
                            {currentSprint.plannedTotalPoints} pts
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
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: "#4CAF50" }}>
                  ℹ️ Información General
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: "#4CAF50" }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {formatDate(currentSprint.startDate)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: "#F44336" }}>
                    <CalendarToday />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Fin
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {formatDate(currentSprint.endDate)}
                    </Typography>
                  </Box>
                </Box>

                {currentSprint.description && (
                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: "#2196F3" }}>
                      <Assessment />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Descripción
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {currentSprint.description}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "#4CAF50" }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Estado del Sprint
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {correctedStatus}
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
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ color: "#4CAF50" }}>
                  👥 Equipo Asignado
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  {currentSprint.usersAssigned?.map((member, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={2}
                      sx={{ background: "#F5F5F5", borderRadius: 2 }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: "#4CAF50", fontSize: '0.875rem' }}>
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            Miembro {index + 1}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {member.userId?.slice(0, 8)}...
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={`${member.hours}h`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: "#4CAF50",
                          color: 'white',
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
                  <Typography variant="h5" fontWeight="700" sx={{ color: "#4CAF50" }}>
                    {currentSprint.usersAssigned?.reduce((sum, m) => sum + m.hours, 0) || 0}h
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Observaciones */}
            {currentSprint.observations && (
              <Card
                elevation={0}
                sx={{
                  background: theme.cardBg,
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="700" mb={2} sx={{ color: "#4CAF50" }}>
                    📋 Observaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentSprint.observations}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Dialog de Confirmación para Eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#f44336', fontWeight: 600 }}>
          🚨 Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el sprint "{deleteDialog.sprint?.name}"? 
            Esta acción no se puede deshacer y se perderán todos los datos asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteSprint} 
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Sí, Eliminar Sprint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}