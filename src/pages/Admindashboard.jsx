import React, { useState, useEffect, useContext } from "react";
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
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  alpha,
  useTheme,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  TrendingUp,
  CheckCircle,
  Schedule,
  Assessment,
  Search,
  FilterList,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  CalendarMonth,
  Groups,
  Speed,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useSprintStore from "../store/SprintStore";
import useAuthStore from "../store/authStore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { sprints, isLoading, error, fetchSprints, deleteSprint } = useSprintStore();
  const { user, token } = useAuthStore();

  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [sprintLimit, setSprintLimit] = useState(4); // Por defecto últimos 4 temporalmente relevantes
  const [showAllSprints, setShowAllSprints] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sprintsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, sprint: null });

  // Tema moderno adaptable
  const modernTheme = {
    primary: "#007AFF",
    primaryDark: "#0056CC",
    secondary: "#8E44AD",
    success: "#27AE60",
    warning: "#F39C12",
    error: "#E74C3C",
    background: theme.palette.mode === 'dark' ? 
      "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" : 
      "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
    cardBg: theme.palette.mode === 'dark' ? "#2D3748" : "#FFFFFF",
    cardHover: theme.palette.mode === 'dark' ? 
      "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)" : 
      "linear-gradient(135deg, #FFFFFF 0%, #F7FAFC 100%)",
    textPrimary: theme.palette.mode === 'dark' ? "#FFFFFF" : "#1A202C",
    textSecondary: theme.palette.mode === 'dark' ? "#A0AEC0" : "#718096",
    textTertiary: theme.palette.mode === 'dark' ? "#718096" : "#A0AEC0",
    border: theme.palette.mode === 'dark' ? "1px solid #4A5568" : "1px solid #E2E8F0",
    shadow: theme.palette.mode === 'dark' ? 
      "0 4px 24px rgba(0, 0, 0, 0.3)" : 
      "0 4px 24px rgba(0, 0, 0, 0.06)",
    shadowHover: theme.palette.mode === 'dark' ? 
      "0 8px 32px rgba(0, 0, 0, 0.4)" : 
      "0 8px 32px rgba(0, 0, 0, 0.12)",
  };

  // Colores CORREGIDOS para estados de sprints
  const statusColors = {
    Activo: "#3498DB",
    Planificado: "#8E44AD", 
    Completado: "#27AE60",
    "Completado Parcial": "#F39C12",
  };

  const statusBackgrounds = {
    Activo: `linear-gradient(135deg, ${alpha(statusColors.Activo, 0.1)} 0%, ${alpha(statusColors.Activo, 0.05)} 100%)`,
    Planificado: `linear-gradient(135deg, ${alpha(statusColors.Planificado, 0.1)} 0%, ${alpha(statusColors.Planificado, 0.05)} 100%)`,
    Completado: `linear-gradient(135deg, ${alpha(statusColors.Completado, 0.1)} 0%, ${alpha(statusColors.Completado, 0.05)} 100%)`,
    "Completado Parcial": `linear-gradient(135deg, ${alpha(statusColors["Completado Parcial"], 0.1)} 0%, ${alpha(statusColors["Completado Parcial"], 0.05)} 100%)`,
  };

  // Función para calcular estado automático basado en fechas
  const calculateSprintStatus = (sprint) => {
    if (!sprint.startDate || !sprint.endDate) return "Planificado";
    
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
      const plannedPoints = sprint.plannedTotalPoints || 0;
      const completedPoints = sprint.completedPoints || 0;
      
      if (plannedPoints > 0 && completedPoints < plannedPoints) {
        return "Completado Parcial";
      }
    }
    
    return status;
  };

  const getSprintStatus = (sprint) => {
    return sprint.calculatedStatus || calculateSprintStatus(sprint);
  };

  const isSprintClosed = (sprint) => {
    const status = getSprintStatus(sprint);
    return status === "Completado" || status === "Completado Parcial";
  };

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  // Obtener años únicos de los sprints
  const getAvailableYears = () => {
    const years = new Set();
    sprints.forEach(sprint => {
      if (sprint.startDate) {
        const year = new Date(sprint.startDate).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // Ordenar sprints según prioridad (para lista completa)
  const getSortedSprints = (sprintsList) => {
    const statusPriority = {
      'Activo': 1,
      'Planificado': 2,
      'Completado': 3,
      'Completado Parcial': 4
    };

    return [...sprintsList].sort((a, b) => {
      const statusA = getSprintStatus(a);
      const statusB = getSprintStatus(b);
      
      if (statusPriority[statusA] !== statusPriority[statusB]) {
        return statusPriority[statusA] - statusPriority[statusB];
      }
      
      return new Date(b.startDate) - new Date(a.startDate);
    });
  };

  // NUEVA FUNCIÓN: Obtener sprints temporalmente relevantes
  const getTemporallyRelevantSprints = (sprintsList, limit) => {
    if (sprintsList.length === 0) return [];
    
    // Encontrar el sprint activo (si existe)
    const activeSprint = sprintsList.find(sprint => getSprintStatus(sprint) === "Activo");
    
    // Si hay sprint activo, lo incluimos y buscamos los más recientes completados
    if (activeSprint) {
      const completedSprints = sprintsList.filter(sprint => {
        const status = getSprintStatus(sprint);
        return (status === "Completado" || status === "Completado Parcial") && sprint._id !== activeSprint._id;
      });
      
      // Ordenar completados por fecha de fin (más recientes primero)
      const recentCompleted = [...completedSprints].sort((a, b) => 
        new Date(b.endDate) - new Date(a.endDate)
      ).slice(0, limit - 1);
      
      return [activeSprint, ...recentCompleted];
    }
    
    // Si no hay activo, mostrar los más recientes completados/incompletos
    const recentSprints = sprintsList.filter(sprint => {
      const status = getSprintStatus(sprint);
      return status === "Completado" || status === "Completado Parcial";
    }).sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
      .slice(0, limit);
    
    return recentSprints;
  };

  // Filtrar sprints para la lista - CON LÍMITE TEMPORAL INTELIGENTE
  const getFilteredSprints = () => {
    let filtered = sprints.filter(sprint => {
      const matchesSearch = sprint.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sprint.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const sprintStatus = getSprintStatus(sprint);
      const matchesStatus = statusFilter === "all" || sprintStatus === statusFilter;
      
      // FILTRO POR AÑO
      const sprintYear = sprint.startDate ? new Date(sprint.startDate).getFullYear().toString() : null;
      const matchesYear = yearFilter === "all" || sprintYear === yearFilter;
      
      return matchesSearch && matchesStatus && matchesYear;
    });

    // Aplicar límite TEMPORAL INTELIGENTE si no se muestran todos
    if (!showAllSprints && sprintLimit > 0) {
      return getTemporallyRelevantSprints(filtered, sprintLimit);
    }

    // Si se muestran todos, aplicar orden normal
    return getSortedSprints(filtered);
  };

  // Calcular métricas para el año seleccionado
  const calculateMetrics = () => {
    const yearSprints = sprints.filter(sprint => {
      if (!sprint.startDate) return false;
      const sprintYear = new Date(sprint.startDate).getFullYear().toString();
      return yearFilter === "all" || sprintYear === yearFilter;
    });
    
    return {
      active: yearSprints.filter(s => getSprintStatus(s) === "Activo").length,
      planned: yearSprints.filter(s => getSprintStatus(s) === "Planificado").length,
      completed: yearSprints.filter(s => getSprintStatus(s) === "Completado").length,
      partial: yearSprints.filter(s => getSprintStatus(s) === "Completado Parcial").length,
    };
  };

  // Sprints para mostrar (con límite temporal inteligente y paginación)
  const filteredSprints = getFilteredSprints();
  const indexOfLastSprint = currentPage * sprintsPerPage;
  const indexOfFirstSprint = indexOfLastSprint - sprintsPerPage;
  const currentSprints = showAllSprints ? 
    filteredSprints.slice(indexOfFirstSprint, indexOfLastSprint) : 
    filteredSprints;
  const totalPages = Math.ceil(filteredSprints.length / sprintsPerPage);

  const metrics = calculateMetrics();
  const availableYears = getAvailableYears();

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

  // Lógica para exportar informe de sprints a CSV
  const handleExportSprintReport = async () => {
    setIsExporting(true);
    setExportError(null); // Limpiamos errores previos

    try {
      const response = await fetch('http://localhost:4000/api/reports/sprint-participation', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Si el servidor devuelve un error (ej. 403 Forbidden)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al generar el informe.');
      }

      // 1. Obtener el blob (el archivo)
      const blob = await response.blob();

      // 2. Crear una URL temporal para el blob
      const url = window.URL.createObjectURL(blob);

      // 3. Crear un enlace <a> invisible
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;

      // 4. Ponerle nombre al archivo
      const date = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      a.download = `sprint_participation_report_${date}.csv`;

      // 5. Añadirlo al DOM y simular un clic
      document.body.appendChild(a);
      a.click();

      // 6. Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error en la exportación:', error);
      setExportError(error.message || 'Ocurrió un error desconocido al exportar el informe.'); // Guardamos el mensaje de error para mostrarlo
    } finally {
      setIsExporting(false); // Pase lo que pase, dejamos de cargar
    }
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

  // Función para filtrar por estado al hacer clic en las métricas
  const handleMetricClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setShowAllSprints(true); // Mostrar todos cuando se filtra por métrica
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
        sx={{ background: modernTheme.background }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            sx={{ 
              color: modernTheme.primary,
              mb: 2 
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: modernTheme.textSecondary,
              fontWeight: 500 
            }}
          >
            Cargando dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: modernTheme.background,
      py: 3,
      width: '100vw',
      overflowX: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      {/* Container principal */}
      <Box sx={{ 
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        px: { xs: 2, sm: 3, md: 4 },
      }}>
        {/* Header Moderno */}
        <Box
          sx={{
            background: modernTheme.cardBg,
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: modernTheme.shadow,
            border: modernTheme.border,
            backgroundImage: modernTheme.cardHover,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                sx={{ 
                  color: modernTheme.success,
                  mb: 0.5
                }}
              >
                Sprint Dashboard
              </Typography>
              <Typography variant="h6" sx={{ color: modernTheme.textSecondary, fontWeight: 400 }}>
                Gestión profesional • {user?.name || "Admin"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateSprint}
              sx={{
                background: `linear-gradient(135deg, ${modernTheme.success} 0%, ${modernTheme.successDark} 100%)`,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0, 255, 174, 0.3)',
                "&:hover": {
                  boxShadow: '0 6px 16px rgba(0, 255, 115, 0.25)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Crear Sprint
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              border: `1px solid ${modernTheme.error}`,
              background: alpha(modernTheme.error, 0.05),
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filtros Modernos COMPLETOS */}
        <Card
          elevation={0}
          sx={{
            background: modernTheme.cardBg,
            borderRadius: 2,
            mb: 3,
            boxShadow: modernTheme.shadow,
            border: modernTheme.border,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar sprints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: modernTheme.textTertiary }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 1.5,
                      background: alpha(modernTheme.primary, 0.02),
                    }
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
                  <MenuItem value="Completado Parcial">Incompleto</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  label="Año"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {availableYears.map(year => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={sprintLimit}
                  onChange={(e) => {
                    setSprintLimit(Number(e.target.value));
                    setShowAllSprints(e.target.value === 0);
                    setCurrentPage(1);
                  }}
                  label="Mostrar"
                >
                  <MenuItem value={4}>Relevantes (1 activo + 3 recientes)</MenuItem>
                  <MenuItem value={10}>Últimos 10</MenuItem>
                  <MenuItem value={0}>Todos</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" gap={1}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setYearFilter(new Date().getFullYear().toString());
                      setSprintLimit(4);
                      setShowAllSprints(false);
                      setCurrentPage(1);
                    }}
                    sx={{
                      borderRadius: 1.5,
                      borderColor: modernTheme.textTertiary,
                      color: modernTheme.textSecondary,
                      '&:hover': {
                        borderColor: modernTheme.primary,
                        color: modernTheme.primary,
                      }
                    }}
                  >
                    Limpiar
                  </Button>
                  <Button
                    size="small"
                    variant={showAllSprints ? "contained" : "outlined"}
                    onClick={() => {
                      setShowAllSprints(!showAllSprints);
                      setCurrentPage(1);
                    }}
                    startIcon={showAllSprints ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                      borderRadius: 1.5,
                      minWidth: 'auto',
                      px: 2,
                    }}
                  >
                    {showAllSprints ? 'Menos' : 'Más'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Métricas Modernas */}
        <Grid container spacing={2} mb={3}>
          {/* Activo - AZUL */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds.Activo,
                borderRadius: 2,
                border: `1px solid ${alpha(statusColors.Activo, 0.2)}`,
                boxShadow: modernTheme.shadow,
                transition: "all 0.2s ease",
                "&:hover": { 
                  transform: "translateY(-2px)",
                  boxShadow: modernTheme.shadowHover,
                  cursor: 'pointer'
                },
              }}
              onClick={() => handleMetricClick("Activo")}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    background: statusColors.Activo, 
                    borderRadius: '12px', 
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PlayArrow sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors.Activo}>
                      {metrics.active}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: modernTheme.textPrimary }}>
                      Activos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Planificado - LILA */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds.Planificado,
                borderRadius: 2,
                border: `1px solid ${alpha(statusColors.Planificado, 0.2)}`,
                boxShadow: modernTheme.shadow,
                transition: "all 0.2s ease",
                "&:hover": { 
                  transform: "translateY(-2px)",
                  boxShadow: modernTheme.shadowHover,
                  cursor: 'pointer'
                },
              }}
              onClick={() => handleMetricClick("Planificado")}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    background: statusColors.Planificado, 
                    borderRadius: '12px', 
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Schedule sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors.Planificado}>
                      {metrics.planned}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: modernTheme.textPrimary }}>
                      Planificados
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Completado - VERDE */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds.Completado,
                borderRadius: 2,
                border: `1px solid ${alpha(statusColors.Completado, 0.2)}`,
                boxShadow: modernTheme.shadow,
                transition: "all 0.2s ease",
                "&:hover": { 
                  transform: "translateY(-2px)",
                  boxShadow: modernTheme.shadowHover,
                  cursor: 'pointer'
                },
              }}
              onClick={() => handleMetricClick("Completado")}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    background: statusColors.Completado, 
                    borderRadius: '12px', 
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors.Completado}>
                      {metrics.completed}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: modernTheme.textPrimary }}>
                      Completados
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Completado Parcial - NARANJA */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: statusBackgrounds["Completado Parcial"],
                borderRadius: 2,
                border: `1px solid ${alpha(statusColors["Completado Parcial"], 0.2)}`,
                boxShadow: modernTheme.shadow,
                transition: "all 0.2s ease",
                "&:hover": { 
                  transform: "translateY(-2px)",
                  boxShadow: modernTheme.shadowHover,
                  cursor: 'pointer'
                },
              }}
              onClick={() => handleMetricClick("Completado Parcial")}
            >
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    background: statusColors["Completado Parcial"], 
                    borderRadius: '12px', 
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Assessment sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={statusColors["Completado Parcial"]}>
                      {metrics.partial}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: modernTheme.textPrimary }}>
                      Incompletos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de Sprints con Límite Temporal Inteligente */}
        <Card
          elevation={0}
          sx={{
            background: modernTheme.cardBg,
            borderRadius: 2,
            boxShadow: modernTheme.shadow,
            border: modernTheme.border,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ color: modernTheme.textPrimary, mb: 0.5 }}>
                  Sprints ({filteredSprints.length})
                  {sprintLimit > 0 && !showAllSprints && (
                    <Typography component="span" variant="body2" sx={{ color: modernTheme.textSecondary, ml: 1 }}>
                      ({sprintLimit === 4 ? '1 activo + 3 recientes' : `Últimos ${sprintLimit} completados`})
                    </Typography>
                  )}
                </Typography>
                <Typography variant="body2" sx={{ color: modernTheme.textSecondary }}>
                  {yearFilter === "all" ? "Todos los años" : `Año ${yearFilter}`} • Orden: Activo → Planificado → Completado
                </Typography>
              </Box>
            </Box>

            {currentSprints.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" sx={{ color: modernTheme.textSecondary }}>
                  {sprints.length === 0 ? "No hay sprints creados todavía" : "No se encontraron sprints con los filtros aplicados"}
                </Typography>
              </Box>
            ) : (
              <Box>
                {currentSprints.map((sprint) => {
                  const sprintStatus = getSprintStatus(sprint);
                  const progress = getProgressPercentage(sprint);
                  const isClosed = isSprintClosed(sprint);
                  
                  return (
                    <Card
                      key={sprint._id}
                      elevation={0}
                      sx={{
                        mb: 1.5,
                        background: statusBackgrounds[sprintStatus],
                        border: `1px solid ${alpha(statusColors[sprintStatus], 0.2)}`,
                        borderRadius: 1.5,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: modernTheme.shadowHover,
                        },
                      }}
                      onClick={() => handleViewSprint(sprint._id)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Chip
                                label={sprintStatus}
                                size="small"
                                sx={{ 
                                  background: statusColors[sprintStatus],
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  height: '22px',
                                }}
                              />
                              <Typography variant="body2" sx={{ color: modernTheme.textSecondary, fontSize: '0.8rem' }}>
                                {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                              </Typography>
                            </Box>
                            
                            <Typography variant="subtitle1" fontWeight="600" sx={{ color: modernTheme.textPrimary, mb: 0.5 }}>
                              {sprint.name}
                            </Typography>
                            
                            <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                              <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: modernTheme.textPrimary }}>
                                {sprint.plannedTotalPoints || 0} pts
                              </Typography>
                              {(sprintStatus === "Completado" || sprintStatus === "Completado Parcial") && (
                                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: modernTheme.textSecondary }}>
                                  • {sprint.completedPoints || 0} completados
                                </Typography>
                              )}
                              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: modernTheme.textSecondary }}>
                                • {sprint.usersAssigned?.length || 0} miembros
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: modernTheme.textSecondary }}>
                                • {calculateDuration(sprint.startDate, sprint.endDate)} días
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box display="flex" gap={0.5} onClick={(e) => e.stopPropagation()}>
                            {!isClosed && (
                              <Tooltip title="Editar">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleEditSprint(sprint._id)}
                                  sx={{ 
                                    color: modernTheme.primary,
                                    background: alpha(modernTheme.primary, 0.1),
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            <Tooltip title="Eliminar">
                              <IconButton 
                                size="small"
                                onClick={() => openDeleteDialog(sprint)}
                                sx={{ 
                                  color: modernTheme.error,
                                  background: alpha(modernTheme.error, 0.1),
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {(sprintStatus === "Completado" || sprintStatus === "Completado Parcial") && (
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              mt: 1.5,
                              backgroundColor: alpha(statusColors[sprintStatus], 0.2),
                              "& .MuiLinearProgress-bar": {
                                background: statusColors[sprintStatus],
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                
                {/* Paginación SOLO cuando se muestran todos */}
                {showAllSprints && totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, value) => setCurrentPage(value)}
                      color="primary"
                      size="medium"
                    />
                  </Box>
                )}
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
        <DialogTitle sx={{ fontWeight: 600 }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el sprint "{deleteDialog.sprint?.name}"? 
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>
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

      {/* Snackbar para mostrar errores de exportación */}
      <Snackbar
        open={!!exportError}
        autoHideDuration={6000}
        onClose={() => setExportError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setExportError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >{exportError}</Alert>
      </Snackbar>
    </Box>
  );
}