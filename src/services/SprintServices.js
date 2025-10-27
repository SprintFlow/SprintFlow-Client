// SprintServices.js - Servicios para la gestión de sprints
// Operaciones CRUD para la colección de sprints

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

export const SprintServices = {
  // Obtener todos los sprints
  getAll: () => handleRequest(axiosClient.get('/sprints')),
  
  // Crear un nuevo sprint
  create: (data) => handleRequest(axiosClient.post('/sprints', data)),
  
  // Actualizar un sprint
  update: (id, data) => handleRequest(axiosClient.put(`/sprints/${id}`, data)),
  
  // Eliminar un sprint
  delete: (id) => handleRequest(axiosClient.delete(`/sprints/${id}`)),

  // Obtener un sprint por ID
  getById: (id) => handleRequest(axiosClient.get(`/sprints/${id}`)),
  
  // Obtener sprints por usuario
  getByUser: (userId) => handleRequest(axiosClient.get(`/sprints/user/${userId}`)),
  
  // Obtener estadísticas del sprint
  getStats: (sprintId) => handleRequest(axiosClient.get(`/sprints/${sprintId}/stats`))
};

export default SprintServices;
