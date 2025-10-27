// UserServices.js - Servicios para la gestión de usuarios
// Operaciones CRUD para la colección de usuarios

import axiosClient from '../utils/axiosClient';

// Manejo centralizado de errores
const handleRequest = async (request) => {
  try {
    return await request;
  } catch (err) {
    console.error('API Error:', err);
    throw err.response?.data || err;
  }
};

export const UserServices = {
  // Obtener perfil del usuario actual
  getProfile: () => handleRequest(axiosClient.get('/users/profile')),
  
  // Actualizar perfil del usuario
  updateProfile: (data) => handleRequest(axiosClient.put('/users/profile', data)),

  // Obtener todos los usuarios (admin)
  getAll: () => handleRequest(axiosClient.get('/users')),
  
  // Obtener usuario por ID
  getById: (userId) => handleRequest(axiosClient.get(`/users/${userId}`)),
  
  // Crear nuevo usuario (admin)
  create: (userData) => handleRequest(axiosClient.post('/users', userData)),
  
  // Actualizar usuario (admin)
  update: (userId, userData) => handleRequest(axiosClient.put(`/users/${userId}`, userData)),
  
  // Eliminar usuario (admin)
  delete: (userId) => handleRequest(axiosClient.delete(`/users/${userId}`)),
  
  // Cambiar rol del usuario
  updateRole: (userId, role) => handleRequest(axiosClient.patch(`/users/${userId}/role`, { role })),
  
  // Cambiar contraseña
  changePassword: (currentPassword, newPassword) => 
    handleRequest(axiosClient.patch('/users/password', { currentPassword, newPassword }))
};

export default UserServices;
