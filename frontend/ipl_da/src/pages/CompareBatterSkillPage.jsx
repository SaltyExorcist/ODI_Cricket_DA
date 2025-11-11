import React, { useState } from "react";
import CompareSkillRadar from "../components/CompareSkillRadar";

function CompareBatterSkillPage() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <input
          type="text"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          placeholder="Player 1"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-600 font-medium">vs</span>
        <input
          type="text"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          placeholder="Player 2"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <CompareSkillRadar player1={player1} player2={player2} />
    </div>
  );
}

export default CompareBatterSkillPage;
