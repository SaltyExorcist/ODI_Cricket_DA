import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PlayerSkillRadar = ({ player }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!player) return;

    axios
      .get(`http://localhost:5000/api/player-skill-profile?player=${encodeURIComponent(player)}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Error fetching radar data:", err));
  }, [player]);

  if (!data)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading skill profile for {player}...
      </div>
    );

  // ✅ Normalize values and invert Dot% (lower = better)
  const normalize = (val, min, max) => ((val - min) / (max - min)) * 100;
  const dotInverted = 100 - normalize(data.dot_pct, 0, 100);

  const chartData = [
  { metric: "Powerplay SR", value: Number(data.pp_sr) || 0 },
  { metric: "Middle-over SR", value: Number(data.middle_sr) || 0 },
  { metric: "Death-over SR", value: Number(data.death_sr) || 0 },
  { metric: "Boundary %", value: Number(data.boundary_pct) || 0 },
  { metric: "Dot % (inverted)", value: 100 - (Number(data.dot_pct) || 0) },
];


  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {player} – Skill Profile
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius="70%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#334155", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 150]} tick={{ fontSize: 10 }} />
          <Radar
            name={player}
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip
  formatter={(val) =>
    isFinite(val) ? `${Number(val).toFixed(1)}` : val
  }
/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayerSkillRadar;
