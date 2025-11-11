import { NavLink, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaDog,
  FaConciergeBell,
  FaBoxOpen,
  FaClipboardList,
  FaCalendarAlt,
  FaSignOutAlt,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: <FaTachometerAlt />, to: "/admin" },
  {
    label: "User Management",
    icon: <FaUsers />,
    to: "/admin/users",
    subMenu: [
      { label: "PT List", to: "/admin/users/pts" },
      { label: "Student List", to: "/admin/users/students" },
    ],
  },
  { label: "Xác minh PT", icon: <FaTachometerAlt />, to: "/admin/pt-requests" },
  { label: "Service Management", icon: <FaConciergeBell />, to: "/admin/services" },
  { label: "Product Management", icon: <FaBoxOpen />, to: "/admin/products" },
  { label: "Order Management", icon: <FaClipboardList />, to: "/admin/orders" },
  { label: "Send Notification", icon: <FaConciergeBell />, to: "/admin/send-notification" },
  {
    label: "Payout Requests",
    icon: <FaMoneyCheckAlt />,
    subMenu: [
      { label: "All", to: "/admin/payouts" },
      { label: "Pending", to: "/admin/payouts?status=pending" },
      { label: "Completed", to: "/admin/payouts?status=completed" },
      { label: "Rejected", to: "/admin/payouts?status=rejected" },
    ],
  },
  {
    label: "Appointment Management",
    icon: <FaCalendarAlt />,
    subMenu: [
      { label: "Pending", to: "/admin/appointments/pending" },
      { label: "Confirmed", to: "/admin/appointments/confirmed" },
      { label: "In Progress", to: "/admin/appointments/in_progress" },
      { label: "Waiting Payment", to: "/admin/appointments/waiting_payment" },
      { label: "Completed", to: "/admin/appointments/completed" },
      { label: "Cancel Request", to: "/admin/appointments/request-cancel" },
      { label: "Cancelled", to: "/admin/appointments/cancelled" },
      { label: "Finished", to: "/admin/appointments/completed" },
    ],
  },
  { label: "Logout", icon: <FaSignOutAlt />, to: "/logout" },
];

export default function SidebarAdmin() {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <aside className="h-screen w-64 bg-[#0f172a] border-r border-slate-800 shadow-lg flex flex-col py-8 px-4 text-gray-200">
      {/* Logo */}
      <div className="mb-8 text-2xl font-bold text-orange-500 text-center">F Admin</div>

      {/* Menu Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) =>
          item.subMenu ? (
            <div key={item.label}>
              {/* Main Menu Item */}
              <div
                className="flex items-center gap-3 px-4 py-2 font-medium text-gray-300 cursor-pointer select-none hover:bg-slate-800 rounded-lg transition-colors duration-200"
                onClick={() =>
                  setOpenMenu(openMenu === item.label ? null : item.label)
                }
              >
                <span className="text-lg text-orange-400">{item.icon}</span>
                <span>{item.label}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {openMenu === item.label ? "▲" : "▼"}
                </span>
              </div>

              {/* Submenu */}
              {openMenu === item.label && (
                <div className="ml-8 mt-1 flex flex-col gap-1 animate-fade-in">
                  {item.subMenu.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `block px-4 py-1 rounded transition-all duration-200 text-sm ${isActive
                          ? "bg-orange-500 text-white font-semibold"
                          : "text-gray-400 hover:text-white hover:bg-slate-800"
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <span className="text-lg text-orange-400">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
