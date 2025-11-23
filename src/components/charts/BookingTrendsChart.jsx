import React from "react";

export default function BookingTrendsChart({ data }) {
  const max = Math.max(...data, 1);
  const height = 260;
  const chartWidth = 600;
  const padding = 40;
  const step = (chartWidth - padding * 2) / 11;

  const points = data
    .map((v, i) => {
      const x = padding + i * step;
      const y = height - padding - (v / max) * 150;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className="
        bg-slate-900 border border-slate-800 rounded-xl p-5 shadow text-gray-200 w-full
        hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1
        transition-all duration-300
      "
    >
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">
        Booking Trends (12 months)
      </div>

      <svg width="100%" height={height}>
        {/* Line */}
        <polyline
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          points={points}
        />

        {/* Points */}
        {data.map((v, i) => {
          const x = padding + i * step;
          const y = height - padding - (v / max) * 150;

          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4} fill="#f97316" />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#e2e8f0"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Months */}
        {data.map((_, i) => {
          const x = padding + i * step;
          return (
            <text
              key={i}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {
                [
                  "Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"
                ][i]
              }
            </text>
          );
        })}
      </svg>
    </div>
  );
}
