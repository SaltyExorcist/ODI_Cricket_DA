import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function SeasonOverview({ season }) {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/api/season-overview?year=${season}`)
      .then(response => setOverview(response.data))
      .catch(error => console.error('Error fetching season overview:', error));
  }, [season]);

  if (!overview) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const teamPerformanceData = {
    labels: overview.team_performance.map(team => team.team),
    datasets: [{
      label: 'Wins',
      data: overview.team_performance.map(team => team.wins),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  const topScorersData = {
    labels: overview.top_scorers.map(player => player.name),
    datasets: [{
      data: overview.top_scorers.map(player => player.runs),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  };

  const topBowlersData = {
    labels: overview.top_bowlers.map(player => player.name),
    datasets: [{
      data: overview.top_bowlers.map(player => player.wickets),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Season {season} Overview</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Team Performance</h3>
            <Bar data={teamPerformanceData} options={{ responsive: true, plugins: { legend: { labels: { color: 'white' } } } }} />
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Top Scorers</h3>
            <Doughnut data={topScorersData} options={{ responsive: true, plugins: { legend: { labels: { color: 'white' } } } }} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-semibold mb-4">Top Bowlers</h3>
          <Bar data={topBowlersData} options={{ responsive: true, plugins: { legend: { labels: { color: 'white' } } } }} />
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Season Highlights</h3>
          <ul className="space-y-2">
            {overview.highlights.map((highlight, index) => (
              <li key={index} className="border-b border-gray-700 pb-2">{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SeasonOverview;