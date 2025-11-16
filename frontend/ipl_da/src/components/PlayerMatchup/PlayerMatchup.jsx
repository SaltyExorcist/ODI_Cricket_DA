import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../SearchBar";
import BatterLineLengthHeatmap from "../BatterLineLengthHeatmap";
import BatterWagonWheel from "../BatterWagonWheel";

function PlayerMatchup() {
  const [batsmen, setBatsmen] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [selectedBatsman, setSelectedBatsman] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");
  const [matchupData, setMatchupData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE}/api/players`)
      .then((res) => {
        setBatsmen(res.data);
        setBowlers(res.data);
      })
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  const fetchMatchupData = () => {
    if (!selectedBatsman || !selectedBowler) return;
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_BASE}/api/player-matchup?batsman=${encodeURIComponent(
          selectedBatsman
        )}&bowler=${encodeURIComponent(selectedBowler)}`
      )
      .then((res) => setMatchupData(res.data))
      .catch((err) => console.error("Error fetching matchup data:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Player Matchup Analysis
        </h2>

        {/* Player Selectors */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SearchBar
            items={batsmen}
            placeholder="Search for a batsman..."
            onSelect={setSelectedBatsman}
          />
          <SearchBar
            items={bowlers}
            placeholder="Search for a bowler..."
            onSelect={setSelectedBowler}
          />
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={fetchMatchupData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            Analyze Matchup
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-500 text-lg">Loading...</p>
        )}

        {/* Results Section */}
        {matchupData && (
          <div className="space-y-10">
            {/* Summary Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                {selectedBatsman} vs {selectedBowler}
              </h3>
              <table className="min-w-full text-center border border-gray-300 rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wide">
                  <tr>
                    <th className="py-3 px-4 border-r border-gray-200">Metric</th>
                    <th className="py-3 px-4">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(matchupData).map(([key, val]) => (
                    <tr key={key} className="border-t border-gray-200">
                      <td className="py-3 px-4 font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-semibold">
                        {val !== null ? val : "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visualization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h4 className="text-xl font-bold mb-4 text-center text-gray-700">
                  Line & Length Heatmap vs {selectedBowler}
                </h4>
                <BatterLineLengthHeatmap
                  player={selectedBatsman}
                  bowler={selectedBowler}   
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h4 className="text-xl font-bold mb-4 text-center text-gray-700">
                  Wagon Wheel vs {selectedBowler}
                </h4>
                <BatterWagonWheel
                  player={selectedBatsman}
                  bowler={selectedBowler}  
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerMatchup;
