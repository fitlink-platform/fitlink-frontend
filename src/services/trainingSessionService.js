// // src/services/trainingSessionService.js
// import axios from '~/api/axiosClient'

// // ✅ Lấy danh sách buổi tập (tất cả, sắp tới, đang diễn ra, đã qua)
// export const fetchTrainingSessions = async ({ userId, role, type = '' }) => {
//   try {
//     console.log('🚀 Gọi API /training-sessions với params:', {
//       userId,
//       role,
//       type,

//     })

//     const res = await axios.get('training-sessions', {
//       params: { userId, role, type },
//       headers: {
//         'Cache-Control': 'no-cache',
//         Pragma: 'no-cache',
//         Expires: '0'
//       }
//     })

//     console.log('📦 Dữ liệu trả về từ server:', res.data)
//     return res.data
//   } catch (error) {
//     console.error(
//       '❌ Lỗi khi fetch training sessions:',
//       error.response || error
//     )
//     throw error
//   }
// }

// // ✅ Các hàm rút gọn (nếu cần)
// export const getAllSessions = (userId, role) =>
//   fetchTrainingSessions({ userId, role })

// export const getUpcomingSessions = (userId, role) =>
//   fetchTrainingSessions({ userId, role, type: 'upcoming' })

// export const getOngoingSessions = (userId, role) =>
//   fetchTrainingSessions({ userId, role, type: 'ongoing' })

// export const getHistorySessions = (userId, role) =>
//   fetchTrainingSessions({ userId, role, type: 'history' })

// export default {
//   fetchTrainingSessions,
//   getAllSessions,
//   getUpcomingSessions,
//   getOngoingSessions,
//   getHistorySessions
// }
// src/services/trainingSessionService.js
import axios from '~/api/axiosClient'

// ✅ Lấy danh sách buổi tập (tất cả, sắp tới, đang diễn ra, đã qua, theo gói)
export const fetchTrainingSessions = async ({
  userId,
  role,
  type = '',
  packageId = '' // 🧩 thêm tham số lọc gói
}) => {
  try {
    console.log('🚀 Gọi API /training-sessions với params:', {
      userId,
      role,
      type,
      packageId
    })

    const res = await axios.get('training-sessions', {
      params: { userId, role, type, packageId }, // ✅ truyền packageId
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })

    console.log('📦 Dữ liệu trả về từ server:', res.data)
    return res.data
  } catch (error) {
    console.error(
      '❌ Lỗi khi fetch training sessions:',
      error.response || error
    )
    throw error
  }
}

// ✅ Các hàm rút gọn (nếu cần)
export const getAllSessions = (userId, role, packageId) =>
  fetchTrainingSessions({ userId, role, packageId })

export const getUpcomingSessions = (userId, role, packageId) =>
  fetchTrainingSessions({ userId, role, type: 'upcoming', packageId })

export const getOngoingSessions = (userId, role, packageId) =>
  fetchTrainingSessions({ userId, role, type: 'ongoing', packageId })

export const getHistorySessions = (userId, role, packageId) =>
  fetchTrainingSessions({ userId, role, type: 'history', packageId })

export default {
  fetchTrainingSessions,
  getAllSessions,
  getUpcomingSessions,
  getOngoingSessions,
  getHistorySessions
}
