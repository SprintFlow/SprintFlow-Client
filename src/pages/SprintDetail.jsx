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
  Paper,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Group,
  Assessment,
  TrendingUp,
  Edit,
  Delete,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useSprintStore from "../store/SprintStore";

export default function SprintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sprints, isLoading } = useSprintStore();
  
  const [sprint, setSprint] = useState(null);

  useEffect(() => {
    const foundSprint = sprints.find((s) => s._id === id);
    setSprint(foundSprint);
  }, [id, sprints]);

  const handleBack = () => {
    navigate("/admin-dashboard");
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
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const getDaysElapsed = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diff = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
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

  if (isLoading || !sprint) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const duration = calculateDuration(sprint.startDate, sprint.endDate);
  const daysElapsed = getDaysElapsed(sprint.startDate);
  const daysRemaining = getDaysRemaining(sprint.endDate);
  const progress = sprint.status === "Activo" ? (daysElapsed / duration) * 100 : sprint.status === "Completado" ? 100 : 0;

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
            <Box display="flex" alignItems="center" gap={2}>
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
                <Typography variant="h4" fontWeight="800">
                  {sprint.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detalle completo del sprint
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <Chip
                label={sprint.status}
                color={getStatusColor(sprint.status)}
                sx={{ fontWeight: 700, px: 2, py: 2.5, fontSize: "0.875rem" }}
              />
              <Button
                startIcon={<Edit />}
                variant="outlined"
                sx={{ textTransform: "none" }}
              >
                Editar
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
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="700" mb={3}>
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
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
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
                    <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" color="primary">
                        {duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Totales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" color="success.main">
                        {daysElapsed}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Transcurridos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" color="warning.main">
                        {daysRemaining}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Días Restantes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="700" color="info.main">
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
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="700" mb={3}>
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
                            <Chip label={`${story.score} pts`} color="primary" size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6" fontWeight="600">
                              {story.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" fontWeight="700" color="primary">
                              {(story.score * story.quantity).toFixed(1)} pts
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                          TOTAL
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h5" fontWeight="800" color="primary">
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
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3}>
                  ℹ️ Información General
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
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
                  <Avatar sx={{ bgcolor: "error.main" }}>
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
                  <Avatar sx={{ bgcolor: "success.main" }}>
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
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" mb={3}>
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
                      sx={{ background: "#f5f5f5", borderRadius: 2 }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
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
                      <Chip label={`${member.hours}h`} size="small" color="primary" />
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight="600">
                    Total de Horas
                  </Typography>
                  <Typography variant="h5" fontWeight="700" color="primary">
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
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="700" mb={2}>
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
    </Box>
  );
}