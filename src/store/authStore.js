import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosClient from '../utils/axiosClient';

// Configuración inicial del estado
const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Store principal de autenticación simplificado 
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones - Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await axiosClient.post('/auth/login', credentials);
          const { token, user } = data;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Error en el login';
          set({
            isLoading: false,
            error: msg,
            isAuthenticated: false
          });
          return { success: false, error: msg };
        }
      },

      // Acciones - Register
      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await axiosClient.post('/auth/register', userData);
          const { token, user } = data;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Error en el registro';
          set({
            isLoading: false,
            error: msg,
            isAuthenticated: false
          });
          return { success: false, error: msg };
        }
      },

      // Acciones - Logout
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      // Acciones - Clear Error
      clearError: () => {
        set({ error: null });
      },

      // Getters/Selectors
      getToken: () => get().token,
      getUser: () => get().user,
      isLoggedIn: () => get().isAuthenticated,

      // Verificar autenticación
      checkAuth: async () => {
        const { token } = get();
        if (!token) return false;
        
        try {
          const response = await axiosClient.get('/auth/verify');
          return response.status === 200;
        } catch {
          get().logout();
          return false;
        }
      },

      // Reset store (útil para testing)
      reset: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;