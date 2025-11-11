import React from "react";

export default function FeedbackItem({ feedback }) {
  const { rating, comment, student } = feedback;

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
      {/* Thông tin người gửi feedback */}
      <div className="flex items-center mb-4">
        <img
          src={student.avatar || "/default-avatar.png"} // Avatar mặc định
          alt="Student Avatar"
          className="w-14 h-14 rounded-full object-cover border-2 border-orange-400"
        />
        <span className="font-semibold text-white ml-4 text-lg">
          {student.name || "Anonymous"}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`${index < rating ? "text-orange-500" : "text-gray-500"}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-200 text-sm">{comment || "No comment provided"}</p>
    </div>
  );
}
