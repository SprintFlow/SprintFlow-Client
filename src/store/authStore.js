import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../utils/axiosClient";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // === LOGIN ===
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosClient.post("/auth/login", credentials);

          // Guardar token en localStorage también
          if (data.token) {
            localStorage.setItem('token', data.token);
          }

          set({
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              isAdmin: data.user.isAdmin,
              avatar: data.user.avatar,
              hasConfiguredSecurity: data.user.hasConfiguredSecurity
            },
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al iniciar sesión",
          });
          return { success: false };
        }
      },

      // === REGISTER ===
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosClient.post("/auth/register", {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            securityQuestion: userData.securityQuestion,
            securityAnswer: userData.securityAnswer
          });

          // Login automático después del registro exitoso
          const loginResult = await get().login({
            email: userData.email,
            password: userData.password
          });

          return loginResult;

        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error en el registro",
          });
          return { success: false };
        }
      },

      // === FORGOT PASSWORD ===
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosClient.post("/auth/get-security-question", { email });
          return { success: true, securityQuestion: data.securityQuestion };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al procesar la solicitud",
          });
          return { success: false };
        }
      },

      // === VERIFY SECURITY ANSWER ===
      verifySecurityAnswer: async (email, answer) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosClient.post("/auth/verify-security-answer", {
            email,
            answer
          });
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Respuesta incorrecta",
          });
          return { success: false };
        }
      },

      // === RESET PASSWORD ===
      resetPassword: async (email, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axiosClient.post("/auth/reset-password", {
            email,
            newPassword
          });
          return { success: true, message: data.message };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al cambiar la contraseña",
          });
          return { success: false };
        }
      },

      // === LOGOUT ===
      logout: () => {
        // Limpiar localStorage también
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // === CHECK AUTH ===
      checkAuth: () => {
        const token = get().token || localStorage.getItem('token');
        return !!token;
      },

      // ✅ Añadir helper para verificar si es admin
      isAdmin: () => {
        const user = get().user;
        return user?.isAdmin === true;
      },

      // ✅ Actualizar información del usuario
      updateUser: (userData) => {
        const currentUser = get().user;
        set({
          user: {
            ...currentUser,
            ...userData
          }
        });
      },

      // === CLEAR ERROR ===
      clearError: () => set({ error: null }),

      // === INITIALIZE AUTH FROM LOCALSTORAGE ===
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
          // Opcional: hacer una petición para obtener datos del usuario
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;