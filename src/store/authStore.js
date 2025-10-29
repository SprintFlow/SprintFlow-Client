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

          // Guardar toda la información del usuario
          set({
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              isAdmin: data.user.isAdmin  // IMPORTANTE
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
          const { data } = await axiosClient.post("/auth/register", userData);

          set({
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              isAdmin: data.user.isAdmin
            },
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al registrarse",
          });
          return { success: false };
        }
      },

      // === LOGOUT ===
      logout: () => {
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
        const token = get().token;
        return !!token;
      },

      // ✅ Añadir helper para verificar si es admin
      isAdmin: () => {
        const user = get().user;
        return user?.isAdmin === true;
      },

      // === CLEAR ERROR ===
      clearError: () => set({ error: null }),
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