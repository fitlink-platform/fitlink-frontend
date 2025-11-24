import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function StudentBMIChart({ data }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }}
            labelStyle={{ color: "#f1f5f9" }}
            itemStyle={{ color: "#f1f5f9" }}
          />
          <Line type="monotone" dataKey="bmi" stroke="#f97316" strokeWidth={3} dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
