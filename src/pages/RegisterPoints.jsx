import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Calendar, Target, TrendingUp, Clock, ArrowLeft } from "lucide-react";
import { LinearProgress } from '@mui/material';
import Chip from '@mui/material/Chip';
import { Divider } from "@mui/material";
import { Link } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import React, { useState } from "react";

const RegisterPoints = () => {

    const [points, setPoints] = useState({
        '0.5': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '5': 0,
        '8': 0,
        '13': 0,
        '21': 0
    });

    const [isInterruption, setIsInterruption] = useState(false);

    const handlePointChange = (pointValue, newValue) => {
        setPoints({
            ...points,
            [pointValue]: parseInt(newValue) || 0
        });
    };

    const calculateSubtotal = (pointValue) => {
        const count = points[pointValue];
        return count > 0 ? (parseFloat(pointValue) * count).toFixed(1) : '-';
    };

    const pointValues = ['0.5', '1', '2', '3', '5', '8', '13', '21'];

    return (
        <>
            <Card component='main' sx={{ bgcolor: '#f5f5f5', color: 'black', textAlign: 'justify', borderRadius: '10px', p: '4% 3%' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button sx={{ color: 'black' }}><ArrowLeft></ArrowLeft> Volver</Button>

                    <Box>
                        <Typography variant='h5'>Registrar Puntos Completados</Typography>
                        <Typography sx={{ color: 'grey' }}><span>Sprint 2</span> - <span>Enero 2025</span> Registra tu trabajo realizado</Typography>
                    </Box>
                </Box>

                {/* Resumen del Sprint */}
                <Card sx={{ p: 3, mt: 5, borderRadius: '10px' }}>
                    <Typography sx={{ fontWeight: '500' }}>Resumen del Sprint</Typography>
                    <Grid container spacing={3}
                        sx={{
                            mt: 2,
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)'
                            },
                            gap: 3
                        }}>
                        <Box sx={{
                            my: 2, p: 2, borderRadius: 2,
                            border: "1px solid",
                            borderColor: "grey.200",
                            bgcolor: "#e3f2fd"
                        }}>
                            <Typography sx={{ color: 'grey' }}>Planificado</Typography>
                            <Typography sx={{ fontSize: '35px' }}>7.0</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>puntos</Typography>
                        </Box>

                        <Box sx={{
                            my: 2, p: 2, borderRadius: 2,
                            border: "1px solid",
                            borderColor: "grey.200",
                            bgcolor: "#e8f5e9"
                        }}>
                            <Typography sx={{ color: 'grey' }}>Completado (Equipo)</Typography>
                            <Typography sx={{ fontSize: '35px' }}>14.0</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>puntos</Typography>
                        </Box>

                        <Box sx={{
                            my: 2, p: 2, borderRadius: 2,
                            border: "1px solid",
                            borderColor: "grey.200",
                            bgcolor: "#f3e5f5"
                        }}>
                            <Typography sx={{ color: 'grey' }}>Mis Puntos</Typography>
                            <Typography sx={{ fontSize: '35px' }}>7.0</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>puntos</Typography>
                        </Box>
                    </Grid>
                </Card>

                {/* Registrar Puntos Completados */}
                <Card sx={{ p: 3, mt: 5, borderRadius: '10px' }}>
                    <Typography sx={{ fontWeight: '500' }}>Registrar Puntos Completados</Typography>
                    <Typography sx={{ color: 'grey', fontSize: '14px' }}>Ingresa la cantidad de historias completadas para cada puntuación</Typography>

                    <Box>
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                            Registrar Puntos Completados
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Ingresa la cantidad de historias completadas para cada puntuación
                        </Typography>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>
                                            Puntuación
                                        </TableCell>
                                        {pointValues.map((value) => (
                                            <TableCell key={value} align="center" sx={{ fontWeight: 600 }}>
                                                {value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            Historias Completadas
                                        </TableCell>
                                        {pointValues.map((value) => (
                                            <TableCell key={value} align="center">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={points[value]}
                                                    onChange={(e) => handlePointChange(value, e.target.value)}
                                                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                                    sx={{
                                                        width: 80,
                                                        '& .MuiOutlinedInput-root': {
                                                            bgcolor: 'white'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            Subtotal Puntos
                                        </TableCell>
                                        {pointValues.map((value) => (
                                            <TableCell key={value} align="center" sx={{ fontWeight: 500 }}>
                                                {calculateSubtotal(value)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ mt: 3, p: 2, bgcolor: '#fffbf0', border: '1px solid #ffeaa7', borderRadius: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isInterruption}
                                        onChange={(e) => setIsInterruption(e.target.checked)}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Marcar como interrupción
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Selecciona si estos puntos corresponden a trabajo inesperado o interrupciones que surgieron durante el sprint
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Box>

                        <Alert severity="info" sx={{ my: 3, borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                Nota:
                            </Typography>
                            <Typography variant="body2">
                                Los puntos que registres se restarán del total planificado. Si completas más trabajo del planificado, los puntos adicionales también se contabilizarán.
                            </Typography>
                        </Alert>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant='contained' size='small' sx={{
                            bgcolor: 'black', color: 'white', fontSize: '0.75rem',
                            padding: '5px 10px',
                            minWidth: 'auto'
                        }}>Registrar Puntos</Button>

                    </Box>
                </Card>

                {/* Mis Registros en este Sprint */}
                <Card sx={{ mt: 4, py: 2.7, px: 2, borderRadius: 3 }}>
                    <Typography sx={{ fontWeight: 500 }}>Mis Registros</Typography>
                    <Box sx={{
                        my: 2, p: 2, borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        bgcolor: "background.default"
                    }}>
                        <Typography><span>2</span> historia(s) de <span>1</span> punto(s)</Typography>
                        <Typography component="span" sx={{ color: 'grey', fontSize: '14px' }}>14 de enero</Typography>
                    </Box>
                    <Box sx={{
                        my: 2, p: 2, borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        bgcolor: "background.default"
                    }}>
                        <Typography><span>1</span> historia(s) de <span>5</span> punto(s)</Typography>
                        <Typography component="span" sx={{ color: 'grey', fontSize: '14px' }}>15 de enero</Typography>
                    </Box>
                </Card>
            </Card>
        </>
    )
}

export default RegisterPoints