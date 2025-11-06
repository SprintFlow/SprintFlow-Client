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
} from "@mui/material";
import {
    AccountCircle,
    Dashboard,
    AdminPanelSettings,
    Logout,
    DarkMode,
    LightMode,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SprintFlowLogo from "../SprintFlowLogo";
import { useThemeContext } from "../../main"; // Importar desde main.jsx

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
    const noNavbarRoutes = ["/", "/login", "/register"];
    
    if (!isAuthenticated || noNavbarRoutes.includes(location.pathname)) {
        return null;
    }

    // Definir items del menú fuera del return
    const userMenuItems = [
        { path: "/user-dashboard", label: "Mi Dashboard", icon: <Dashboard /> },
        { path: "/results", label: "Resultados", icon: <Dashboard /> },
        { path: "/configuration", label: "Mi Perfil", icon: <AdminPanelSettings /> }
    ];

    const adminMenuItems = [
        { path: "/admin-dashboard", label: "Dashboard Admin", icon: <Dashboard /> },
        { path: "/create-sprint", label: "Gestión Sprints", icon: <Dashboard /> },
        { path: "/results", label: "Resultados", icon: <Dashboard /> },
        { path: "/configuration", label: "Mi Perfil", icon: <AdminPanelSettings /> }
    ];

    // Renderizar items del menú móvil
    const renderMobileMenuItems = () => {
        if (user && !user.isAdmin) {
            return userMenuItems.map((item) => (
                <MenuItem
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {item.icon}
                        {item.label}
                    </Box>
                </MenuItem>
            ));
        }

        if (user?.isAdmin) {
            return adminMenuItems.map((item) => (
                <MenuItem
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {item.icon}
                        {item.label}
                    </Box>
                </MenuItem>
            ));
        }

        return null;
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: 1,
                transition: 'all 0.3s ease',
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Logo y título */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SprintFlowLogo size={70} />
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#10b981", fontSize: "0.95rem" }}
                    >
                        SprintFlow
                    </Typography>
                </Box>

                {/* Menú de navegación - Solo en desktop */}
                {!isMobile && (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        {/* Botones para usuario regular */}
                        {user && !user.isAdmin && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/user-dashboard")}
                                    sx={{
                                        backgroundColor: location.pathname === "/user-dashboard" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/user-dashboard" ? 600 : 400
                                    }}
                                >
                                    Mi Dashboard
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/results")}
                                    sx={{
                                        backgroundColor: location.pathname === "/results" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/results" ? 600 : 400
                                    }}
                                >
                                    Resultados
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/configuration")}
                                    startIcon={<AdminPanelSettings />}
                                    sx={{
                                        backgroundColor: location.pathname === "/configuration" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/configuration" ? 600 : 400
                                    }}
                                >
                                    Mi Perfil
                                </Button>
                            </Box>
                        )}

                        {/* Botones para admin */}
                        {user?.isAdmin && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/admin-dashboard")}
                                    startIcon={<Dashboard />}
                                    sx={{
                                        backgroundColor: location.pathname === "/admin-dashboard" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/admin-dashboard" ? 600 : 400
                                    }}
                                >
                                    Dashboard Admin
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/create-sprint")}
                                    sx={{
                                        backgroundColor: location.pathname === "/create-sprint" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/create-sprint" ? 600 : 400
                                    }}
                                >
                                    Gestión Sprints
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/results")}
                                    sx={{
                                        backgroundColor: location.pathname === "/results" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/results" ? 600 : 400
                                    }}
                                >
                                    Resultados
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/configuration")}
                                    startIcon={<AdminPanelSettings />}
                                    sx={{
                                        backgroundColor: location.pathname === "/configuration" ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/configuration" ? 600 : 400
                                    }}
                                >
                                    Mi Perfil
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Menú de usuario y modo oscuro */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Botón de modo oscuro */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightMode sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                        <Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#10b981',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#10b981',
                                },
                            }}
                        />
                        <DarkMode sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                    </Box>

                    <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                        Hola, {user?.name}
                    </Typography>

                    <IconButton
                        onClick={handleMenu}
                        sx={{
                            border: "2px solid",
                            borderColor: "primary.main"
                        }}
                    >
                        <Avatar
                            src={user?.avatar}
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#10b981",
                                fontSize: "0.875rem"
                            }}
                        >
                            {!user?.avatar && (user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />)}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    >
                        {/* Menú móvil - Navegación */}
                        {isMobile && (
                            <Box>
                                {renderMobileMenuItems()}
                                <MenuItem divider />
                            </Box>
                        )}

                        {/* Información del usuario */}
                        <MenuItem disabled>
                            <Box>
                                <Typography variant="subtitle2">{user?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.email}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                    {user?.isAdmin ? "Administrador" : user?.role}
                                </Typography>
                            </Box>
                        </MenuItem>
                        <MenuItem divider />

                        {/* Cerrar sesión */}
                        <MenuItem
                            onClick={handleLogout}
                            sx={{ color: "error.main" }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Logout fontSize="small" />
                                Cerrar Sesión
                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}