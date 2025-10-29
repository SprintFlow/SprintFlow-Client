import axiosClient from "../utils/axiosClient";

const sprintService = {
  getAll: async () => {
    const { data } = await axiosClient.get("/sprints");
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosClient.get(`/sprints/${id}`);
    return data;
  },

  create: async (sprintData) => {
    const { data } = await axiosClient.post("/sprints", sprintData);
    return data;
  },

  update: async (id, sprintData) => {
    const { data } = await axiosClient.put(`/sprints/${id}`, sprintData);
    return data;
  },

  delete: async (id) => {
    const { data } = await axiosClient.delete(`/sprints/${id}`);
    return data;
  },
};

export default sprintService;
