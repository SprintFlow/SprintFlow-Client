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

  // Crear nuevo usuario
  create: async (userData) => {
    try {
      const { data } = await axiosClient.post("/users", userData);
      return data;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },

  // Actualizar usuario
  update: async (userId, userData) => {
    try {
      const { data } = await axiosClient.put(`/users/${userId}`, userData);
      return data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },

  // Eliminar usuario
  delete: async (userId) => {
    try {
      const { data } = await axiosClient.delete(`/users/${userId}`);
      return data;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },

  // Actualizar perfil propio
  updateProfile: async (profileData) => {
    try {
      console.log('UserService.updateProfile - Enviando:', {
        hasName: !!profileData.name,
        hasEmail: !!profileData.email,
        hasAvatar: !!profileData.avatar,
        avatarLength: profileData.avatar?.length
      });
      
      const { data } = await axiosClient.put("/users/profile", profileData);
      
      console.log('UserService.updateProfile - Respuesta:', {
        success: !!data,
        hasAvatar: !!data.user?.avatar
      });
      
      return data;
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      const { data } = await axiosClient.put("/users/change-password", passwordData);
      return data;
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      throw error;
    }
  },
};

export default UserService;
