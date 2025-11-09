import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react"; // modern icon
import {
  getNotifications,
  markFeedbackSent,
} from "~/services/notificationService";
import NotificationItem from "~/components/NotificationItem";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      console.log("📬 Notifications:", res);
      setNotifications(res || []);
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // 🟢 Handle feedback sent
  const handleFeedbackSent = async (id) => {
    try {
      await markFeedbackSent(id);
      await loadNotifications();
    } catch (err) {
      console.error("❌ Error marking feedback sent:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] px-6 py-8 transition-all">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-7 h-7 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Notifications
          </h1>
        </div>

        {/* Notifications */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <Bell className="w-10 h-10 mx-auto mb-3 text-orange-400" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationItem
                key={n._id}
                noti={n}
                onFeedbackSent={handleFeedbackSent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
