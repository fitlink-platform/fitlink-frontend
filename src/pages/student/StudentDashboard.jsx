import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import MainLayout from "~/layouts/MainLayout";

import {
  getStudentPaymentStats,
  getStudentCompletedStats,
  getStudentProgressStats,
  getStudentSessionHistory,
  getStudentSessionHistoryFull,
  getStudentBMIHistory,
} from "~/services/studentStatsService";

import PaymentHistoryChart from "~/components/student-charts/PaymentHistoryChart";
import StudentCompletedChart from "~/components/student-charts/StudentCompletedChart";
import StudentProgressChart from "~/components/student-charts/StudentProgressChart";
import StudentSessionsHistoryChart from "~/components/student-charts/StudentSessionsHistoryChart";
import StudentBMIChart from "~/components/student-charts/StudentBMIChart";

/* =========================================================
   UI WRAPPERS
========================================================= */

function SectionCard({ children, title, action }) {
  return (
    <div
      className="
        rounded-2xl bg-slate-900/90 border border-slate-700/70 p-6 
        shadow-xl transition-all 
        hover:-translate-y-1 
        hover:shadow-blue-400/50 hover:border-blue-400/50
      "
    >
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* =========================================================
   MAIN STUDENT DASHBOARD
========================================================= */

export default function StudentDashboard() {
  const [sessions, setSessions] = useState([]);
  const [paymentStats, setPaymentStats] = useState(Array(12).fill(0));
  const [completedStats, setCompletedStats] = useState(Array(12).fill(0));
  const [progressStats, setProgressStats] = useState(Array(12).fill(0));
  const [historyStats, setHistoryStats] = useState(Array(12).fill(0));
   const [bmiHistory, setBmiHistory] = useState([]);

  const year = new Date().getFullYear();

  /* FETCHERS */

  const fetchSessionHistory = async () => {
    const data = await getStudentSessionHistory(year);
    setHistoryStats(data || Array(12).fill(0));
  };

  const fetchPayment = async () => {
    const data = await getStudentPaymentStats(year);
    setPaymentStats(data || Array(12).fill(0));
  };

  const fetchCompleted = async () => {
    const data = await getStudentCompletedStats(year);
    setCompletedStats(data || Array(12).fill(0));
  };

  const fetchProgress = async () => {
    const data = await getStudentProgressStats(year);
    setProgressStats(data || Array(12).fill(0));
  };

  const fetchRecentSessions = async () => {
    const sessions = await getStudentSessionHistoryFull(year);
    setSessions(sessions || []);
  };

 const fetchBMIHistory = async () => {
  const raw = await getStudentBMIHistory();   // <--- raw ở đây
  if (!raw) {
    setBmiHistory([]);
    return;
  }

  const formatted = raw.map((item) => ({
    bmi: item.bmi,
    date: new Date(item.session?.startTime).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));

  setBmiHistory(formatted);
};

  /* LOAD ON MOUNT */
  useEffect(() => {
    fetchPayment();
    fetchCompleted();
    fetchProgress();
    fetchSessionHistory();
    fetchRecentSessions();
    fetchBMIHistory();
  }, []);

  /* =========================================================
     UI
  ========================================================== */

  return (
    <MainLayout>
      {/* FULL WRAPPER GIỐNG PT DASHBOARD */}
      

        {/* TITLE — đặt hẳn ra đầu, KHÔNG tụt vào card */}
<div className="pt-28 px-6 w-full">
        <h1 className="text-2xl font-extrabold text-orange-400">
          Student Dashboard
        </h1>
    
        </div>
        <div className="max-w-5xl mx-auto px-4 py-10">


        {/* RECENT SESSIONS */}
        <div className="mb-10">
          <SectionCard title="Recent Sessions">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="px-2 py-2 font-medium">PT</th>
                    <th className="px-2 py-2 font-medium">Time</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {sessions
                    .slice()
                    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                    .slice(0, 5)
                    .map((s) => (
                      <tr key={s._id} className="border-t border-white/5">
                        <td className="px-2 py-2 text-white">{s.pt?.name}</td>

                        <td className="px-2 py-2 text-gray-300">
                          {new Date(s.startTime).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </td>

                        <td className="px-2 py-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                              s.status === "completed"
                                ? "bg-green-500/20 text-green-300"
                                : s.status === "cancelled"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-orange-500/20 text-orange-300"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                  {sessions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-2 py-4 text-center text-xs text-gray-500">
                        No sessions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* 4 BIỂU ĐỒ — tất cả đều canh giữa max-w-5xl */}
        <div className="space-y-10">

          <SectionCard title="Payment History (12 months)">
            <PaymentHistoryChart data={paymentStats} />
          </SectionCard>

          <SectionCard title="Completed Sessions (12 months)">
            <StudentCompletedChart data={completedStats} />
          </SectionCard>

          <SectionCard title="Progress Tracking (12 months)">
            <StudentProgressChart data={progressStats} />
          </SectionCard>

          <SectionCard title="Session History (12 months)">
            <StudentSessionsHistoryChart data={historyStats} />
          </SectionCard>
          
          <SectionCard title="BMI History (Per Session)">
  <div className="w-full h-64">
    <StudentBMIChart data={bmiHistory} />
  </div>
</SectionCard>
        </div>
      </div>
    </MainLayout>
  );
}
