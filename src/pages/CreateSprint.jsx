import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import useSprintStore from "../store/SprintStore";

// Tema verde menta profesional (IGUAL que AdminDashboard)
const theme = {
  primary: "#4CAF50",
  primaryDark: "#45A049",
  primaryLight: "#81C784",
  background: "#e6f2ed",
  cardBg: "#ffffff",
  gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
  gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
};

// Escala Fibonacci con ponderaciones
const FIBONACCI_SCALE = [
  { points: 0.5, weight: 1.0 },
  { points: 1, weight: 1.1 },
  { points: 2, weight: 1.2 },
  { points: 3, weight: 1.3 },
  { points: 5, weight: 1.5 },
  { points: 8, weight: 1.8 },
  { points: 13, weight: 2.1 },
  { points: 21, weight: 2.5 },
];

export default function CreateSprint() {
  const navigate = useNavigate();
  const { createSprint } = useSprintStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [sprintData, setSprintData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    observations: "",
  });

  const [storyPoints, setStoryPoints] = useState({
    0.5: 0, 1: 0, 2: 0, 3: 0, 5: 0, 8: 0, 13: 0, 21: 0,
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userHours, setUserHours] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await UserService.getAll();
        setAvailableUsers(users);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError("No se pudieron cargar los usuarios disponibles");
      }
    };
    fetchUsers();
  }, []);

  const getSprintDuration = () => {
    if (!sprintData.startDate || !sprintData.endDate) return 0;
    const start = new Date(sprintData.startDate);
    const end = new Date(sprintData.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const calculateIdealVelocity = () => {
    return FIBONACCI_SCALE.reduce((total, fib) => {
      const count = storyPoints[fib.points] || 0;
      return total + (fib.points * count * fib.weight);
    }, 0);
  };

  const calculateTotalPoints = () => {
    return FIBONACCI_SCALE.reduce((total, fib) => {
      const count = storyPoints[fib.points] || 0;
      return total + (fib.points * count);
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSprintData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoryPointChange = (points, value) => {
    setStoryPoints((prev) => ({
      ...prev,
      [points]: parseInt(value) || 0,
    }));
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        const newSelected = prev.filter((id) => id !== userId);
        const newHours = { ...userHours };
        delete newHours[userId];
        setUserHours(newHours);
        return newSelected;
      } else {
        setUserHours((h) => ({ ...h, [userId]: 40 }));
        return [...prev, userId];
      }
    });
  };

  const handleHoursChange = (userId, hours) => {
    setUserHours((prev) => ({ ...prev, [userId]: parseInt(hours) || 0 }));
  };

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const handleSaveSprint = async () => {
    if (!sprintData.name || !sprintData.startDate || !sprintData.endDate) {
      setError("Completa los campos obligatorios: nombre y fechas");
      return;
    }

    if (new Date(sprintData.startDate) >= new Date(sprintData.endDate)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Debes seleccionar al menos un miembro del equipo");
      return;
    }

    if (calculateTotalPoints() === 0) {
      setError("Debes planificar al menos una historia con puntuación");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const plannedStories = FIBONACCI_SCALE
        .filter((fib) => storyPoints[fib.points] > 0)
        .map((fib) => ({
          score: fib.points,
          quantity: storyPoints[fib.points],
        }));

      const usersAssigned = selectedUsers.map((userId) => ({
        userId,
        hours: userHours[userId] || 0,
      }));

      const payload = {
        name: sprintData.name,
        startDate: sprintData.startDate,
        endDate: sprintData.endDate,
        status: "Planificado",
        observations: sprintData.observations,
        plannedStories,
        usersAssigned,
      };

      console.log("📤 Enviando sprint:", payload);

      await createSprint(payload);
      setSuccess("¡Sprint creado exitosamente!");
      
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(`Error: ${err.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = calculateTotalPoints();
  const idealVelocity = calculateIdealVelocity();
  const duration = getSprintDuration();

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
        <Box sx={{
          background: theme.cardBg,
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button
              startIcon={<ArrowBack />}
              variant="outlined"
              onClick={handleBack}
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
              Volver
            </Button>
            <Box>
              <Typography variant="h4" fontWeight="700" sx={{ color: theme.primary }}>
                Crear Nuevo Sprint
              </Typography>
              <Typography color="text.secondary">
                Planifica el sprint y asigna el equipo
              </Typography>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
          {/* Información Básica */}
          <Card elevation={0} sx={{ mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <CardHeader
              title="Información del Sprint"
              subheader="Datos generales del sprint"
              sx={{ "& .MuiCardHeader-title": { color: theme.primary, fontWeight: 700 } }}
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Nombre del Sprint"
                  name="name"
                  value={sprintData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Sprint Q1 2025"
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: theme.primary },
                      "&.Mui-focused fieldset": { borderColor: theme.primary },
                    }
                  }}
                />
                <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
                  <TextField
                    label="Fecha de Inicio"
                    name="startDate"
                    type="date"
                    value={sprintData.startDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: theme.primary },
                        "&.Mui-focused fieldset": { borderColor: theme.primary },
                      }
                    }}
                  />
                  <TextField
                    label="Fecha de Fin"
                    name="endDate"
                    type="date"
                    value={sprintData.endDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: theme.primary },
                        "&.Mui-focused fieldset": { borderColor: theme.primary },
                      }
                    }}
                  />
                </Box>
                {duration > 0 && (
                  <Alert severity="info" sx={{ backgroundColor: "#E8F5E9" }}>
                    <strong>Duración del sprint:</strong> {duration} días
                  </Alert>
                )}
                <TextField
                  label="Observaciones"
                  name="observations"
                  multiline
                  minRows={3}
                  value={sprintData.observations}
                  onChange={handleInputChange}
                  placeholder="Notas o comentarios sobre el sprint..."
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: theme.primary },
                      "&.Mui-focused fieldset": { borderColor: theme.primary },
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Historias Planificadas */}
          <Card elevation={0} sx={{ mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <CardHeader
              title="Historias Planificadas"
              subheader="Indica la cantidad de historias para cada puntuación Fibonacci"
              sx={{ "& .MuiCardHeader-title": { color: theme.primary, fontWeight: 700 } }}
            />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Puntuación</TableCell>
                      {FIBONACCI_SCALE.map((fib) => (
                        <TableCell key={fib.points} align="center">
                          <Chip 
                            label={fib.points} 
                            size="small"
                            sx={{ 
                              backgroundColor: theme.primary, 
                              color: "white", 
                              fontWeight: 600 
                            }} 
                          />
                        </TableCell>
                      ))}
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500 }}>Nº Historias</TableCell>
                      {FIBONACCI_SCALE.map((fib) => (
                        <TableCell key={fib.points} align="center">
                          <TextField
                            type="number"
                            inputProps={{ min: 0, style: { textAlign: "center" } }}
                            value={storyPoints[fib.points]}
                            onChange={(e) => handleStoryPointChange(fib.points, e.target.value)}
                            sx={{ width: 70 }}
                          />
                        </TableCell>
                      ))}
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: 16 }}>
                        {FIBONACCI_SCALE.reduce((sum, fib) => sum + (storyPoints[fib.points] || 0), 0)}
                      </TableCell>
                    </TableRow>

                    <TableRow sx={{ backgroundColor: "#F1F8E9" }}>
                      <TableCell sx={{ fontWeight: 500 }}>Ponderado</TableCell>
                      {FIBONACCI_SCALE.map((fib) => (
                        <TableCell key={fib.points} align="center" sx={{ color: "text.secondary" }}>
                          {fib.weight.toFixed(1)}
                        </TableCell>
                      ))}
                      <TableCell />
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ fontWeight: 500 }}>Subtotal Puntos</TableCell>
                      {FIBONACCI_SCALE.map((fib) => {
                        const count = storyPoints[fib.points] || 0;
                        const subtotal = fib.points * count;
                        return (
                          <TableCell key={fib.points} align="center" sx={{ fontWeight: 600 }}>
                            {subtotal.toFixed(1)}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: 16, color: theme.primary }}>
                        {totalPoints.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={3} display="flex" gap={3} flexDirection={{ xs: "column", sm: "row" }}>
                <Alert severity="success" sx={{ flex: 1, backgroundColor: "#E8F5E9" }}>
                  <Typography variant="body2">
                    <strong>Total Puntos Planificados:</strong> {totalPoints.toFixed(1)} puntos
                  </Typography>
                </Alert>
                <Alert severity="info" sx={{ flex: 1, backgroundColor: "#E3F2FD" }}>
                  <Typography variant="body2">
                    <strong>Velocidad Ideal (ponderada):</strong> {idealVelocity.toFixed(2)}
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>

          {/* Equipo Asignado */}
          <Card elevation={0} sx={{ mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <CardHeader
              title="Equipo Asignado"
              subheader="Selecciona los miembros del equipo y sus horas dedicadas"
              sx={{ "& .MuiCardHeader-title": { color: theme.primary, fontWeight: 700 } }}
            />
            <CardContent>
              {availableUsers.length === 0 ? (
                <Box display="flex" justifyContent="center" py={3}>
                  <CircularProgress sx={{ color: theme.primary }} />
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {availableUsers.map((user) => {
                    const isSelected = selectedUsers.includes(user._id);
                    return (
                      <Box
                        key={user._id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={2}
                        border="1px solid #ddd"
                        borderRadius={2}
                        sx={{
                          backgroundColor: isSelected ? "#F1F8E9" : "white",
                          transition: "all 0.2s",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleUserToggle(user._id)}
                              sx={{
                                color: theme.primary,
                                "&.Mui-checked": { color: theme.primary },
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography fontWeight="500">{user.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.email} • {user.role}
                              </Typography>
                            </Box>
                          }
                        />
                        {isSelected && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2">Horas:</Typography>
                            <TextField
                              type="number"
                              inputProps={{ min: 0, max: 80 }}
                              value={userHours[user._id] || 40}
                              onChange={(e) => handleHoursChange(user._id, e.target.value)}
                              sx={{ width: 80 }}
                            />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}

              {selectedUsers.length > 0 && (
                <Alert severity="info" sx={{ mt: 2, backgroundColor: "#E8F5E9" }}>
                  <Typography variant="body2">
                    <strong>Equipo seleccionado:</strong> {selectedUsers.length} miembros •{" "}
                    <strong>Total horas:</strong>{" "}
                    {Object.values(userHours).reduce((sum, h) => sum + h, 0)} horas
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Botones */}
          <Box display="flex" justifyContent="space-between" gap={2}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={loading}
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
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
              onClick={handleSaveSprint}
              disabled={loading}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                background: theme.gradient,
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.25)",
                "&:hover": {
                  background: theme.gradientAlt,
                  boxShadow: "0 6px 16px rgba(76, 175, 80, 0.35)",
                }
              }}
            >
              {loading ? "Guardando..." : "Crear Sprint"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}