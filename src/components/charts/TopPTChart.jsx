import React from "react";

export default function TopPTChart({ data }) {
  const max = Math.max(...data.map(d => d.totalSessions), 1);
  const height = 260;
  const barW = 40;
  const gap = 40;
  const chartWidth = data.length * (barW + gap);

  if (data.length === 0) {
    return (
      <div
        className="
          bg-slate-900 border border-slate-800 p-5 rounded-xl text-gray-400 text-center
          hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1
          transition-all duration-300
        "
      >
        No PT has completed any sessions yet.
      </div>
    );
  }

  return (
    <div
      className="
        bg-slate-900 border border-slate-800 p-5 rounded-xl text-gray-200 w-full
        hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1
        transition-all duration-300
      "
    >
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">
        Top 5 PT (by completed sessions)
      </div>

      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        {data.map((pt, i) => {
          const h = (pt.totalSessions / max) * 150;
          const x = i * (barW + gap);
          const y = height - h - 50;

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="8"
                fill="#f97316"
              />

              {/* Session count */}
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="12"
                fill="#e2e8f0"
              >
                {pt.totalSessions}
              </text>

              {/* PT name */}
              <text
                x={x + barW / 2}
                y={height - 20}
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
              >
                {pt.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Nếu chỉ có 1 PT */}
      {data.length === 1 && (
        <p className="text-gray-500 text-xs mt-2">
          Only 1 PT has completed sessions.
        </p>
      )}
    </div>
  );
}
