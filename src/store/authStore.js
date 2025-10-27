import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Configuración inicial del estado
const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Store principal de autenticación simplificado - sin Immer
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones - Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          // SIMULACIÓN - Mock para desarrollo
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Credenciales de demo
          const demoUsers = [
            { email: 'admin@cohispania.com', password: 'demo123', role: 'admin', name: 'Administrador' },
            { email: 'dev@cohispania.com', password: 'demo123', role: 'user', name: 'Desarrollador' }
          ];

          const foundUser = demoUsers.find(u => 
            u.email === credentials.email && u.password === credentials.password
          );

          if (foundUser || (credentials.email && credentials.password)) {
            const mockUser = foundUser || {
              id: Date.now(),
              name: credentials.email.split('@')[0],
              email: credentials.email,
              role: 'user'
            };

            const mockToken = `mock-jwt-${mockUser.role}-${Date.now()}`;

            set({
              token: mockToken,
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });

            return { success: true };
          } else {
            throw new Error('Credenciales inválidas');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Error en el login',
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Acciones - Register
      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          // SIMULACIÓN - Mock para desarrollo
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockToken = `mock-jwt-user-${Date.now()}`;
          const mockUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            role: 'user'
          };

          set({
            token: mockToken,
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Error en el registro',
            isAuthenticated: false
          });
          return { success: false, error: error.message };
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
      checkAuth: () => {
        const { token } = get();
        return !!token;
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