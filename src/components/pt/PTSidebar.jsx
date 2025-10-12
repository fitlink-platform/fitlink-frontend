import { NavLink } from "react-router-dom";
import {
  FaHome, FaUsers, FaCalendarAlt, FaDumbbell, FaComments,
  FaWallet, FaChartPie, FaSignOutAlt, FaBoxOpen, FaUser
} from "react-icons/fa";

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

export default function PTSidebar({ open, onClose }) {
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
          <SideItem to="/pt/packages" icon={FaBoxOpen} label="Packages" onClick={onClose} />
          <SideItem to="/pt/profile" icon={FaUser} label="Profile" onClick={onClose} />
          <SideItem to="/pt/schedule" icon={FaCalendarAlt} label="Schedule" onClick={onClose} />
          <SideItem to="/pt/workouts" icon={FaDumbbell} label="Workouts" onClick={onClose} />
          <SideItem to="/pt/chat" icon={FaComments} label="Messages" onClick={onClose} />
          <SideItem to="/pt/wallet" icon={FaWallet} label="Wallet" onClick={onClose} />
          <SideItem to="/pt/analytics" icon={FaChartPie} label="Analytics" onClick={onClose} />

        </nav>

        <div className="mt-auto pt-6">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/20"
            onClick={() => {/* TODO: call logout */ }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
