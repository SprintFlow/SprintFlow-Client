import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  LinearProgress,
} from "@mui/material";

export default function Results() {
  const data = {
    sprint: "Sprint 12",
    plannedPoints: 120,
    completedPoints: 100,
    completionRate: 83,
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {data.sprint} - Resultados
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Puntos planificados</Typography>
            <Typography variant="h4">{data.plannedPoints}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Puntos completados</Typography>
            <Typography variant="h4">{data.completedPoints}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">% de cumplimiento</Typography>
            <Typography variant="h4">{data.completionRate}%</Typography>
            <LinearProgress
              variant="determinate"
              value={data.completionRate}
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );