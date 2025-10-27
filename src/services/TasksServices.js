// TasksServices.js - Servicios para la gestión de tareas
// Operaciones CRUD para la colección de tasks

import axiosClient from '../utils/axiosClient';

export const TasksServices = {
  // Obtener todas las tareas
  getAll: async () => {
    try {
      const response = await axiosClient.get('/tasks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener tarea por ID
  getById: async (taskId) => {
    try {
      const response = await axiosClient.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener tareas de una historia
  getByStory: async (storyId) => {
    try {
      const response = await axiosClient.get(`/tasks/story/${storyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener tareas de un sprint
  getBySprint: async (sprintId) => {
    try {
      const response = await axiosClient.get(`/tasks/sprint/${sprintId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener tareas asignadas a un usuario
  getByUser: async (userId) => {
    try {
      const response = await axiosClient.get(`/tasks/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva tarea
  create: async (taskData) => {
    try {
      const response = await axiosClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar tarea
  update: async (taskId, taskData) => {
    try {
      const response = await axiosClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar tarea
  delete: async (taskId) => {
    try {
      const response = await axiosClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar estado de la tarea
  updateStatus: async (taskId, status) => {
    try {
      const response = await axiosClient.patch(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Asignar tarea a usuario
  assignToUser: async (taskId, userId) => {
    try {
      const response = await axiosClient.patch(`/tasks/${taskId}/assign`, { userId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Registrar tiempo trabajado
  logTime: async (taskId, timeSpent, description) => {
    try {
      const response = await axiosClient.post(`/tasks/${taskId}/time-log`, {
        timeSpent,
        description
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default TasksServices;
