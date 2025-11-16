import React, { useEffect, useState } from "react";

const BowlerLineLengthHeatmap = ({ player }) => {
  const [data, setData] = useState([]);
  const [bowlStyle, setBowlStyle] = useState("");
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState("wickets");

  const metrics = [
    { key: "wickets", label: "Wickets" },
    { key: "economy", label: "Economy" },
    { key: "dot_pct", label: "Dot %" },
    { key: "control_pct", label: "Control %" }
  ];

  useEffect(() => {
    if (!player) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        // ✅ keep your existing fetch call for line-length data
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/bowler-line-length?player=${encodeURIComponent(player)}`
        );
        const json = await res.json();
        setData(json);

        // ✅ fetch bowling style (if exists)
        const res2 = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/player-stats?player=${encodeURIComponent(player)}`
        );
        const json2 = await res2.json();
        if (json2?.bowl_style?.bowl_style) setBowlStyle(json2.bowl_style.bowl_style);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [player]);

  // Define grid axes
  const lineOrder = [
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
    if (metric === "wickets") {
      min = 0;
      max = 30;
    } else if (metric === "economy") {
      min = 3;
      max = 10;
    } else if (metric === "dot_pct") {
      min = 20;
      max = 80;
    }

    const ratio = Math.min(1, Math.max(0, (value - min) / (max - min)));
    // invert hue for economy (lower = better)
    const invert = metric === "economy" ? true : false;
    const hue = invert ? 60 + ratio * 180 : 220 - ratio * 180;

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
        {player} ({bowlStyle}) — {metrics.find((m) => m.key === metric)?.label} Map
      </h2>

      {/* Metric toggle buttons */}
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
                      color:
                        metric === "economy" && val < 6
                          ? "white"
                          : "black",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    className="hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    {val ? val.toFixed(1) : ""}
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
              metric === "economy"
                ? "linear-gradient(to right, hsl(0,70%,50%), hsl(60,70%,50%), hsl(150,70%,50%), hsl(220,70%,50%))"
                : "linear-gradient(to right, hsl(220,70%,50%), hsl(150,70%,50%), hsl(60,70%,50%), hsl(0,70%,50%))",
          }}
        ></div>
        <span>
          {metrics.find((m) => m.key === metric)?.label}:{" "}
          {metric === "economy" ? "High → Low" : "Low → High"}
        </span>
      </div>
    </div>
  );
};

export default BowlerLineLengthHeatmap;
