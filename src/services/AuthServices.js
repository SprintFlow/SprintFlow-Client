import axiosClient from "../utils/axiosClient";

const AuthServices = {
  // LOGIN
  login: async (email, password) => {
    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });
      // data: { token, userId, name, email, role }
      return data;
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error;
    }
  },

  // REGISTER
  register: async (userData) => {
    try {
      const { data } = await axiosClient.post("/auth/register", userData);
      // data: { token, user: { id, name, email, role } }
      return data;
    } catch (error) {
      console.error("Error en registro:", error.response?.data || error.message);
      throw error;
    }
  },

  // LOGOUT
  logout: () => {
    // Limpia el store de auth y opcionalmente el localStorage
    try {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirige al login
    } catch (err) {
      console.warn("Error al hacer logout:", err);
    }
  },

  // GET CURRENT USER (opcional)
  getCurrentUser: async () => {
    try {
      const { data } = await axiosClient.get("/auth/me"); // si tu backend tiene /auth/me
      return data;
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default AuthServices;