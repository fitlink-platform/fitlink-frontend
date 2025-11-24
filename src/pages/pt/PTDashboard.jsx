import { Link } from "react-router-dom";
import { FaUsers, FaCalendarAlt, FaWallet, FaChartPie, FaStar } from "react-icons/fa";
import PTMainLayout from "~/layouts/pt/PTMainLayout";
import { getMyWallet } from "~/services/ptWalletService";
import { getPTDashboardStats } from "~/services/ptDashboardService";
import { listMyStudents } from "~/services/ptStudentService";
import { getMySessions } from "~/services/sessionService";
import { useEffect, useState } from "react";
import axiosClient from "~/api/axiosClient";

import RevenueChart from "~/components/pt-charts/RevenueChart";
import UserStatsChart from "~/components/pt-charts/UserStatsChart";
import { 
  getPTRevenueStats, 
  getPTStudentStats,
  getPTCompletedSessionStats,
  getPTCancelRateStats
} from "~/services/ptStatsService";

import CompletedSessionChart from "~/components/pt-charts/CompletedSessionChart";
import CancelRateChart from "~/components/pt-charts/CancelRateChart";

function getStartOfWeek(date) {
  const d = new Date(date);
  const weekday = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - weekday);
  return d;
}

const formatVND = (n) =>
  Number(n ?? 0).toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

function formatTimeRange(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";

  const options = { hour: "2-digit", minute: "2-digit" };
  const day = start.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

  return `${day} ${start.toLocaleTimeString("vi-VN", options)}–${end.toLocaleTimeString("vi-VN", options)}`;
}

function getWeekdayIndex(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  return (day + 6) % 7;
}

/* ===================== UI WRAPPER ===================== */

