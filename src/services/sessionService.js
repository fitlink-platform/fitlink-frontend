// src/services/sessionService.js
import axios from '~/api/axiosClient'

// Lấy toàn bộ session của chính mình (PT thấy tất cả của mình; Student thấy lịch của mình)
export const getMySessions = async () => {
  const res = await axios.get('/sessions/my')
  return res.data // { success, data: [...] }
}

export const createSession = async (payload) => {
  const res = await axios.post('/sessions', payload)
  return res.data
}

export const updateSession = async (id, payload) => {
  const res = await axios.put(`/sessions/${id}`, payload)
  return res.data
}

export const deleteSession = async (id) => {
  const res = await axios.delete(`/sessions/${id}`)
  return res.data
}
