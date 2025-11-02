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
  Paper,
  Avatar,
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

  useEffect(() => {
    console.log("🔄 [DEBUG] Cargando sprints...");
    fetchSprints();
  }, [fetchSprints]);

  useEffect(() => {
    if (sprints.length > 0) {
      console.log("📊 [DEBUG] Estado de sprints:");
      console.log("   - Total sprints:", sprints.length);
      console.log("   - Sprints data:", sprints);
      console.log("   - Active sprints:", activeSprints);
      console.log("   - Planned sprints:", plannedSprints);
      console.log("   - Completed sprints:", completedSprints);

      // Debug detallado de cada sprint
      sprints.forEach((sprint, index) => {
        const today = new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        
        console.log(`🔍 Sprint ${index}: ${sprint.name}`);
        console.log(`   - ID: ${sprint._id}`);
        console.log(`   - Status actual: ${sprint.status}`);
        console.log(`   - Start: ${startDate.toISOString()}`);
        console.log(`   - End: ${endDate.toISOString()}`);
        console.log(`   - Today: ${today.toISOString()}`);
        console.log(`   - Should be active? ${today >= startDate && today <= endDate}`);
        console.log(`   - Users: ${sprint.usersAssigned?.length || 0}`);
        console.log(`   - Points: ${sprint.plannedTotalPoints}`);
      });
    }
  }, [sprints]);

  const handleCreateSprint = () => {
    console.log("➕ Creando nuevo sprint");
    navigate("/create-sprint");
  };

  const handleViewSprint = (sprintId) => {
    console.log("🔗 [DEBUG] Iniciando navegación...");
    console.log("📍 Sprint ID:", sprintId);
    console.log("👤 Usuario:", user);
    console.log("🔐 isAdmin:", user?.isAdmin);
    
    // Verifica que el ID sea válido
    if (!sprintId) {
      console.error("❌ ERROR: sprintId es undefined o null");
      return;
    }
    
    // Prueba con navigate
    const destination = `/sprint-detail/${sprintId}`;
    console.log("🎯 Navegando a:", destination);
    
    navigate(destination);
    
    // Si no funciona en 2 segundos, forzar recarga
    setTimeout(() => {
      console.log("⏰ Timeout - Forzando recarga...");
      window.location.href = destination;
    }, 2000);
  };

  const handleEditSprint = (sprintId) => {
    console.log("✏️ Editando sprint:", sprintId);
    navigate(`/edit-sprint/${sprintId}`);
  };

  const handleDeleteSprint = async (sprintId) => {
    try {
      await deleteSprint(sprintId);
      setDeleteDialog({ open: false, sprint: null });
      // Recargar los sprints después de eliminar
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

  // Filtrar y ordenar sprints
  const filteredAndSortedSprints = sprints
    .filter(sprint => {
      const matchesSearch = sprint.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sprint.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || sprint.status === statusFilter;
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
  const activeSprints = sprints.filter((s) => s.status === "Activo");
  const plannedSprints = sprints.filter((s) => s.status === "Planificado");
  const completedSprints = sprints.filter((s) => s.status === "Completado");

  const activeSprint = activeSprints[0];

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
      py: 4,
      width: '100%'
    }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
        {/* Header */}
        <Box
          sx={{
            background: theme.cardBg,
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.15)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="800" 
                sx={{ 
                  color: theme.primary,
                  mb: 0.5
                }}
              >
                Dashboard de Administrador
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Bienvenido de nuevo, {user?.name || "Admin"} 👋
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
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    background: theme.gradientAlt,
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                  },
                }}
              >
                Crear Nuevo Sprint
              </Button>

              {/* 🔧 BOTÓN DEBUG TEMPORAL */}
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => {
                  console.log("🔄 DEBUG: Recargando datos manualmente");
                  fetchSprints();
                }}
              >
                🔧 Recargar
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
              backgroundColor: "#ffebee",
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
            borderRadius: 3,
            mb: 3,
            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.12)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
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
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Planificado">Planificado</MenuItem>
                  <MenuItem value="Completado">Completado</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
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
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: theme.gradient,
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.2)",
                "&:hover": { 
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 56, height: 56 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {activeSprints.length}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 600 }}>
                  Sprint Activo
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {activeSprint ? activeSprint.name : "Ninguno activo"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #26A69A 0%, #4DB6AC 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                boxShadow: "0 4px 15px rgba(38, 166, 154, 0.2)",
                "&:hover": { 
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(38, 166, 154, 0.3)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 56, height: 56 }}>
                    <CheckCircle />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {completedSprints.length}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 600 }}>
                  Completados
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Este año
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #66BB6A 0%, #9CCC65 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                boxShadow: "0 4px 15px rgba(102, 187, 106, 0.2)",
                "&:hover": { 
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(102, 187, 106, 0.3)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 56, height: 56 }}>
                    <Schedule />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {plannedSprints.length}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 600 }}>
                  Planificados
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Próximos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                boxShadow: "0 4px 15px rgba(66, 165, 245, 0.2)",
                "&:hover": { 
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(66, 165, 245, 0.3)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 56, height: 56 }}>
                    <Group />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {activeSprint ? activeSprint.usersAssigned?.length || 0 : 0}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 600 }}>
                  Equipo Total
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Miembros activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sprint Activo Destacado */}
        {activeSprint && (
          <Card
            elevation={0}
            sx={{
              background: theme.cardBg,
              borderRadius: 3,
              mb: 3,
              boxShadow: "0 4px 20px rgba(76, 175, 80, 0.12)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: theme.primary }}>
                    🚀 Sprint Activo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seguimiento en tiempo real
                  </Typography>
                </Box>
                <Chip
                  label="EN CURSO"
                  color="success"
                  sx={{ fontWeight: 700, px: 2, py: 2.5, fontSize: "0.875rem" }}
                />
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
                  <Typography variant="h4" fontWeight="700">
                    {activeSprint.name}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleViewSprint(activeSprint._id)}
                    sx={{
                      background: theme.gradient,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        background: theme.gradientAlt,
                      }
                    }}
                  >
                    Ver Detalle Completo
                  </Button>
                </Box>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarToday fontSize="small" sx={{ color: theme.primary }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${calculateDuration(activeSprint.startDate, activeSprint.endDate)} días totales`}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: theme.primary, color: theme.primary }}
                  />
                  <Chip
                    label={`${getDaysRemaining(activeSprint.endDate)} días restantes`}
                    size="small"
                    sx={{ 
                      backgroundColor: "#FFF9C4",
                      color: "#F57F17",
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={600}>Progreso del Sprint</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    0 / {activeSprint.plannedTotalPoints} puntos
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={0}
                  sx={{
                    height: 12,
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

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#F1F8E9", borderRadius: 2 }}>
                    <Assessment sx={{ fontSize: 40, color: theme.primary, mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">{activeSprint.plannedTotalPoints}</Typography>
                    <Typography variant="caption" color="text.secondary">Puntos Planificados</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#E8F5E9", borderRadius: 2 }}>
                    <Group sx={{ fontSize: 40, color: "#26A69A", mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">{activeSprint.usersAssigned?.length || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Miembros del Equipo</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#E3F2FD", borderRadius: 2 }}>
                    <Schedule sx={{ fontSize: 40, color: "#42A5F5", mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">
                      {activeSprint.plannedStories?.reduce((sum, story) => sum + story.quantity, 0) || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Historias Planificadas</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#FFF9C4", borderRadius: 2 }}>
                    <CalendarToday sx={{ fontSize: 40, color: "#F57F17", mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">{getDaysRemaining(activeSprint.endDate)}</Typography>
                    <Typography variant="caption" color="text.secondary">Días Restantes</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Lista de Todos los Sprints - ACTUALIZADO */}
        <Card
          elevation={0}
          sx={{
            background: theme.cardBg,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(76, 175, 80, 0.12)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="700" sx={{ color: theme.primary }}>
                📋 Todos los Sprints ({filteredAndSortedSprints.length})
              </Typography>
              <Chip 
                icon={<Sort />}
                label={`Ordenado por ${sortBy}`}
                variant="outlined"
                sx={{ borderColor: theme.primary, color: theme.primary }}
              />
            </Box>

            {filteredAndSortedSprints.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary" mb={3}>
                  {sprints.length === 0 ? "No hay sprints creados todavía" : "No se encontraron sprints con los filtros aplicados"}
                </Typography>
                {sprints.length === 0 && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={handleCreateSprint}
                    sx={{
                      background: theme.gradient,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 4,
                      boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                      "&:hover": {
                        background: theme.gradientAlt,
                      }
                    }}
                  >
                    Crear tu Primer Sprint
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredAndSortedSprints.map((sprint) => (
                  <Grid item xs={12} sm={6} md={4} key={sprint._id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.primaryLight}20 0%, ${theme.primary}20 100%)`,
                        border: `2px solid ${theme.primary}30`,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 35px rgba(76, 175, 80, 0.25)",
                          border: `2px solid ${theme.primary}60`,
                          background: `linear-gradient(135deg, ${theme.primaryLight}30 0%, ${theme.primary}30 100%)`,
                        },
                      }}
                      onClick={() => handleViewSprint(sprint._id)}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Header con acciones */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Chip
                            label={sprint.status}
                            color={getStatusColor(sprint.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Box>
                            <Tooltip title="Ver Detalle">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewSprint(sprint._id);
                                }}
                                sx={{ color: theme.primary }}
                              >
                                <Visibility />
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
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar Sprint">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteDialog(sprint);
                                }}
                                sx={{ color: '#f44336' }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Contenido del sprint */}
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: theme.primaryDark }}>
                            {sprint.name}
                          </Typography>
                          
                          {sprint.description && (
                            <Typography variant="body2" color="text.secondary" mb={2}>
                              {sprint.description.length > 100 
                                ? `${sprint.description.substring(0, 100)}...` 
                                : sprint.description
                              }
                            </Typography>
                          )}

                          <Box display="flex" flexDirection="column" gap={1} mb={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" sx={{ color: theme.primary }} />
                              <Typography variant="body2">
                                {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                              </Typography>
                            </Box>
                            
                            <Box display="flex" gap={1} flexWrap="wrap">
                              <Chip 
                                label={`${sprint.plannedTotalPoints || 0} pts`} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: theme.primary,
                                  color: 'white',
                                  fontWeight: 600
                                }} 
                              />
                              <Chip
                                label={`${sprint.usersAssigned?.length || 0} miembros`}
                                size="small"
                                variant="outlined"
                                sx={{ borderColor: theme.primary, color: theme.primary }}
                              />
                              <Chip
                                label={`${calculateDuration(sprint.startDate, sprint.endDate)} días`}
                                size="small"
                                sx={{ 
                                  backgroundColor: "#E3F2FD",
                                  color: "#1976D2",
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        {/* Botón de ver detalle */}
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Visibility />}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("🔄 Navegación forzada para:", sprint._id);
                            window.location.href = `/sprint-detail/${sprint._id}`;
                          }}
                          sx={{
                            background: theme.gradient,
                            textTransform: "none",
                            fontWeight: 600,
                            mt: 'auto',
                            "&:hover": {
                              background: theme.gradientAlt,
                            }
                          }}
                        >
                          Ver Detalle (Forzado)
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
            onClick={() => handleDeleteSprint(deleteDialog.sprint?._id)} 
            color="error"
            variant="contained"
          >
            Sí, Eliminar Sprint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}