function SectionCard({ children, title, action }) {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-700/70 p-6 shadow-xl hover:-translate-y-1 transition hover:shadow-orange-500/20">
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

function StatCard({ title, value, sub, children }) {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-700/70 p-5 shadow-xl hover:-translate-y-1 hover:shadow-orange-500/20 transition">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="text-white/80">{children}</div>
      </div>
      <p className="mt-2 text-3xl font-extrabold text-orange-400">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

/* ===================== Weekly Calendar ===================== */

function CalendarPlaceholder({ sessions = [] }) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const grouped = Array.from({ length: 7 }, () => []);

  const now = new Date();
  const weekStart = getStartOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const weekSessions = sessions.filter((s) => {
    const start = new Date(s.startTime);
    return start >= weekStart && start < weekEnd;
  });

  weekSessions.forEach((s) => {
    const idx = getWeekdayIndex(s.startTime);
    if (idx >= 0) grouped[idx].push(s);
  });

  return (
    <SectionCard
      title="Weekly Calendar"
      action={<Link to="/pt/schedule" className="text-sm text-orange-400 hover:underline">Open calendar</Link>}
    >
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-400">
        {days.map((d, i) => (
          <div
            key={d}
            className="rounded-xl border border-slate-700/70 bg-slate-800/40 p-3 shadow hover:-translate-y-1 hover:shadow-orange-500/20 transition"
          >
            <p className="mb-2 font-medium text-gray-300">{d}</p>

            {grouped[i].length === 0 && (
              <p className="text-[11px] text-gray-500">No sessions</p>
            )}

            {grouped[i].map((s) => (
              <div key={s._id} className="rounded-md bg-orange-500/20 px-2 py-1 text-orange-200">
                {new Date(s.startTime).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})}{" "}
                {s.student?.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ===================== Recent Sessions ===================== */

function RecentSessions({ sessions = [] }) {
  const rows = sessions
    .slice()
    .sort((a,b)=>new Date(b.startTime)-new Date(a.startTime))
    .slice(0,5);

  return (
    <SectionCard
      title="Recent Sessions"
      action={<Link to="/pt/schedule" className="text-sm text-orange-400 hover:underline">View all</Link>}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="px-2 py-2 font-medium">Student</th>
              <th className="px-2 py-2 font-medium">Time</th>
              <th className="px-2 py-2 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((s) => (
              <tr key={s._id} className="border-t border-white/5">
                <td className="px-2 py-2 text-white">{s.student?.name}</td>
                <td className="px-2 py-2 text-gray-300">{formatTimeRange(s.startTime,s.endTime)}</td>
                <td className="px-2 py-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                    s.status === "completed"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-orange-500/20 text-orange-300"
                  }`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-2 py-4 text-center text-xs text-gray-500">
                  No sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

/* ===================== Students Mini ===================== */

function StudentsMini({ students = [] }) {
  const list = students.slice(0, 4);
  return (
    <SectionCard
      title="Students"
      action={<Link to="/pt/students" className="text-sm text-orange-400 hover:underline">Manage</Link>}
    >
      <ul className="space-y-3">
        {list.map((s) => (
          <li key={s._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-white/10">
                {s.avatar && <img src={s.avatar} className="h-full w-full object-cover" />}
              </div>
              <div>
                <p className="text-sm text-white">{s.name}</p>
                <p className="text-xs text-gray-400">{s.email}</p>
              </div>
            </div>

            <Link to={`/pt/students/${s._id}`} className="rounded-lg border border-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/10">
              View
            </Link>
          </li>
        ))}

        {list.length === 0 && <li className="text-xs text-gray-500">Chưa có học viên nào.</li>}
      </ul>
    </SectionCard>
  );
}

/* ===================== MAIN PAGE START ===================== */

export default function PTDashboard() {
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({
    studentCount: 0,
    packageTemplateCount: 0,
    soldPackageCount: 0,
    totalRevenue: 0,
  });

  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [year] = useState(new Date().getFullYear());
  const [revenueStats, setRevenueStats] = useState(Array(12).fill(0));
  const [userJoinStats, setUserJoinStats] = useState(Array(12).fill(0));

  /* NEW */
  const [completedStats, setCompletedStats] = useState(Array(12).fill(0));
  const [cancelStats, setCancelStats] = useState(Array(12).fill(0));
  const [rating, setRating] = useState({
  averageRating: 0,
  totalReviews: 0
});

  const fetchWallet = async () => {
    const data = await getMyWallet();
    setBalance(data.available || 0);
  };

  const fetchStats = async () => {
    const data = await getPTDashboardStats();
    setStats({
      studentCount: data?.studentCount ?? 0,
      packageTemplateCount: data?.packageTemplateCount ?? 0,
      soldPackageCount: data?.soldPackageCount ?? 0,
      totalRevenue: data?.totalRevenue ?? 0,
    });
  };

  const fetchStudents = async () => {
    const res = await listMyStudents({ page: 1, limit: 50, status: "active" });
    const pkgs = res.data || [];

    const raw = pkgs.map((sp) => sp.student).filter(Boolean);

    const uniq = [];
    const seen = new Set();

    for (const s of raw) {
      if (!seen.has(String(s._id))) {
        seen.add(String(s._id));
        uniq.push(s);
      }
    }
    setStudents(uniq);
  };

  const fetchSessions = async () => {
    const res = await getMySessions();
    const all = res.data || res.data?.data || [];

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const up = all.filter((s) => {
      const start = new Date(s.startTime);
      return start >= now && start <= nextWeek;
    });

    setSessions(up);
  };
  const fetchRating = async () => {
  const res = await axiosClient.get("/pt/stats/rating");
  setRating({
    averageRating: res.data?.averageRating || 0,
    totalReviews: res.data?.totalReviews || 0
  });
};


  useEffect(() => {
    fetchWallet();
    fetchStats();
    fetchStudents();
    fetchSessions();
    fetchRating();
  }, []);
  /* ===================== LOAD BIỂU ĐỒ — 4 loại ===================== */
  useEffect(() => {
    (async () => {
      try {
        const rev = await getPTRevenueStats(year);
        const usr = await getPTStudentStats(year);
        const comp = await getPTCompletedSessionStats(year);
        const canc = await getPTCancelRateStats(year);

        setRevenueStats(rev || Array(12).fill(0));
        setUserJoinStats(usr || Array(12).fill(0));
        setCompletedStats(comp || Array(12).fill(0));
        setCancelStats(canc || Array(12).fill(0));
      } catch (err) {
        console.error("Chart load failed", err);
      }
    })();
  }, [year]);

  /* ===================== UI RETURN ===================== */

  return (
    <PTMainLayout>
      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Students"
          value={stats.studentCount.toString()}
          sub={`${stats.soldPackageCount} packages sold`}
        >
          <FaUsers />
        </StatCard>

        <StatCard
          title="My packages"
          value={stats.packageTemplateCount.toString()}
          sub="Active templates"
        >
          <FaCalendarAlt />
        </StatCard>

        <StatCard
          title="Total revenue"
          value={`${stats.totalRevenue.toLocaleString()}₫`}
          sub="From sold packages"
        >
          <FaChartPie />
        </StatCard>

        <StatCard
          title="Wallet balance"
          value={`${formatVND(balance)}₫`}
          sub="Ready to payout"
        >
          <FaWallet />
        </StatCard>

      </div>

      {/* MIDDLE GRID */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CalendarPlaceholder sessions={sessions} />
          <RecentSessions sessions={sessions} />
        </div>

        <div className="space-y-6">
          <StudentsMini students={students} />
          <SectionCard title="Rating">
        <div className="flex items-center gap-3">
          <p className="text-3xl font-bold text-orange-400">{rating.averageRating}</p>
        <FaStar className="text-yellow-400 text-2xl" />
        </div>
          <p className="text-sm text-gray-400 mt-1">{rating.totalReviews} reviews</p>
          </SectionCard>

          <SectionCard title="Free plan limit">
            <p className="text-sm text-gray-200">
              Bạn đang ở gói{" "}
              <span className="font-semibold text-orange-300">Free</span> — quản lý tối đa{" "}
              <span className="font-semibold">2 học viên</span>. Nâng cấp lên{" "}
              <span className="font-semibold text-orange-300">PT Pro</span> để không giới hạn.
            </p>
            <Link
              to="/pt/upgrade"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Upgrade to PT Pro
            </Link>
          </SectionCard>
        </div>
      </div>

      {/* ===================== YEARLY STATS — 4 BIỂU ĐỒ ===================== */}
      <div className="mt-10 space-y-10">

        {/* Revenue */}
        <SectionCard title="Revenue (12 months)">
          <RevenueChart data={revenueStats} />
        </SectionCard>

        {/* New Students */}
        <SectionCard title="New Students (12 months)">
          <UserStatsChart data={userJoinStats} />
        </SectionCard>

        {/* Completed Sessions */}
        <SectionCard title="Completed Sessions (12 months)">
          <CompletedSessionChart data={completedStats} />
        </SectionCard>

        {/* Cancellation Rate */}
        <SectionCard title="Cancellation Rate (12 months)">
          <CancelRateChart data={cancelStats} />
        </SectionCard>

      </div>
    </PTMainLayout>
  );
}
