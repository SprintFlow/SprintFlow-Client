// SprintServices.js - Servicios para la gestión de sprints
// Operaciones CRUD para la colección de sprints

import axiosClient from '../utils/axiosClient';

export const SprintServices = {
  // Obtener todos los sprints
  getAll: async () => {
    try {
      const response = await axiosClient.get('/sprints');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un sprint por ID
  getById: async (sprintId) => {
    try {
      const response = await axiosClient.get(`/sprints/${sprintId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo sprint
  create: async (sprintData) => {
    try {
      const response = await axiosClient.post('/sprints', sprintData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un sprint
  update: async (sprintId, sprintData) => {
    try {
      const response = await axiosClient.put(`/sprints/${sprintId}`, sprintData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un sprint
  delete: async (sprintId) => {
    try {
      const response = await axiosClient.delete(`/sprints/${sprintId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar estado del sprint
  updateStatus: async (sprintId, status) => {
    try {
      const response = await axiosClient.patch(`/sprints/${sprintId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener sprints por usuario
  getByUser: async (userId) => {
    try {
      const response = await axiosClient.get(`/sprints/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas del sprint
  getStats: async (sprintId) => {
    try {
      const response = await axiosClient.get(`/sprints/${sprintId}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default SprintServices;
