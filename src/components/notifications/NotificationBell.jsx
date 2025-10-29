import { useNotification } from "../../contexts/NotificationContext";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const { notifications } = useNotification();

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-700" />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {notifications.length}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
