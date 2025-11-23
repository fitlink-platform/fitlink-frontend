import React from "react";

export default function UserStatsChart({ data }) {
  const height = 240;
  const barW = 30;
  const gap = 20;
  const max = Math.max(...data, 1);

  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun",
                       "Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:shadow-orange-500/20 transition">
      <h3 className="text-sm uppercase text-gray-400 mb-4">
        New Students (12 months)
      </h3>

      <svg width="100%" height={height}>
        {data.map((v, i) => {
          const h = (v / max) * 150;
          const x = i * (barW + gap) + 30;
          const y = height - h - 40;

          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill="#fb923c" rx="6" />

              <text
                x={x + barW / 2}
                y={y - 6}
                fill="#fff"
                fontSize="11"
                textAnchor="middle"
              >
                {v}
              </text>

              {/* LABEL THÁNG — THÊM MỚI */}
              <text
                x={x + barW / 2}
                y={height - 10}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="middle"
              >
                {monthLabels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
