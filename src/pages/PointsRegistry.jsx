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
import { Link, useNavigate } from 'react-router-dom';
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
import Snackbar from '@mui/material/Snackbar';
import { useState, useMemo, useEffect } from "react";
import useAuthStore from '../store/authStore';
import useSprintStore from '../store/SprintStore';
import usePointsRegistryStore from '../store/PointsRegistryStore';

const PointsRegistry = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { sprints, fetchSprints } = useSprintStore();
    const { createRegistry, fetchUserRegistries, registries } = usePointsRegistryStore();

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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    // Obtener sprint activo
    const activeSprint = useMemo(() => {
        const userId = user?._id || user?.id
        if (!userId) return null

        const today = new Date()
        return sprints.find(s => {
            const start = new Date(s.startDate);
            const end = new Date(s.endDate);
            const isActiveByDate = today >= start && today <= end;
            const isStatusActive = s.status === "Activo";
            const isUserAssigned = s.usersAssigned?.some(
                u => String(u.userId?._id || u.userId) === String(userId)
            );
            return isActiveByDate && isStatusActive && isUserAssigned;
        })
    }, [sprints, user])

    useEffect(() => {
        fetchSprints();
    }, [fetchSprints]);

    // Cargar registros del usuario en el sprint activo
    useEffect(() => {
        if (activeSprint && user) {
            fetchUserRegistries(user._id || user.id, activeSprint._id);
        }
    }, [activeSprint, user, fetchUserRegistries]);

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

    const calculateTotalPoints = () => {
        return Object.entries(points).reduce((total, [pointValue, count]) => {
            return total + (parseFloat(pointValue) * count);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!activeSprint) {
            setSnackbar({
                open: true,
                message: 'No hay un sprint activo',
                severity: 'error'
            });
            return;
        }

        const totalPoints = calculateTotalPoints();
        if (totalPoints === 0) {
            setSnackbar({
                open: true,
                message: 'Debes registrar al menos una historia',
                severity: 'warning'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Crear array de historias con sus puntos
            const stories = Object.entries(points)
                .filter(([_, count]) => count > 0)
                .map(([pointValue, count]) => ({
                    pointValue: parseFloat(pointValue),
                    count: count,
                    subtotal: parseFloat(pointValue) * count
                }));

            const registryData = {
                userId: user._id || user.id,
                sprintId: activeSprint._id,
                stories: stories,
                totalPoints: totalPoints,
                isInterruption: isInterruption,
                registeredAt: new Date().toISOString()
            };

            await createRegistry(registryData);

            setSnackbar({
                open: true,
                message: 'Puntos registrados exitosamente',
                severity: 'success'
            });

            // Resetear formulario
            setPoints({
                '0.5': 0, '1': 0, '2': 0, '3': 0,
                '5': 0, '8': 0, '13': 0, '21': 0
            });
            setIsInterruption(false);

            // Redirigir al dashboard después de 1.5 segundos
            setTimeout(() => {
                navigate('/user-dashboard');
            }, 1500);

        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Error al registrar puntos',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const pointValues = ['0.5', '1', '2', '3', '5', '8', '13', '21'];

    // Calcular datos del sprint
    const userPoints = activeSprint?.userPoints?.find(u => u.userId === (user?._id || user?.id));
    const myPoints = userPoints?.points || 0;
    const planned = activeSprint?.plannedTotalPoints || 0;
    const completed = activeSprint?.completedPoints || 0;

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (!activeSprint) {
        return (
            <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">No hay un sprint activo para registrar puntos</Typography>
                <Button component={Link} to="/user-dashboard" sx={{ mt: 2 }}>
                    Volver al Dashboard
                </Button>
            </Card>
        );
    }

    return (
        <>
            <Card component='main' sx={{ bgcolor: '#f5f5f5', color: 'black', textAlign: 'justify', borderRadius: '10px', p: '4% 3%' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} to="/user-dashboard" sx={{ color: 'black' }}><ArrowLeft></ArrowLeft> Volver</Button>

                    <Box>
                        <Typography variant='h5' sx={{ fontSize: '19px' }}>Registrar Puntos Completados</Typography>
                        <Typography sx={{ color: 'grey' }}><span>{activeSprint.name}</span> - Registra tu trabajo realizado</Typography>
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
                            <Typography sx={{ fontSize: '35px' }}>{planned.toFixed(1)}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>puntos</Typography>
                        </Box>

                        <Box sx={{
                            my: 2, p: 2, borderRadius: 2,
                            border: "1px solid",
                            borderColor: "grey.200",
                            bgcolor: "#e8f5e9"
                        }}>
                            <Typography sx={{ color: 'grey' }}>Completado (Equipo)</Typography>
                            <Typography sx={{ fontSize: '35px' }}>{completed.toFixed(1)}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>puntos</Typography>
                        </Box>

                        <Box sx={{
                            my: 2, p: 2, borderRadius: 2,
                            border: "1px solid",
                            borderColor: "grey.200",
                            bgcolor: "#f3e5f5"
                        }}>
                            <Typography sx={{ color: 'grey' }}>Mis Puntos</Typography>
                            <Typography sx={{ fontSize: '35px' }}>{myPoints.toFixed(1)}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>puntos</Typography>
                        </Box>
                    </Grid>
                </Card>

                {/* Registrar Puntos Completados */}
                <Card sx={{ p: 3, mt: 5, borderRadius: '10px' }}>
                    <Typography sx={{ fontWeight: '500' }}>Registrar Puntos Completados</Typography>
                    <Typography sx={{ color: 'grey', fontSize: '14px' }}>Ingresa la cantidad de historias completadas para cada puntuación</Typography>

                    <Box sx={{ mt: 3 }}>
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
                                Los puntos que registres se restarán del total planificado. Si completas más trabajo del planificado, los puntos adicionales también se contabilizarán. Total a registrar: <strong>{calculateTotalPoints().toFixed(1)} puntos</strong>
                            </Typography>
                        </Alert>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant='contained' size='small' onClick={handleSubmit}
                            disabled={isSubmitting || calculateTotalPoints() === 0} sx={{
                                bgcolor: 'black', color: 'white', fontSize: '0.75rem',
                                padding: '5px 10px',
                                minWidth: 'auto',
                                '&:hover': { bgcolor: '#333' },
                                '&:disabled': { bgcolor: '#ccc' }
                            }}>{isSubmitting ? 'Registrando...' : 'Registrar Puntos'}</Button>

                    </Box>
                </Card>

                {/* Mis Registros en este Sprint */}
                <Card sx={{ mt: 4, py: 2.7, px: 2, borderRadius: 3 }}>
                    <Typography sx={{ fontWeight: 500 }}>Mis Registros en este Sprint</Typography>

                    {registries.length === 0 ? (
                        <Typography sx={{ color: 'grey', mt: 2, textAlign: 'center', py: 3 }}>
                            No hay registros aún en este sprint
                        </Typography>
                    ) : (
                        registries.map((registry, index) => (
                            <React.Fragment key={index}>
                                <Box key={index} sx={{
                                    my: 2, p: 2, borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "grey.200",
                                    bgcolor: registry.isInterruption ? "#fff8e1" : "background.default",
                                    display: 'flex',
                                    justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <Box>
                                        {registry.stories.map((story, idx) => (
                                            <Typography key={idx}><span style={{ fontWeight: "bold" }}>{story.count}</span>{' '} historia(s) de {' '}<span style={{ fontWeight: "bold" }}>{story.pointValue}</span>{' '} punto(s) {idx < registry.stories.length - 1 && ' | '}</Typography>
                                        ))}
                                        <Typography component="span" sx={{ color: 'grey', fontSize: '14px' }}>{formatDate(registry.registeredAt)}{registry.isInterruption && ' • Interrupción'}</Typography>
                                    </Box>

                                    <Box sx={{
                                        px: 1, borderRadius: 5,
                                        border: "1px solid",
                                        borderColor: "grey.200",
                                        bgcolor: "background.default"
                                    }}><Typography sx={{ fontSize: '14px' }}><span>{registry.totalPoints.toFixed(1)}</span> pts</Typography> </Box>
                                </Box>

                                <Box sx={{
                                    my: 2, p: 2, borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "grey.200",
                                    bgcolor: "background.default",
                                    display: 'flex',
                                    justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <Box>
                                        <Typography><span style={{ fontWeight: "bold" }}>1</span> historia(s) de <span style={{ fontWeight: "bold" }}>5</span> punto(s)</Typography>
                                        <Typography component="span" sx={{ color: 'grey', fontSize: '14px' }}>15 de enero</Typography>
                                    </Box>

                                    <Box sx={{
                                        px: 1, borderRadius: 5,
                                        border: "1px solid",
                                        borderColor: "grey.200",
                                        bgcolor: "background.default"
                                    }}><Typography sx={{ fontSize: '14px' }}><span>5.0</span> pts</Typography> </Box>
                                </Box>
                            </React.Fragment>
                        ))
                    )}
                </Card>
            </Card>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default PointsRegistry