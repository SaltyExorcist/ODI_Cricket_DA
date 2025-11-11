import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function TeamComparison({ team1, team2 }) {
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/team-comparison?team1=${team1}&team2=${team2}`)
      .then(response => setComparisonData(response.data))
      .catch(error => console.error('Error fetching team comparison:', error));
  }, [team1, team2]);

  if (!comparisonData) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const radarData = {
    labels: ['Batting Average', 'Bowling Economy', 'Fielding Efficiency', 'Win Percentage', 'Run Rate'],
    datasets: [
      {
        label: team1,
        data: [
          comparisonData[team1].batting_average,
          comparisonData[team1].bowling_economy,
          comparisonData[team1].fielding_efficiency,
          comparisonData[team1].win_percentage,
          comparisonData[team1].run_rate
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: team2,
        data: [
          comparisonData[team2].batting_average,
          comparisonData[team2].bowling_economy,
          comparisonData[team2].fielding_efficiency,
          comparisonData[team2].win_percentage,
          comparisonData[team2].run_rate
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      }
    ]
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Team Comparison: {team1} vs {team2}</h2>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
          <Radar 
            data={radarData} 
            options={{ 
              responsive: true, 
              scales: { r: { ticks: { color: 'white' }, pointLabels: { color: 'white' } } },
              plugins: { legend: { labels: { color: 'white' } } }
            }} 
          />
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Head-to-Head</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-400">Total Matches:</p>
              <p className="font-semibold text-gray-400">{team1} Wins:</p>
              <p className="font-semibold text-gray-400">{team2} Wins:</p>
              <p className="font-semibold text-gray-400">Ties/No Results:</p>
            </div>
            <div>
              <p>{comparisonData.head_to_head.total_matches}</p>
              <p>{comparisonData.head_to_head[team1]}</p>
              <p>{comparisonData.head_to_head[team2]}</p>
              <p>{comparisonData.head_to_head.ties}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamComparison;