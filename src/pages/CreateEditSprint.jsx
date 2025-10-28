import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Divider,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import axios from "axios";

// 🧠 Simulación de usuarios del sistema (en un entorno real, los traerías del backend)
const availableUsers = [
  { id: "u1", name: "Ana García" },
  { id: "u2", name: "Carlos López" },
  { id: "u3", name: "María Rodríguez" },
  { id: "u4", name: "Juan Martínez" },
  { id: "u5", name: "Laura Fernández" },
];

export default function CreateEditSprint({ onBack }) {
  // 🧩 Estado base del formulario
  const [sprintData, setSprintData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "Planificado",
    observations: "",
    plannedStories: [],
    usersAssigned: [],
  });

  const [loading, setLoading] = useState(false);

  // 🪄 Función genérica para campos simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSprintData({ ...sprintData, [name]: value });
  };

  // 🏗️ Añadir historia planificada
  const addStory = () => {
    setSprintData((prev) => ({
      ...prev,
      plannedStories: [...prev.plannedStories, { score: 1, quantity: 1 }],
    }));
  };

  // 🧹 Eliminar historia
  const removeStory = (index) => {
    const updated = [...sprintData.plannedStories];
    updated.splice(index, 1);
    setSprintData({ ...sprintData, plannedStories: updated });
  };

  // 👥 Añadir miembro del equipo
  const addMember = () => {
    setSprintData((prev) => ({
      ...prev,
      usersAssigned: [...prev.usersAssigned, { userId: "", hours: 0 }],
    }));
  };

  // ❌ Eliminar miembro
  const removeMember = (index) => {
    const updated = [...sprintData.usersAssigned];
    updated.splice(index, 1);
    setSprintData({ ...sprintData, usersAssigned: updated });
  };

  // 🧮 Calcular total de puntos planificados
  const totalPoints = sprintData.plannedStories.reduce(
    (sum, s) => sum + s.score * s.quantity,
    0
  );

  // 💾 Enviar formulario al backend
  const handleSave = async () => {
    if (!sprintData.name || !sprintData.startDate || !sprintData.endDate) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/sprints", sprintData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Sprint guardado:", response.data);
      alert("✅ Sprint creado correctamente");
      onBack();
    } catch (error) {
      console.error("❌ Error al guardar el sprint:", error);
      alert("Error al guardar el sprint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <Button
        startIcon={<ArrowLeft />}
        onClick={onBack}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Card sx={{ maxWidth: 1100, mx: "auto" }}>
        <CardHeader
          title="Planificación del Sprint"
          subheader="Completa los datos para crear un nuevo sprint"
        />
        <Divider />

        <CardContent>
          {/* 🧾 Información básica */}
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Nombre del Sprint"
              value={sprintData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <Box display="flex" gap={2}>
              <TextField
                name="startDate"
                label="Fecha de inicio"
                type="date"
                value={sprintData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                name="endDate"
                label="Fecha de fin"
                type="date"
                value={sprintData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            <TextField
              name="status"
              label="Estado"
              select
              value={sprintData.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Planificado">Planificado</MenuItem>
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Completado">Completado</MenuItem>
            </TextField>

            <TextField
              name="observations"
              label="Observaciones"
              multiline
              minRows={3}
              value={sprintData.observations}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* 📊 Historias planificadas */}
          <Typography variant="h6" gutterBottom>
            Historias planificadas
          </Typography>

          <Button
            startIcon={<Plus />}
            variant="outlined"
            onClick={addStory}
            sx={{ mb: 2 }}
          >
            Añadir historia
          </Button>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Puntuación</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sprintData.plannedStories.map((story, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      type="number"
                      inputProps={{ min: 0.5, step: 0.5 }}
                      value={story.score}
                      onChange={(e) => {
                        const updated = [...sprintData.plannedStories];
                        updated[index].score = parseFloat(e.target.value);
                        setSprintData({
                          ...sprintData,
                          plannedStories: updated,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      inputProps={{ min: 1 }}
                      value={story.quantity}
                      onChange={(e) => {
                        const updated = [...sprintData.plannedStories];
                        updated[index].quantity = parseInt(e.target.value);
                        setSprintData({
                          ...sprintData,
                          plannedStories: updated,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => removeStory(index)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography sx={{ mt: 2, fontWeight: 600 }}>
            Total puntos planificados: {totalPoints}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 👥 Miembros del equipo */}
          <Typography variant="h6" gutterBottom>
            Equipo asignado
          </Typography>

          <Button
            startIcon={<Plus />}
            variant="outlined"
            onClick={addMember}
            sx={{ mb: 2 }}
          >
            Añadir miembro
          </Button>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Miembro</TableCell>
                <TableCell>Horas asignadas</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sprintData.usersAssigned.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Autocomplete
                      options={availableUsers}
                      getOptionLabel={(option) => option.name}
                      value={
                        availableUsers.find(
                          (u) => u.id === member.userId
                        ) || null
                      }
                      onChange={(_, value) => {
                        const updated = [...sprintData.usersAssigned];
                        updated[index].userId = value ? value.id : "";
                        setSprintData({
                          ...sprintData,
                          usersAssigned: updated,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Seleccionar usuario" />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      value={member.hours}
                      onChange={(e) => {
                        const updated = [...sprintData.usersAssigned];
                        updated[index].hours = parseInt(e.target.value);
                        setSprintData({
                          ...sprintData,
                          usersAssigned: updated,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => removeMember(index)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 🔘 Botones de acción */}
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onBack}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Sprint"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
