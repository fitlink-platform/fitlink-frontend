const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function StudentCompletedChart({ data }) {
  const h = 220;
  const max = Math.max(...data, 1);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
        <svg width="100%" height={h}>
          {data.map((v, i) => {
            const barH = (v / max) * 140;
            const x = i * 55 + 40;
            const y = h - barH - 40;

            return (
              <g key={i}>
                <rect x={x} y={y} width={26} height={barH} rx="6" fill="#22c55e" />
                <text x={x + 13} y={y - 6} textAnchor="middle" fontSize="11" fill="#fff">
                  {v}
                </text>
                <text x={x + 13} y={h - 18} textAnchor="middle" fontSize="12" fill="#bbb">
                  {M[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
