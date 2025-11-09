import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/messages";

export const messageApi = {
  getMessages: (chatId) => axios.get(`${API_URL}/${chatId}`),
  sendMessage: (data) => axios.post(API_URL, data),
};
