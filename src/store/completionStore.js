import { create } from "zustand";
import { persist } from "zustand/middleware";
import { completionService } from "../services/completionServices";

const useCompletionStore = create(
  persist(
    (set, get) => ({
      completions: [],
      isLoading: false,
      error: null,

      // === GET ALL COMPLETIONS FOR A SPRINT ===
      fetchCompletions: async (sprintId) => {
        set({ isLoading: true, error: null });
        try {
          const data = await completionService.getCompletionsBySprint(sprintId);
          set({ completions: data, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al cargar completions",
          });
          return { success: false };
        }
      },

      // === CREATE OR UPDATE COMPLETION ===
      saveCompletion: async (completionData) => {
        set({ isLoading: true, error: null });
        try {
          const existing = get().completions.find(
            (c) =>
              c.sprintId === completionData.sprintId &&
              c.userId === completionData.userId
          );

          let saved;
          if (existing) {
            saved = await completionService.updateCompletion(
              existing._id,
              completionData
            );
            set({
              completions: get().completions.map((c) =>
                c._id === existing._id ? saved : c
              ),
            });
          } else {
            saved = await completionService.createCompletion(completionData);
            set({ completions: [...get().completions, saved] });
          }

          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al guardar completion",
          });
          return { success: false };
        }
      },

      clearCompletions: () => set({ completions: [], error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "completion-storage",
      partialize: (state) => ({
        completions: state.completions,
      }),
    }
  )
);

export default useCompletionStore;
