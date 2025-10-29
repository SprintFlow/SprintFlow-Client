import axiosClient from "../utils/axiosClient";

const UserService = {
  // Traer todos los usuarios (solo admin)
  getAll: async () => {
    try {
      const { data } = await axiosClient.get("/users");
      // data debería ser un array con { _id, name, email, role, ... }
      return data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },
};

export default UserService;
