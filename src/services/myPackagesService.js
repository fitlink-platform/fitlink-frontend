// src/services/myPackagesService.js
import axiosClient from '~/api/axiosClient'

const myPackagesService = {
  /* ---------------------------------------------------------
   * 📦 Lấy danh sách gói tập của học viên đang đăng nhập
   * GET /student-packages/my-packages
   * --------------------------------------------------------- */
  async getMyPackages() {
    try {
      const res = await axiosClient.get('/student-packages/my-packages')
      return res.data // { success, data: [...] }
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách gói tập:', error)
      throw error
    }
  },

  /* ---------------------------------------------------------
   * 🔍 Lấy chi tiết 1 gói tập theo ID
   * GET /student-packages/my-packages/:id
   * --------------------------------------------------------- */
  async getMyPackageById(packageId) {
    try {
      const res = await axiosClient.get(
        `/student-packages/my-packages/${packageId}`
      )
      return res.data // { success, data: {...} }
    } catch (error) {
      console.error('❌ Lỗi lấy chi tiết gói tập:', error)
      throw error
    }
  },

  /* ---------------------------------------------------------
   * 🗓 Lấy lịch tập theo packageId
   * GET /sessions?userId=...&role=student&packageId=...
   * --------------------------------------------------------- */
  async getSessionsByPackage(packageId, studentId) {
    try {
      const res = await axiosClient.get('/sessions', {
        params: {
          userId: studentId,
          role: 'student',
          packageId
        }
      })
      return res.data // { success, sessions: [...] }
    } catch (error) {
      console.error('❌ Lỗi lấy lịch tập theo gói:', error)
      throw error
    }
  }
}

export default myPackagesService
