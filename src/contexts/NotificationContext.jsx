// src/contexts/NotificationContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthProvider";
import axiosClient from "~/api/axiosClient";

const NotificationContext = createContext(null);
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const calcUnread = (list) => list.filter((n) => !n.read).length;

  // 🔹 Fetch lần đầu khi đã có user
  useEffect(() => {
    if (loading || !user?._id) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await axiosClient.get("/notifications", {
          signal: controller.signal,
        });

        // API của bạn có thể trả:
        // 1) [ {...}, {...} ]  hoặc
        // 2) { items: [...], totalUnread }
        let list = [];
        let totalUnread;

        if (Array.isArray(res.data)) {
          list = res.data;
          totalUnread = calcUnread(list);
        } else if (res.data && Array.isArray(res.data.items)) {
          list = res.data.items;
          totalUnread =
            typeof res.data.totalUnread === "number"
              ? res.data.totalUnread
              : calcUnread(list);
        }

        setItems(list);
        setUnread(totalUnread ?? 0);
      } catch (e) {
        if (e.name === "CanceledError") return;
        console.error("Load notifications error:", e?.message || e);
      }
    })();

    return () => controller.abort();
  }, [loading, user?._id]);

  // 🔹 Realtime qua websocket
  useEffect(() => {
    if (!socket || !user?._id) return;

    const onNoti = (n) => {
      // n là object notification server emit
      setItems((prev) => [n, ...prev]);
      if (!n.read) {
        setUnread((u) => u + 1);
      }
      console.log("🔔 notification:", n);
    };

    socket.on("notification", onNoti);
    return () => socket.off("notification", onNoti);
  }, [socket, user?._id]);

  // 🔹 Đánh dấu tất cả đã đọc
  const markAllRead = async () => {
    try {
      const res = await axiosClient.patch("/notifications/mark-all");
      // backend có thể trả { totalUnread }, nếu không thì set 0 luôn
      const newUnread =
        typeof res.data?.totalUnread === "number" ? res.data.totalUnread : 0;
      setUnread(newUnread);
    } catch (e) {
      console.error("Mark all read error:", e?.message || e);
    }

    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  // 🔹 Đánh dấu 1 cái đã đọc (chỉ local, API bạn đã gọi trong NotificationBell)
  const markOneReadLocal = (id) => {
    if (!id) return;
    setItems((prev) => {
      let changed = false;
      const next = prev.map((n) => {
        const nid = n._id || n.id;
        if (nid === id && !n.read) {
          changed = true;
          return { ...n, read: true };
        }
        return n;
      });
      if (changed) {
        setUnread((u) => Math.max(0, u - 1));
      }
      return next;
    });
  };

  const value = {
    items,
    unread,
    markAllRead,
    markOneReadLocal,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
