// UserServices.js - Servicios para la gestión de usuarios
// Operaciones CRUD para la colección de usuarios

import axiosClient from '../utils/axiosClient';

export const UserServices = {
  // Obtener perfil del usuario actual
  getProfile: async () => {
    try {
      const response = await axiosClient.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (userData) => {
    try {
      const response = await axiosClient.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todos los usuarios (admin)
  getAll: async () => {
    try {
      const response = await axiosClient.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario por ID
  getById: async (userId) => {
    try {
      const response = await axiosClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo usuario (admin)
  create: async (userData) => {
    try {
      const response = await axiosClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar usuario (admin)
  update: async (userId, userData) => {
    try {
      const response = await axiosClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar usuario (admin)
  delete: async (userId) => {
    try {
      const response = await axiosClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar rol del usuario
  updateRole: async (userId, role) => {
    try {
      const response = await axiosClient.patch(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosClient.patch('/user/password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default UserServices;
