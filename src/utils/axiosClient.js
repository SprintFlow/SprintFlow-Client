import axios from "axios";

// ✅ Configuración para desarrollo y producción
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

console.log('🔗 Conectando a:', baseURL); // Para debug

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response mejorado
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error de axios:", error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      // Redirigir al login
      if (window.location.pathname !== '/login') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;