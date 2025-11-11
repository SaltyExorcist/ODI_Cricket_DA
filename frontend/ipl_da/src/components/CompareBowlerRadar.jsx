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
import CompareSkillTable from "./CompareSkillTable";

const CompareBowlerRadar = ({ player1, player2 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player1 || !player2) return;
    setLoading(true);

    Promise.all([
      axios.get(`http://localhost:5000/api/bowler-skill-profile?player=${encodeURIComponent(player1)}`),
      axios.get(`http://localhost:5000/api/bowler-skill-profile?player=${encodeURIComponent(player2)}`),
      axios.get(`http://localhost:5000/api/bowlers-global-benchmarks`)
    ])
      .then(([res1, res2, res3]) => {
        const p1 = res1.data;
        const p2 = res2.data;
        const benchmarks = res3.data;

        const getPhaseVal = (data, phase, key) =>
          Number(data.phase_data.find(p => p.phase.includes(phase))?.[key]) || 0;

        const getGlobal = (key) => Number(benchmarks.global[key]) || 1;

        // Helper normalization functions
        const normalizePositive = (val, max) => Math.min(val / max, 1);
        const normalizeInverse = (val, max) => Math.min(1 - (val / max), 1);

        const formattedData = [
          {
            metric: "Powerplay Econ",
            [player1]: normalizeInverse(getPhaseVal(p1, "Powerplay", "economy"), benchmarks.phase.Powerplay.econ_95),
            [player2]: normalizeInverse(getPhaseVal(p2, "Powerplay", "economy"), benchmarks.phase.Powerplay.econ_95),
            [`${player1}_raw`]: getPhaseVal(p1, "Powerplay", "economy"),
            [`${player2}_raw`]: getPhaseVal(p2, "Powerplay", "economy"),
            benchmark: benchmarks.phase.Powerplay.econ_95,
          },
          {
            metric: "Middle Econ",
            [player1]: normalizeInverse(getPhaseVal(p1, "Middle", "economy"), benchmarks.phase.Middle.econ_95),
            [player2]: normalizeInverse(getPhaseVal(p2, "Middle", "economy"), benchmarks.phase.Middle.econ_95),
            [`${player1}_raw`]: getPhaseVal(p1, "Middle", "economy"),
            [`${player2}_raw`]: getPhaseVal(p2, "Middle", "economy"),
            benchmark: benchmarks.phase.Middle.econ_95,
          },
          {
            metric: "Death Econ",
            [player1]: normalizeInverse(getPhaseVal(p1, "Death", "economy"), benchmarks.phase.Death.econ_95),
            [player2]: normalizeInverse(getPhaseVal(p2, "Death", "economy"), benchmarks.phase.Death.econ_95),
            [`${player1}_raw`]: getPhaseVal(p1, "Death", "economy"),
            [`${player2}_raw`]: getPhaseVal(p2, "Death", "economy"),
            benchmark: benchmarks.phase.Death.econ_95,
          },
          {
            metric: "Strike Rate",
            [player1]: normalizeInverse(Number(p1.skills.strike_rate), benchmarks.phase.Middle.sr_95),
            [player2]: normalizeInverse(Number(p2.skills.strike_rate), benchmarks.phase.Middle.sr_95),
            [`${player1}_raw`]: Number(p1.skills.strike_rate),
            [`${player2}_raw`]: Number(p2.skills.strike_rate),
            benchmark: benchmarks.phase.Middle.sr_95,
          },
          {
            metric: "BEI (Bowling Efficiency Index)",
            [player1]: normalizePositive(Number(p1.bei.bei), getGlobal("bei_95_global")),
            [player2]: normalizePositive(Number(p2.bei.bei), getGlobal("bei_95_global")),
            [`${player1}_raw`]: Number(p1.bei.bei),
            [`${player2}_raw`]: Number(p2.bei.bei),
            benchmark: getGlobal("bei_95_global"),
          },
        ];

        setData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching comparison data:", err);
        setLoading(false);
      });
  }, [player1, player2]);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
  if (!data.length) return <div className="text-center text-gray-500">No data available.</div>;

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {player1} vs {player2} — Bowling Skill Comparison
        </h2>

        <ResponsiveContainer width="100%" height={420}>
          <RadarChart outerRadius="70%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }} />
            <PolarRadiusAxis angle={90} domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
            <Radar name={player1} dataKey={player1} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
            <Radar name={player2} dataKey={player2} stroke="#ef4444" fill="#ef4444" fillOpacity={0.35} />
            <Legend verticalAlign="top" />
            <Tooltip formatter={(val) => `${(val * 100).toFixed(1)}%`} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Table below radar */}
      <CompareSkillTable player1={player1} player2={player2} data={data} />
    </div>
  );
};

export default CompareBowlerRadar;
