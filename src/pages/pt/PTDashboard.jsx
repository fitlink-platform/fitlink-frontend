import { Link } from "react-router-dom";
import { FaUsers, FaCalendarAlt, FaWallet, FaChartPie } from "react-icons/fa";
import PTMainLayout from "~/layouts/pt/PTMainLayout";

// --- small UI components ---
function StatCard({ title, value, sub, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="text-white/80">{children}</div>
      </div>
      <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-400">{sub}</p>}
    </div>
  );
}

function CalendarPlaceholder() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Weekly Calendar</h3>
        <Link to="/pt/schedule" className="text-sm text-orange-400 hover:underline">
          Open calendar
        </Link>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-400">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="mb-2 font-medium text-gray-300">{d}</p>
            <div className="space-y-2">
              <div className="rounded-md bg-orange-500/20 px-2 py-1 text-orange-200">16:00 An</div>
              <div className="rounded-md bg-green-500/20 px-2 py-1 text-green-200">19:00 Bình</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentSessions() {
  const rows = [
    { student: "Nguyễn An", when: "Hôm nay 16:00–17:00", status: "Scheduled" },
    { student: "Trần Bình", when: "Hôm nay 18:00–19:00", status: "Scheduled" },
    { student: "Lê Châu", when: "Hôm qua 19:00–20:00", status: "Completed" },
  ];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Sessions</h3>
        <Link to="/pt/schedule" className="text-sm text-orange-400 hover:underline">
          View all
        </Link>
      </div>
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
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-white/5">
                <td className="px-2 py-2 text-white">{r.student}</td>
                <td className="px-2 py-2 text-gray-300">{r.when}</td>
                <td className="px-2 py-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                      r.status === "Completed"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-orange-500/20 text-orange-300"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentsMini() {
  const list = [
    { name: "Nguyễn An", tag: "From app" },
    { name: "Phạm Duy", tag: "External" },
    { name: "Lê Châu", tag: "From app" },
    { name: "Đào Quyên", tag: "External" },
  ];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Students</h3>
        <Link to="/pt/students" className="text-sm text-orange-400 hover:underline">
          Manage
        </Link>
      </div>
      <ul className="space-y-3">
        {list.map((s, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/10" />
              <div>
                <p className="text-sm text-white">{s.name}</p>
                <p className="text-xs text-gray-400">{s.tag}</p>
              </div>
            </div>
            <Link
              to="/pt/students/1"
              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/10"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PTDashboard() {
  return (
    <PTMainLayout>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active students" value="12" sub="+3 this week">
          <FaUsers />
        </StatCard>
        <StatCard title="Sessions today" value="5" sub="2 completed">
          <FaCalendarAlt />
        </StatCard>
        <StatCard title="Wallet balance" value="4.200.000đ" sub="Ready to payout">
          <FaWallet />
        </StatCard>
        <StatCard title="Avg rating" value="4.8★" sub="128 reviews">
          <FaChartPie />
        </StatCard>
      </div>

      {/* Grid two cols */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CalendarPlaceholder />
          <RecentSessions />
        </div>
        <div className="space-y-6">
          <StudentsMini />
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/20 to-amber-500/10 p-5">
            <h3 className="mb-2 text-lg font-semibold text-white">Free plan limit</h3>
            <p className="text-sm text-gray-200">
              Bạn đang ở gói <span className="font-semibold text-orange-300">Free</span> — quản lý tối đa{" "}
              <span className="font-semibold">2 học viên</span>. Nâng cấp lên{" "}
              <span className="font-semibold text-orange-300">PT Pro</span> để không giới hạn.
            </p>
            <Link
              to="/pt/upgrade"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Upgrade to PT Pro
            </Link>
          </div>
        </div>
      </div>
    </PTMainLayout>
  );
}
