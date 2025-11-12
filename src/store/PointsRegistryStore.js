import { create } from 'zustand';
import axiosClient from '../utils/axiosClient';

const usePointsRegistryStore = create((set, get) => ({
    registries: [],
    isLoading: false,
    error: null,

    // === OBTENER REGISTROS DE UN USUARIO EN UN SPRINT ESPECÍFICO ===
    fetchUserRegistries: async (userId, sprintId) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axiosClient.get(
                `/points-registry/user/${userId}/sprint/${sprintId}`
            );

            set({ registries: data, isLoading: false });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al obtener registros';
            set({ error: errorMessage, isLoading: false });
            console.error('Error fetching registries:', error);
            return [];
        }
    },

    // === CREAR NUEVO REGISTRO DE PUNTOS ===
    createRegistry: async (registryData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axiosClient.post('/points-registry', registryData);

            // Agregar el nuevo registro al inicio del array
            set(state => ({
                registries: [data, ...state.registries],
                isLoading: false
            }));

            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al crear registro';
            set({ error: errorMessage, isLoading: false });
            console.error('Error creating registry:', error);
            throw new Error(errorMessage);
        }
    },

    // === OBTENER TODOS LOS REGISTROS DE UN USUARIO (HISTORIAL COMPLETO) ===
    fetchAllUserRegistries: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axiosClient.get(`/points-registry/user/${userId}`);

            set({ registries: data, isLoading: false });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al obtener registorial';
            set({ error: errorMessage, isLoading: false });
            console.error('Error fetching all registries:', error);
            return [];
        }
    },

    // === OBTENER TODOS LOS REGISTROS DE UN SPRINT (ADMIN/SCRUM MASTER) ===
    fetchSprintRegistries: async (sprintId) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axiosClient.get(`/points-registry/sprint/${sprintId}`);

            set({ registries: data, isLoading: false });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al obtener registros del sprint';
            set({ error: errorMessage, isLoading: false });
            console.error('Error fetching sprint registries:', error);
            return [];
        }
    },

    // === ELIMINAR UN REGISTRO ===
    deleteRegistry: async (registryId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosClient.delete(`/points-registry/${registryId}`);

            // Eliminar el registro del estado
            set(state => ({
                registries: state.registries.filter(r => r._id !== registryId),
                isLoading: false
            }));

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al eliminar registro';
            set({ error: errorMessage, isLoading: false });
            console.error('Error deleting registry:', error);
            throw new Error(errorMessage);
        }
    },

    // === LIMPIAR REGISTROS ===
    clearRegistries: () => set({ registries: [], error: null }),

    // === LIMPIAR ERROR ===
    clearError: () => set({ error: null }),
}));

export default usePointsRegistryStore;