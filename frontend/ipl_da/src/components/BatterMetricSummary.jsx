import React, { useEffect, useState } from "react";
import axios from "axios";

const BatterMetricSummary = ({ player, bowlKind }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!player) return;
    axios
      .get(
        `${import.meta.env.VITE_API_BASE}/api/batter-zone-summary?player=${encodeURIComponent(player)}${
          bowlKind ? `&bowl_style=${encodeURIComponent(bowlKind)}` : ""
        }`
      )
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Error fetching batter summary:", err));
  }, [player, bowlKind]);

 if (!metrics)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading metrics...
      </div>
    );

  // Utility to format numeric safely
  const fmt = (val) =>
    isNaN(Number(val)) ? "–" : Number(val).toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Key Batting Metrics vs {bowlKind === "pace" ? "Pace" : "Spin"}
      </h3>
      <table className="w-full text-center text-gray-700">
        <tbody>
          <tr>
            <td className="font-medium py-2">Strike Rate</td>
            <td>{fmt(metrics.strike_rate)}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Boundary %</td>
            <td>{fmt(metrics.boundary_pct)}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Dot Ball %</td>
            <td>{fmt(metrics.dot_pct)}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Control %</td>
            <td>{fmt(metrics.ctrl_pct)}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">SRI</td>
            <td>{fmt(metrics.sri)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BatterMetricSummary;