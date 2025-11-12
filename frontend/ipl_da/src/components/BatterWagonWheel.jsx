import React, { useEffect, useState } from "react";
import axios from "axios";

// Plasma-like gradient approximation
function plasmaColor(value, max) {
  const ratio = value / (max || 1);
  const r = Math.round(255 * Math.min(1, Math.max(0, 1.5 * ratio)));
  const g = Math.round(255 * (0.5 * ratio));
  const b = Math.round(255 * (1 - ratio * 0.8));
  return `rgb(${r}, ${g}, ${b})`;
}

const BatterWagonWheel = ({ player ,bowlType,bowler}) => {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState("total_runs"); // 🔁 default metric
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!player) return;
    axios
      .get(
        `http://localhost:5000/api/batter-wagon?player=${encodeURIComponent(
          player
        )}${
    bowlType ? `&bowl_style=${encodeURIComponent(bowlType)}` : ""
  }${
    bowler ? `&bowler=${encodeURIComponent(bowler)}` : ""
  }`
      )
      .then((res) => setData(res.data || []))
      .catch((err) => console.error("Error fetching wagon wheel:", err));
  }, [player,bowlType]);

  if (!data || data.length === 0)
    return (
      <div className="text-center text-gray-500 border rounded-lg p-4 bg-gray-50">
        No data available for {player}.
      </div>
    );

  const width = 500;
  const height = 500;
  const cx = width / 2;
  const cy = height / 2;

  const metricLabel =
    metric === "total_runs"
      ? "Total Runs"
      : metric === "strike_rate"
      ? "Strike Rate"
      : "Boundary %";

  const metricData = data.map((d) => parseFloat(d[metric] || 0));
  const maxValue = Math.max(...metricData);
  const numZones = data.length;
  const angleStep = (2 * Math.PI) / numZones;
  const radiusScale = 180 / (maxValue || 1);

  return (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Metric Selector */}
      <div className="flex space-x-2">
        {[
          { key: "total_runs", label: "Total Runs" },
          { key: "strike_rate", label: "Strike Rate" },
          { key: "boundary_pct", label: "Boundary %" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setMetric(opt.key)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              metric === opt.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <svg width={width} height={height}>
        <circle cx={cx} cy={cy} r={200} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {data.map((zone, i) => {
          const startAngle = i * angleStep - Math.PI / 2;
          const endAngle = (i + 1) * angleStep - Math.PI / 2;
          const value = parseFloat(zone[metric] || 0);
          const r = value * radiusScale;
          const color = plasmaColor(value, maxValue);

          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);
          const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

          const pathData = [
            `M ${cx} ${cy}`,
            `L ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          return (
            <path
              key={i}
              d={pathData}
              fill={color}
              stroke="#111827"
              strokeWidth={0.6}
              onMouseEnter={() => setHovered(zone)}
              onMouseLeave={() => setHovered(null)}
              className="transition-transform duration-150 hover:scale-[1.02] cursor-pointer"
            />
          );
        })}

        {/* Labels */}
        {data.map((zone, i) => {
          const midAngle = (i + 0.5) * angleStep - Math.PI / 2;
          const value = parseFloat(zone[metric] || 0);
          const r = value * radiusScale;
          const labelR = 200;
          const labelX = cx + (labelR + 20) * Math.cos(midAngle);
          const labelY = cy + (labelR + 20) * Math.sin(midAngle);

          return (
            <g key={i}>
              <text
                x={cx + (r + 20) * Math.cos(midAngle)}
                y={cy + (r + 20) * Math.sin(midAngle)}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="10"
                fill="#0f172a"
                fontWeight="bold"
              >
                {value.toFixed(0)}
              </text>
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="9"
                fill="#6b7280"
              >
                {zone.wagonzone}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg p-2 text-xs shadow-md z-10">
          <div className="font-semibold text-blue-700">
            Zone {hovered.wagonzone}
          </div>
          <div>Runs: {hovered.total_runs}</div>
          <div>SR: {hovered.strike_rate}</div>
          <div>Dot%: {hovered.dot_pct}</div>
          <div>Boundary%: {hovered.boundary_pct}</div>
        </div>
      )}

      <div className="text-sm text-gray-600 mt-1">Current metric: <b>{metricLabel}</b></div>
    </div>
  );
};

export default BatterWagonWheel;
