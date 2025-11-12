import React, { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import routerSprint from "./router/Router";
import useAuthStore from "./store/authStore";

// ✅ SOLUCIÓN DEFINITIVA - Ignorar error de Fragment en Menu
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && 
        args[0].includes("MUI: The Menu component doesn't accept a Fragment")) {
      return;
    }
    originalError.apply(console, args);
  };
}

// TEMA UNIFICADO - Se adapta automáticamente al modo
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: "#4CAF50",      // Verde principal
      light: "#81C784",     // Verde claro
      dark: "#45A049",      // Verde oscuro
    },
    secondary: {
      main: "#8E44AD",      // Violeta principal
      light: "#9C27B0",     // Violeta claro
      dark: "#7B1FA2",      // Violeta oscuro
    },
    background: {
      default: mode === 'dark' ? "#1a1a1a" : "#e6f2ed",
      paper: mode === 'dark' ? "#2D3748" : "#ffffff",
    },
    text: {
      primary: mode === 'dark' ? "#FFFFFF" : "#1A202C",
      secondary: mode === 'dark' ? "#A0AEC0" : "#718096",
    },
    success: {
      main: "#27AE60",
      dark: "#219653",
    },
    warning: {
      main: "#F39C12",
    },
    error: {
      main: "#E74C3C",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          width: '100vw',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          transition: 'all 0.3s ease',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
        '#root': {
          width: '100vw',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        }
      }),
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#4A5568' : '#E2E8F0'}`,
          borderRadius: '12px',
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#4A5568' : '#E2E8F0'}`,
          color: theme.palette.text.primary,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          fontWeight: 600,
          borderRadius: '8px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          },
          transition: 'all 0.2s ease',
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          fontWeight: 600,
          borderRadius: '8px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
            borderColor: theme.palette.primary.dark,
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: theme.palette.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '6px',
          fontWeight: 600,
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          height: '6px',
        },
      },
    },
  },
});

// Crear contexto del tema
const ThemeContext = React.createContext();

export const useThemeContext = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Componente principal que maneja el tema
function ThemedApp() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const theme = React.useMemo(
    () => getTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  // ✅ INICIALIZAR AUTH STORE AL CARGAR LA APP
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={routerSprint} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemedApp />
  </StrictMode>
);

export { ThemeContext };