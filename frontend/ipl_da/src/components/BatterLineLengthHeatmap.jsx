import React, { useEffect, useState } from "react";

const BatterLineLengthHeatmap = ({ player ,bowlType,bowler}) => {
  console.log("BatterLineLengthHeatmap rendered for player:", player, "bowlType:", bowlType);
  const [data, setData] = useState([]);
  const [batHand, setBatHand] = useState("");
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState("strike_rate");

  const metrics = [
    { key: "strike_rate", label: "Strike Rate" },
    { key: "control_pct", label: "Control %" },
    { key: "boundary_pct", label: "Boundary %" },
    { key: "dot_pct", label: "Dot %" },
  ];

  useEffect(() => {
  if (!player) return;
  setLoading(true);

  const fetchData = async () => {
    try {
      // ✅ Build URL safely
      const url = new URL("http://localhost:5000/api/batter-line-length-sr2");
      url.searchParams.append("player", player);
      if (bowlType && bowlType !== "All") {
        url.searchParams.append("bowl_style", bowlType);
      }
      if (bowler) url.searchParams.append("bowler", bowler);
      const res = await fetch(url);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ API error response:", text);
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);

       const res2 = await fetch(
        `http://localhost:5000/api/player-stats?player=${encodeURIComponent(player)}`
      );
      const json2 = await res2.json();
      if (json2?.bat_hand?.bat_hand) setBatHand(json2.bat_hand.bat_hand);
      
    } catch (err) {
      console.error(" Fetch error in BatterLineLengthHeatmap:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [player, bowlType,bowler]);


  // Axis definitions
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

  const getMetricValue = (line, length) => {
    const match = data.find((d) => d.line === line && d.length === length);
    if (!match) return null;
    const val = match[metric];
    return val !== undefined ? parseFloat(val) : null;
  };

  const getColor = (value) => {
    if (!value || isNaN(value)) return "transparent";

    let min = 0,
      max = 100;
    if (metric === "strike_rate") {
      min = 60;
      max = 200;
    } else if (metric === "control_pct") {
      min = 60;
      max = 100;
    } else if (metric === "boundary_pct") {
      min = 0;
      max = 30;
    } else if (metric === "dot_pct") {
      min = 20;
      max = 80;
    }

    const ratio = Math.min(1, Math.max(0, (value - min) / (max - min)));
    // Invert hue if Dot% (lower = better)
    const hue = metric === "dot_pct" ? 60 + ratio * 180 : 220 - ratio * 180;
    return `hsla(${hue}, 80%, 50%, 0.8)`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading Heatmap...
      </div>
    );

  if (!data.length)
    return (
      <div className="text-center text-gray-500 bg-gray-50 p-6 border border-gray-200 rounded-xl">
        No data available for {player}.
      </div>
    );

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        {player} ({batHand}) — {metrics.find((m) => m.key === metric)?.label} Map
      </h2>

      {/* Metric Toggle Buttons */}
      <div className="flex justify-center mb-4 space-x-2">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`px-3 py-1 text-sm rounded-full ${
              metric === m.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 3D Pitch Heatmap */}
      <div
        className="relative bg-green-800 rounded-xl shadow-2xl overflow-hidden"
        style={{
          perspective: "1200px",
          height: "700px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Pitch background */}
        <div
          className="relative w-[85%] h-[85%]"
          style={{
            transform: "rotateX(55deg)",
            transformOrigin: "bottom center",
            backgroundImage: "url('/assets/pitch.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            borderRadius: "1rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${lineOrder.length}, 1fr)`,
              gridTemplateRows: `repeat(${lengthOrder.length}, 1fr)`,
            }}
          >
            {lengthOrder.map((length) =>
              lineOrder.map((line) => {
                const val = getMetricValue(line, length);
                return (
                  <div
                    key={`${length}-${line}`}
                    title={`${line} | ${length}: ${
                      val ? val.toFixed(1) : "–"
                    }`}
                    style={{
                      backgroundColor: getColor(val),
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: metric === "strike_rate" && val > 140 ? "white" : "black",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    className="hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    {val ? val.toFixed(0) : ""}
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
              metric === "dot_pct"
                ? "linear-gradient(to right, hsl(0,70%,50%), hsl(60,70%,50%), hsl(150,70%,50%), hsl(220,70%,50%))"
                : "linear-gradient(to right, hsl(220,70%,50%), hsl(150,70%,50%), hsl(60,70%,50%), hsl(0,70%,50%))",
          }}
        ></div>
        <span>
          {metrics.find((m) => m.key === metric)?.label}:{" "}
          {metric === "dot_pct" ? "High → Low" : "Low → High"}
        </span>
      </div>
    </div>
  );
};

export default BatterLineLengthHeatmap;
