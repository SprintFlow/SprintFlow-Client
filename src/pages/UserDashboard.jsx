// components/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Calendar, Target, TrendingUp, Clock, Plus, Minus } from "lucide-react";
import { LinearProgress, CircularProgress, Alert, Divider, Chip, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControlLabel, Checkbox, useTheme } from '@mui/material';

// Importar stores
import useAuthStore from '../store/authStore';
import useSprintStore from '../store/SprintStore';
import usePointStore from '../store/pointStore';

const UserDashboard = () => {
    const theme = useTheme();
    
    // ===== TEMA PERSONALIZADO CON SOPORTE PARA MODO OSCURO =====
    const customTheme = {
        primary: "#10b981",
        primaryDark: "#059669",
        primaryLight: "#34d399",
        background: theme.palette.mode === 'dark' ? theme.palette.background.default : "#f0fdf4",
        cardBg: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#ffffff",
        gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
        text: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
        textSecondary: theme.palette.mode === 'dark' ? theme.palette.text.secondary : "#6b7280",
        border: theme.palette.mode === 'dark' ? '#333' : '#d1fae5',
        hoverBg: theme.palette.mode === 'dark' ? '#1e293b' : '#d1fae5',
        warningBg: theme.palette.mode === 'dark' ? '#422006' : '#fffbeb',
        warningBorder: theme.palette.mode === 'dark' ? '#78350f' : '#fcd34d',
        warningText: theme.palette.mode === 'dark' ? '#fbbf24' : '#92400e',
    };

    // ===== STORES =====
    const { user } = useAuthStore();
    const { sprints, isLoading: sprintsLoading, error: sprintsError, fetchSprints } = useSprintStore();
    const {
        userPoints,
        recentRecords,
        isLoading: pointsLoading,
        error: pointsError,
        fetchUserPoints,
        fetchRecentRecords,
        getPointsBySprint,
        getTotalPoints,
        registerPoints,
        getSprintRecords,
    } = usePointStore();

    // ===== ESTADOS =====
    const [activeSprint, setActiveSprint] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        currentSprintPoints: 0,
        totalPoints: 0,
        teamProgress: 0,
        daysRemaining: 0,
        teamTotalPoints: 0,
        teamPlannedPoints: 0,
        remainingPoints: 0
    });

    // Estados para el registro de puntos
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ===== EFFECTS =====
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            await fetchSprints();
            if (user?.id) {
                await fetchUserPoints(user.id);
                await fetchRecentRecords(user.id);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    // Encontrar sprint activo y calcular estadísticas
    // useEffect(() => {
    //     if (sprints && sprints.length > 0) {
    //         const active = sprints.find(sprint => {
    //             const sprintStatus = sprint.calculatedStatus || 'Planificado';
    //             return sprintStatus === 'Activo';
    //         });

    //         setActiveSprint(active || null);

    //         if (active && user?.id) {
    //             const userSprintPoints = getPointsBySprint(active._id);
    //             const totalUserPoints = getTotalPoints();

    //             const teamTotalPoints = active.completedPoints || 0;
    //             const teamPlannedPoints = active.plannedTotalPoints || 0;
    //             const remainingPoints = Math.max(0, teamPlannedPoints - teamTotalPoints);
    //             const teamProgress = teamPlannedPoints > 0 ?
    //                 (teamTotalPoints / teamPlannedPoints) * 100 : 0;

    //             const daysRemaining = calculateDaysRemaining(active.endDate);

    //             setDashboardStats({
    //                 currentSprintPoints: userSprintPoints,
    //                 totalPoints: totalUserPoints,
    //                 teamProgress: teamProgress,
    //                 daysRemaining: daysRemaining,
    //                 teamTotalPoints: teamTotalPoints,
    //                 teamPlannedPoints: teamPlannedPoints,
    //                 remainingPoints: remainingPoints
    //             });
    //         }
    //     }
    // }, [sprints, userPoints, user]);
    useEffect(() => {
        if (!activeSprint || !user) return;

        const userSprintPoints = getPointsBySprint(activeSprint._id) || 0;
        const totalUserPoints = getTotalPoints() || 0;
        const teamTotalPoints = activeSprint.completedPoints || 0;
        const teamPlannedPoints = activeSprint.plannedTotalPoints || 0;
        const remainingPoints = Math.max(0, teamPlannedPoints - teamTotalPoints);
        const teamProgress = teamPlannedPoints > 0 ? (teamTotalPoints / teamPlannedPoints) * 100 : 0;
        const daysRemaining = calculateDaysRemaining(activeSprint.endDate);

        setDashboardStats({
            currentSprintPoints: userSprintPoints,
            totalPoints: totalUserPoints,
            teamProgress,
            daysRemaining,
            teamTotalPoints,
            teamPlannedPoints,
            remainingPoints
        });
    }, [activeSprint, userPoints, user]);

    useEffect(() => {
        if (sprints && sprints.length > 0) {
            const active = sprints.find(s => s.status === "Activo");
            setActiveSprint(active || null);
        }
    }, [sprints]);

    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return 0;
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    const calculateSprintDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff + 1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatRecordDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long"
        });
    };

    // 🔹 Datos calculados
    const myPoints = activeSprint ? getPointsBySprint(activeSprint._id) : 0;
    const sprintRecords = activeSprint ? getSprintRecords(activeSprint._id) : [];
    const plannedPoints = activeSprint?.plannedTotalPoints || 0;

    // Funciones para el registro de puntos
    const handlePointChange = (pointValue, change) => {
        setPoints(prev => ({
            ...prev,
            [pointValue]: Math.max(0, prev[pointValue] + change)
        }));
    };

    const handleInputChange = (pointValue, newValue) => {
        const value = parseInt(newValue) || 0;
        setPoints(prev => ({
            ...prev,
            [pointValue]: value >= 0 ? value : 0
        }));
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

    const getStoriesArray = () => {
        return Object.entries(points)
            .filter(([_, count]) => count > 0)
            .map(([pointValue, count]) => ({
                points: parseFloat(pointValue),
                count: count
            }));
    };

    const handleSubmit = async () => {
        const totalPoints = calculateTotalPoints();

        if (totalPoints === 0) {
            showSnackbar('Debes registrar al menos un punto', 'error');
            return;
        }

        if (!activeSprint) {
            showSnackbar('No hay un sprint activo', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const pointData = {
                sprintId: activeSprint._id,
                userId: user.id,
                points: totalPoints,
                stories: getStoriesArray(),
                totalPoints: totalPoints, // añadido
                isInterruption: isInterruption,
                date: new Date().toISOString().split('T')[0]
            };

            console.log('Enviando datos:', pointData); // DEBUG

            const result = await registerPoints(pointData);

            if (result.success) {
                showSnackbar('Puntos registrados exitosamente!', 'success');

                setPoints({
                    '0.5': 0, '1': 0, '2': 0, '3': 0,
                    '5': 0, '8': 0, '13': 0, '21': 0
                });
                setIsInterruption(false);

                setTimeout(() => {
                    loadDashboardData();
                }, 1000);
            } else {
                showSnackbar(pointsError || 'Error al registrar puntos', 'error');
            }
        } catch (error) {
            console.error('Error al registrar puntos:', error);
            showSnackbar('Error al registrar puntos: ' + error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const pointValues = ['0.5', '1', '2', '3', '5', '8', '13', '21'];
    const totalPoints = calculateTotalPoints();

    if (sprintsLoading || pointsLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                // sx={{ backgroundColor: '#f0fdf4' }}
                sx={{ backgroundColor: customTheme.background }}
            >
                {/* <CircularProgress size={60} sx={{ color: '#10b981' }} /> */}
                <CircularProgress size={60} sx={{ color: customTheme.primary }} />
            </Box>
        );
    }

    const hasError = sprintsError || pointsError;

    return (
        <Box sx={{
            minHeight: "100vh",
            // backgroundColor: '#f0fdf4',
            backgroundColor: customTheme.background,
            py: 3,
            width: '100%',
            margin: '2% 0',
            padding: 0,
        }}>
            <Box sx={{
                width: '100%',
                px: { xs: 2, sm: 3, md: 4 },
                // maxWidth: '1400px',
                margin: '0 auto'
            }}>

                {hasError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {sprintsError || pointsError}
                    </Alert>
                )}

                {/* Header */}
                <Card sx={{
                    // bgcolor: 'background.paper',
                    bgcolor: customTheme.cardBg,
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                    // border: '1px solid #d1fae5'
                    border: `1px solid ${customTheme.border}`
                }}>
                    <Box>
                        {/* <Typography variant='h5' fontWeight="700" sx={{ color: '#065f46' }}> */}
                        <Typography variant='h5' fontWeight="700" sx={{ color: customTheme.primary }}>
                            Mi Dashboard - {user?.role || 'Developer'}
                        </Typography>
                        {/* <Typography sx={{ color: '#6b7280' }}> */}
                        <Typography sx={{ color: customTheme.textSecondary }}>
                            {/* Bienvenido, <span style={{ fontWeight: 600, color: '#059669' }}>{user?.name || 'Usuario'}</span> */}
                            Bienvenido, <span style={{ fontWeight: 600, color: customTheme.primary }}>{user?.name || 'Usuario'}</span>
                        </Typography>
                    </Box>
                </Card>

                {/* Stats Cards */}
                <Box container spacing={2} sx={{
                    mb: 4, width: '100%', mx: 0, display: 'flex', gap: 2
                }}>
                    {/* Sprint actual */}
                    <Box item xs={12} sm={6} md={3} sx={{ width: '100%' }}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: customTheme.cardBg,
                            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                            transition: 'transform 0.2s',
                            // border: '1px solid #d1fae5',
                            border: `1px solid ${customTheme.border}`,
                            '&:hover': { transform: 'translateY(-2px)' }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                                    {/* <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: '#065f46' }}> */}
                                    <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: customTheme.primary }}>
                                        Sprint actual
                                    </Typography>
                                    {/* <Target style={{ color: '#10b981' }} /> */}
                                    <Target style={{ color: customTheme.primary }} />
                                </Box>
                                {/* <Typography sx={{ fontSize: '35px', fontWeight: 'bold', mb: 1, color: '#10b981' }}> */}
                                <Typography sx={{ fontSize: '35px', fontWeight: 'bold', mb: 1, color: customTheme.primary }}>
                                    {activeSprint ? activeSprint.number || '1' : '0'}
                                </Typography>
                                {/* <Typography sx={{ fontSize: '12px', color: '#6b7280' }}> */}
                                <Typography sx={{ fontSize: '12px', color: customTheme.textSecondary }}>
                                    {activeSprint ? 'En progreso' : 'No activo'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Mis Puntos (Sprint) */}
                    <Box item xs={12} sm={6} md={3} sx={{ width: '100%' }}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: customTheme.cardBg,
                            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                            transition: 'transform 0.2s',
                            // border: '1px solid #d1fae5',
                            border: `1px solid ${customTheme.border}`,
                            '&:hover': { transform: 'translateY(-2px)' }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                                    {/* <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: '#065f46' }}> */}
                                    <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: customTheme.primary }}>
                                        Mis Puntos (Sprint)
                                    </Typography>
                                    {/* <TrendingUp style={{ color: '#10b981' }} /> */}
                                    <TrendingUp style={{ color: customTheme.primary }} />
                                </Box>
                                {/* <Typography sx={{ fontSize: '35px', fontWeight: 'bold', mb: 1, color: '#10b981' }}> */}
                                <Typography sx={{ fontSize: '35px', fontWeight: 'bold', mb: 1, color: customTheme.primary }}>
                                    {/* {dashboardStats.currentSprintPoints.toFixed(1)} */}
                                    {activeSprint ? getPointsBySprint(activeSprint._id)?.toFixed(1) : 0}
                                </Typography>
                                {/* <Typography sx={{ fontSize: '12px', color: '#6b7280' }}> */}
                                <Typography sx={{ fontSize: '12px', color: customTheme.textSecondary }}>
                                    Este sprint
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Puntos Totales Planificados */}
                    <Box item xs={12} sm={6} md={3} sx={{ width: '100%' }}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: customTheme.cardBg,
                            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                            transition: 'transform 0.2s',
                            // border: '1px solid #d1fae5',
                            border: `1px solid ${customTheme.border}`,
                            '&:hover': { transform: 'translateY(-2px)' }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                                    {/* <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: '#065f46' }}> */}
                                    <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: customTheme.primary }}>
                                        Puntos Totales
                                    </Typography>
                                    {/* <Calendar style={{ color: '#10b981' }} /> */}
                                    <Calendar style={{ color: customTheme.primary }} />
                                </Box>
                                {/* <Typography sx={{ fontSize: '35px', fontWeight: 'bold', mb: 1, color: '#10b981' }}> */}
                                <Typography sx={{ fontSize: '35px', fontWeight: 'bold', mb: 1, color: customTheme.primary }}>
                                    {/* {dashboardStats.totalPoints.toFixed(1)} */}
                                    {activeSprint?.plannedTotalPoints?.toFixed(1) || 0}
                                </Typography>
                                {/* <Typography sx={{ fontSize: '12px', color: '#6b7280' }}> */}
                                <Typography sx={{ fontSize: '12px', color: customTheme.textSecondary }}>
                                    Este sprint
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Días Restantes */}
                    <Box item xs={12} sm={6} md={3} sx={{ width: '100%' }}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: customTheme.cardBg,
                            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                            transition: 'transform 0.2s',
                            // border: '1px solid #d1fae5',
                            border: `1px solid ${customTheme.border}`,
                            '&:hover': { transform: 'translateY(-2px)' }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                                    {/* <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: '#065f46' }}> */}
                                    <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: customTheme.primary }}>
                                        Días Restantes
                                    </Typography>
                                    {/* <Clock style={{ color: '#10b981' }} /> */}
                                    <Clock style={{ color: customTheme.primary }} />
                                </Box>
                                <Typography sx={{ fontSize: '35px', fontWeight: 'bold', mb: 1, color: '#ef4444' }}>
                                    {dashboardStats.daysRemaining}
                                </Typography>
                                {/* <Typography sx={{ fontSize: '12px', color: '#6b7280' }}> */}
                                <Typography sx={{ fontSize: '12px', color: customTheme.textSecondary }}>
                                    Para finalizar sprint
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {/* Columna izquierda: Sprint activo y registro de puntos */}
                    <Grid item xs={12} lg={8}>
                        {/* Active Sprint Section */}
                        {activeSprint && (
                            <Card sx={{
                                borderRadius: 3,
                                mb: 3,
                                bgcolor: customTheme.cardBg,
                                boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                                // border: '1px solid #d1fae5'
                                border: `1px solid ${customTheme.border}`
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        {/* <Typography variant='h5' sx={{ fontSize: 20, fontWeight: 600, color: '#065f46' }}> */}
                                        <Typography variant='h5' sx={{ fontSize: 20, fontWeight: 600, color: customTheme.primary }}>
                                            Sprint Activo
                                        </Typography>
                                        <Chip
                                            label="Activo"
                                            sx={{
                                                // color: 'background.paper',
                                                color: 'white',
                                                // backgroundColor: '#10b981',
                                                backgroundColor: customTheme.primary,
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Box>
                                            {/* <Typography variant="h6" sx={{ fontWeight: 600, color: '#065f46' }}> */}
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: customTheme.primary }}>
                                                {activeSprint.name}
                                            </Typography>
                                            {/* <Typography sx={{ color: '#6b7280', fontSize: 14, mt: 0.5 }}> */}
                                            <Typography sx={{ color: customTheme.textSecondary, fontSize: 14, mt: 0.5 }}>
                                                {formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}
                                                {` (${calculateSprintDuration(activeSprint.startDate, activeSprint.endDate)} días)`}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Progreso del equipo */}
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", mb: 1 }}>
                                            {/* <Typography variant="body2" fontWeight={500} color="#6b7280"> */}
                                            <Typography variant="body2" fontWeight={500} color={customTheme.textSecondary}>
                                                Progreso del Equipo
                                            </Typography>
                                            {/* <Typography variant='body2' fontWeight={600} color="#065f46"> */}
                                            <Typography variant='body2' fontWeight={600} color={customTheme.primary}>
                                                {dashboardStats.teamTotalPoints.toFixed(1)} / {dashboardStats.teamPlannedPoints.toFixed(1)} puntos
                                            </Typography>
                                        </Box>

                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(dashboardStats.teamProgress, 100)}
                                            sx={{
                                                height: 8,
                                                borderRadius: 5,
                                                // backgroundColor: "#d1fae5",
                                                // "& .MuiLinearProgress-bar": {
                                                //     backgroundColor: "#10b981",
                                                // },
                                                backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : "#d1fae5",
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor: customTheme.primary,
                                                },
                                            }}
                                        />
                                        {/* <Typography variant="body2" sx={{ textAlign: "right", mt: 1, color: '#065f46', fontWeight: 500 }}> */}
                                        <Typography variant="body2" sx={{ textAlign: "right", mt: 1, color: customTheme.primary, fontWeight: 500 }}>
                                            Faltan {dashboardStats.remainingPoints.toFixed(1)} puntos por completar
                                        </Typography>
                                    </Box>

                                    {/* <Divider sx={{ my: 3, borderColor: '#d1fae5' }} /> */}
                                    <Divider sx={{ my: 3, borderColor: customTheme.border }} />

                                    {/* Puntos del usuario vs equipo */}
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            {/* <Typography variant="subtitle2" color="#6b7280"> */}
                                            <Typography variant="subtitle2" color={customTheme.textSecondary}>
                                                Mis Puntos
                                            </Typography>
                                            {/* <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28, color: '#10b981' }}> */}
                                            <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28, color: customTheme.primary }}>
                                                {dashboardStats.currentSprintPoints.toFixed(1)}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            {/* <Typography variant="subtitle2" color="#6b7280"> */}
                                            <Typography variant="subtitle2" color={customTheme.textSecondary}>
                                                Equipo Total
                                            </Typography>
                                            {/* <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28, color: '#10b981' }}> */}
                                            <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28, color: customTheme.primary }}>
                                                {dashboardStats.teamTotalPoints.toFixed(1)}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {activeSprint.description && (
                                        <Box>
                                            {/* <Divider sx={{ my: 3, borderColor: '#d1fae5' }} /> */}
                                            <Divider sx={{ my: 3, borderColor: customTheme.border }} />
                                            <Box>
                                                {/* <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#065f46' }}> */}
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: customTheme.primary }}>
                                                    Observaciones:
                                                </Typography>
                                                {/* <Typography variant="body1" color="#6b7280"> */}
                                                <Typography variant="body1" color={customTheme.textSecondary}>
                                                    {activeSprint.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Formulario de Registro de Puntos - TABLA COMPACTA */}
                        <Card sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: customTheme.cardBg,
                            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                            // border: '1px solid #d1fae5'
                            border: `1px solid ${customTheme.border}`
                        }}>
                            {/* <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#065f46' }}> */}
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: customTheme.primary }}>
                                Registrar Puntos Completados
                            </Typography>
                            {/* <Typography sx={{ color: '#6b7280', fontSize: '14px', mb: 3 }}> */}
                            <Typography sx={{ color: customTheme.textSecondary, fontSize: '14px', mb: 3 }}>
                                Ingresa la cantidad de historias completadas para cada puntuación
                            </Typography>

                            <TableContainer component={Paper} elevation={0} sx={{ 
                                // border: '1px solid #d1fae5',
                                border: `1px solid ${customTheme.border}`, 
                                mb: 3, overflow: 'hidden',
                                bgcolor: customTheme.cardBg }}>
                                <Table sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
                                    <TableHead>
                                        <TableRow>
                                            {/* <TableCell sx={{ fontWeight: 600, color: '#065f46', width: '140px', px: 1 }}> */}
                                            <TableCell sx={{ fontWeight: 600, color: customTheme.primary, width: '140px', px: 1 }}>
                                                Puntuación
                                            </TableCell>
                                            {pointValues.map((value) => (
                                                // <TableCell key={value} align="center" sx={{ fontWeight: 600, color: '#065f46', px: 1 }}>
                                                <TableCell key={value} align="center" sx={{ fontWeight: 600, color: customTheme.primary, px: 1 }}>
                                                    {value}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {/* <TableCell sx={{ fontWeight: 500, color: '#065f46', px: 1 }}> */}
                                            <TableCell sx={{ fontWeight: 500, color: customTheme.primary, px: 1 }}>
                                                Historias
                                            </TableCell>
                                            {pointValues.map((value) => (
                                                <TableCell key={value} align="center" sx={{ px: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handlePointChange(value, -1)}
                                                            disabled={points[value] <= 0 || !activeSprint || isSubmitting}
                                                            sx={{
                                                                minWidth: '28px',
                                                                width: '28px',
                                                                height: '28px',
                                                                // borderColor: '#10b981',
                                                                // color: '#10b981',
                                                                // '&:hover': { bgcolor: '#f0fdf4' }
                                                                borderColor: customTheme.primary,
                                                                color: customTheme.primary,
                                                                '&:hover': { bgcolor: customTheme.hoverBg }
                                                            }}
                                                        >
                                                            <Minus size={14} />
                                                        </Button>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={points[value]}
                                                            onChange={(e) => handleInputChange(value, e.target.value)}
                                                            inputProps={{
                                                                min: 0,
                                                                style: {
                                                                    textAlign: 'center',
                                                                    padding: '4px 2px',
                                                                    fontSize: '14px'
                                                                }
                                                            }}
                                                            sx={{
                                                                width: '50px',
                                                                '& .MuiOutlinedInput-root': {
                                                                    // bgcolor: 'background.paper',
                                                                    bgcolor: customTheme.cardBg,
                                                                    height: '28px',
                                                                    '& input': {
                                                                        padding: '4px 2px',
                                                                        fontSize: '14px',
                                                                        '&[type=number]': {
                                                                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                                                                display: 'none',
                                                                            },
                                                                            '-moz-appearance': 'textfield',
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                            disabled={!activeSprint || isSubmitting}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handlePointChange(value, 1)}
                                                            disabled={!activeSprint || isSubmitting}
                                                            sx={{
                                                                minWidth: '28px',
                                                                width: '28px',
                                                                height: '28px',
                                                                // bgcolor: '#10b981',
                                                                // '&:hover': { bgcolor: '#059669' }
                                                                bgcolor: customTheme.primary,
                                                                '&:hover': { bgcolor: customTheme.primaryDark }
                                                            }}
                                                        >
                                                            <Plus size={14} />
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            {/* <TableCell sx={{ fontWeight: 600, color: '#065f46', px: 1 }}> */}
                                            <TableCell sx={{ fontWeight: 600, color: customTheme.primary, px: 1 }}>
                                                Subtotal
                                            </TableCell>
                                            {pointValues.map((value) => (
                                                // <TableCell key={value} align="center" sx={{ fontWeight: 500, color: '#065f46', px: 1 }}>
                                                <TableCell key={value} align="center" sx={{ fontWeight: 500, color: customTheme.primary, px: 1 }}>
                                                    {calculateSubtotal(value)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Total Points */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                                // border: '1px solid #10b981',
                                border: `1px solid ${customTheme.primary}`,
                                mb: 3,
                                bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f0fdf4'
                            }}>
                                {/* <Typography variant="h6" sx={{ fontWeight: 600, color: '#065f46' }}> */}
                                <Typography variant="h6" sx={{ fontWeight: 600, color: customTheme.primary }}>
                                    Total de Puntos a Registrar:
                                </Typography>
                                {/* <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#065f46' }}> */}
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: customTheme.primary }}>
                                    {totalPoints.toFixed(1)}
                                </Typography>
                            </Box>

                            {/* Interruption Checkbox */}
                            <Box sx={{
                                p: 2,
                                // bgcolor: '#fffbeb',
                                // border: '1px solid #fcd34d',
                                bgcolor: customTheme.warningBg,
                                border: `1px solid ${customTheme.warningBorder}`,
                                borderRadius: 2,
                                mb: 3
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isInterruption}
                                            onChange={(e) => setIsInterruption(e.target.checked)}
                                            disabled={!activeSprint || isSubmitting}
                                            sx={{ 
                                                // color: '#f59e0b', 
                                                // '&.Mui-checked': { color: '#f59e0b' } 
                                                color: customTheme.warningText, 
                                                '&.Mui-checked': { color: customTheme.warningText } 
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            {/* <Typography variant="body1" sx={{ fontWeight: 500, color: '#92400e' }}> */}
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: customTheme.warningText }}>
                                                Marcar como interrupción
                                            </Typography>
                                            {/* <Typography variant="body2" color="#92400e"> */}
                                            <Typography variant="body2" color={customTheme.warningText}>
                                                Selecciona si estos puntos corresponden a trabajo inesperado o interrupciones
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant='contained'
                                    onClick={handleSubmit}
                                    disabled={!activeSprint || totalPoints === 0 || isSubmitting}
                                    sx={{
                                        // bgcolor: '#10b981',
                                        bgcolor: customTheme.primary,
                                        color: 'white',
                                        px: 4,
                                        '&:hover': {
                                            // bgcolor: '#059669',
                                            bgcolor: customTheme.primaryDark,
                                        },
                                        '&:disabled': {
                                            bgcolor: '#9ca3af',
                                            color: '#6b7280'
                                        }
                                    }}
                                >
                                    {isSubmitting ? <CircularProgress size={24} /> : 'Registrar Puntos'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Columna derecha: Registros recientes */}
                    <Grid item xs={12} lg={4} sx={{ width: '100%' }}>
                        <Card sx={{
                            borderRadius: 3,
                            bgcolor: customTheme.cardBg,
                            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.1)',
                            // border: '1px solid #d1fae5',
                            border: `1px solid ${customTheme.border}`,
                            height: 'fit-content'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                {/* <Typography variant='h5' sx={{ fontSize: 20, fontWeight: 600, mb: 3, color: '#065f46' }}> */}
                                <Typography variant='h5' sx={{ fontSize: 20, fontWeight: 600, mb: 3, color: customTheme.primary }}>
                                    Mis Registros Recientes
                                </Typography>

                                {/* {recentRecords.length === 0 ? ( */}
                                {(!activeSprint || getSprintRecords(activeSprint._id).length === 0) ? (
                                    <Box textAlign="center" py={4}>
                                        {/* <Typography variant="body1" color="#6b7280"> */}
                                        <Typography variant="body1" color={customTheme.textSecondary}>
                                            No hay registros recientes para este sprint
                                        </Typography>
                                    </Box>
                                ) : (
                                    // recentRecords.slice(0, 8).map((record, index) => (
                                    getSprintRecords(activeSprint._id).slice(0, 8).map((record, index) => (
                                        <Box
                                            key={record._id || index}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                border: "1px solid",
                                                // borderColor: "#d1fae5",
                                                borderColor: customTheme.border,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    // borderColor: "#10b981",
                                                    // bgcolor: "#d1fae5"
                                                    borderColor: customTheme.primary,
                                                    bgcolor: customTheme.hoverBg
                                                }
                                            }}
                                        >
                                            {/* <Typography sx={{ fontWeight: 600, mb: 0.5, color: '#065f46' }}> */}
                                            <Typography sx={{ fontWeight: 600, mb: 0.5, color: customTheme.primary }}>
                                                {/* {record.stories && record.stories.length > 0 ? (
                                                    record.stories.map(story =>
                                                        `${story.count} historia(s) de ${story.pointValue || story.points || '0'} punto(s)`
                                                    ).join(', ')
                                                ) : (
                                                    `${record.points?.toFixed(1) || '0'} punto(s) totales`
                                                )} */}

                                                {record.stories.map(story =>
                                                    `${story.count} historia(s) de ${story.pointValue || story.points || '0'} punto(s)`
                                                ).join(', ')}
                                            </Typography>
                                            {/* <Typography component="span" sx={{ color: '#6b7280', fontSize: '14px' }}> */}
                                            <Typography component="span" sx={{ color: customTheme.textSecondary, fontSize: '14px' }}>
                                                {/* {formatRecordDate(record.date || record.createdAt)} */}
                                                {formatRecordDate(record.registeredAt)}
                                                {/* {record.sprintName && ` • ${record.sprintName}`} */}
                                                {record.isInterruption && (
                                                    <Chip
                                                        label="Interrupción"
                                                        size="small"
                                                        sx={{ 
                                                            ml: 1, 
                                                            // bgcolor: '#fef3c7', 
                                                            // color: '#92400e' 
                                                            bgcolor: theme.palette.mode === 'dark' ? '#422006' : '#fef3c7', 
                                                            color: theme.palette.mode === 'dark' ? '#fbbf24' : '#92400e' 
                                                        }}
                                                    />
                                                )}
                                            </Typography>
                                        </Box>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default UserDashboard;