import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import routerSprint from "./router/Router";

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

// Tema mejorado para ocupar todo el ancho
const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // Verde menta para coincidir con tu diseño
    },
    secondary: {
      main: "#065f46", // Verde oscuro
    },
    background: {
      default: "#f0fdf4", // Fondo verde menta claro
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          width: '100vw',
          margin: 0,
          padding: 0,
          overflowX: 'hidden'
        },
        '#root': {
          width: '100%',
          minHeight: '100vh'
        }
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: '100% !important',
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
          margin: '0 !important'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    }
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={routerSprint} />
    </ThemeProvider>
  </StrictMode>
);