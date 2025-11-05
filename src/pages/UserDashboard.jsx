import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    Grid,
    LinearProgress,
    Chip,
    Divider,
    CircularProgress
} from "@mui/material";
import { Calendar, Target, TrendingUp, Clock, Award } from "lucide-react";
import { Link } from 'react-router-dom';
import { useEffect, useMemo } from "react";

import useSprintStore from "../store/SprintStore";
import useAuthStore from "../store/authStore";


const UserDashboard = () => {
    const { user } = useAuthStore()
    const { sprints, fetchSprints, isLoading } = useSprintStore()

    useEffect(() => {
        fetchSprints()
    }, [fetchSprints])

    // 👇 Para depurar
    // console.log("Usuario logeado:", user);

    // const activeSprint = useMemo(() => {
    //     const today = new Date();
    //     return sprints.find(s => {
    //         const start = new Date(s.startDate);
    //         const end = new Date(s.endDate);
    //         return today >= start && today <= end;
    //     });
    // }, [sprints]);
    const activeSprint = useMemo(() => {
        const userId = user?._id || user?.id
        if (!userId) return null;

        const today = new Date();
        return sprints.find(s => {
            const start = new Date(s.startDate);
            const end = new Date(s.endDate);
            const isActiveByDate = today >= start && today <= end;
            const isStatusActive = s.status === "Activo";
            const isUserAssigned = s.usersAssigned?.some(
                u => String(u.userId?._id || u.userId) === String(userId)
            );

            // Para depurar
            console.log('Sprint:', s.name, {
                isActiveByDate,
                isStatusActive,
                isUserAssigned,
                userIds: s.usersAssigned?.map(u => String(u.userId?._id || u.userId)),
                currentUserId: String(userId)
            });
            return isActiveByDate && isStatusActive && isUserAssigned
        });
    }, [sprints, user]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>Cargando...</Typography>
            </Box>
        );
    }

    if (!activeSprint) {
        return (
            <Card sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6">No hay un sprint activo actualmente</Typography>
            </Card>
        );
    }

    // Datos del usuario dentro del sprint activo
    const userPoints = activeSprint.userPoints?.find(u => u.userId === user?._id);
    const myPoints = userPoints?.points || 0;

    // Cálculo de progreso
    const planned = activeSprint.plannedTotalPoints || 0;
    const completed = activeSprint.completedPoints || 0;
    const progress = planned > 0 ? (completed / planned) * 100 : 0;

    const daysRemaining = (() => {
        const today = new Date();
        const end = new Date(activeSprint.endDate);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    })();

    return (
        <>
            <Card component='main' sx={{ bgcolor: '#f5f5f5', color: 'black', textAlign: 'justify', borderRadius: '10px', p: '5% 3%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box >
                        <Typography variant='h5' sx={{ fontSize: '20px' }}>Mi Dashboard - Desarrollador</Typography>
                        <Typography sx={{ color: 'grey' }}> Bienvenido, <span>{user?.name}</span></Typography>
                    </Box>
                    <Button component={Link} to="/points-registry" variant='contained' size='small' sx={{
                        bgcolor: 'black', color: 'white', fontSize: '0.75rem',
                        padding: '2px 10px',
                        minWidth: 'auto'
                    }}>Registrar puntos</Button>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3}
                    sx={{
                        mt: 4,
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)'
                        },
                        gap: 3
                    }}>
                    {/* Sprint actual */}
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Sprint actual
                                </Typography>
                                <Target style={{ color: '#9e9e9e' }} />
                            </Box>
                            <Typography sx={{ mt: '30px', fontSize: '20px', whiteSpace: 'normal', textAlign: 'left' }}>{activeSprint.name.replace(/\s+/g, ' ').trim() }</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey', mt: 2 }}>En progreso</Typography>
                        </CardContent>
                    </Card>

                    {/* Mis Puntos (Sprint) */}
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Mis Puntos (Sprint)
                                </Typography>
                                <TrendingUp style={{ color: '#9e9e9e' }} />
                            </Box>
                            <Typography sx={{ mt: '30px', fontSize: '30px' }}>{myPoints.toFixed(1)}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>Este sprint</Typography>
                        </CardContent>
                    </Card>

                    {/* Puntos Totales  */}
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Puntos Totales
                                </Typography>
                                {/* <Calendar style={{ color: '#9e9e9e' }} /> */}
                                <Award style={{ color: '#9e9e9e' }}></Award>
                            </Box>
                            {/* <Typography sx={{ mt: '30px', fontSize: '30px' }}>{user?.totalPoints || 0}</Typography> */}
                            <Typography sx={{ mt: '30px', fontSize: '30px' }}>{planned}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>De este sprint</Typography>
                        </CardContent>
                    </Card>

                    {/* Días Restantes  */}
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Días Restantes
                                </Typography>
                                <Clock style={{ color: '#9e9e9e' }}></Clock>
                            </Box>
                            <Typography sx={{ mt: '30px', fontSize: '30px' }}>{daysRemaining}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>Para finalizar sprint</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Sprint */}
                {activeSprint ? (
                    <Card sx={{ mt: 4, py: 2.7, px: 2, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant='h4' sx={{ fontSize: 17, fontWeight: 600 }}>Sprint Activo</Typography>
                            <Chip label="Activo" sx={{ color: 'white', backgroundColor: 'black' }} />
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{activeSprint.name}</Typography>
                                <Button component={Link} to={`/sprint-detail/${activeSprint._id}`} variant='outlined' >Ver Detalle</Button>
                            </Box>
                            <Typography sx={{ color: 'grey.600', fontSize: 14, mt: 0.5 }}><span>{activeSprint.startDate}</span>  -  <span>{activeSprint.endDate}</span> <span>(5 días)</span></Typography>
                        </Box>

                        {/* Progreso del equipo - Sprint Activo  */}
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", gap: 1 }}>
                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Progreso del Equipo
                                </Typography>
                                <Typography variant='body2'><span>{completed}</span> / <span>{planned}</span> puntos</Typography>
                            </Box>

                            <Box sx={{ width: "100%" }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: 8,
                                        borderRadius: 5,
                                        backgroundColor: "#e5e7eb",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: "#1e40af",
                                        },
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 40, textAlign: "justify", mt: 1 }}>
                                <span>{progress.toFixed(1)}</span> %
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box elevation={1} sx={{ mx: "auto", backgroundColor: "transparent" }}>
                            {/* Puntos */}
                            <Grid container spacing={6} sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                alignItems: "center",
                                textAlign: "justify",
                                gap: 0,
                            }}>
                                <Grid>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Mis Puntos
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28 }}>
                                        {myPoints.toFixed(1)}
                                    </Typography>
                                </Grid>

                                <Grid>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Equipo Total
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28 }}>
                                        {completed.toFixed(1)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Observaciones */}
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    sx={{ mb: 0.5 }}
                                >
                                    Observaciones:
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14 }}>
                                    {activeSprint.observations || 'Sin observaciones'}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                ) : (
                    <Typography>No hay un sprint activo actualmente</Typography>
                )}

                {/* My Recent Records */}
                <Card sx={{ mt: 4, py: 2.7, px: 2, borderRadius: 3 }}>
                    <Typography variant='h4' sx={{ fontSize: 17, fontWeight: 600 }}>Mis Registros</Typography>
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

export default UserDashboard