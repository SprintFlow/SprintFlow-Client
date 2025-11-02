import { create } from "zustand";
import sprintService from "../services/sprintService";

// Función para calcular el estado del sprint basado en fechas y puntos
const calculateSprintStatus = (sprint) => {
  const today = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  
  // Calcular estado basado en fechas
  let status;
  if (today < startDate) {
    status = "Planificado";
  } else if (today >= startDate && today <= endDate) {
    status = "Activo";
  } else {
    status = "Completado";
  }
  
  // Si está completado, verificar si alcanzó los puntos planificados
  if (status === "Completado") {
    const plannedPoints = sprint.plannedTotalPoints || 0;
    const completedPoints = sprint.completedPoints || 0;
    
    if (plannedPoints > 0 && completedPoints < plannedPoints) {
      return "Completado Parcial";
    }
  }
  
  return status;
};

const useSprintStore = create((set, get) => ({
  sprints: [],
  activeSprint: null,
  currentSprint: null, // Para el detalle
  isLoading: false,
  error: null,

  fetchSprints: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sprintService.getAll();
      
      // Calcular estado automático para cada sprint
      const sprintsWithCalculatedStatus = data.map(sprint => ({
        ...sprint,
        calculatedStatus: calculateSprintStatus(sprint)
      }));
      
      set({ sprints: sprintsWithCalculatedStatus, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Error al obtener sprints",
      });
    }
  },

  fetchSprintById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sprintService.getById(id);
      
      // Calcular estado automático
      const sprintWithCalculatedStatus = {
        ...data,
        calculatedStatus: calculateSprintStatus(data)
      };
      
      set({ currentSprint: sprintWithCalculatedStatus, isLoading: false });
      return { success: true, sprint: sprintWithCalculatedStatus };
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Error al obtener el sprint",
      });
      return { success: false };
    }
  },

  createSprint: async (sprintData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sprintService.create(sprintData);
      
      // Calcular estado automático para el nuevo sprint
      const sprintWithCalculatedStatus = {
        ...data,
        calculatedStatus: calculateSprintStatus(data)
      };
      
      set((state) => ({
        sprints: [...state.sprints, sprintWithCalculatedStatus],
        isLoading: false,
      }));
      return { success: true, sprint: sprintWithCalculatedStatus };
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Error al crear el sprint",
      });
      return { success: false };
    }
  },

  updateSprint: async (id, sprintData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sprintService.update(id, sprintData);
      
      // Calcular estado automático para el sprint actualizado
      const sprintWithCalculatedStatus = {
        ...data,
        calculatedStatus: calculateSprintStatus(data)
      };
      
      set((state) => ({
        sprints: state.sprints.map(sprint => 
          sprint._id === id ? sprintWithCalculatedStatus : sprint
        ),
        currentSprint: sprintWithCalculatedStatus,
        isLoading: false,
      }));
      return { success: true, sprint: sprintWithCalculatedStatus };
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Error al actualizar el sprint",
      });
      return { success: false };
    }
  },

  deleteSprint: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await sprintService.delete(id);
      set((state) => ({
        sprints: state.sprints.filter(sprint => sprint._id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Error al eliminar el sprint",
      });
      return { success: false };
    }
  },

  // Función helper para obtener el estado actual de un sprint
  getSprintStatus: (sprint) => {
    return calculateSprintStatus(sprint);
  },

  setActiveSprint: (sprint) => set({ activeSprint: sprint }),
  clearError: () => set({ error: null }),
  clearCurrentSprint: () => set({ currentSprint: null }),
}));

export default useSprintStore;