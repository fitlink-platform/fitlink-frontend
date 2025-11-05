import axios from "~/api/axiosClient";

/**
 * 📋 Admin: Lấy danh sách yêu cầu PT
 */
export const getAllPTRequests = async () => {
  const res = await axios.get("/admin/pt-requests");
  return res.data;
};

/**
 * 🔍 Admin: Lấy chi tiết một yêu cầu PT
 */
export const getPTRequestDetail = async (id) => {
  const res = await axios.get(`/admin/pt-requests/${id}`);
  return res.data;
};

/**
 * ✅ Admin: Duyệt hoặc từ chối hồ sơ PT
 * @param {string} id - ID của yêu cầu PT
 * @param {"approve"|"reject"} action - hành động
 * @param {string} reason - lý do (nếu từ chối)
 */
export const reviewPTRequest = async (id, action, reason = "") => {
  const res = await axios.post(`/admin/pt-requests/${id}/review`, {
    action,
    reason,
  });
  return res.data;
};

export default {
  getAllPTRequests,
  getPTRequestDetail,
  reviewPTRequest,
};
