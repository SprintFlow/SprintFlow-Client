import React, { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import routerSprint from "./router/Router";
import useAuthStore from "./store/authStore"; // ✅ Agregar esta importación

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

// Tema claro - Verde menta original
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    secondary: {
      main: "#065f46",
      light: "#047857",
      dark: "#064e3b",
    },
    background: {
      default: "#f0fdf4",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
});

// Tema oscuro - Verde profundo y elegante
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#10b981", // Verde menta para acentos
      light: "#34d399",
      dark: "#059669",
    },
    secondary: {
      main: "#065f46", // Verde oscuro elegante
      light: "#047857",
      dark: "#064e3b",
    },
    background: {
      default: "#0a0f1a", // Azul noche muy oscuro
      paper: "#111827",   // Azul grisáceo profundo
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#d1d5db",
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
      }),
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#1f2937' : '#e5e7eb'}`,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
          backgroundImage: 'none',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#1f2937' : '#e5e7eb'}`,
          color: theme.palette.text.primary,
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
    MuiTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? '#1a2332' : '#f8fafc',
          '& th': {
            color: theme.palette.text.primary,
            fontWeight: 600,
          },
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.mode === 'dark' ? '#131b28' : '#f9fafb',
          },
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1a2332' : '#f3f4f6',
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#1f2937' : '#e5e7eb'}`,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
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

  const theme = darkMode ? darkTheme : lightTheme;

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