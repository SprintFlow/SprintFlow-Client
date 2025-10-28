
// Ejemplo de cómo usar el axiosClient en otros componentes/servicios

import axiosClient from '../utils/axiosClient';

// Ejemplo de servicio para sprints
export const sprintService = {
  // Obtener todos los sprints
  getAllSprints: async () => {
    try {
      const response = await axiosClient.get('/sprints');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo sprint
  createSprint: async (sprintData) => {
    try {
      const response = await axiosClient.post('/sprints', sprintData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un sprint
  updateSprint: async (sprintId, sprintData) => {
    try {
      const response = await axiosClient.put(`/sprints/${sprintId}`, sprintData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un sprint
  deleteSprint: async (sprintId) => {
    try {
      const response = await axiosClient.delete(`/sprints/${sprintId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Ejemplo de servicio para usuarios
export const userService = {
  // Obtener perfil del usuario
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
};

// Ejemplo de cómo usar en un componente
/*
import { sprintService } from '../services/apiServices';
import useAuthStore from '../store/authStore';
const SprintsList = () => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const data = await sprintService.getAllSprints();
        setSprints(data);
      } catch (error) {
        console.error('Error fetching sprints:', error);
        // Si es un error de autenticación, el interceptor ya habrá hecho logout
      } finally {
        setLoading(false);
      }
    };
    fetchSprints();
  }, []);
  // resto del componente...
};
*/