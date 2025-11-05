import axiosClient from "../utils/axiosClient";

const pointService = {
  // === Crear nuevo registro de puntos ===
  createPoint: async (pointData) => {
    try {
      console.log("📤 Enviando POST a /points-registry con datos:", pointData);

      const response = await axiosClient.post("/points-registry", pointData);

      console.log("✅ Puntos creados exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error en createPoint:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw (
        error.response?.data || {
          message: "Error al crear los puntos",
          error: error.message,
        }
      );
    }
  },

  // === Obtener registros de un usuario ===
  getUserPoints: async (userId) => {
    try {
      console.log(`📥 Obteniendo puntos del usuario ${userId}`);
      const response = await axiosClient.get(`/points-registry/user/${userId}`);
      console.log(`✅ Registros obtenidos (${response.data.length})`);
      return response.data;
    } catch (error) {
      console.error("❌ Error en getUserPoints:", error);
      throw error.response?.data || { message: "Error al obtener los puntos" };
    }
  },

  // === Obtener registros de un usuario en un sprint específico ===
  getUserSprintPoints: async (userId, sprintId) => {
    try {
      console.log(`📥 Obteniendo puntos del usuario ${userId} en sprint ${sprintId}`);
      const response = await axiosClient.get(
        `/points-registry/user/${userId}/sprint/${sprintId}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en getUserSprintPoints:", error);
      throw error.response?.data || { message: "Error al obtener puntos del sprint" };
    }
  },

  // === Obtener los 10 registros más recientes ===
  getRecentRecords: async (userId) => {
    try {
      const registries = await pointService.getUserPoints(userId);
      const recent = registries.slice(0, 10);
      console.log(`🕒 Últimos ${recent.length} registros devueltos`);
      return recent;
    } catch (error) {
      console.error("❌ Error en getRecentRecords:", error);
      throw error;
    }
  },

  // === Eliminar un registro de puntos ===
  deletePoint: async (pointId) => {
    try {
      console.log(`🗑️ Eliminando registro con ID ${pointId}`);
      const response = await axiosClient.delete(`/points-registry/${pointId}`);
      console.log("✅ Registro eliminado");
      return response.data;
    } catch (error) {
      console.error("❌ Error en deletePoint:", error);
      throw error.response?.data || { message: "Error al eliminar el registro" };
    }
  },
};

export default pointService;
