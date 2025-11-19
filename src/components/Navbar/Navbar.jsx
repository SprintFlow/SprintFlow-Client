import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    useTheme,
    useMediaQuery,
    Switch,
    Divider,
    Chip,
} from "@mui/material";
import {
    AccountCircle,
    Dashboard,
    AdminPanelSettings,
    Logout,
    DarkMode,
    LightMode,
    TrendingUp,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SprintFlowLogo from "../SprintFlowLogo";
import { useThemeContext } from "../../main";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { darkMode, toggleDarkMode } = useThemeContext();

    const { user, isAuthenticated, logout } = useAuthStore();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate("/");
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleClose();
    };

    // Rutas donde NO debe mostrarse el navbar
    const noNavbarRoutes = ["/", "/login", "/register", "/forgot-password"];
    
    if (!isAuthenticated || noNavbarRoutes.includes(location.pathname)) {
        return null;
    }

    // Definir items del menú
    const userMenuItems = [
        { path: "/user-dashboard", label: "Mi Dashboard", icon: <Dashboard /> },
        { path: "/results", label: "Resultados", icon: <TrendingUp /> },
        { path: "/configuration", label: "Mi Perfil", icon: <AdminPanelSettings /> }
    ];

    const adminMenuItems = [
        { path: "/admin-dashboard", label: "Dashboard Admin", icon: <Dashboard /> },
        { path: "/create-sprint", label: "Crear sprint", icon: <AdminPanelSettings /> },
        { path: "/results", label: "Resultados", icon: <TrendingUp /> },
        { path: "/configuration", label: "Mi Perfil", icon: <AdminPanelSettings /> }
    ];

    const currentMenuItems = user?.isAdmin ? adminMenuItems : userMenuItems;

    // Función para verificar si la ruta está activa
    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    // Renderizar items del menú móvil
    const renderMobileMenuItems = () => {
        return currentMenuItems.map((item) => (
            <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                selected={isActiveRoute(item.path)}
                sx={{
                    backgroundColor: isActiveRoute(item.path) ? 
                        'rgba(76, 175, 80, 0.1)' : 'transparent',
                    '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    }
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ 
                        color: isActiveRoute(item.path) ? '#4CAF50' : theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {item.icon}
                    </Box>
                    <Typography 
                        variant="body2"
                        sx={{ 
                            fontWeight: isActiveRoute(item.path) ? 600 : 400,
                            color: isActiveRoute(item.path) ? '#4CAF50' : theme.palette.text.primary,
                        }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            </MenuItem>
        ));
    };

    // Renderizar botones de navegación para desktop
    const renderDesktopButtons = () => {
        return currentMenuItems.map((item) => (
            <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                    backgroundColor: isActiveRoute(item.path) ? 
                        'rgba(76, 175, 80, 0.1)' : 'transparent',
                    color: isActiveRoute(item.path) ? '#4CAF50' : theme.palette.text.primary,
                    fontWeight: isActiveRoute(item.path) ? 600 : 400,
                    borderRadius: '8px',
                    // px: 2,
                    py: 1,
                    '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                        transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                }}
            >
                {item.label}
            </Button>
        ));
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#4A5568' : '#E2E8F0'}`,
                transition: 'all 0.3s ease',
            }}
        >
            <Toolbar sx={{ 
                justifyContent: "space-between",
                minHeight: '70px !important',
                px: { xs: 2, sm: 3, md: 4 },
            }}>
                {/* Logo y título */}
                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 2,
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate(user?.isAdmin ? "/admin-dashboard" : "/user-dashboard")}
                >
                    <SprintFlowLogo size={80}/>
                    <Typography
                        variant="h6"
                        sx={{ 
                            fontWeight: 700, 
                            color: "#4CAF50",
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                            background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        SprintFlow
                    </Typography>
                </Box>

                {/* Menú de navegación - Solo en desktop */}
                {!isMobile && (
                    <Box sx={{ 
                        display: "flex", 
                        gap: 1, 
                        alignItems: "center",
                        flex: 1,
                        justifyContent: 'center',
                        mx: 4
                    }}>
                        {renderDesktopButtons()}
                    </Box>
                )}

                {/* Menú de usuario y modo oscuro */}
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 3 
                }}>
                    {/* Botón de modo oscuro */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '20px',
                        px: 1.5,
                        py: 0.5,
                    }}>
                        <LightMode sx={{ 
                            fontSize: 20, 
                            color: !darkMode ? '#4CAF50' : theme.palette.text.secondary 
                        }} />
                        <Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            size="small"
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#4CAF50',
                                    '&:hover': {
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#4CAF50',
                                },
                            }}
                        />
                        <DarkMode sx={{ 
                            fontSize: 20, 
                            color: darkMode ? '#4CAF50' : theme.palette.text.secondary 
                        }} />
                    </Box>

                    {/* Información del usuario */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontWeight: 500,
                                    color: theme.palette.text.primary
                                }}
                            >
                                Hola, {user?.name}
                            </Typography>
                        </Box>
                    )}

                    {/* Avatar y menú */}
                    <IconButton
                        onClick={handleMenu}
                        sx={{
                            border: `2px solid ${theme.palette.primary.main}`,
                            '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Avatar
                            src={user?.avatar}
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: theme.palette.primary.main,
                                fontSize: "0.875rem",
                                fontWeight: 600,
                            }}
                        >
                            {!user?.avatar && (user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />)}
                        </Avatar>
                    </IconButton>

                    {/* Menú desplegable */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 240,
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.mode === 'dark' ? '#4A5568' : '#E2E8F0'}`,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {/* Menú móvil - Navegación */}
                        {isMobile && (
                            <Box>
                                {renderMobileMenuItems()}
                                <Divider />
                            </Box>
                        )}

                        {/* Información del usuario */}
                        <MenuItem disabled sx={{ opacity: 1, py: 2 }}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {user?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {user?.email}
                                </Typography>
                                <Chip
                                    label={user?.isAdmin ? "Administrador" : "Usuario"}
                                    size="small"
                                    sx={{
                                        backgroundColor: user?.isAdmin ? '#8E44AD' : '#4CAF50',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.65rem',
                                        height: '20px',
                                        mt: 0.5,
                                    }}
                                />
                            </Box>
                        </MenuItem>
                        <Divider />

                        {/* Cerrar sesión */}
                        <MenuItem
                            onClick={handleLogout}
                            sx={{ 
                                color: theme.palette.error.main,
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Logout fontSize="small" />
                                <Typography variant="body2" fontWeight={500}>
                                    Cerrar Sesión
                                </Typography>
                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}