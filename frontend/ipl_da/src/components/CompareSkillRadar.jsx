import React, { useEffect, useState } from "react";
import CompareSkillTable from "./CompareSkillTable";
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

const CompareSkillRadar = ({ player1, player2 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // helper: normalize to 0–1 scale against benchmark
  const normalize = (value, benchmark) => {
    if (!value || !benchmark) return 0;
    return Math.min(Number(value) / Number(benchmark), 1);
  };

  useEffect(() => {
    if (!player1 || !player2) return;
    setLoading(true);

    Promise.all([
      axios.get(`http://localhost:5000/api/batter-skill-profile?player=${encodeURIComponent(player1)}`),
      axios.get(`http://localhost:5000/api/batter-skill-profile?player=${encodeURIComponent(player2)}`),
      axios.get(`http://localhost:5000/api/global-phase-benchmarks`),
    ])
      .then(([res1, res2, res3]) => {
        const p1 = res1.data;
        const p2 = res2.data;
        const benchmarks = res3.data;

        // --- Create combined (raw + normalized) metrics ---
        const formattedData = [
          {
            metric: "Powerplay SR",
            [`${player1}_raw`]: Number(p1.pp_sr) || 0,
            [`${player2}_raw`]: Number(p2.pp_sr) || 0,
            [player1]: normalize(p1.pp_sr, benchmarks.phase.Powerplay.sr_95),
            [player2]: normalize(p2.pp_sr, benchmarks.phase.Powerplay.sr_95),
            benchmark: benchmarks.phase.Powerplay.sr_95,
          },
          {
            metric: "Middle-over SR",
            [`${player1}_raw`]: Number(p1.middle_sr) || 0,
            [`${player2}_raw`]: Number(p2.middle_sr) || 0,
            [player1]: normalize(p1.middle_sr, benchmarks.phase.Middle.sr_95),
            [player2]: normalize(p2.middle_sr, benchmarks.phase.Middle.sr_95),
            benchmark: benchmarks.phase.Middle.sr_95,
          },
          {
            metric: "Death-over SR",
            [`${player1}_raw`]: Number(p1.death_sr) || 0,
            [`${player2}_raw`]: Number(p2.death_sr) || 0,
            [player1]: normalize(p1.death_sr, benchmarks.phase.Death.sr_95),
            [player2]: normalize(p2.death_sr, benchmarks.phase.Death.sr_95),
            benchmark: benchmarks.phase.Death.sr_95,
          },
          {
            metric: "Boundary %",
            [`${player1}_raw`]: Number(p1.boundary_pct) || 0,
            [`${player2}_raw`]: Number(p2.boundary_pct) || 0,
            [player1]: normalize(p1.boundary_pct, benchmarks.global.boundary_95_global),
            [player2]: normalize(p2.boundary_pct, benchmarks.global.boundary_95_global),
            benchmark: benchmarks.global.boundary_95_global,
          },
          {
            metric: "SRI (Strike Rotation Index)",
            [`${player1}_raw`]: Number(p1.sri) || 0,
            [`${player2}_raw`]: Number(p2.sri) || 0,
            [player1]: normalize(p1.sri, benchmarks.global.sri_95_global),
            [player2]: normalize(p2.sri, benchmarks.global.sri_95_global),
            benchmark: benchmarks.global.sri_95_global,
          },
        ];

        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching comparison data:", err);
        setLoading(false);
      });
  }, [player1, player2]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading radar comparison...
      </div>
    );

  if (!data.length)
    return (
      <div className="text-center text-gray-500 bg-gray-50 p-6 border border-gray-200 rounded-xl">
        No data available for comparison.
      </div>
    );

  // Keep returning both raw and normalized metrics for table usage
return (
  <div>
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {player1} vs {player2} — Batting Skill Comparison
      </h2>

      <ResponsiveContainer width="100%" height={420}>
        <RadarChart outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <Radar
            name={`${player1} (Normalized)`}
            dataKey={player1}
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <Radar
            name={`${player2} (Normalized)`}
            dataKey={player2}
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <Legend verticalAlign="top" />
          <Tooltip
            formatter={(value, name, props) => {
              const { metric } = props.payload;
              const p1Raw = props.payload[`${player1}_raw`];
              const p2Raw = props.payload[`${player2}_raw`];
              const benchmark = props.payload.benchmark;

              return [
                `${(value * 100).toFixed(1)}% of benchmark (${benchmark})`,
                name.includes(player1)
                  ? `${player1}: ${p1Raw?.toFixed(2)}`
                  : `${player2}: ${p2Raw?.toFixed(2)}`,
              ];
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-center text-sm text-gray-500 mt-3">
        *Inner scale shows normalized performance (0–1). Tooltip shows actual values and 95th percentile benchmarks.
      </p>
    </div>

    {/* Export table below radar */}
    <CompareSkillTable player1={player1} player2={player2} data={data} />
  </div>
);

};

export default CompareSkillRadar;
