export default function CancelRateChart({ data }) {
  const height = 260;
  const max = 100;

  const barW = 22;
  const gap = 20;

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:shadow-orange-500/20 transition">

      <h3 className="text-sm uppercase text-gray-400 mb-4">
        CANCELLATION RATE (%) — 12 MONTHS
      </h3>

      <svg width="100%" height={height}>
        {data.map((v, i) => {
          const h = (v / max) * 150;
          const x = i * (barW + gap) + 40;
          const y = height - h - 50;

          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill="#ef4444" rx="6" />

              <text x={x + barW / 2} y={y - 6} fill="#fff" fontSize="11" textAnchor="middle">
                {v}%
              </text>

              {/* tháng */}
              <text x={x + barW / 2} y={height - 20} fill="#a3a3a3" fontSize="11" textAnchor="middle">
                {months[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
