import React, { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "~/components/SidebarAdmin";
import axiosClient from "~/api/axiosClient";

function StatCard({ title, value }) {
  return (
    <div className="flex-1 min-w-[220px] bg-slate-900 border border-slate-800 rounded-xl p-4 shadow text-white">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="mt-1 text-3xl font-bold">{value.toLocaleString("en-US")}</div>
    </div>
  );
}

function StatusTag({ verified }) {
  return verified ? (
    <span className="px-2 py-1 bg-green-600/30 border border-green-500 rounded text-green-400 text-xs font-semibold">
      Approved
    </span>
  ) : (
    <span className="px-2 py-1 bg-gray-600/30 border border-gray-500 rounded text-gray-400 text-xs font-semibold">
      Pending
    </span>
  );
}

function MiniBarChart({ data, labels }) {
  const max = Math.max(1, ...data);
  const width = 300,
    height = 100;
  const barW = 50;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow text-gray-200">
      <div className="text-sm text-gray-400 mb-2">Overview Chart</div>
      <svg width={width} height={height}>
        {data.map((v, i) => {
          const h = (v / max) * 70;
          return (
            <g key={i}>
              <rect
                x={30 + i * (barW + 20)}
                y={height - h - 15}
                width={barW}
                height={h}
                rx="6"
                fill="#f97316"
              />
              <text
                x={30 + i * (barW + 20) + barW / 2}
                y={height - 7}
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
              >
                {labels[i]}
              </text>
              <text
                x={30 + i * (barW + 20) + barW / 2}
                y={height - h - 15}
                textAnchor="middle"
                fontSize="10"
                fill="#e2e8f0"
              >
                {v}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("/admin/overview");
        setOverview(res.data);

        const usersRes = await axiosClient.get("/admin/users");
        setUsers(usersRes.data);

        const studentsRes = await axiosClient.get("/admin/students");
        setStudents(studentsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const userById = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(String(u._id), u));
    return map;
  }, [users]);

  const allPTs = (overview.approvedPTs || []).map((p) => {
    const u = userById.get(String(p.user)) || {};
    return {
      id: p.user,
      name: u.name || "(Not updated)",
      email: u.email,
      phone: u.phone,
      experience: p.yearsExperience || 0,
      rating: p.ratingAvg || 0,
      count: p.ratingCount || 0,
      verified: p.verified || false,
    };
  });

  if (loading)
    return (
      <div className="flex min-h-screen bg-slate-900 text-white justify-center items-center">
        Loading data...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <SidebarAdmin />
      <div className="flex-1 p-8 space-y-6">
        <h1 className="text-3xl font-bold text-orange-400">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">
          Overview of the system: PTs, Students, and Bookings
        </p>

        {/* Statistic Section */}
        <div className="flex flex-wrap gap-4">
          <StatCard title="Total PTs" value={overview.totalPTs || 0} />
          <StatCard title="Students" value={overview.totalStudents || 0} />
          <StatCard title="Bookings" value={overview.totalBookings || 0} />
          <MiniBarChart
            data={[
              overview.totalPTs || 0,
              overview.totalStudents || 0,
              overview.totalBookings || 0,
            ]}
            labels={["PT", "Student", "Booking"]}
          />
        </div>

        {/* PT Table */}
        <div className="bg-slate-800 rounded-xl shadow border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-orange-400">PT List</h2>
            <span className="text-sm text-gray-400">{allPTs.length} results</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-200">
              <thead className="bg-slate-700 text-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Experience</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {allPTs.length > 0 ? (
                  allPTs.slice(0, 10).map((pt) => (
                    <tr
                      key={pt.id}
                      className="border-t border-slate-700 hover:bg-slate-700/60 transition"
                    >
                      <td className="p-3">{pt.name}</td>
                      <td className="p-3">{pt.email || "—"}</td>
                      <td className="p-3">{pt.phone || "—"}</td>
                      <td className="p-3">{pt.experience} yrs</td>
                      <td className="p-3">
                        {pt.rating.toFixed(1)}{" "}
                        <span className="text-xs text-gray-400">({pt.count})</span>
                      </td>
                      <td className="p-3">
                        <StatusTag verified={pt.verified} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-400">
                      No PTs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-slate-800 rounded-xl shadow border border-slate-700 mt-6">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-orange-400">Student List</h2>
            <span className="text-sm text-gray-400">{students.length} results</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-200">
              <thead className="bg-slate-700 text-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Gender</th>
                  <th className="p-3 text-left">Goals</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.slice(0, 10).map((s, index) => (
                    <tr
                      key={index}
                      className="border-t border-slate-700 hover:bg-slate-700/60 transition"
                    >
                      <td className="p-3">{s.name || "—"}</td>
                      <td className="p-3">{s.email || "—"}</td>
                      <td className="p-3 capitalize">{s.gender || "—"}</td>
                      <td className="p-3">
                        {s.goals?.length ? s.goals.join(", ") : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-400">
                      No students available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
