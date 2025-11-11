// src/services/studentPackageService.js
import axios from '~/api/axiosClient'

// 🧩 Lấy tất cả gói tập của học viên hiện tại
export const fetchStudentPackages = async () => {
  try {
    console.log('🚀 Gọi API /student-packages/my-packages')

    const res = await axios.get('/student-packages/my-packages', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })

    console.log('📦 Dữ liệu gói tập trả về:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Lỗi khi fetch student packages:', error.response || error)
    throw error
  }
}

// 🧩 Xem chi tiết 1 gói cụ thể
export const fetchStudentPackageById = async (id) => {
  try {
    console.log(`🚀 Gọi API /student-packages/my-packages/${id}`)

    const res = await axios.get(`/student-packages/my-packages/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })

    console.log('📦 Chi tiết gói trả về:', res.data)
    return res.data
  } catch (error) {
    console.error(
      '❌ Lỗi khi fetch chi tiết student package:',
      error.response || error
    )
    throw error
  }
}

// ✅ Export tổng hợp để dễ import
export default {
  fetchStudentPackages,
  fetchStudentPackageById
}
