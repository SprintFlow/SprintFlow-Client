// src/theme/useThemeContext.js
import { useContext } from "react";
import { ThemeContext } from "../main";

// Hook personalizado para acceder al contexto del tema
export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext debe usarse dentro de ThemeProviderCustom");
  }

  return context; // devuelve { darkMode, toggleDarkMode }
};

export default useThemeContext;