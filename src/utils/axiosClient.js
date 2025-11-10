import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ SOLO UN interceptor de request
axiosClient.interceptors.request.use(
  (config) => {
    // Obtener token de localStorage en lugar de useAuthStore
    // para evitar importación circular
    const token = localStorage.getItem('token');
    console.log("Token enviado:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor de response mejorado
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