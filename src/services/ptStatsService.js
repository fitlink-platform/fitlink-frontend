import axiosClient from "~/api/axiosClient";

export async function getPTRevenueStats(year) {
  const res = await axiosClient.get(`/pt/stats/revenue?year=${year}`);
  return res.data?.revenue || [];
}

export async function getPTStudentStats(year) {
  const res = await axiosClient.get(`/pt/stats/users?year=${year}`);
  return res.data?.students || [];
}

export async function getPTCompletedSessionStats(year) {
  const res = await axiosClient.get(`/pt/stats/sessions-completed?year=${year}`);
  return res.data?.completed || [];
}

export async function getPTCancelRateStats(year) {
  const res = await axiosClient.get(`/pt/stats/cancel-rate?year=${year}`);
  return res.data?.cancelRate || [];
}