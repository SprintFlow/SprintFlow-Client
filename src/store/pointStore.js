import { create } from "zustand";
import { persist } from "zustand/middleware";
import pointService from "../services/pointService";

const usePointStore = create(
  persist(
    (set, get) => ({
      userPoints: [], // Todos los registros del usuario
      recentRecords: [], // Últimos registros
      isLoading: false,
      error: null,

      // === OBTENER TODOS LOS PUNTOS DEL USUARIO ===
      fetchUserPoints: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const data = await pointService.getUserPoints(userId);

          //Ordenamos del más reciente al más antiguo
          const sorted = data.sort((a,b) => new Date(b.registeredAt) - new Date(a.registeredAt))

          set({
            // userPoints: data,
            userPoints: sorted,
            // recentRecords: data.slice(0, 10),
            recentRecords: sorted.slice(0, 10),
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          console.error("❌ Error en fetchUserPoints:", error);
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              "Error al cargar puntos del usuario",
          });
          return { success: false };
        }
      },

      // === OBTENER REGISTROS RECIENTES ===
      fetchRecentRecords: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const data = await pointService.getRecentRecords(userId);
          set({ recentRecords: data, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error("❌ Error en fetchRecentRecords:", error);
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              "Error al cargar registros recientes",
          });
          return { success: false };
        }
      },

      // === REGISTRAR NUEVOS PUNTOS ===
      registerPoints: async (pointData) => {
        set({ isLoading: true, error: null });
        try {
          // Aseguramos que el formato coincida con el schema del backend
          const stories = pointData.stories.map((story) => ({
            pointValue: story.points,
            count: story.count,
            subtotal: story.points * story.count,
          }));

          const totalPoints = stories.reduce(
            (sum, story) => sum + story.subtotal,
            0
          );

          const backendPointData = {
            userId: pointData.userId,
            sprintId: pointData.sprintId,
            stories,
            totalPoints,
            isInterruption: pointData.isInterruption || false,
            registeredAt: pointData.date || new Date(),
          };

          const data = await pointService.createPoint(backendPointData);

          // ✅ Actualizar estado local sin recargar
          set((state) => ({
            userPoints: [data, ...state.userPoints],
            recentRecords: [data, ...state.recentRecords.slice(0, 9)],
            isLoading: false,
          }));

          return { success: true, point: data };
        } catch (error) {
          console.error("❌ Error en registerPoints:", error);
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              "Error al registrar los puntos",
          });
          return { success: false };
        }
      },

      // === CALCULAR PUNTOS POR SPRINT ===
      getPointsBySprint: (sprintId) => {
        const { userPoints } = get();
        return userPoints
          .filter(
            (point) =>
              point.sprintId === sprintId || point.sprintId?._id === sprintId
          )
          .reduce((total, point) => total + (point.totalPoints || 0), 0);
      },

      // === CALCULAR PUNTOS TOTALES ===
      getTotalPoints: () => {
        const { userPoints } = get();
        return userPoints.reduce(
          (total, point) => total + (point.totalPoints || 0),
          0
        );
      },

      // === OBTENER REGISTROS POR SPRINT ===
      getSprintRecords: (sprintId) => {
        const { userPoints } = get();
        return userPoints
          .filter(
            (point) =>
              point.sprintId === sprintId || point.sprintId?._id === sprintId
          )
          .sort(
            (a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)
          );
      },

      clearError: () => set({ error: null }),
      clearPoints: () => set({ userPoints: [], recentRecords: [] }),
    }),
    {
      name: "point-storage",
      partialize: (state) => ({
        userPoints: state.userPoints,
        recentRecords: state.recentRecords,
      }),
    }
  )
);

export default usePointStore;
