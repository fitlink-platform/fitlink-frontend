// src/services/notificationService.js
import axiosClient from '~/api/axiosClient';

/**
 * 📬 Lấy danh sách thông báo của người dùng hiện tại
 */
/*export const getNotifications = async () => {
  const res = await axiosClient.get('/notifications');
  return res.data;
};*/
export const getNotifications = async () => {
  const res = await axiosClient.get('/notifications');
  console.log("📬 Raw notifications API:", res.data);

  return res.data.items || [];  
};

/**
 * ✅ Đánh dấu một thông báo là đã đọc
 */
export const markAsRead = async (id) => {
  const res = await axiosClient.patch(`/notifications/${id}/read`);
  return res.data;
};

/**
 * ✅ Đánh dấu tất cả thông báo là đã đọc
 */
export const markAllAsRead = async () => {
  const res = await axiosClient.patch('/notifications/mark-all');
  return res.data;
};

/**
 * ⭐ Đánh dấu thông báo feedback là đã gửi
 * (sử dụng khi student gửi đánh giá PT xong)
 */
export const markFeedbackSent = async (id) => {
  const res = await axiosClient.patch(`/notifications/${id}/feedback-sent`);
  return res.data;
};

export const getFeedbackByPT = async (ptId) => {
  const res = await axiosClient.get(`/feedbacks/pt/${ptId}`); // Đảm bảo ptId được truyền vào đúng.
  console.log("📬 Feedback của PT:", res.data);
  return res.data; // Trả về dữ liệu feedback
};

export const getAllFeedbacks = async () => {
  const res = await axiosClient.get('/feedbacks');
  console.log("📬 Tất cả Feedbacks:", res.data);
  return res.data; // Trả về tất cả dữ liệu feedback
};
