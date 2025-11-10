// src/services/messageService.js
import axiosClient from "./axiosClient";

/**
 * Lấy danh sách PT của học viên hiện tại
 */
export const getMyPTs = () => {
  return axiosClient.get("/student/me/pts");
};

/**
 * Lấy danh sách học viên của PT hiện tại
 */
export const getMyStudents = () => {
  return axiosClient.get("/pt/me/students");
};

/**
 * Lấy lịch sử tin nhắn theo roomId
 */
export const getMessagesByRoom = (roomId) => {
  return axiosClient.get(`/messages/${roomId}`);
};
