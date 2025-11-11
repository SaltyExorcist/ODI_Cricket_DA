import React, { useEffect, useState } from "react";

const PitchHeatmap3D = ({ player }) => {
  const [data, setData] = useState([]);
  const [batHand, setBatHand] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player) return;
    setLoading(true);
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:5000/api/batter-line-length-sr?player=${encodeURIComponent(player)}`
      );
      const json = await res.json();
      setData(json);

      const res2 = await fetch(
        `http://localhost:5000/api/player-stats?player=${encodeURIComponent(player)}`
      );
      const json2 = await res2.json();
      if (json2?.bat_hand?.bat_hand) setBatHand(json2.bat_hand.bat_hand);
      setLoading(false);
    };
    fetchData();
  }, [player]);

  let lineOrder = [
    "WIDE_OUTSIDE_OFFSTUMP",
    "OUTSIDE_OFFSTUMP",
    "ON_THE_STUMPS",
    "DOWN_LEG",
    "WIDE_DOWN_LEG",
  ];

  const lengthOrder = [
    "FULL_TOSS",
    "YORKER",
    "FULL",
    "GOOD_LENGTH",
    "SHORT_OF_A_GOOD_LENGTH",
    "SHORT",
  ];

  if (batHand === "LHB") lineOrder = [...lineOrder].reverse();

  const getSR = (line, length) => {
    const match = data.find((d) => d.line === line && d.length === length);
    return match ? parseFloat(match.strike_rate) : null;
  };

  const getColor = (value) => {
    if (!value) return "transparent";
    const min = 60;
    const max = 200;
    const ratio = Math.min(1, Math.max(0, (value - min) / (max - min)));
    const hue = 220 - ratio * 180;
    return `hsla(${hue}, 80%, 50%, 0.8)`; // alpha = 0.8 for pitch overlay
  };

  if (loading)
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading Heatmap...</div>;

  if (!data.length)
    return (
      <div className="text-center text-gray-500 bg-gray-50 p-6 border border-gray-200 rounded-xl">
        No data available for {player}.
      </div>
    );
    
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Line vs Length Strike Rate — {player} ({batHand})
      </h2>

      <div className="relative bg-green-800 rounded-xl shadow-2xl overflow-hidden"
           style={{
             perspective: "1200px",
             height: "700px",
             display: "flex",
             justifyContent: "center",
             alignItems: "center"
           }}>
        {/* Pitch background */}
        <div className="relative w-[85%] h-[85%]"
             style={{
               transform: "rotateX(55deg)",
               transformOrigin: "bottom center",
               backgroundImage: "url('/assets/pitch.png')",
               backgroundSize: "cover",
               backgroundPosition: "center",
               position: "relative",
               borderRadius: "1rem",
               boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
             }}>
          {/* Heatmap overlay grid */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${lineOrder.length}, 1fr)`,
              gridTemplateRows: `repeat(${lengthOrder.length}, 1fr)`,
            }}
          >
            {lengthOrder.map((length) =>
              lineOrder.map((line) => {
                const sr = getSR(line, length);
                return (
                  <div
                    key={`${length}-${line}`}
                    title={`${line} | ${length}: SR ${sr ? sr.toFixed(1) : "–"}`}
                    style={{
                      backgroundColor: getColor(sr),
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: sr && sr > 140 ? "white" : "black",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    className="hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    {sr ? sr.toFixed(0) : ""}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-2 mt-6 text-base text-gray-600">
        <div
          className="h-4 w-56 rounded-full"
          style={{
            background:
              "linear-gradient(to right, hsl(220,70%,50%), hsl(150,70%,50%), hsl(60,70%,50%), hsl(0,70%,50%))",
          }}
        ></div>
        <span>Strike Rate: Low → High</span>
      </div>
    </div>
  );
};

export default PitchHeatmap3D;
