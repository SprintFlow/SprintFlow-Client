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
} from "@mui/material";
import {
  Add as AddIcon,
  TrendingUp,
  CheckCircle,
  Schedule,
  Group,
  CalendarToday,
  Assessment,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useSprintStore from "../store/SprintStore";
import useAuthStore from "../store/authStore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { sprints, isLoading, error, fetchSprints } = useSprintStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    fetchSprints();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateSprint = () => {
    navigate("/create-sprint");
  };

  const handleViewSprint = (sprintId) => {
    navigate(`/sprint-detail/${sprintId}`);
  };

  // Filtrar sprints por estado
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
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", py: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
        {/* Header */}
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="800" sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Dashboard de Administrador
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={0.5}>
                Bienvenido de nuevo, {user?.name || "Admin"} 👋
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateSprint}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    boxShadow: "0 6px 30px rgba(102, 126, 234, 0.6)",
                  },
                }}
              >
                Crear Nuevo Sprint
              </Button>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        {/* Métricas principales */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {activeSprints.length}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Sprint Activo
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {activeSprint ? activeSprint.name : "Ninguno activo"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                    <CheckCircle />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {completedSprints.length}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Completados
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Este año
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                    <Schedule />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {plannedSprints.length}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Planificados
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Próximos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                    <Group />
                  </Avatar>
                  <Typography variant="h3" fontWeight="700">
                    {activeSprint ? activeSprint.usersAssigned?.length || 0 : 0}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Equipo Total
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
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
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              mb: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5" fontWeight="700" gutterBottom>
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h4" fontWeight="700">
                    {activeSprint.name}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleViewSprint(activeSprint._id)}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Ver Detalle Completo
                  </Button>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${calculateDuration(activeSprint.startDate, activeSprint.endDate)} días totales`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${getDaysRemaining(activeSprint.endDate)} días restantes`}
                    size="small"
                    color="warning"
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
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" mt={0.5}>
                  0% completado
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                    <Assessment sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">{activeSprint.plannedTotalPoints}</Typography>
                    <Typography variant="caption" color="text.secondary">Puntos Planificados</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                    <Group sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">{activeSprint.usersAssigned?.length || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Miembros del Equipo</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                    <Schedule sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">
                      {activeSprint.plannedStories?.reduce((sum, story) => sum + story.quantity, 0) || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Historias Planificadas</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                    <CalendarToday sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
                    <Typography variant="h4" fontWeight="700">{getDaysRemaining(activeSprint.endDate)}</Typography>
                    <Typography variant="caption" color="text.secondary">Días Restantes</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Lista de Todos los Sprints */}
        <Card
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="700" mb={3}>
              📋 Todos los Sprints
            </Typography>

            {sprints.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary" mb={3}>
                  No hay sprints creados todavía
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleCreateSprint}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                  }}
                >
                  Crear tu Primer Sprint
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {sprints.map((sprint) => (
                  <Grid item xs={12} key={sprint._id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        cursor: "pointer",
                        border: "2px solid transparent",
                        borderRadius: 2,
                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: "#667eea",
                          transform: "translateX(5px)",
                          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.2)",
                        },
                      }}
                      onClick={() => handleViewSprint(sprint._id)}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="700" gutterBottom>
                            {sprint.name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                            <Typography variant="body2" color="text.secondary">
                              📅 {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                            </Typography>
                            <Chip label={`${sprint.plannedTotalPoints} pts`} size="small" color="primary" variant="outlined" />
                            <Chip
                              label={`${sprint.usersAssigned?.length || 0} miembros`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        <Chip
                          label={sprint.status}
                          color={getStatusColor(sprint.status)}
                          sx={{ fontWeight: 600, ml: 2 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}