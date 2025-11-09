import React, { useState } from "react";
import { CheckCircle, Info, Star, Gift } from "lucide-react";
import FeedbackDialog from "./student/FeedbackDialog";

export default function NotificationItem({ noti, onFeedbackSent }) {
  const [openFeedback, setOpenFeedback] = useState(false);

  // 🎨 Màu theo loại thông báo
  const getTypeColor = () => {
    switch (noti.type) {
      case "session":
        return "border-blue-400 bg-blue-50";
      case "feedback":
        return "border-orange-400 bg-orange-50";
      default:
        return "border-gray-300 bg-white";
    }
  };

  // 🔔 Icon tương ứng
  const getIcon = () => {
    if (noti.title?.includes("Hoàn thành")) {
      return <Gift className="text-orange-500 w-5 h-5" />;
    }
    switch (noti.type) {
      case "session":
        return <CheckCircle className="text-blue-500 w-5 h-5" />;
      case "feedback":
        return <Star className="text-orange-500 w-5 h-5" />;
      default:
        return <Info className="text-gray-500 w-5 h-5" />;
    }
  };

  // 🧩 Parse message: lấy tên buổi, trạng thái, ghi chú
  const parseMessage = (msg) => {
    if (!msg) return { sessionName: "", status: "", note: "" };

    const nameMatch = msg.match(/"([^"]+)"/);
    const sessionName = nameMatch ? nameMatch[1] : "";

    const statusMatch = msg.match(/cập nhật:\s*(\w+)/i);
    const status = statusMatch ? statusMatch[1] : noti.meta?.status || "";

    const noteMatch = msg.match(/Ghi chú huấn luyện viên[:：]?\s*(.*)/i);
    const note = noteMatch ? noteMatch[1].trim() : "";

    return { sessionName, status, note };
  };

  const { sessionName, status, note } = parseMessage(noti.message);

  // 🧾 Tùy loại thông báo hiển thị khác nhau
  const renderMessage = () => {
    // 🎉 Hoàn thành gói tập
    if (noti.title?.includes("Hoàn thành gói tập")) {
      return (
        <div className="text-center text-gray-800 text-sm leading-relaxed">
          <p className="text-lg font-semibold text-orange-600 mb-1">
            🎉 Congratulations!
          </p>
          <p>
            You’ve completed all your training sessions. Don’t forget to leave
            feedback for your trainer!
          </p>
        </div>
      );
    }

    // 🏋️‍♂️ Cập nhật buổi tập
    if (noti.type === "session") {
      return (
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {sessionName && (
            <p className="font-semibold text-gray-800">
              Session:{" "}
              <span className="font-normal text-gray-700">{sessionName}</span>
            </p>
          )}
          {status && (
            <p className="mt-1">
              <span className="font-semibold text-gray-800">Status:</span>{" "}
              {status === "completed"
                ? "✅ Completed"
                : status === "missed"
                ? "❌ Missed"
                : status === "upcoming"
                ? "🕓 Upcoming"
                : status}
            </p>
          )}
          {note && (
            <p className="mt-1">
              <span className="font-semibold text-gray-800">
                Trainer’s Note:
              </span>{" "}
              {note}
            </p>
          )}
        </div>
      );
    }

    // Các loại thông báo khác
    return (
      <p
        className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: noti.message }}
      />
    );
  };

  return (
    <div
      className={`border ${getTypeColor()} rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {getIcon()}
        <h3 className="font-semibold text-gray-800 text-base">{noti.title}</h3>
      </div>

      {/* Nội dung */}
      {renderMessage()}

      {/* Thời gian */}
      <small className="text-gray-500 text-xs mt-3 block text-right">
        {new Date(noti.createdAt).toLocaleString("en-GB")}
      </small>

      {/* Nút feedback */}
      {noti.meta?.feedbackRequest && !noti.meta?.feedbackSent && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setOpenFeedback(true)}
            className="px-4 py-1.5 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium shadow-sm transition-all"
          >
            Give Feedback
          </button>
        </div>
      )}

      {/* Popup feedback */}
      <FeedbackDialog
        open={openFeedback}
        onClose={() => setOpenFeedback(false)}
        ptId={noti.meta?.ptId}
        notiId={noti._id}
        onFeedbackSent={onFeedbackSent}
      />
    </div>
  );
}
