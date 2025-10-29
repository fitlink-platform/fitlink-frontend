import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/feedbacks";

export const feedbackApi = {
  create: (data) => axios.post(API_URL, data),
  getByPT: (ptId) => axios.get(`${API_URL}/pt/${ptId}`),
};
