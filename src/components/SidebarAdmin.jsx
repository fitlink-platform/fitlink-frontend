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
} from "react-icons/fa";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: <FaTachometerAlt />, to: "/admin" },
  { label: "Quản lý người dùng", icon: <FaUsers />, to: "/admin/users" },
  { label: "Xác minh PT", icon: <FaTachometerAlt />, to: "/admin/pt-requests" },
  {
    label: "Quản lý dịch vụ",
    icon: <FaConciergeBell />,
    to: "/admin/services",
  },

  { label: "Quản lý sản phẩm", icon: <FaBoxOpen />, to: "/admin/products" },

  { label: "Quản lý đơn hàng", icon: <FaClipboardList />, to: "/admin/orders" },

  {
    label: "Gửi thông báo",
    icon: <FaConciergeBell />,
    to: "/admin/send-notification",
  },

  {
    label: "Quản lý lịch hẹn",
    icon: <FaCalendarAlt />,
    subMenu: [
      { label: "Duyệt đơn", to: "/admin/appointments/pending" },
      { label: "Đã xác nhận", to: "/admin/appointments/confirmed" },
      { label: "Đang tiến hành", to: "/admin/appointments/in_progress" },
      { label: "Chờ thanh toán", to: "/admin/appointments/waiting_payment" },
      { label: "Hoàn thành", to: "/admin/appointments/completed" },
      { label: "Yêu cầu huỷ", to: "/admin/appointments/request-cancel" },
      { label: "Đơn đã huỷ", to: "/admin/appointments/cancelled" },
      { label: "Đơn đã hoàn thành", to: "/admin/appointments/completed" },
    ],
  },

  { label: "Đăng xuất", icon: <FaSignOutAlt />, to: "/logout" },
];

export default function SidebarAdmin() {
  const [openMenu, setOpenMenu] = useState(null);
  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col py-8 px-4 border-r">
      <div className="mb-8 text-2xl font-bold text-orange-500 text-center">
        F Admin
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) =>
          item.subMenu ? (
            <div key={item.label}>
              <div
                className="flex items-center gap-3 px-4 py-2 font-medium text-gray-700 cursor-pointer select-none hover:bg-orange-100 rounded-lg"
                onClick={() =>
                  setOpenMenu(openMenu === item.label ? null : item.label)
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                <span className="ml-auto">
                  {openMenu === item.label ? "▲" : "▼"}
                </span>
              </div>
              {openMenu === item.label && (
                <div className="ml-8 flex flex-col gap-1 animate-fade-in">
                  {item.subMenu.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `block px-4 py-1 rounded transition-colors duration-200 hover:bg-orange-100 text-gray-600 text-sm ${
                          isActive ? "bg-orange-500 text-white" : ""
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
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-orange-100 text-gray-700 font-medium ${
                  isActive ? "bg-orange-500 text-white" : ""
                }`
              }
              end={item.to === "/admin"}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
