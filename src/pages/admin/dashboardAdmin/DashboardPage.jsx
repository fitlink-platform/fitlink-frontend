// --- BẮT ĐẦU FILE HOÀN CHỈNH ---

import React, { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "~/components/SidebarAdmin";
import axiosClient from "~/api/axiosClient";

// CHARTS
import BookingTrendsChart from "~/components/charts/BookingTrendsChart";
import TopPTChart from "~/components/charts/TopPTChart";

/* -----------------------------------------------------------
   UI COMPONENTS — thêm hover shadow
----------------------------------------------------------- */

function StatCard({ title, value, subtitle }) {
  return (
    <div className="flex-1 min-w-[230px] bg-slate-900/90 backdrop-blur border border-slate-700/70 
                    rounded-2xl p-5 shadow-xl transition transform hover:-translate-y-1
                    hover:shadow-orange-500/20 cursor-pointer">
      <div className="text-xs uppercase tracking-wide text-gray-400 font-medium">
        {title}
      </div>
      <div className="mt-2 text-4xl font-bold text-orange-400 drop-shadow-sm">
        {Number(value || 0).toLocaleString("en-US")}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  );
}

function MiniBarChart({ data, labels }) {
  const max = useMemo(() => Math.max(1, ...data), [data]);
  const height = 180;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-700/70 p-6 shadow-xl 
                    transition hover:shadow-orange-500/20 hover:-translate-y-1
                    w-full max-w-3xl mx-auto"> {/* THU NHỎ WIDTH + CĂN GIỮA */}
      
      <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4">
        System Overview Chart
      </h3>

      <svg width="100%" height={height}>
        {data.map((v, i) => {
          const h = (v / max) * 110;
          const x = 80 + i * 140;   // THU GỌN KHOẢNG CÁCH
          const y = height - h - 30;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={50}   // CỘT RỘNG HƠN CHO ĐẸP
                height={h}
                rx="12"
                fill="#fb923c"
              />

              <text
                x={x + 25}
                y={y - 10}
                textAnchor="middle"
                fontSize="14"
                fill="#f8fafc"
              >
                {Number(v).toLocaleString("en-US")}
              </text>

              <text
                x={x + 25}
                y={height - 10}
                textAnchor="middle"
                fontSize="13"
                fill="#94a3b8"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


function MetricChip({ label, value }) {
  return (
    <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-3 
                    text-sm shadow-xl transition hover:-translate-y-1 hover:shadow-orange-500/20">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-lg font-semibold text-orange-300 ml-3">
        {Number.isFinite(value) ? value.toFixed(2) : "0"}
      </span>
    </div>
  );
}

/* -----------------------------------------------------------
   YEAR CHART — có hover shadow
----------------------------------------------------------- */

function YearChart({ title, data, labels }) {
  const max = Math.max(...data, 1);
  const height = 260;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-700/70 p-6 shadow-xl
                    transition hover:-translate-y-1 hover:shadow-orange-500/20">
      <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4">
        {title}
      </h3>

      <svg width="100%" height={height}>
        {data.map((v, i) => {
          const h = (v / max) * 130;
          const x = i * 46 + 20;
          const y = height - h - 40;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={28}
                height={h}
                rx="8"
                fill="#fb923c"
              />

              <text
                x={x + 14}
                y={y - 6}
                textAnchor="middle"
                fontSize="11"
                fill="#f8fafc"
              >
                {Number(v).toLocaleString("en-US")}
              </text>

              <text
                x={x + 14}
                y={height - 20}
                textAnchor="middle"
                fontSize="12"
                fill="#94a3b8"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* -----------------------------------------------------------
   MAIN PAGE
----------------------------------------------------------- */

export default function DashboardPage() {
  const [overview, setOverview] = useState({});
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState(new Date().getFullYear());
  const [revenue, setRevenue] = useState(Array(12).fill(0));
  const [userStats, setUserStats] = useState(Array(12).fill(0));

  const [bookingTrends, setBookingTrends] = useState(Array(12).fill(0));
  const [topPT, setTopPT] = useState([]);

  /* LOAD OVERVIEW */
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("/admin/overview");
        setOverview(res.data || {});

        const usersRes = await axiosClient.get("/admin/users");
        setTotalAccounts(usersRes.data.length);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* LOAD YEARLY STATS */
  useEffect(() => {
    (async () => {
      const r1 = await axiosClient.get(`/admin/stats/revenue?year=${year}`);
      const r2 = await axiosClient.get(`/admin/stats/users?year=${year}`);
      const r3 = await axiosClient.get(`/admin/stats/booking-trends?year=${year}`);
      const r4 = await axiosClient.get(`/admin/stats/top-pt`);

      setRevenue(r1.data.revenue || Array(12).fill(0));
      setUserStats(r2.data.users || Array(12).fill(0));
      setBookingTrends(r3.data.bookings || Array(12).fill(0));
      setTopPT(r4.data.topPTs || []);
    })();
  }, [year]);

  /* TOTALS */
  const totals = useMemo(() => {
    const totalPTs = Number(overview.totalPTs || 0);
    const totalStudents = Number(overview.totalStudents || 0);
    const totalBookings = Number(overview.totalBookings || 0);

    const approvedRaw =
      typeof overview.approvedPTs === "number"
        ? overview.approvedPTs
        : Array.isArray(overview.approvedPTs)
        ? overview.approvedPTs.length
        : 0;

    const approvedPTs = Number(approvedRaw || 0);

    return {
      totalPTs,
      totalStudents,
      totalBookings,
      approvedPTs,
      pendingPTs: Math.max(totalPTs - approvedPTs, 0),
      approvalRate: totalPTs ? Math.round((approvedPTs / totalPTs) * 100) : 0,
      studentPTRatio: totalPTs ? totalStudents / totalPTs : 0,
      bookingsPTRatio: totalPTs ? totalBookings / totalPTs : 0,
      bookingsStudentRatio: totalStudents ? totalBookings / totalStudents : 0,
    };
  }, [overview]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-900 text-white justify-center items-center text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <SidebarAdmin />

      <div className="flex-1 p-10 space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold text-orange-400 drop-shadow-lg">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Full analytics overview
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total PTs"
            value={totals.totalPTs}
            subtitle={`${totals.approvedPTs} approved • ${totals.pendingPTs} pending`}
          />
          <StatCard
            title="Students"
            value={totals.totalStudents}
            subtitle={`Student / PT: ${totals.studentPTRatio.toFixed(2)}`}
          />
          <StatCard
            title="Bookings"
            value={totals.totalBookings}
            subtitle={`Per PT: ${totals.bookingsPTRatio.toFixed(2)}`}
          />
          <StatCard
            title="Total Accounts"
            value={totalAccounts}
            subtitle="All system accounts"
          />
        </div>

        {/* ----- PT SUMMARY + SYSTEM OVERVIEW ----- */}
        <div className="grid gap-6 lg:grid-cols-2">

            {/* MINI BAR CHART */}
        <MiniBarChart
          data={[totals.totalPTs, totals.totalStudents, totals.totalBookings]}
          labels={["PT", "Student", "Booking"]}
        />
          {/* SYSTEM OVERVIEW CARD */}
          <div className="bg-slate-900/90 border border-slate-700/70 rounded-2xl p-6 shadow-xl 
                          text-sm text-gray-200 transition hover:-translate-y-1 hover:shadow-orange-500/20">
            <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              System Overview
            </h3>

            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Total Accounts</span>
                <span className="font-semibold">
                  {totalAccounts.toLocaleString("en-US")}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Total PTs</span>
                <span className="font-semibold">
                  {totals.totalPTs.toLocaleString("en-US")}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Total Students</span>
                <span className="font-semibold">
                  {totals.totalStudents.toLocaleString("en-US")}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Total Bookings</span>
                <span className="font-semibold">
                  {totals.totalBookings.toLocaleString("en-US")}
                </span>
              </li>
            </ul>
          </div>
        </div>


          {/* PT SUMMARY */}
          <div className="bg-slate-900/90 border border-slate-700/70 rounded-2xl p-6 shadow-xl 
                          transition hover:-translate-y-1 hover:shadow-orange-500/20 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xs uppercase text-gray-400 tracking-wide">
                  PT Summary
                </h3>
                <p className="text-xs text-gray-500">
                  {totals.approvedPTs} approved / {totals.totalPTs} total
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Approval rate</p>
                <p className="text-3xl font-bold text-orange-400">
                  {totals.approvalRate}%
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-200">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 
                              transition hover:-translate-y-1 hover:shadow-orange-500/20">
                <p className="text-xs text-gray-400">Approved PTs</p>
                <p className="text-xl font-semibold">{totals.approvedPTs}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700
                              transition hover:-translate-y-1 hover:shadow-orange-500/20">
                <p className="text-xs text-gray-400">Pending PTs</p>
                <p className="text-xl font-semibold">{totals.pendingPTs}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700
                              transition hover:-translate-y-1 hover:shadow-orange-500/20">
                <p className="text-xs text-gray-400">Total PTs</p>
                <p className="text-xl font-semibold">{totals.totalPTs}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Approval progress</span>
                <span>{totals.approvalRate}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${totals.approvalRate}%` }}
                />
              </div>
            </div>
          </div>

        {/* ----- RATIOS ----- */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricChip label="Student / PT Ratio" value={totals.studentPTRatio} />
          <MetricChip label="Bookings / PT" value={totals.bookingsPTRatio} />
          <MetricChip label="Bookings / Student" value={totals.bookingsStudentRatio} />
        </div>

        {/* YEARLY STATS */}
        <div className="bg-slate-900/90 border border-slate-700/70 rounded-2xl p-8 shadow-xl mt-10">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold text-orange-400">Yearly Statistics</h2>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <YearChart
              title={`Revenue in ${year}`}
              data={revenue}
              labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
            />

            <YearChart
              title={`Users Joined in ${year}`}
              data={userStats}
              labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
            />
          </div>
        </div>

        {/* NEW CHARTS */}
        <div className="grid gap-6 lg:grid-cols-2">
          <BookingTrendsChart data={bookingTrends} />
          <TopPTChart data={topPT} />
        </div>
      </div>
    </div>
  );
}
