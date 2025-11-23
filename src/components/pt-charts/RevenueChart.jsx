import React from "react";

export default function RevenueChart({ data }) {
  const height = 240;
  const width = 600;
  const padding = 40;
  const max = Math.max(...data, 1);
  const step = (width - padding * 2) / 11;

  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const points = data
    .map((v, i) => {
      const x = padding + i * step;
      const y = height - padding - (v / max) * 150;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:shadow-orange-500/20 transition">
      <h3 className="text-sm uppercase text-gray-400 mb-4">Revenue (12 months)</h3>

      <svg width="100%" height={height}>
        {/* ĐƯỜNG LINE */}
        <polyline fill="none" stroke="#fb923c" strokeWidth="3" points={points} />

        {/* CÁC CHẤM + LABEL GIÁ TRỊ */}
        {data.map((v, i) => {
          const x = padding + i * step;
          const y = height - padding - (v / max) * 150;

          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4} fill="#fb923c" />
              <text x={x} y={y - 8} fontSize="11" fill="#fff" textAnchor="middle">
                {v.toLocaleString()}
              </text>

              {/* LABEL THÁNG — THÊM MỚI  */}
              <text
                x={x}
                y={height - 10}
                fontSize="11"
                fill="#94a3b8"
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
