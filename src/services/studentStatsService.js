import axiosClient from "~/api/axiosClient";

export async function getStudentPaymentStats(year) {
  const res = await axiosClient.get(`/student-stats/payment?year=${year}`);
  return res.data?.payments || [];
}

export async function getStudentCompletedStats(year) {
  const res = await axiosClient.get(`/student-stats/sessions-completed?year=${year}`);
  return res.data?.completed || [];
}

export async function getStudentProgressStats(year) {
  const res = await axiosClient.get(`/student-stats/progress?year=${year}`);
  return res.data?.progress || [];
}

// A) 12 months history
export async function getStudentSessionHistory(year) {
  const res = await axiosClient.get(`/student-stats/history?year=${year}`);
  return res.data?.history || [];
}

// B) FULL LIST (recent sessions)
export async function getStudentSessionHistoryFull(year) {
  const res = await axiosClient.get(`/student-stats/history?year=${year}&full=1`);
  return res.data?.sessions || [];
}

// dashboard
export async function getStudentDashboard() {
  const res = await axiosClient.get(`/student-stats/dashboard`);
  return res.data || {};
}

export async function getStudentBMIHistory() {
  const res = await axiosClient.get("/student/bmi/history");
  return res.data || [];
}