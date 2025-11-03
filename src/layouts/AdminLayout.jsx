import React from "react";
import SidebarAdmin from "~/components/SidebarAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <SidebarAdmin />
      <div className="flex-1 p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
