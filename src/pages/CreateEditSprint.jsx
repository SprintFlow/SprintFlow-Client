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
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import useSprintStore from "../store/SprintStore";

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

  // Estados principales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Datos del sprint
  const [sprintData, setSprintData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    observations: "",
  });

  // Puntuaciones planificadas (cantidad por cada valor Fibonacci)
  const [storyPoints, setStoryPoints] = useState({
    0.5: 0,
    1: 0,
    2: 0,
    3: 0,
    5: 0,
    8: 0,
    13: 0,
    21: 0,
  });

  // Equipo asignado
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userHours, setUserHours] = useState({});

  // Cargar usuarios disponibles
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

  // Calcular duración del sprint en días
  const getSprintDuration = () => {
    if (!sprintData.startDate || !sprintData.endDate) return 0;
    const start = new Date(sprintData.startDate);
    const end = new Date(sprintData.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1; // Incluir día final
  };

  // Calcular velocidad ideal (con ponderación)
  const calculateIdealVelocity = () => {
    return FIBONACCI_SCALE.reduce((total, fib) => {
      const count = storyPoints[fib.points] || 0;
      return total + (fib.points * count * fib.weight);
    }, 0);
  };

  // Calcular total de puntos planificados (sin ponderación)
  const calculateTotalPoints = () => {
    return FIBONACCI_SCALE.reduce((total, fib) => {
      const count = storyPoints[fib.points] || 0;
      return total + (fib.points * count);
    }, 0);
  };

  // Manejar cambio en campos básicos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSprintData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio en cantidad de historias
  const handleStoryPointChange = (points, value) => {
    setStoryPoints((prev) => ({
      ...prev,
      [points]: parseInt(value) || 0,
    }));
  };

  // Manejar selección de usuarios
  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        // Remover usuario
        const newSelected = prev.filter((id) => id !== userId);
        const newHours = { ...userHours };
        delete newHours[userId];
        setUserHours(newHours);
        return newSelected;
      } else {
        // Añadir usuario con horas por defecto
        setUserHours((h) => ({ ...h, [userId]: 40 }));
        return [...prev, userId];
      }
    });
  };

  // Manejar cambio de horas de usuario
  const handleHoursChange = (userId, hours) => {
    setUserHours((prev) => ({ ...prev, [userId]: parseInt(hours) || 0 }));
  };

  // Función para volver
  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  // Guardar sprint
  const handleSaveSprint = async () => {
    // Validaciones
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

      // Preparar plannedStories en el formato del backend
      const plannedStories = FIBONACCI_SCALE
        .filter((fib) => storyPoints[fib.points] > 0)
        .map((fib) => ({
          score: fib.points,
          quantity: storyPoints[fib.points],
        }));

      // Preparar usersAssigned
      const usersAssigned = selectedUsers.map((userId) => ({
        userId,
        hours: userHours[userId] || 0,
      }));

      // Crear payload
      const payload = {
        name: sprintData.name,
        startDate: sprintData.startDate,
        endDate: sprintData.endDate,
        status: "Planificado", // Siempre empieza como Planificado
        observations: sprintData.observations,
        plannedStories,
        usersAssigned,
      };

      console.log("📤 Enviando sprint:", payload);

      // Llamar al store para crear
      const result = await useSprintStore.getState().createSprint(payload);

      console.log("📥 Respuesta del servidor:", result);

      if (result && result.success) {
        setSuccess("¡Sprint creado exitosamente!");
        console.log("✅ Sprint guardado:", result.sprint);
        
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1500);
      } else {
        console.error("❌ Error al guardar sprint:", result);
        setError("Error al crear el sprint. Verifica la consola del servidor.");
      }
    } catch (err) {
      console.error("❌ Error capturado:", err);
      setError(`Error de conexión: ${err.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = calculateTotalPoints();
  const idealVelocity = calculateIdealVelocity();
  const duration = getSprintDuration();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 4,
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          variant="outlined"
          onClick={handleBack}
        >
          Volver
        </Button>
        <Box>
          <Typography variant="h5" fontWeight="600">
            Crear Nuevo Sprint
          </Typography>
          <Typography color="text.secondary">
            Planifica el sprint y asigna el equipo
          </Typography>
        </Box>
      </Box>

      {/* Mensajes */}
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
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Información del Sprint"
            subheader="Datos generales del sprint"
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
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Fecha de Inicio"
                  name="startDate"
                  type="date"
                  value={sprintData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
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
                />
              </Box>
              {duration > 0 && (
                <Alert severity="info">
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
              />
            </Box>
          </CardContent>
        </Card>

        {/* Planificación de Historias con Fibonacci */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Historias Planificadas"
            subheader="Indica la cantidad de historias para cada puntuación Fibonacci"
          />
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Puntuación</TableCell>
                    {FIBONACCI_SCALE.map((fib) => (
                      <TableCell key={fib.points} align="center">
                        <Chip label={fib.points} color="primary" size="small" />
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Fila de Cantidad */}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Nº Historias</TableCell>
                    {FIBONACCI_SCALE.map((fib) => (
                      <TableCell key={fib.points} align="center">
                        <TextField
                          type="number"
                          inputProps={{ min: 0, style: { textAlign: "center" } }}
                          value={storyPoints[fib.points]}
                          onChange={(e) =>
                            handleStoryPointChange(fib.points, e.target.value)
                          }
                          sx={{ width: 70 }}
                        />
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 16 }}>
                      {FIBONACCI_SCALE.reduce(
                        (sum, fib) => sum + (storyPoints[fib.points] || 0),
                        0
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Fila de Ponderado */}
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 500 }}>Ponderado</TableCell>
                    {FIBONACCI_SCALE.map((fib) => (
                      <TableCell key={fib.points} align="center" sx={{ color: "text.secondary" }}>
                        {fib.weight.toFixed(1)}
                      </TableCell>
                    ))}
                    <TableCell />
                  </TableRow>

                  {/* Fila de Subtotal */}
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
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 16, color: "primary.main" }}>
                      {totalPoints.toFixed(1)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={3} display="flex" gap={3}>
              <Alert severity="success" sx={{ flex: 1 }}>
                <Typography variant="body2">
                  <strong>Total Puntos Planificados:</strong> {totalPoints.toFixed(1)} puntos
                </Typography>
              </Alert>
              <Alert severity="info" sx={{ flex: 1 }}>
                <Typography variant="body2">
                  <strong>Velocidad Ideal (ponderada):</strong> {idealVelocity.toFixed(2)}
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>

        {/* Equipo Asignado */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Equipo Asignado"
            subheader="Selecciona los miembros del equipo y sus horas dedicadas"
          />
          <CardContent>
            {availableUsers.length === 0 ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress />
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
                        backgroundColor: isSelected ? "#f0f7ff" : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleUserToggle(user._id)}
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
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Equipo seleccionado:</strong> {selectedUsers.length} miembros •{" "}
                  <strong>Total horas:</strong>{" "}
                  {Object.values(userHours).reduce((sum, h) => sum + h, 0)} horas
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={handleBack} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
            onClick={handleSaveSprint}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Crear Sprint"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}