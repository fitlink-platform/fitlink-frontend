// src/components/student/FeedbackDialog.jsx
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosClient from "~/api/axiosClient";

export default function FeedbackDialog({ open, onClose, ptId, notiId, onFeedbackSent }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Vui lòng chọn số sao đánh giá!");
      return;
    }

    try {
      setLoading(true);
      // ✅ Đổi từ api.post → axiosClient.post
      await axiosClient.post("/feedbacks", {
        pt: ptId,
        rating,
        content,
      });

      toast.success("Đã gửi đánh giá thành công!");
      if (onFeedbackSent) await onFeedbackSent(notiId);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Gửi đánh giá thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md text-white">
          <h2 className="text-xl font-semibold mb-4">Đánh giá huấn luyện viên</h2>

          <div className="flex justify-center mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar
                key={s}
                size={28}
                className={`cursor-pointer ${
                  s <= rating ? "text-yellow-400" : "text-gray-500"
                }`}
                onClick={() => setRating(s)}
              />
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhận xét của bạn..."
            rows={3}
            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 bg-white/10 hover:bg-white/20"
            >
              Hủy
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="rounded-lg px-4 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
