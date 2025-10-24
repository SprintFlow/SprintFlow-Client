import axios from 'axios';
import useAuthStore from '../store/authStore';

// Configurar la base URL de tu API
const API_BASE_URL = 'http://localhost:3000/api';

// Crear instancia de axios
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token ha expirado (401), hacer logout automático
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Opcional: redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
