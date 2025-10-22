import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  LinearProgress,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Results() {
  const [chartType, setChartType] = useState("bar");
  const [comments, setComments] = useState("");

  const handleChartChange = (event, newType) => {
    if (newType) setChartType(newType);
  };

  // Datos principales del sprint
  const sprintData = {
    sprint: "Sprint 12",
    plannedPoints: 120,
    completedPoints: 100,
    completionRate: 83,
    velocityIdeal: 35.2,
    velocityReal: 28.5,
    totalDays: 10,
    objective: "Completar el módulo de autenticación y establecer la base del dashboard principal.",
  };

  // Rendimiento del equipo
  const teamPerformance = [
    { name: "Guille", planned: 40, completed: 35 },
    { name: "Nanu", planned: 40, completed: 30 },
    { name: "Neo", planned: 40, completed: 35 },
  ];

  // Datos para gráficos
  const chartData = [
    { name: "Planificado", value: sprintData.plannedPoints },
    { name: "Completado", value: sprintData.completedPoints },
  ];

  const colors = ["#1976d2", "#2e7d32", "#ed6c02"];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {sprintData.sprint} - Resultados
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Métricas clave */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Puntos Planificados</Typography>
            <Typography variant="h4">{sprintData.plannedPoints}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Puntos Completados</Typography>
            <Typography variant="h4">{sprintData.completedPoints}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">% de Cumplimiento</Typography>
            <Typography variant="h4">{sprintData.completionRate}%</Typography>
            <LinearProgress
              variant="determinate"
              value={sprintData.completionRate}
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Velocidad (ideal / real)</Typography>
            <Typography variant="h4">
              {sprintData.velocityIdeal} / {sprintData.velocityReal}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Objetivo del sprint */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Objetivo del Sprint
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {sprintData.objective}
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 2 }}>
          <Typography variant="body2" color="success.contrastText">
            ✅ El equipo completó el 83% de los puntos planificados, superando el
            umbral mínimo del 80%. Buen rendimiento general.
          </Typography>
        </Box>
      </Paper>

      {/* Selector de tipo de gráfico */}
      <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">📊 Visualización de Resultados</Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartChange}
          size="small"
        >
          <ToggleButton value="bar">Barras</ToggleButton>
          <ToggleButton value="line">Líneas</ToggleButton>
          <ToggleButton value="pie">Tarta</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Gráfico dinámico */}
      <Paper sx={{ p: 3, mt: 2, height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" && (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          )}
          {chartType === "line" && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2e7d32" strokeWidth={2} />
            </LineChart>
          )}
          {chartType === "pie" && (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Paper>

      {/* Rendimiento del equipo */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          👥 Rendimiento del Equipo
        </Typography>
        {teamPerformance.map((member) => {
          const completion = Math.round(
            (member.completed / member.planned) * 100
          );
          return (
            <Box key={member.name} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                {member.name} — {completion}% completado
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completion}
                color={completion >= 80 ? "success" : "warning"}
                sx={{ height: 10, borderRadius: 5, mt: 1 }}
              />
            </Box>
          );
        })}
      </Paper>

      {/* Comentarios del Scrum Master */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          💬 Observaciones del Scrum Master
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Añade observaciones o aprendizajes del sprint..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button variant="contained" color="primary">
            Guardar observaciones
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
