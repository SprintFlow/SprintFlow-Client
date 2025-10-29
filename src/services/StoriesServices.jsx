import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_URL = "http://localhost:3000/stories"

// POST/ - Crear una historia ✅
export const createStory = async (storyData) => {
    try {
        const response = await axios.post(`${API_URL}`, storyData)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
}

// GET/ - Obtener todas las historias ✅
export const getStories = async () => {
    try {
        // const response = await axios.get(`${API_URL}`)
        const response = await axios.get(`${API_URL}?_expand=user&_expand=sprint`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
}

// GET/:id - Obtener una historia por ID ✅
export const getOneStory = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
}

// GET/sprint/:sprintId - Obtener historias por sprint
export const getStoriesBySprint = async (sprintId) => {
    try {
        const response = await axios.get(`${API_URL}/sprint/${sprintId}/stories`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
}

// PUT/:id - Actualizar una historia ✅
export const updateStory = async (id, storyData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, storyData)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
}

// PATCH/:id/points - Actualizar solo los puntos de una historia ✅
export const updateStoryPoints = async (id, points) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/points`, { points })
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
}

// DELETE/:id - Eliminar una historia ✅
export const deleteStory = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
}