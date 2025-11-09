import axiosClient from "~/api/axiosClient";

// Service gọi API student
export const studentService = {
  async getAllStudents() {
    try {
      const res = await axiosClient.get("/admin/students");
      // Nếu backend trả trực tiếp mảng → return res.data
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách student:", error);
      throw error;
    }
  },
};
