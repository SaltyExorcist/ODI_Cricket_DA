import React, { useState, useEffect } from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function PlayerContributionTreemap({ teamName, season }) {
  const [data, setData] = useState([]);
  const [contributionType, setContributionType] = useState('runs');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/api/team-contributions?team=${teamName}&season=${season}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error('Error fetching team contributions:', error));
  }, [teamName, season]);

  const treeMapData = {
    name: 'Players',
    children: data.map(player => ({
      name: player.name,
      size: player[contributionType],
    })),
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Player Contribution Treemap</h3>
        <div className="mb-4">
          <select 
            value={contributionType} 
            onChange={(e) => setContributionType(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
          >
            <option value="runs">Runs</option>
            <option value="wickets">Wickets</option>
          </select>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={treeMapData.children}
              dataKey="size"
              ratio={4/3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow">
        <p className="text-white">{`${data.name} : ${data.size}`}</p>
      </div>
    );
  }
  return null;
}

export default PlayerContributionTreemap;