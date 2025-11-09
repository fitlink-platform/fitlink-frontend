
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthProvider";   
import axios from "axios";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user, loading } = useAuth();      
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  // Chỉ fetch khi đã có user và đã hết loading
  useEffect(() => {
    if (loading || !user?._id) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/notifications`,
          { withCredentials: true, signal: controller.signal }
        );
        setItems(res.data.items || []);
        setUnread(res.data.totalUnread || 0);
      } catch (e) {
        if (axios.isCancel?.(e) || e.name === "CanceledError") return;
        console.error("Load notifications error:", e?.message || e);
      }
    })();

    return () => controller.abort();
  }, [loading, user?._id]);

  // Realtime
  useEffect(() => {
    if (!socket) return;
    const onNoti = (n) => {
      setItems((p) => [n, ...p]);
      setUnread((u) => u + 1);
      console.log("🔔 notification:", n);
    };
    socket.on("notification", onNoti);
    return () => socket.off("notification", onNoti);
  }, [socket]);

  const markAllRead = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/mark-all`,
        {},
        { withCredentials: true }
      );
      setUnread(res.data.totalUnread ?? 0);
      setItems((p) => p.map((x) => ({ ...x, read: true })));
    } catch (e) {
      console.error("Mark all read error:", e?.message || e);
    }
  };

  return (
    <NotificationContext.Provider value={{ items, unread, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
