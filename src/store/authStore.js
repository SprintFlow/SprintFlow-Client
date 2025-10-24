import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Configurar axios base URL (ajusta según tu backend)
const API_BASE_URL = 'http://localhost:3000/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acción para login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // SIMULACIÓN - Reemplazar cuando tengas backend real
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de red
          
          // Validar credenciales demo
          const validCredentials = [
            { email: 'admin@cohispania.com', password: 'demo123', role: 'admin' },
            { email: 'dev@cohispania.com', password: 'demo123', role: 'user' },
            { email: credentials.email, password: credentials.password, role: 'user' } // Cualquier email/password funciona
          ];
          
          const foundUser = validCredentials.find(u => 
            u.email === credentials.email && u.password === credentials.password
          );
          
          if (!foundUser && credentials.email && credentials.password) {
            // Si no es un usuario demo, crear uno temporal
            const mockToken = 'mock-jwt-token-' + Date.now();
            const mockUser = {
              id: Date.now(),
              name: credentials.email.split('@')[0],
              email: credentials.email,
              role: 'user'
            };
            
            set({
              token: mockToken,
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return { success: true };
          } else if (foundUser) {
            // Usuario demo encontrado
            const mockToken = 'mock-jwt-token-' + Date.now();
            const mockUser = {
              id: Date.now(),
              name: foundUser.role === 'admin' ? 'Administrador' : 'Desarrollador',
              email: foundUser.email,
              role: foundUser.role
            };
            
            set({
              token: mockToken,
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return { success: true };
          } else {
            throw new Error('Credenciales inválidas');
          }
        } catch (error) {
          const errorMessage = error.message || 'Error en el login';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      // Acción para register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // SIMULACIÓN - Reemplazar cuando tengas backend real
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de red
          
          // Simular respuesta exitosa
          const mockToken = 'mock-jwt-token-' + Date.now();
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
            error: null,
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = 'Error en el registro';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      // Acción para logout
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Limpiar errores
      clearError: () => {
        set({ error: null });
      },

      // Obtener token (para usar en peticiones)
      getToken: () => {
        return get().token;
      },

      // Verificar autenticación
      checkAuth: () => {
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: 'auth-storage', // nombre para localStorage
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;