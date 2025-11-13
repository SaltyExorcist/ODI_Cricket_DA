import React, { useState } from "react";
import BatterLineLengthHeatmap from "./BatterLineLengthHeatmap";
import BatterWagonWheel from "./BatterWagonWheel";
import BatterMetricSummary from "./BatterMetricSummary"; // new small summary component
import {useParams} from "react-router-dom"

const BatterWeakZonePage = () => {
  const { player } = useParams();
  const [bowlKind, setbowlKind] = useState("pace bowler");

  const handleChange = (e) => setbowlKind(e.target.value);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Batter Zone Analysis — {player}
      </h1>

      {/* Bowler Type Selector */}
      <div className="flex justify-center mb-6">
        <select
          value={bowlKind}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 text-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="pace bowler">Pace Bowlers</option>
          <option value="spin bowler">Spin Bowlers</option>
        </select>
      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="col-span-1">
          <BatterMetricSummary player={player} bowlKind={bowlKind} />
        </div>

         {/* Viz Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap View */}
        <div className="p-4 bg-white rounded-xl shadow-md">
          <BatterLineLengthHeatmap player={player} bowlKind={bowlKind} />
        </div>

        {/* Wagon Wheel View */}
        <div className="p-4 bg-white rounded-xl shadow-md">
          <BatterWagonWheel player={player} bowlKind={bowlKind} />
        </div>
      </div>

      </div>
    </div>
  );
};

export default BatterWeakZonePage;
