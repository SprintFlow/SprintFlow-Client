import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

export default function CreateEditSprint({ onBack }) {
  
  const teamMembers = [
    { id: 1, name: "Ana García", role: "Frontend Developer" },
    { id: 2, name: "Carlos López", role: "Backend Developer" },
    { id: 3, name: "María Rodríguez", role: "Full Stack Developer" },
    { id: 4, name: "Juan Martínez", role: "QA Engineer" },
    { id: 5, name: "Laura Fernández", role: "UX/UI Designer" },
  ];

  const userStories = [
    { id: 1, title: "Implementar autenticación con OAuth2", points: 8 },
    { id: 2, title: "Diseñar la interfaz del panel de control", points: 5 },
    { id: 3, title: "Configurar base de datos de usuarios", points: 3 },
    { id: 4, title: "Integrar API de notificaciones por correo", points: 8 },
    { id: 5, title: "Ajustar estilos del dashboard responsive", points: 2 },
  ];

  const totalPoints = userStories.reduce((sum, s) => sum + s.points, 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "flex-start", 
        p: 4,
        backgroundColor: "#fafafa",
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          variant="outlined"
          onClick={onBack}
        >
          Volver
        </Button>
        <Box textAlign="center">
          <Typography variant="h5" fontWeight="600">
            Sprint Q4 - 2025
          </Typography>
          <Typography color="text.secondary">
            Planificación del ciclo de desarrollo del cuarto trimestre
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1100, 
          mx: "auto", 
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Información Básica"
                subheader="Datos generales del sprint"
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Nombre del Sprint"
                    value="Sprint Q4-2025"
                    InputProps={{ readOnly: true }}
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Fecha de Inicio"
                      type="date"
                      value="2025-10-20"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                    <TextField
                      label="Fecha de Fin"
                      type="date"
                      value="2025-11-03"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Box>
                  <TextField
                    label="Horas Disponibles"
                    type="number"
                    value="200"
                    InputProps={{ readOnly: true }}
                    helperText="Total de horas disponibles del equipo durante este sprint"
                  />
                  <TextField
                    label="Objetivo del Sprint"
                    multiline
                    minRows={4}
                    value="Completar el módulo de autenticación, implementar el sistema de notificaciones y dejar preparado el entorno del dashboard administrativo."
                    InputProps={{ readOnly: true }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Equipo Participante */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Equipo Participante"
                subheader="Miembros asignados al sprint"
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  {teamMembers.map((member) => (
                    <Box
                      key={member.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      border="1px solid #ddd"
                      borderRadius={2}
                    >
                      <Box>
                        <Typography fontWeight="500">{member.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                      </Box>
                      <Chip label="Asignado" variant="outlined" color="primary" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Historias de Usuario */}
        <Box mt={4}>
          <Card>
            <CardHeader
              title="Historias de Usuario"
              subheader="Backlog del sprint con estimaciones"
              action={
                <Button variant="outlined" startIcon={<Plus size={16} />}>
                  Nueva historia
                </Button>
              }
            />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Puntos</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userStories.map((story) => (
                      <TableRow key={story.id}>
                        <TableCell>US-{story.id}</TableCell>
                        <TableCell>{story.title}</TableCell>
                        <TableCell>{story.points}</TableCell>
                        <TableCell align="center">
                          <Button color="error" size="small">
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: 500 }}>
                        Total Puntos Planificados:
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          {totalPoints} puntos
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={onBack}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save size={18} />}
                >
                  Guardar Sprint
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
