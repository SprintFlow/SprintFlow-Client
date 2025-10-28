import { create } from "zustand";
import sprintService from "../services/sprintService";

const useSprintStore = create((set, get) => ({
  sprints: [],
  activeSprint: null,
  isLoading: false,
  error: null,

  // === Obtener todos los sprints ===
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

  // === Crear nuevo sprint ===
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

  // === Seleccionar sprint activo ===
  setActiveSprint: (sprint) => set({ activeSprint: sprint }),

  // === Limpiar errores ===
  clearError: () => set({ error: null }),
}));

export default useSprintStore;
