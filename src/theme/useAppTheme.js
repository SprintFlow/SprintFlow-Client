// src/theme/useAppTheme.js
import { alpha } from "@mui/material/styles";
import { useThemeContext } from "../main";

const useAppTheme = () => {
  const { darkMode } = useThemeContext();

  const themeStyles = {
    primary: "#4CAF50",
    primaryDark: "#45A049",
    primaryLight: "#81C784",
    secondary: "#8E44AD",
    success: "#27AE60",
    successDark: "#219653",
    warning: "#F39C12",
    error: "#E74C3C",

    background: darkMode
      ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
      : "#e6f2ed",

    cardBg: darkMode ? "#2D3748" : "#ffffff",

    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    gradientAlt: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",

    textPrimary: darkMode ? "#FFFFFF" : "#1A202C",
    textSecondary: darkMode ? "#A0AEC0" : "#718096",
    textTertiary: darkMode ? "#808080" : "#A0AEC0",

    border: darkMode ? "1px solid #4A5568" : "1px solid #E2E8F0",

    shadow: darkMode
      ? "0 4px 24px rgba(0, 0, 0, 0.3)"
      : "0 4px 24px rgba(0, 0, 0, 0.06)",

    shadowHover: darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.4)"
      : "0 8px 32px rgba(0, 0, 0, 0.12)",

    statusColors: {
      Activo: darkMode ? "#64b5f6" : "#3498DB",
      Planificado: darkMode ? "#ba68c8" : "#8E44AD",
      Completado: darkMode ? "#81c784" : "#27AE60",
      "Completado Parcial": darkMode ? "#ffb74d" : "#F39C12",
    },

    statusBackgrounds: {
      Activo: darkMode
        ? `linear-gradient(135deg, ${alpha("#64b5f6", 0.15)} 0%, ${alpha(
            "#64b5f6",
            0.08
          )} 100%)`
        : `linear-gradient(135deg, ${alpha("#3498DB", 0.1)} 0%, ${alpha(
            "#3498DB",
            0.05
          )} 100%)`,
      Planificado: darkMode
        ? `linear-gradient(135deg, ${alpha("#ba68c8", 0.15)} 0%, ${alpha(
            "#ba68c8",
            0.08
          )} 100%)`
        : `linear-gradient(135deg, ${alpha("#8E44AD", 0.1)} 0%, ${alpha(
            "#8E44AD",
            0.05
          )} 100%)`,
      Completado: darkMode
        ? `linear-gradient(135deg, ${alpha("#81c784", 0.15)} 0%, ${alpha(
            "#81c784",
            0.08
          )} 100%)`
        : `linear-gradient(135deg, ${alpha("#27AE60", 0.1)} 0%, ${alpha(
            "#27AE60",
            0.05
          )} 100%)`,
      "Completado Parcial": darkMode
        ? `linear-gradient(135deg, ${alpha("#ffb74d", 0.15)} 0%, ${alpha(
            "#ffb74d",
            0.08
          )} 100%)`
        : `linear-gradient(135deg, ${alpha("#F39C12", 0.1)} 0%, ${alpha(
            "#F39C12",
            0.05
          )} 100%)`,
    },
  };

  return themeStyles;
};

export default useAppTheme;