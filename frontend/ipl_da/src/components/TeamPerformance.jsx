import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Trophy, TrendingUp } from 'lucide-react';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function TeamPerformance({ team }) {
  const [performance, setPerformance] = useState(null);
  const [seasonPerformance, setSeasonPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfRes, seasonRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE}/api/team-performance?team=${team}`),
          axios.get(`${import.meta.env.VITE_API_BASE}/api/team-season-performance?team=${team}`)
        ]);
        setPerformance(perfRes.data);
        setSeasonPerformance(seasonRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [team]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!performance || !seasonPerformance) {
    return <div className="text-center py-12 text-gray-500">No data available</div>;
  }

  const overallData = {
    labels: ['Wins', 'Losses', 'Ties'],
    datasets: [{
      label: team,
      data: [performance.wins, performance.losses, performance.ties],
      backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(234, 179, 8, 0.8)'],
      borderRadius: 8,
    }]
  };

  const seasonData = {
    labels: seasonPerformance.map(season => season.year),
    datasets: [
      {
        label: 'Wins',
        data: seasonPerformance.map(season => season.wins),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Losses',
        data: seasonPerformance.map(season => season.losses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#374151', font: { size: 12, weight: '500' } }
      }
    },
    scales: {
      y: { 
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: { 
        ticks: { color: '#6B7280' },
        grid: { display: false }
      }
    }
  };

  const totalMatches = performance.wins + performance.losses + performance.ties;
  const winRate = Math.round((performance.wins / totalMatches) * 100);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <Trophy className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total Wins</p>
          <p className="text-3xl font-bold">{performance.wins}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total Losses</p>
          <p className="text-3xl font-bold">{performance.losses}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 text-white">
          <Trophy className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Ties</p>
          <p className="text-3xl font-bold">{performance.ties}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Win Rate</p>
          <p className="text-3xl font-bold">{winRate}%</p>
        </div>
      </div>

      {/* Overall Performance Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Overall Performance</h3>
        <div style={{ height: '300px' }}>
          <Bar data={overallData} options={chartOptions} />
        </div>
      </div>

      {/* Season-wise Performance Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Season-wise Performance Trend</h3>
        <div style={{ height: '350px' }}>
          <Line data={seasonData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default TeamPerformance;