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
  PieChart
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
} from "recharts";
import { useNavigate } from "react-router-dom";
import useSprintStore from "../store/SprintStore";
import { useTheme } from '@mui/material/styles';

const theme = {
  primary: "#4CAF50",
  primaryDark: "#45A049",
  primaryLight: "#81C784",
  background: "#e6f2ed",
  cardBg: "#ffffff",
  gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
};

export default function Results() {
  const navigate = useNavigate();
  const { sprints, isLoading, fetchSprints } = useSprintStore();
  
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [comments, setComments] = useState("");

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
      const completedSprints = sprints.filter(sprint => {
        const status = calculateSprintStatus(sprint);
        return status === "Completado" || status === "Completado Parcial";
      });

      if (completedSprints.length > 0) {
        const latestSprint = completedSprints.sort((a, b) => 
          new Date(b.endDate) - new Date(a.endDate)
        )[0];
        
        setSelectedSprint(latestSprint);
        calculateResults(latestSprint);
      }
    }
  }, [sprints]);

  const calculateSprintStatus = (sprint) => {
    const today = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    
    if (today < startDate) return "Planificado";
    if (today >= startDate && today <= endDate) return "Activo";
    
    const plannedPoints = sprint.plannedTotalPoints || 0;
    const completedPoints = sprint.completedPoints || 0;
    
    if (plannedPoints > 0 && completedPoints < plannedPoints) {
      return "Completado Parcial";
    }
    return "Completado";
  };

  const calculateResults = (sprint) => {
    if (!sprint) return;

    const plannedPoints = sprint.plannedTotalPoints || 0;
    const completedPoints = sprint.completedPoints || 0;
    const completionRate = plannedPoints > 0 ? Math.round((completedPoints / plannedPoints) * 100) : 0;
    const objectiveAchieved = completionRate >= 80;
    const duration = calculateDuration(sprint.startDate, sprint.endDate);
    const velocityIdeal = duration > 0 ? (plannedPoints / duration).toFixed(1) : 0;
    const velocityReal = duration > 0 ? (completedPoints / duration).toFixed(1) : 0;

    const pointsDistribution = calculatePointsDistribution(sprint);
    const teamPerformance = calculateTeamPerformance(sprint);

    setResultsData({
      sprint: sprint,
      plannedPoints,
      completedPoints,
      completionRate,
      objectiveAchieved,
      pointsDistribution,
      teamPerformance,
      velocityIdeal,
      velocityReal,
      duration,
      status: calculateSprintStatus(sprint)
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const calculatePointsDistribution = (sprint) => {
    const fibonacciPoints = [0.5, 1, 2, 3, 5, 8, 13, 21];
    const distribution = [];

    if (sprint.plannedStories) {
      sprint.plannedStories.forEach(story => {
        distribution.push({
          points: story.score,
          planned: story.quantity,
          completed: Math.floor(story.quantity * 0.8),
          plannedPoints: story.score * story.quantity,
          completedPoints: Math.floor(story.score * story.quantity * 0.8)
        });
      });
    }

    fibonacciPoints.forEach(point => {
      if (!distribution.find(item => item.points === point)) {
        distribution.push({
          points: point,
          planned: 0,
          completed: 0,
          plannedPoints: 0,
          completedPoints: 0
        });
      }
    });

    return distribution.sort((a, b) => a.points - b.points);
  };

  const calculateTeamPerformance = (sprint) => {
    if (!sprint.usersAssigned) return [];
    
    return sprint.usersAssigned.map((member, index) => {
      const completedPoints = Math.floor((sprint.completedPoints || 0) / sprint.usersAssigned.length);
      const plannedPoints = Math.floor((sprint.plannedTotalPoints || 0) / sprint.usersAssigned.length);
      const completionRate = plannedPoints > 0 ? Math.round((completedPoints / plannedPoints) * 100) : 0;
      
      return {
        name: member.userId?.name || `Miembro ${index + 1}`,
        planned: plannedPoints,
        completed: completedPoints,
        completionRate: completionRate
      };
    });
  };

  const handleBack = () => navigate("/admin-dashboard");
  const handleSprintChange = (sprint) => {
    setSelectedSprint(sprint);
    calculateResults(sprint);
  };
  const handleChartChange = (event, newType) => {
    if (newType) setChartType(newType);
  };

  // Datos para gráficos
  const getChartData = () => {
    if (!resultsData) return [];
    return [
      { name: "Planificado", value: resultsData.plannedPoints },
      { name: "Completado", value: resultsData.completedPoints },
    ];
  };

  const colors = ["#1976d2", "#4CAF50", "#FF9800"];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: theme.background }}>
        <CircularProgress size={60} sx={{ color: theme.primary }} />
      </Box>
    );
  }

  const completedSprints = sprints ? sprints.filter(sprint => {
    const status = calculateSprintStatus(sprint);
    return status === "Completado" || status === "Completado Parcial";
  }) : [];

  if (completedSprints.length === 0) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        backgroundColor: theme.background,
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
                borderColor: theme.primary,
                color: theme.primary,
              }}
            >
              Volver al Dashboard
            </Button>
            <Typography variant="h4" fontWeight="700" sx={{ color: theme.primary }}>
              Resultados del Sprint
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
      backgroundColor: theme.background,
      width: "100vw",
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
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            border: `1px solid #e0e0e0`,
            maxWidth: 1400,
            mx: "auto"
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
                }}
              >
                Volver al Dashboard
              </Button>
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: theme.primary }}>
                  📊 Resultados del Sprint
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comparativa de puntos planificados vs completados
                </Typography>
              </Box>
            </Box>

            {/* Selector de Sprint */}
            <Box sx={{ minWidth: 280 }}>
              <Typography variant="body2" fontWeight="600" mb={1}>
                Seleccionar Sprint:
              </Typography>
              <select 
                value={selectedSprint?._id || ""}
                onChange={(e) => {
                  const sprint = completedSprints.find(s => s._id === e.target.value);
                  if (sprint) handleSprintChange(sprint);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  fontWeight: "500"
                }}
              >
                {completedSprints.map(sprint => (
                  <option key={sprint._id} value={sprint._id}>
                    {sprint.name} ({new Date(sprint.endDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </Box>
          </Box>
        </Box>

        {resultsData && (
          <Box sx={{ maxWidth: 1400, mx: "auto" }}>
            {/* Métricas Principales */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
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
                  <CardContent sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Avatar sx={{ bgcolor: theme.primary, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Puntos Planificados
                    </Typography>
                    <Typography variant="h3" fontWeight="700" sx={{ color: theme.primary }}>
                      {resultsData.plannedPoints}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
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
                  <CardContent sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Avatar sx={{ bgcolor: "#1976D2", width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      <CheckCircle />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Puntos Completados
                    </Typography>
                    <Typography variant="h3" fontWeight="700" sx={{ color: "#1976D2" }}>
                      {resultsData.completedPoints}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
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
                  <CardContent sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Avatar sx={{ bgcolor: "#FF9800", width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      <Analytics />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Velocidad (ideal / real)
                    </Typography>
                    <Typography variant="h4" fontWeight="700" sx={{ color: "#FF9800" }}>
                      {resultsData.velocityIdeal} / {resultsData.velocityReal}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      puntos/día
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
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
                  <CardContent sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Avatar sx={{ 
                      bgcolor: resultsData.objectiveAchieved ? theme.primary : "#FF9800", 
                      width: 56, 
                      height: 56, 
                      mx: 'auto', 
                      mb: 2 
                    }}>
                      <Assessment />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Objetivo
                    </Typography>
                    <Chip
                      label={resultsData.objectiveAchieved ? "LOGRADO ✅" : "PENDIENTE ⚠️"}
                      color={resultsData.objectiveAchieved ? "success" : "warning"}
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: "1rem", 
                        py: 1.5,
                        px: 2,
                        backgroundColor: resultsData.objectiveAchieved ? theme.primary : "#FF9800",
                        color: "white"
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {resultsData.completionRate}% de 80% requerido
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Contenido Principal con Gráficos */}
            <Grid container spacing={3}>
              {/* Columna Izquierda: Tabla y Gráficos */}
              <Grid item xs={12} lg={8}>
                {/* Selector de Gráficos */}
                <Card
                  elevation={0}
                  sx={{
                    background: theme.cardBg,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid #e0e0e0`,
                    mb: 3
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight="600" sx={{ color: theme.primary }}>
                        📈 Visualización de Resultados
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
                        <ToggleButton value="pie">
                          <PieChart sx={{ mr: 1 }} />
                          Tarta
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </CardContent>
                </Card>

                {/* Gráfico Dinámico */}
                <Card
                  elevation={0}
                  sx={{
                    background: theme.cardBg,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid #e0e0e0`,
                    mb: 3,
                    height: 320
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "bar" && (
                        <RechartsBarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill={theme.primary} />
                        </RechartsBarChart>
                      )}
                      {chartType === "line" && (
                        <RechartsLineChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke={theme.primary} strokeWidth={2} />
                        </RechartsLineChart>
                      )}
                      {chartType === "pie" && (
                        <RechartsPieChart>
                          <Pie
                            data={getChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      )}
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Tabla de Comparativa */}
                <Card
                  elevation={0}
                  sx={{
                    background: theme.cardBg,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid #e0e0e0`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={3} sx={{ color: theme.primary }}>
                      📋 Comparativa de Puntos por Tamaño de Historia
                    </Typography>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                            <TableCell sx={{ fontWeight: 700 }}>Puntos</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Planificado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Completado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>% Completado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Estado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {resultsData.pointsDistribution.map((item, index) => {
                            const itemCompletion = item.plannedPoints > 0 ? 
                              Math.round((item.completedPoints / item.plannedPoints) * 100) : 0;
                            
                            return (
                              <TableRow key={index} hover>
                                <TableCell>
                                  <Chip 
                                    label={`${item.points} pts`} 
                                    size="small"
                                    sx={{ 
                                      backgroundColor: "#E8F5E9", 
                                      color: theme.primary, 
                                      fontWeight: 600 
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <Typography fontWeight="700">
                                    {item.planned} historias
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.plannedPoints} pts
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography fontWeight="700">
                                    {item.completed} historias
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.completedPoints} pts
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography fontWeight="700" sx={{ 
                                    color: itemCompletion >= 80 ? theme.primary : "#ED6C02" 
                                  }}>
                                    {itemCompletion}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={itemCompletion >= 80 ? "Cumplido" : "Pendiente"}
                                    size="small"
                                    sx={{
                                      backgroundColor: itemCompletion >= 80 ? "#E8F5E9" : "#FFF3E0",
                                      color: itemCompletion >= 80 ? theme.primary : "#ED6C02",
                                      fontWeight: 600
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Columna Derecha: Información Adicional */}
              <Grid item xs={12} lg={4}>
                {/* Información del Sprint */}
                <Card
                  elevation={0}
                  sx={{
                    background: theme.cardBg,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid #e0e0e0`,
                    mb: 3
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={3} sx={{ color: theme.primary }}>
                      ℹ️ Información del Sprint
                    </Typography>
                    
                    <Box sx={{ mb: 2, p: 2, backgroundColor: "#F8F9FA", borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight="600" color={theme.primary}>
                        {resultsData.sprint.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(resultsData.sprint.startDate).toLocaleDateString()} - {" "}
                        {new Date(resultsData.sprint.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">Estado:</Typography>
                      <Chip 
                        label={resultsData.status} 
                        size="small"
                        sx={{
                          backgroundColor: 
                            resultsData.status === "Completado" ? "#E8F5E9" : 
                            resultsData.status === "Completado Parcial" ? "#FFF3E0" : "#F5F5F5",
                          color: 
                            resultsData.status === "Completado" ? theme.primary : 
                            resultsData.status === "Completado Parcial" ? "#ED6C02" : "#666",
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary" mb={1} fontWeight="600">
                      Observaciones:
                    </Typography>
                    <Box sx={{ p: 2, backgroundColor: "#F8F9FA", borderRadius: 1, minHeight: 80 }}>
                      <Typography variant="body2" sx={{ fontStyle: resultsData.sprint.observations ? "normal" : "italic" }}>
                        {resultsData.sprint.observations || "No hay observaciones registradas"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Rendimiento del Equipo */}
                <Card
                  elevation={0}
                  sx={{
                    background: theme.cardBg,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid #e0e0e0`,
                    mb: 3
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={3} sx={{ color: theme.primary }}>
                      👥 Rendimiento del Equipo
                    </Typography>
                    {resultsData.teamPerformance.map((member) => (
                      <Box key={member.name} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight="600">
                            {member.name}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: member.completionRate >= 80 ? theme.primary : "#ED6C02",
                            fontWeight: 600
                          }}>
                            {member.completionRate}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={member.completionRate}
                          color={member.completionRate >= 80 ? "success" : "warning"}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: member.completionRate >= 80 ? theme.primary : "#ED6C02",
                            }
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {member.completed}/{member.planned} pts
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Comentarios del Scrum Master */}
                <Card
                  elevation={0}
                  sx={{
                    background: theme.cardBg,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid #e0e0e0`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={2} sx={{ color: theme.primary }}>
                      💬 Observaciones del Scrum Master
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Añade observaciones o aprendizajes del sprint..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" fullWidth sx={{ background: theme.gradient }}>
                      Guardar observaciones
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}