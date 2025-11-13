import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BatterLineLengthHeatmap from "./BatterLineLengthHeatmap";
import BatterWagonWheel from "./BatterWagonWheel";

const fmt = (val) => (isNaN(Number(val)) ? "–" : Number(val).toFixed(2));

const colorForMetric = (metric, value) => {
  if (value === null || isNaN(value)) return "text-gray-500";
  if (metric === "strike_rate") return value >= 120 ? "text-green-600" : value >= 80 ? "text-yellow-600" : "text-red-600";
  if (metric === "average") return value >= 45 ? "text-green-600" : value >= 30 ? "text-yellow-600" : "text-red-600";
  if (metric === "boundary_pct") return value >= 15 ? "text-green-600" : value >= 10 ? "text-yellow-600" : "text-red-600";
  if (metric === "dot_pct") return value <= 35 ? "text-green-600" : value <= 50 ? "text-yellow-600" : "text-red-600";
  return "text-gray-700";
};

const PhaseGroup = ({ phase, data, player }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedBowlType, setSelectedBowlType] = useState(null);

  const safeNum = (v) => (v === null || v === undefined || isNaN(Number(v)) ? 0 : Number(v));
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const phaseStats = {
    sr: avg(data.map((d) => safeNum(d.strike_rate))),
    avg: avg(data.map((d) => safeNum(d.average))),
    dot: avg(data.map((d) => safeNum(d.dot_pct))),
    boundary: avg(data.map((d) => safeNum(d.boundary_pct))),
    control: avg(data.map((d) => safeNum(d.control_pct))),
  };

  return (
    <div className="border border-gray-200 rounded-xl mb-6 overflow-hidden bg-white shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer bg-gray-100 px-6 py-3 flex justify-between items-center"
      >
        <h3 className="text-lg font-semibold text-gray-800">{phase}</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 mr-2">
            SR <span className={`font-semibold ${colorForMetric("strike_rate", phaseStats.sr)}`}>{fmt(phaseStats.sr)}</span>
          </div>
          <div className="text-sm text-gray-600 mr-2">
            Avg <span className={`font-semibold ${colorForMetric("average", phaseStats.avg)}`}>{fmt(phaseStats.avg)}</span>
          </div>
          <span className="text-sm text-gray-600">{expanded ? "▲ Collapse" : "▼ Expand"}</span>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-6 space-y-6">
          {/* Mini summary cards */}
          <div className="flex flex-wrap justify-start gap-4 mb-2">
            {[
              ["Avg SR", phaseStats.sr, "strike_rate"],
              ["Avg", phaseStats.avg, "average"],
              ["Dot %", phaseStats.dot, "dot_pct"],
              ["Boundary %", phaseStats.boundary, "boundary_pct"],
              ["Control %", phaseStats.control, "control_pct"],
            ].map(([label, val, key]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-3 text-center shadow-sm w-36">
                <div className="text-xs text-gray-500">{label}</div>
                <div className={`text-xl font-bold ${colorForMetric(key, val)}`}>{fmt(val)}</div>
              </div>
            ))}
          </div>

          {/* Bowler Type Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bowler Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balls</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Runs</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SR</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dot %</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Boundary %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() =>
                      setSelectedBowlType(selectedBowlType === row.bowl_style ? null : row.bowl_style)
                    }
                    className={`hover:bg-blue-50 transition cursor-pointer ${
                      selectedBowlType === row.bowl_style ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">{row.bowl_style}</td>
                    <td className="px-6 py-3 text-gray-700">{row.total_balls}</td>
                    <td className="px-6 py-3 text-gray-700">{row.total_runs}</td>
                    <td className={`px-6 py-3 font-semibold ${colorForMetric("strike_rate", row.strike_rate)}`}>{fmt(row.strike_rate)}</td>
                    <td className={`px-6 py-3 font-semibold ${colorForMetric("average", row.average)}`}>{fmt(row.average)}</td>
                    <td className={`px-6 py-3 font-semibold ${colorForMetric("dot_pct", row.dot_pct)}`}>{fmt(row.dot_pct)}</td>
                    <td className={`px-6 py-3 font-semibold ${colorForMetric("boundary_pct", row.boundary_pct)}`}>{fmt(row.boundary_pct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Child Visuals when a bowler type is selected */}
          {selectedBowlType && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-center font-semibold text-gray-700 mb-2">
                  Line–Length Heatmap ({phase} | {selectedBowlType})
                </h4>
                <BatterLineLengthHeatmap player={player} phase={phase} bowlType={selectedBowlType} />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-center font-semibold text-gray-700 mb-2">
                  Wagon Wheel ({phase} | {selectedBowlType})
                </h4>
                <BatterWagonWheel player={player} phase={phase} bowlType={selectedBowlType} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BatterBowlPhaseAnalysis = () => {
  const { player } = useParams();
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!player) return;

    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:5000/api/batter-bowl-phase-types?player=${encodeURIComponent(player)}`)
      .then((res) => {
        const raw = res.data || [];
        const groupedData = raw.reduce((acc, row) => {
          const phaseKey = row.phase || "Unknown Phase";
          if (!acc[phaseKey]) acc[phaseKey] = [];
          acc[phaseKey].push(row);
          return acc;
        }, {});
        setGrouped(groupedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching batter phase data:", err);
        setError("Failed to load data. Check API connection.");
        setLoading(false);
      });
  }, [player]);

  if (loading)
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading phase data for {player}...</div>;

  if (error)
    return <div className="text-center text-red-500 bg-red-50 p-6 border border-red-200 rounded-xl">{error}</div>;

  if (!Object.keys(grouped).length)
    return <div className="text-center text-gray-500 bg-gray-50 p-6 border border-gray-200 rounded-xl">
      No phase-wise data available for {player}.
    </div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {player} — Phase-wise Batting vs Bowler Types
      </h2>

      {Object.entries(grouped).map(([phase, rows]) => (
        <PhaseGroup key={phase} phase={phase} data={rows} player={player} />
      ))}
    </div>
  );
};

export default BatterBowlPhaseAnalysis;
