// src/services/ptService.js  (hoặc ptStudentService.js — tên tùy bạn)
import axios from '~/api/axiosClient'

export const isPTVerified = async () => {
  try {
    const res = await axios.get('/pt/me/verification-status')
    return res.data
  } catch (err) {
    console.error('❌ isPTVerified error:', err.response?.data || err.message)
    throw err.response?.data || { message: 'Failed to load PT verification status' }
  }
}
