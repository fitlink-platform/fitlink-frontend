// src/components/NotificationBell.jsx
import { useState } from "react";
import { useNotification } from "~/contexts/NotificationContext";

export default function NotificationBell() {
  const { items, unread, markAllRead } = useNotification();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-100"
        aria-label="Notifications"
      >
        {/* icon bell */}
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700 fill-current">
          <path d="M12 2a6 6 0 00-6 6v3.586L4.293 13.293A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zm0 20a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-[70vh] overflow-auto rounded-xl border bg-white shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="font-semibold">Thông báo</span>
            <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">
              Đánh dấu đã đọc
            </button>
          </div>
          <ul className="divide-y">
            {items.length === 0 && <li className="p-4 text-sm text-gray-500">Không có thông báo</li>}
            {items.map((n) => (
              <li key={n.id || n._id} className="p-3 hover:bg-gray-50">
                <div className="flex items-start gap-2">
                  <span className={`mt-1 h-2 w-2 rounded-full ${n.read ? "bg-gray-300" : "bg-blue-500"}`} />
                  <div className="flex-1">
                    <div className="font-medium">{n.title}</div>
                    <div className="text-sm text-gray-600">{n.message}</div>
                    {n.data?.url && (
                      <a href={n.data.url} className="text-sm text-blue-600 hover:underline">Xem chi tiết</a>
                    )}               
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
           {/* 🔸 Nút View all notifications ở cuối */}
          {items.length > 0 && (
            <div className="sticky bottom-0 text-center py-2 border-t bg-gray-50">
              <a
                href="/notifications"
                onClick={() => setOpen(false)}
                className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
              >
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
