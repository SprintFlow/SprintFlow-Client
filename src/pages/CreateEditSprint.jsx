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
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowLeft, Plus, Trash2, Save, Users, Target, Calendar } from "lucide-react";

export default function CreateEditSprint({ onBack }) {
//   const teamMembers = [
//     { id: 1, name: "Ana García", role: "Frontend Developer", availability: "100%" },
//     { id: 2, name: "Carlos López", role: "Backend Developer", availability: "100%" },
//     { id: 3, name: "María Rodríguez", role: "Full Stack", availability: "80%" },
//     { id: 4, name: "Juan Martínez", role: "QA Engineer", availability: "100%" },
//   ];

//   const backlogItems = [
//     { id: 1, title: "Sistema de autenticación de usuarios", points: 8, priority: "Alta" },
//     { id: 2, title: "Panel de control principal", points: 13, priority: "Media" },
//     { id: 3, title: "Integración con servicio de pagos", points: 5, priority: "Alta" },
//   ];

// //   const totalPoints = backlogItems.reduce((sum, item) => sum + item.points, 0);

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button variant="outlined" startIcon={<ArrowLeft />} onClick={onBack}>
          Regresar
        </Button>
        <Box>
          <Typography variant="h4">Configurar Sprint</Typography>
          <Typography variant="body2" color="text.secondary">
            Establece la configuración y objetivos para el próximo ciclo de trabajo
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sprint Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Detalles del Sprint"
              subheader="Información fundamental del ciclo"
              avatar={<Target />}
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Título del Sprint" defaultValue="Sprint Q4-2025" fullWidth />
              <TextField label="Capacidad (horas)" type="number" defaultValue="180" fullWidth />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField type="date" defaultValue="2025-10-20" fullWidth />
                <TextField type="date" defaultValue="2025-11-03" fullWidth />
              </Box>
              <TextField
                label="Enfoque Principal"
                multiline
                rows={4}
                defaultValue="Desarrollar e implementar el sistema de autenticación seguro y comenzar con la estructura base del dashboard administrativo."
                fullWidth
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Team Members */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Asignación de Equipo"
              subheader="Recursos asignados al sprint"
              avatar={<Users />}
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* {teamMembers.map((member) => ( */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2">fulanito</Typography>
                    <Typography variant="caption" color="text.secondary">
                     fulanito
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined" color="error">
                    <Trash2 />
                  </Button>
                </Box>
              {/* ))} */}
              <Button variant="outlined" startIcon={<Plus />}>
                Agregar Recurso
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Backlog Items */}
      <Card>
        <CardHeader title="Elementos del Backlog" subheader="Tareas y historias asignadas al sprint" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Elemento</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell>Estimación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {backlogItems.map((item) => ( */}
                  <TableRow>
                    <TableCell>TASK-3</TableCell>
                    <TableCell>fulanito</TableCell>
                    <TableCell>fulanito</TableCell>
                    <TableCell>fulanito</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" size="small">
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                {/* ))} */}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    Total Estimado:
                  </TableCell>
                  <TableCell> puntos</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined">
              Descartar
            </Button>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined">Guardar Borrador</Button>
              <Button variant="contained" color="primary" startIcon={<Save />}>
                Crear Sprint
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}