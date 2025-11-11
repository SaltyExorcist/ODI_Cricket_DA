import React from "react";

const CompareSkillTable = ({ player1, player2, data }) => {
  if (!data || !data.length) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Actual Player Metrics
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-800 font-semibold">
            <tr>
              <th className="px-4 py-2 text-left">Metric</th>
              <th className="px-4 py-2 text-center">{player1}</th>
              <th className="px-4 py-2 text-center">{player2}</th>
              <th className="px-4 py-2 text-center">95th Benchmark</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.metric} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{row.metric}</td>
                <td className="px-4 py-2 text-center text-blue-600 font-semibold">
                  {row[`${player1}_raw`]?.toFixed(2) ?? "-"}
                </td>
                <td className="px-4 py-2 text-center text-red-600 font-semibold">
                  {row[`${player2}_raw`]?.toFixed(2) ?? "-"}
                </td>
                <td className="px-4 py-2 text-center text-gray-600">
                  {row.benchmark ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareSkillTable;
