import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaCalendarAlt,
  FaChartPie,
  FaComments,
  FaDumbbell,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

// ---------- Sidebar Link Item ----------
function SideItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
         ${isActive ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`
      }
      end
    >
      <Icon className="text-base" />
      <span>{label}</span>
    </NavLink>
  );
}

// ---------- Topbar ----------
function Topbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-gray-900/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:bg-white/10 md:hidden"
          >
            <FaBars />
          </button>
          <Link
            to="/"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600"
          >
            FitLink<span className="text-white"> Coach</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10">
            Help
          </button>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <FaUser className="text-gray-300" />
            <span className="text-sm text-gray-200">Coach Minh</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------- Sidebar ----------
function Sidebar({ open, onClose }) {
  return (
    <>
      {/* overlay mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/50 md:hidden ${open ? "block" : "hidden"}`}
      />
      <aside
        className={`fixed z-40 h-full w-72 bg-gray-900/95 backdrop-blur border-r border-white/10 p-4 transition-transform md:static md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-4">
          <p className="text-xs uppercase tracking-widest text-gray-400">Navigation</p>
        </div>

        <nav className="flex flex-col gap-1">
          <SideItem to="/pt/dashboard" icon={FaHome} label="Overview" onClick={onClose} />
          <SideItem to="/pt/students" icon={FaUsers} label="Students" onClick={onClose} />
          <SideItem to="/pt/schedule" icon={FaCalendarAlt} label="Schedule" onClick={onClose} />
          <SideItem to="/pt/workouts" icon={FaDumbbell} label="Workouts" onClick={onClose} />
          <SideItem to="/pt/chat" icon={FaComments} label="Messages" onClick={onClose} />
          <SideItem to="/pt/wallet" icon={FaWallet} label="Wallet" onClick={onClose} />
          <SideItem to="/pt/analytics" icon={FaChartPie} label="Analytics" onClick={onClose} />
        </nav>

        <div className="mt-auto pt-6">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/20">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ---------- Stat Cards ----------
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

// ---------- Recent Sessions (placeholder) ----------
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

// ---------- Students mini list (placeholder) ----------
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

// ---------- Calendar placeholder ----------
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

// ---------- Main Page ----------
export default function PTPage() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Topbar onToggleSidebar={() => setOpenSidebar((s) => !s)} />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:py-8">
        {/* Sidebar */}
        <Sidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />

        {/* Content */}
        <main className="w-full">
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

          {/* Footer note */}
          <div className="py-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} FitLink Coach — PT Dashboard
          </div>
        </main>
      </div>
    </div>
  );
}
