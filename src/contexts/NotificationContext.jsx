// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "~/api/axiosClient";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const calcUnread = (list) => list.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const res = await axiosClient.get("/notifications");
      const list = res.data || [];
      setItems(list);
      setUnread(calcUnread(list));
    } catch (err) {
      console.error("❌ Load notifications error:", err);
    }
  };

  useEffect(() => {
    // lần đầu
    fetchNotifications();

    // 🔁 auto refresh mỗi 1s (tuỳ bạn chỉnh)
    const interval = setInterval(fetchNotifications, 1000);

    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await axiosClient.patch("/notifications/mark-all");
    } catch (err) {
      console.error("❌ markAllRead error:", err);
    }
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  // update local khi 1 noti được đọc
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
    refetch: fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
