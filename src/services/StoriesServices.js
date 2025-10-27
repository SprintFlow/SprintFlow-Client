// StoriesServices.js - Servicios para la gestión de historias de usuario
// Operaciones CRUD para la colección de stories/user stories

import axiosClient from '../utils/axiosClient';

export const StoriesServices = {
  // Obtener todas las historias
  getAll: async () => {
    try {
      const response = await axiosClient.get('/stories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener historia por ID
  getById: async (storyId) => {
    try {
      const response = await axiosClient.get(`/stories/${storyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener historias de un sprint
  getBySprint: async (sprintId) => {
    try {
      const response = await axiosClient.get(`/stories/sprint/${sprintId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva historia
  create: async (storyData) => {
    try {
      const response = await axiosClient.post('/stories', storyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar historia
  update: async (storyId, storyData) => {
    try {
      const response = await axiosClient.put(`/stories/${storyId}`, storyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar historia
  delete: async (storyId) => {
    try {
      const response = await axiosClient.delete(`/stories/${storyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar estado de la historia
  updateStatus: async (storyId, status) => {
    try {
      const response = await axiosClient.patch(`/stories/${storyId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Asignar historia a sprint
  assignToSprint: async (storyId, sprintId) => {
    try {
      const response = await axiosClient.patch(`/stories/${storyId}/sprint`, { sprintId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Asignar historia a usuario
  assignToUser: async (storyId, userId) => {
    try {
      const response = await axiosClient.patch(`/stories/${storyId}/assign`, { userId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar estimación de historia
  updateEstimation: async (storyId, estimation) => {
    try {
      const response = await axiosClient.patch(`/stories/${storyId}/estimation`, { estimation });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default StoriesServices;
