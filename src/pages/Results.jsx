import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  TrendingUp,
  CheckCircle,
  Warning,
  Assessment,
  Analytics,
  BarChart,
  ShowChart,
  PieChart,
  Download,
  CalendarToday,
  Group,
  Speed
} from "@mui/icons-material";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useNavigate } from "react-router-dom";
import useSprintStore from "../store/SprintStore";
import axiosClient from "../utils/axiosClient";

export default function Results() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sprints, isLoading, fetchSprints } = useSprintStore();

  const [selectedSprints, setSelectedSprints] = useState([]);
  const [timeFilter, setTimeFilter] = useState("last4");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamPerformanceData, setTeamPerformanceData] = useState({});

  // Tema profesional con soporte para modo oscuro
  const customTheme = {
    primary: "#4CAF50",
    primaryDark: "#45A049",
    primaryLight: "#81C784",
    background: theme.palette.mode === 'dark' ? theme.palette.background.default : "#f8fbf9",
    cardBg: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#ffffff",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    text: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
    textSecondary: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.secondary,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchSprints();
        setLoading(false);
      } catch (error) {
        console.error("Error loading sprints:", error);
        setLoading(false);
      }
    };
    loadData();
  }, [fetchSprints]);

  useEffect(() => {
    if (sprints && sprints.length > 0) {
      applyFilters();
    }
  }, [sprints, timeFilter, startDate, endDate]);

  const applyFilters = () => {
    let filteredSprints = getCompletedSprints();

    // Aplicar filtro de tiempo
    if (timeFilter === "last4") {
      filteredSprints = filteredSprints.slice(0, 4);
    } else if (timeFilter === "last10") {
      filteredSprints = filteredSprints.slice(0, 10);
    } else if (timeFilter === "custom" && startDate && endDate) {
      filteredSprints = filteredSprints.filter(sprint => {
        const sprintDate = new Date(sprint.endDate);
        return sprintDate >= new Date(startDate) && sprintDate <= new Date(endDate);
      });
    }

    setSelectedSprints(filteredSprints);
    calculateComparisonData(filteredSprints);
    fetchTeamPerformanceData(filteredSprints);
  };

  const getCompletedSprints = () => {
    return sprints
      .filter(sprint => {
        const status = calculateSprintStatus(sprint);
        return status === "Completado" || status === "Completado Parcial";
      })
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
  };

  const calculateSprintStatus = (sprint) => {
    const today = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (today < startDate) return "Planificado";
    if (today >= startDate && today <= endDate) return "Activo";

    const plannedPoints = calculateTotalPlannedPoints(sprint);
    const completedPoints = sprint.completedPoints || 0;

    if (plannedPoints > 0 && completedPoints < plannedPoints) {
      return "Completado Parcial";
    }
    return "Completado";
  };

  const calculateTotalPlannedPoints = (sprint) => {
    if (!sprint.plannedStories || sprint.plannedStories.length === 0) {
      return 0;
    }

    return sprint.plannedStories.reduce((total, story) => {
      return total + (story.score * story.quantity);
    }, 0);
  };

  const calculateComparisonData = (sprintsToCompare) => {
    if (!sprintsToCompare || sprintsToCompare.length === 0) {
      setComparisonData(null);
      return;
    }

    const velocityData = sprintsToCompare.map(sprint => {
      const duration = calculateDuration(sprint.startDate, sprint.endDate);
      const plannedPoints = calculateTotalPlannedPoints(sprint);
      const completedPoints = sprint.completedPoints || 0;
      const velocityIdeal = duration > 0 ? (plannedPoints / duration).toFixed(1) : 0;
      const velocityReal = duration > 0 ? (completedPoints / duration).toFixed(1) : 0;
      const completionRate = plannedPoints > 0 ? Math.round((completedPoints / plannedPoints) * 100) : 0;

      return {
        name: sprint.name,
        sprintId: sprint._id,
        plannedPoints: plannedPoints,
        completedPoints: completedPoints,
        velocityIdeal: parseFloat(velocityIdeal),
        velocityReal: parseFloat(velocityReal),
        completionRate,
        duration,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: calculateSprintStatus(sprint)
      };
    });

    // Estadísticas resumen
    const totalPlannedPoints = velocityData.reduce((sum, sprint) => sum + sprint.plannedPoints, 0);
    const totalCompletedPoints = velocityData.reduce((sum, sprint) => sum + sprint.completedPoints, 0);
    const averageCompletion = velocityData.length > 0 ?
      Math.round(velocityData.reduce((sum, sprint) => sum + sprint.completionRate, 0) / velocityData.length) : 0;
    const averageVelocity = velocityData.length > 0 ?
      (velocityData.reduce((sum, sprint) => sum + sprint.velocityReal, 0) / velocityData.length).toFixed(1) : 0;

    setComparisonData({
      velocityData,
      summary: {
        totalSprints: sprintsToCompare.length,
        totalPlannedPoints,
        totalCompletedPoints,
        averageCompletion,
        averageVelocity,
        overallCompletionRate: totalPlannedPoints > 0 ? Math.round((totalCompletedPoints / totalPlannedPoints) * 100) : 0
      }
    });
  };

  const fetchTeamPerformanceData = async (sprintsToCompare) => {
    const performanceData = {};

    for (const sprint of sprintsToCompare) {
      try {
        const response = await axiosClient.get(`/completions/sprint/${sprint._id}`);
        const completions = response.data.completions || [];

        completions.forEach(completion => {
          const memberName = completion.userId?.name || 'Usuario';
          if (!performanceData[memberName]) {
            performanceData[memberName] = [];
          }

          performanceData[memberName].push({
            sprint: sprint.name,
            sprintId: sprint._id,
            completed: completion.totalAchievedPoints || 0,
            completionRate: Math.round((completion.totalAchievedPoints / calculateTotalPlannedPoints(sprint)) * 100) || 0,
            date: sprint.endDate
          });
        });
      } catch (error) {
        console.error(`Error fetching completions for sprint ${sprint._id}:`, error);
      }
    }

    setTeamPerformanceData(performanceData);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const handleBack = () => navigate("/admin-dashboard");
  const handleChartChange = (event, newType) => {
    if (newType) setChartType(newType);
  };

  const handleExportCSV = () => {
    if (!comparisonData) return;

    const headers = [
      'Sprint',
      'Fecha Inicio',
      'Fecha Fin',
      'Puntos Planificados',
      'Puntos Completados',
      'Tasa Completado (%)',
      'Velocidad Ideal',
      'Velocidad Real',
      'Duración (días)',
      'Estado'
    ];

    const csvData = comparisonData.velocityData.map(sprint => [
      `"${sprint.name}"`,
      new Date(sprint.startDate).toLocaleDateString(),
      new Date(sprint.endDate).toLocaleDateString(),
      sprint.plannedPoints,
      sprint.completedPoints,
      sprint.completionRate,
      sprint.velocityIdeal,
      sprint.velocityReal,
      sprint.duration,
      sprint.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sprint-comparison-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChartColors = () => {
    return theme.palette.mode === 'dark'
      ? ['#4CAF50', '#81C784', '#66BB6A', '#388E3C']
      : ['#4CAF50', '#81C784', '#66BB6A', '#388E3C'];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: customTheme.background }}>
        <CircularProgress size={60} sx={{ color: customTheme.primary }} />
      </Box>
    );
  }

  const completedSprints = getCompletedSprints();

  if (completedSprints.length === 0) {
    return (
      <Box sx={{
        minHeight: "100vh",
        backgroundColor: customTheme.background,
        width: "100vw",
        margin: 0,
        padding: 0,
      }}>
        <Box sx={{
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
        }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: customTheme.primary,
                color: customTheme.primary,
              }}
            >
              Volver al Dashboard
            </Button>
            <Typography variant="h4" fontWeight="700" sx={{ color: customTheme.primary }}>
              Comparativa de Sprints
            </Typography>
          </Box>

          <Alert severity="info" sx={{ maxWidth: 800, mx: "auto" }}>
            No hay sprints completados disponibles para mostrar resultados.
            Los resultados se mostrarán aquí una vez que los sprints hayan finalizado.
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      backgroundColor: customTheme.background,
      width: "100vw",
      margin: 0,
      padding: 0,
    }}>
      <Box sx={{
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
        maxWidth: 1400,
        mx: "auto"
      }}>
        {/* Header */}
        <Card
          elevation={0}
          sx={{
            background: customTheme.cardBg,
            borderRadius: 3,
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
                }}
              >
                Volver al Dashboard
              </Button>
              <Box>
                <Typography variant="h5" fontWeight="700" sx={{ color: customTheme.primary }}>
                  📊 Comparativa de Sprints
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Análisis histórico y planificación basada en datos
                </Typography>
              </Box>
            </Box>

            <Button
              startIcon={<Download />}
              onClick={handleExportCSV}
              variant="contained"
              disabled={!comparisonData}
              sx={{
                background: customTheme.gradient,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Exportar CSV
            </Button>
          </Box>

          {/* Filtros */}
          <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Período de tiempo</InputLabel>
              <Select
                value={timeFilter}
                label="Período de tiempo"
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <MenuItem value="last4">Últimos 4 sprints</MenuItem>
                <MenuItem value="last10">Últimos 10 sprints</MenuItem>
                <MenuItem value="custom">Rango personalizado</MenuItem>
              </Select>
            </FormControl>

            {timeFilter === "custom" && (
              <>
                <TextField
                  label="Fecha inicio"
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  label="Fecha fin"
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 150 }}
                />
              </>
            )}

            <Chip
              label={`${selectedSprints.length} sprint(s) seleccionados`}
              variant="outlined"
              sx={{ alignSelf: 'center', borderColor: customTheme.primary, color: customTheme.primary }}
            />
          </Box>
        </Card>

        {comparisonData && (
          <>
            {/* Métricas Resumen - Diseño Compacto y Elegante */}
            <Box container spacing={2} sx={{
              mb: 4, width: '100%', mx: 0, display: 'flex', gap: 2, flexWrap: 'wrap'
            }}>
              <Box item sx={{
                flex: '1 1 calc(25% - 16px)', 
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center'  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Total Sprints
                      </Typography>
                      <Avatar sx={{ bgcolor: customTheme.primary, width: 35, height: 30, mb: 2 }}>
                        <TrendingUp />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ color: customTheme.primary }}>
                      {comparisonData.summary.totalSprints} 
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box item sx={{
                flex: '1 1 calc(25% - 16px)', 
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Tasa Completado
                      </Typography>
                      <Avatar sx={{ bgcolor: "#1976D2", width: 35, height: 30, mb: 2 }}>
                        <CheckCircle sx={{ height: 20 }} />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ color: "#1976D2" }}>
                      {comparisonData.summary.overallCompletionRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box item sx={{
                flex: '1 1 calc(25% - 16px)', 
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Velocidad Promedio
                      </Typography>
                      <Avatar sx={{ bgcolor: "#FF9800", width: 35, height: 30, mb: 2 }}>
                        <Speed sx={{ height: 20 }} />
                      </Avatar>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: "#FF9800" }}>
                        {comparisonData.summary.averageVelocity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        puntos/día
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              <Box item sx={{
                flex: '1 1 calc(25% - 16px)', 
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Objetivo Promedio
                      </Typography>
                      <Avatar sx={{
                        bgcolor: comparisonData.summary.averageCompletion >= 80 ? customTheme.primary : "#FF9800",
                        width: 35,
                        height: 30,
                        mb: 2
                      }}>
                        <Assessment sx={{ height: 20 }} />
                      </Avatar>
                    </Box>

                    <Chip
                      label={`${comparisonData.summary.averageCompletion}%`}
                      color={comparisonData.summary.averageCompletion >= 80 ? "success" : "warning"}
                      sx={{
                        fontWeight: 700,
                        fontSize: "20px",
                        py: 2,
                        px: 1,
                        borderRadius:10
                      }}
                    />
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Segunda Fila: Gráficos Principales */}
            <Box container sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              width: '100%',
              mb: 4
            }}>
              {/* Gráfico de Comparativa de Puntos */}
              <Box sx={{
                flex: '1 1 calc(60%  - 12px)',
                minWidth: { xs: '100%', lg: 'calc(60% - 12px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" sx={{gap: 2}} justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h6" fontWeight="600" sx={{ color: '#5b5c5c' }}>
                        Comparativa de Puntos por Sprint:
                      </Typography>
                      <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={handleChartChange}
                        size="small"
                      >
                        <ToggleButton value="bar">
                          <BarChart sx={{ mr: 1 }} />
                          Barras
                        </ToggleButton>
                        <ToggleButton value="line">
                          <ShowChart sx={{ mr: 1 }} />
                          Líneas
                        </ToggleButton>
                        <ToggleButton value="area">
                          <PieChart sx={{ mr: 1 }} />
                          Área
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === "bar" ? (
                          <RechartsBarChart data={comparisonData.velocityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? '#444' : '#f0f0f0'} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="plannedPoints" fill="#1976d2" name="Puntos Planificados" />
                            <Bar dataKey="completedPoints" fill="#4CAF50" name="Puntos Completados" />
                          </RechartsBarChart>
                        ) : chartType === "line" ? (
                          <RechartsLineChart data={comparisonData.velocityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? '#444' : '#f0f0f0'} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="plannedPoints" stroke="#1976d2" name="Puntos Planificados" strokeWidth={2} />
                            <Line type="monotone" dataKey="completedPoints" stroke="#4CAF50" name="Puntos Completados" strokeWidth={2} />
                          </RechartsLineChart>
                        ) : (
                          <AreaChart data={comparisonData.velocityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? '#444' : '#f0f0f0'} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="plannedPoints" stackId="1" stroke="#1976d2" fill="#1976d2" name="Puntos Planificados" />
                            <Area type="monotone" dataKey="completedPoints" stackId="1" stroke="#4CAF50" fill="#4CAF50" name="Puntos Completados" />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Gráfico de Velocidad */}
              <Box sx={{
                flex: '1 1 calc(40% - 12px)',
                minWidth: { xs: '100%', lg: 'calc(40% - 12px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={3} sx={{ color: '#5b5c5c' }}>
                      Velocidad por Sprint
                    </Typography>

                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={comparisonData.velocityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? '#444' : '#f0f0f0'} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="velocityIdeal" fill="#FF9800" name="Velocidad Ideal" />
                          <Bar dataKey="velocityReal" fill="#4CAF50" name="Velocidad Real" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Tercera Fila: Rendimiento del Equipo y Tabla Resumen */}
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              width: '100%',
              mb: 3
            }}>
              {/* Rendimiento del Equipo */}
              <Box item sx={{
                flex: '1 1 calc(50% - 12px)',
                minWidth: { xs: '100%', lg: 'calc(50% - 12px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={3} sx={{ color: '#5b5c5c' }}>
                      Rendimiento del Equipo por Miembro
                    </Typography>

                    {Object.entries(teamPerformanceData).length > 0 ? (
                      <Box display="flex" flexDirection="column" gap={2}>
                        {Object.entries(teamPerformanceData).map(([memberName, performances]) => (
                          <Box key={memberName}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" fontWeight="600">
                                {memberName}
                              </Typography>
                              <Typography variant="body2" sx={{
                                color: performances[0]?.completionRate >= 80 ? customTheme.primary : "#ED6C02",
                                fontWeight: 600
                              }}>
                                {performances[0]?.completionRate || 0}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={performances[0]?.completionRate || 0}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: theme.palette.mode === 'dark' ? '#333' : "#e0e0e0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: (performances[0]?.completionRate || 0) >= 80 ? customTheme.primary : "#ED6C02",
                                }
                              }}
                            />
                            <Box display="flex" justifyContent="space-between" mt={0.5}>
                              <Typography variant="caption" color="text.secondary">
                                Último sprint: {performances[0]?.completed || 0} pts
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {performances.length} sprint(s)
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box textAlign="center" py={4}>
                        <Typography variant="body2" color="text.secondary">
                          No hay datos de rendimiento disponibles
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Tabla Resumen de Sprints */}
              <Box item sx={{
                flex: '1 1 calc(50% - 12px)',
                minWidth: { xs: '100%', lg: 'calc(50% - 12px)' }
              }}>
                <Card
                  elevation={0}
                  sx={{
                    background: customTheme.cardBg,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={2} sx={{ color: '#5b5c5c' }}>
                      Resumen por Sprint
                    </Typography>

                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Sprint</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Puntos</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Completado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Velocidad</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {comparisonData.velocityData.map((sprint) => (
                            <TableRow key={sprint.sprintId} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600" noWrap>
                                  {sprint.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(sprint.startDate).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600">
                                  {sprint.completedPoints}/{sprint.plannedPoints}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${sprint.completionRate}%`}
                                  size="small"
                                  sx={{
                                    backgroundColor: sprint.completionRate >= 80 ?
                                      (theme.palette.mode === 'dark' ? '#1B5E20' : "#E8F5E9") :
                                      (theme.palette.mode === 'dark' ? '#E65100' : "#FFF3E0"),
                                    color: sprint.completionRate >= 80 ?
                                      (theme.palette.mode === 'dark' ? '#81C784' : "#2E7D32") :
                                      (theme.palette.mode === 'dark' ? '#FFB74D' : "#ED6C02"),
                                    fontWeight: 600,
                                    minWidth: 60
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600">
                                  {sprint.velocityReal}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  pts/día
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}