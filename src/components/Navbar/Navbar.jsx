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
} from "@mui/material";
import {
    AccountCircle,
    Dashboard,
    AdminPanelSettings,
    Logout,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SprintFlowLogo from "../SprintFlowLogo";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    
    // No mostrar navbar si:
    // 1. No está autenticado O
    // 2. Está en una ruta de autenticación
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
                backgroundColor: "white",
                color: "text.primary",
                boxShadow: 1
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Logo y título */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SprintFlowLogo size={70} />
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#4CAF50", fontSize: "0.95rem" }}
                    >
                        SprintFlow
                    </Typography>
                </Box>

                {/* Menú de navegación - Solo en desktop */}
                {!isMobile && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {/* Botones para usuario regular */}
                        {user && !user.isAdmin && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/user-dashboard")}
                                    sx={{
                                        backgroundColor: location.pathname === "/user-dashboard" ? "rgba(76, 175, 80, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/user-dashboard" ? 600 : 400
                                    }}
                                >
                                    Mi Dashboard
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/results")}
                                    sx={{
                                        backgroundColor: location.pathname === "/results" ? "rgba(76, 175, 80, 0.1)" : "transparent",
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
                                        backgroundColor: location.pathname === "/configuration" ? "rgba(76, 175, 80, 0.1)" : "transparent",
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
                                        backgroundColor: location.pathname === "/admin-dashboard" ? "rgba(76, 175, 80, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/admin-dashboard" ? 600 : 400
                                    }}
                                >
                                    Dashboard Admin
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/create-sprint")}
                                    sx={{
                                        backgroundColor: location.pathname === "/create-sprint" ? "rgba(76, 175, 80, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/create-sprint" ? 600 : 400
                                    }}
                                >
                                    Gestión Sprints
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate("/results")}
                                    sx={{
                                        backgroundColor: location.pathname === "/results" ? "rgba(76, 175, 80, 0.1)" : "transparent",
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
                                        backgroundColor: location.pathname === "/configuration" ? "rgba(76, 175, 80, 0.1)" : "transparent",
                                        fontWeight: location.pathname === "/configuration" ? 600 : 400
                                    }}
                                >
                                    Mi Perfil
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Menú de usuario */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#4CAF50",
                                fontSize: "0.875rem"
                            }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200
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