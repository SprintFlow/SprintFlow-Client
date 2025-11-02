import { create } from "zustand";
import sprintService from "../services/sprintService";

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
      set({ sprints: data, isLoading: false });
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
      set({ currentSprint: data, isLoading: false });
      return { success: true, sprint: data };
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
      set((state) => ({
        sprints: [...state.sprints, data],
        isLoading: false,
      }));
      return { success: true, sprint: data };
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
      set((state) => ({
        sprints: state.sprints.map(sprint => 
          sprint._id === id ? data : sprint
        ),
        currentSprint: data,
        isLoading: false,
      }));
      return { success: true, sprint: data };
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

  setActiveSprint: (sprint) => set({ activeSprint: sprint }),
  clearError: () => set({ error: null }),
  clearCurrentSprint: () => set({ currentSprint: null }),
}));

export default useSprintStore;