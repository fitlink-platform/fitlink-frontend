// src/services/ptProfileService.js
import axios from '../api/axiosClient'

// 🔹 Lấy hồ sơ của PT hiện tại (đang đăng nhập)
export const getMyProfile = async () => {
  const res = await axios.get('/pt/profile/me')
  return res.data
}

// 🔹 Cập nhật hoặc tạo hồ sơ (upsert)
export const upsertMyProfile = async (payload) => {
  const res = await axios.put('/pt/profile/me', payload)
  return res.data
}

// 🔹 Xem hồ sơ công khai của một PT (dành cho Student)
export const getPTProfilePublic = async (ptId) => {
  const res = await axios.get(`/pt/${ptId}/profile`)
  return res.data
}

// 🔹 Xoá hồ sơ PT (tùy chọn, chỉ khi cần)
export const deleteMyProfile = async () => {
  const res = await axios.delete('/pt/profile/me')
  return res.data
}

const ptProfileService = {
  getMyProfile,
  upsertMyProfile,
  getPTProfilePublic,
  deleteMyProfile
}

export default ptProfileService
