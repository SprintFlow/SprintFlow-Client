// src/services/completionServices.js
import axiosClient from "../utils/axiosClient";

export const completionService = {
  // Obtener todas las completions de un sprint
  getCompletionsBySprint: async (sprintId) => {
    try {
      const response = await axiosClient.get(`/completions?sprintId=${sprintId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva completion
  createCompletion: async (completionData) => {
    try {
      const response = await axiosClient.post("/completions", completionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una completion existente
  updateCompletion: async (completionId, completionData) => {
    try {
      const response = await axiosClient.put(`/completions/${completionId}`, completionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Opcional: eliminar una completion
  deleteCompletion: async (completionId) => {
    try {
      const response = await axiosClient.delete(`/completions/${completionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
