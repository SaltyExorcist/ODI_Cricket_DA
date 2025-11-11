import React, { useState } from "react";
import PitchHeatmap3D from "../components/BowlerLineLengthHeatmap";

const BowlerHeatmapPage = () => {
  const [player, setPlayer] = useState("");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Bowler Line–Length Heatmap Analytics
      </h1>

      <div className="flex justify-center gap-3">
        <input
          type="text"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          placeholder="Enter bowler name..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-72"
        />
      </div>

      <div className="mt-6">
        <PitchHeatmap3D player={player} />
      </div>
    </div>
  );
};

export default BowlerHeatmapPage;
