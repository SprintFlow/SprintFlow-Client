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
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  TrendingUp,
  CheckCircle,
  Schedule,
  Group,
  CalendarToday,
  Assessment,
  Search,
  FilterList,
  Visibility,
  Edit,
  Delete,
  Sort,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useSprintStore from "../store/SprintStore";
import useAuthStore from "../store/authStore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { sprints, isLoading, error, fetchSprints, deleteSprint } = useSprintStore();
  const { user } = useAuthStore();

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, sprint: null });

  // Colores del tema verde profesional
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
    Activo: "#1976D2", // Azul cuando está activo
    Planificado: "#d13e8fff", // Lila si está planificado
    Completado: "#2E7D32", // Verde si se ha cumplido o superado
    "Completado Parcial": "#FF9800", // Naranja si no ha cumplido con los puntos planificados
  };

  const statusBackgrounds = {
    Activo: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
    Planificado: "linear-gradient(135deg, #F3E5F5 0%, #e7bedeff 100%)",
    Completado: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
    "Completado Parcial": "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
  };

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const handleCreateSprint = () => {
    navigate("/create-sprint");
  };

  const handleViewSprint = (sprintId) => {
    if (!sprintId) return;
    navigate(`/sprint-detail/${sprintId}`);
  };

  const handleEditSprint = (sprintId) => {
    navigate(`/edit-sprint/${sprintId}`);
  };

  const handleDeleteSprint = async (sprintId) => {
    try {
      await deleteSprint(sprintId);
      setDeleteDialog({ open: false, sprint: null });
      fetchSprints();
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

  const openDeleteDialog = (sprint) => {
    setDeleteDialog({ open: true, sprint });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, sprint: null });
  };

  // Función para calcular estado automático basado en fechas
  const calculateSprintStatus = (sprint) => {
    const today = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    
    // Calcular estado basado en fechas
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
      const completedPoints = sprint.completedPoints || 0;
      
      if (plannedPoints > 0 && completedPoints < plannedPoints) {
        return "Completado Parcial";
      }
    }
    
    return status;
  };

  // Determinar el estado real del sprint (usa calculatedStatus si existe, sino calcula)
  const getSprintStatus = (sprint) => {
    return sprint.calculatedStatus || calculateSprintStatus(sprint);
  };

  // Filtrar y ordenar sprints
  const filteredAndSortedSprints = sprints
    .filter(sprint => {
      const matchesSearch = sprint.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sprint.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const sprintStatus = getSprintStatus(sprint);
      const matchesStatus = statusFilter === "all" || sprintStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Filtrar sprints por estado para las métricas
  const activeSprints = sprints.filter((s) => getSprintStatus(s) === "Activo");
  const plannedSprints = sprints.filter((s) => getSprintStatus(s) === "Planificado");
  const completedSprints = sprints.filter((s) => getSprintStatus(s) === "Completado");
  const partialSprints = sprints.filter((s) => getSprintStatus(s) === "Completado Parcial");

  const activeSprint = activeSprints[0];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
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

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getProgressPercentage = (sprint) => {
    const plannedPoints = sprint.plannedTotalPoints || 0;
    const completedPoints = sprint.completedPoints || 0;
    if (plannedPoints === 0) return 0;
    return Math.min(100, Math.round((completedPoints / plannedPoints) * 100));
  };

  if (isLoading) {
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
      width: '100vw', // Ocupa todo el ancho de la ventana
      overflowX: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      {/* Container principal - SIN maxWidth para ocupar todo el ancho */}
      <Box sx={{ 
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 }, // Padding responsive
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
                Dashboard de Administrador
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Bienvenido de nuevo, {user?.name || "Admin"} 😊
              </Typography>
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateSprint}
                sx={{
                  background: theme.gradient,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": {
                    background: theme.gradientAlt,
                  },
                }}
              >
                Crear Nuevo Sprint
              </Button>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filtros y Búsqueda */}
        <Card
          elevation={0}
          sx={{
            background: theme.cardBg,
            borderRadius: 2,
            mb: 3,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            border: `1px solid #e0e0e0`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Planificado">Planificado</MenuItem>
                  <MenuItem value="Completado">Completado</MenuItem>
                  <MenuItem value="Completado Parcial">Completado Parcial</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Ordenar por"
                >
                  <MenuItem value="createdAt">Fecha de creación</MenuItem>
                  <MenuItem value="startDate">Fecha de inicio</MenuItem>
                  <MenuItem value="endDate">Fecha de fin</MenuItem>
                  <MenuItem value="name">Nombre</MenuItem>
                  <MenuItem value="plannedTotalPoints">Puntos planificados</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  label="Orden"
                >
                  <MenuItem value="desc">Descendente</MenuItem>
                  <MenuItem value="asc">Ascendente</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSortBy("createdAt");
                    setSortOrder("desc");
                  }}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Métricas principales */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds.Activo,
                borderRadius: 2,
                border: `1px solid ${statusColors.Activo}30`,
                transition: "transform 0.2s",
                "&:hover": { 
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    backgroundColor: `${statusColors.Activo}20`, 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp sx={{ color: statusColors.Activo, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors.Activo}>
                      {activeSprints.length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: statusColors.Activo }}>
                      Sprint Activo
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {activeSprint ? activeSprint.name : "Ninguno activo"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds.Completado,
                borderRadius: 2,
                border: `1px solid ${statusColors.Completado}30`,
                transition: "transform 0.2s",
                "&:hover": { 
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    backgroundColor: `${statusColors.Completado}20`, 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle sx={{ color: statusColors.Completado, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors.Completado}>
                      {completedSprints.length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: statusColors.Completado }}>
                      Completados
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Objetivo cumplido
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds.Planificado,
                borderRadius: 2,
                border: `1px solid ${statusColors.Planificado}30`,
                transition: "transform 0.2s",
                "&:hover": { 
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    backgroundColor: `${statusColors.Planificado}20`, 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Schedule sx={{ color: statusColors.Planificado, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors.Planificado}>
                      {plannedSprints.length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: statusColors.Planificado }}>
                      Planificados
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Próximos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds["Completado Parcial"],
                borderRadius: 2,
                border: `1px solid ${statusColors["Completado Parcial"]}30`,
                transition: "transform 0.2s",
                "&:hover": { 
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    backgroundColor: `${statusColors["Completado Parcial"]}20`, 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Assessment sx={{ color: statusColors["Completado Parcial"], fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors["Completado Parcial"]}>
                      {partialSprints.length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: statusColors["Completado Parcial"] }}>
                      Incompletos
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      No alcanzados
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de Todos los Sprints - SIN SCROLL INTERNO */}
        <Card
          elevation={0}
          sx={{
            background: theme.cardBg,
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            border: `1px solid #e0e0e0`,
            minHeight: '400px', // Altura mínima pero sin scroll interno
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="700" sx={{ color: theme.primaryDark }}>
                Todos los Sprints ({filteredAndSortedSprints.length})
              </Typography>
            </Box>

            {filteredAndSortedSprints.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  {sprints.length === 0 ? "No hay sprints creados todavía" : "No se encontraron sprints con los filtros aplicados"}
                </Typography>
              </Box>
            ) : (
              <Box>
                {filteredAndSortedSprints.map((sprint) => {
                  const sprintStatus = getSprintStatus(sprint);
                  const progress = getProgressPercentage(sprint);
                  
                  return (
                    <Card
                      key={sprint._id}
                      elevation={0}
                      sx={{
                        mb: 2,
                        background: statusBackgrounds[sprintStatus],
                        border: `1px solid ${statusColors[sprintStatus]}30`,
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        },
                        "&:last-child": {
                          mb: 0
                        }
                      }}
                      onClick={() => handleViewSprint(sprint._id)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Chip
                                label={sprintStatus}
                                size="small"
                                sx={{ 
                                  backgroundColor: statusColors[sprintStatus],
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.7rem'
                                }}
                              />
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                              </Typography>
                            </Box>
                            
                            <Typography variant="subtitle1" fontWeight="600" sx={{ color: theme.primaryDark, mb: 0.5 }}>
                              {sprint.name}
                            </Typography>
                            
                            {sprint.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 1 }}>
                                {sprint.description}
                              </Typography>
                            )}
                          </Box>
                          
                          <Box display="flex" gap={0.5}>
                            <Tooltip title="Ver Detalle">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewSprint(sprint._id);
                                }}
                                sx={{ color: theme.primary }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar Sprint">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSprint(sprint._id);
                                }}
                                sx={{ color: theme.primary }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar Sprint">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteDialog(sprint);
                                }}
                                sx={{ color: '#d32f2f' }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Información del sprint */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                              {sprint.plannedTotalPoints || 0} pts planificados
                            </Typography>
                            {(sprintStatus === "Completado" || sprintStatus === "Completado Parcial") && (
                              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                • {sprint.completedPoints || 0} pts completados
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                              • {sprint.usersAssigned?.length || 0} miembros
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                              • {calculateDuration(sprint.startDate, sprint.endDate)} días
                            </Typography>
                          </Box>
                          
                          {(sprintStatus === "Completado" || sprintStatus === "Completado Parcial") && (
                            <Typography variant="body2" sx={{ 
                              fontSize: '0.8rem', 
                              fontWeight: 600,
                              color: statusColors[sprintStatus]
                            }}>
                              {progress}% completado
                            </Typography>
                          )}
                        </Box>

                        {/* Barra de progreso para sprints completados o parciales */}
                        {(sprintStatus === "Completado" || sprintStatus === "Completado Parcial") && (
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              mt: 1,
                              backgroundColor: `${statusColors[sprintStatus]}20`,
                              "& .MuiLinearProgress-bar": {
                                background: statusColors[sprintStatus],
                              },
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Dialog de Confirmación para Eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el sprint "{deleteDialog.sprint?.name}"? 
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={() => handleDeleteSprint(deleteDialog.sprint?._id)} 
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}