import axios from "axios";

// Se importa dinámicamente el store para evitar errores de carga
let useAuthStore;
(async () => {
  const mod = await import("../store/authStore");
  useAuthStore = mod.default;
})();

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// === Interceptor de REQUEST ===
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const token = useAuthStore?.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error al inyectar token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Interceptor de RESPONSE ===
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        useAuthStore?.getState().logout();
        window.location.href = "/login";
      } catch {
        console.warn("Fallo en logout automático");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
