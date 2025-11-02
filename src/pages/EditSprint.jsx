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
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import useSprintStore from "../store/SprintStore";

// Tema verde menta profesional
const theme = {
  primary: "#4CAF50",
  primaryDark: "#45A049",
  primaryLight: "#81C784",
  background: "#e6f2ed",
  cardBg: "#ffffff",
  gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
  gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
};

// Escala Fibonacci
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

export default function EditSprint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSprint, fetchSprintById, updateSprint } = useSprintStore();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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

  // Cargar datos del sprint
  useEffect(() => {
    const loadSprint = async () => {
      try {
        setLoadingData(true);
        await fetchSprintById(id);
      } catch (err) {
        setError("No se pudo cargar el sprint");
      } finally {
        setLoadingData(false);
      }
    };
    loadSprint();
  }, [id, fetchSprintById]);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await UserService.getAll();
        setAvailableUsers(users);
      } catch (err) {
        setError("No se pudieron cargar los usuarios");
      }
    };
    fetchUsers();
  }, []);

  // Llenar formulario con datos del sprint
  useEffect(() => {
    if (currentSprint) {
      setSprintData({
        name: currentSprint.name || "",
        startDate: currentSprint.startDate?.split('T')[0] || "",
        endDate: currentSprint.endDate?.split('T')[0] || "",
        observations: currentSprint.observations || "",
      });

      // Story points
      const newStoryPoints = { 0.5: 0, 1: 0, 2: 0, 3: 0, 5: 0, 8: 0, 13: 0, 21: 0 };
      if (currentSprint.plannedStories) {
        currentSprint.plannedStories.forEach((story) => {
          newStoryPoints[story.score] = story.quantity;
        });
      }
      setStoryPoints(newStoryPoints);

      // Usuarios
      if (currentSprint.usersAssigned) {
        const userIds = currentSprint.usersAssigned.map((u) => u.userId._id || u.userId);
        const hours = {};
        currentSprint.usersAssigned.forEach((u) => {
          const userId = u.userId._id || u.userId;
          hours[userId] = u.hours;
        });
        setSelectedUsers(userIds);
        setUserHours(hours);
      }
    }
  }, [currentSprint]);

  const calculateTotalPoints = () => {
    return FIBONACCI_SCALE.reduce((total, fib) => {
      return total + (fib.points * (storyPoints[fib.points] || 0));
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
    navigate(`/sprint-detail/${id}`);
  };

  const handleSave = async () => {
    if (!sprintData.name || !sprintData.startDate || !sprintData.endDate) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Selecciona al menos un miembro del equipo");
      return;
    }

    if (calculateTotalPoints() === 0) {
      setError("Planifica al menos una historia");
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
        ...sprintData,
        status: currentSprint.status,
        plannedStories,
        usersAssigned,
      };

      console.log("📤 Actualizando sprint:", payload);
      await updateSprint(id, payload);
      
      setSuccess("¡Sprint actualizado exitosamente!");
      setTimeout(() => {
        navigate(`/sprint-detail/${id}`);
      }, 1500);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al actualizar sprint");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: theme.background }}>
        <CircularProgress size={60} sx={{ color: theme.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.background, py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ background: theme.cardBg, borderRadius: 3, p: 3, mb: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
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
              "&:hover": { borderColor: theme.primaryDark, backgroundColor: "rgba(76, 175, 80, 0.04)" },
            }}
          >
            Volver
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="700" sx={{ color: theme.primary }}>
              Editar Sprint
            </Typography>
            <Typography color="text.secondary">
              Modifica los datos del sprint
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        {/* Información Básica */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <CardHeader
            title="Información del Sprint"
            subheader="Datos generales"
            sx={{ "& .MuiCardHeader-title": { color: theme.primary, fontWeight: 700 } }}
          />
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nombre del Sprint"
                name="name"
                value={sprintData.name}
                onChange={handleInputChange}
                required
                fullWidth
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
              <TextField
                label="Observaciones"
                name="observations"
                multiline
                minRows={3}
                value={sprintData.observations}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
          </CardContent>
        </Card>

        {/* Historias Planificadas */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <CardHeader
            title="Historias Planificadas"
            subheader="Cantidad por puntuación Fibonacci"
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
                        <Chip label={fib.points} size="small" sx={{ backgroundColor: theme.primary, color: "white", fontWeight: 600 }} />
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
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Subtotal</TableCell>
                    {FIBONACCI_SCALE.map((fib) => {
                      const subtotal = fib.points * (storyPoints[fib.points] || 0);
                      return (
                        <TableCell key={fib.points} align="center" sx={{ fontWeight: 600 }}>
                          {subtotal.toFixed(1)}
                        </TableCell>
                      );
                    })}
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: 16, color: theme.primary }}>
                      {calculateTotalPoints().toFixed(1)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Equipo */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <CardHeader
            title="Equipo Asignado"
            subheader="Miembros y horas dedicadas"
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
                      sx={{ backgroundColor: isSelected ? "#F1F8E9" : "white" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleUserToggle(user._id)}
                            sx={{ color: theme.primary, "&.Mui-checked": { color: theme.primary } }}
                          />
                        }
                        label={
                          <Box>
                            <Typography fontWeight="500">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
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
              "&:hover": { borderColor: theme.primaryDark, backgroundColor: "rgba(76, 175, 80, 0.04)" },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
            onClick={handleSave}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              background: theme.gradient,
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.25)",
              "&:hover": { background: theme.gradientAlt, boxShadow: "0 6px 16px rgba(76, 175, 80, 0.35)" },
            }}
          >
            {loading ? "Guardando..." : "Actualizar Sprint"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}