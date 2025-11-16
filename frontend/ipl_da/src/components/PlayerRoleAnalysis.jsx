import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PlayerRoleAnalysis({ playerName }) {
  const [data, setData] = useState({ batting: [], bowling: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBattingStat, setSelectedBattingStat] = useState('runs');
  const [selectedBowlingStat, setSelectedBowlingStat] = useState('wickets');

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${import.meta.env.VITE_API_BASE}/api/player-role-analysis?player=${playerName}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching player role analysis:', error);
        setError('Failed to fetch player role analysis data');
        setLoading(false);
      });
  }, [playerName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  const battingStatsOptions = [
    { value: 'runs', label: 'Runs' },
    { value: 'strike_rate', label: 'Strike Rate' },
    { value: 'average', label: 'Average' }
  ];

  const bowlingStatsOptions = [
    { value: 'wickets', label: 'Wickets' },
    { value: 'economy_rate', label: 'Economy Rate' },
    { value: 'average', label: 'Average' },
    { value: 'strike_rate', label: 'Strike Rate' }
  ];

  return (
    <div className="space-y-8">
      {/* Batting Section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Batting Performance by Phase</h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="batting-stats" className="text-sm text-gray-600 font-medium">Metric:</label>
            <select
              id="batting-stats"
              value={selectedBattingStat}
              onChange={(e) => setSelectedBattingStat(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {battingStatsOptions.map(stat => (
                <option key={stat.value} value={stat.value}>{stat.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {data.batting.length > 0 ? (
          <div className="bg-gray-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.batting}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="role" 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey={selectedBattingStat} 
                  fill="#3B82F6" 
                  radius={[8, 8, 0, 0]}
                  name={battingStatsOptions.find(s => s.value === selectedBattingStat)?.label}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No batting data available</div>
        )}
      </div>
      
      {/* Bowling Section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Bowling Performance by Phase</h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="bowling-stats" className="text-sm text-gray-600 font-medium">Metric:</label>
            <select
              id="bowling-stats"
              value={selectedBowlingStat}
              onChange={(e) => setSelectedBowlingStat(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {bowlingStatsOptions.map(stat => (
                <option key={stat.value} value={stat.value}>{stat.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {data.bowling.length > 0 ? (
          <div className="bg-gray-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.bowling}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="role" 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey={selectedBowlingStat} 
                  fill="#10B981" 
                  radius={[8, 8, 0, 0]}
                  name={bowlingStatsOptions.find(s => s.value === selectedBowlingStat)?.label}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No bowling data available</div>
        )}
      </div>

      {/* Phase Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-800 mb-3">Phase Breakdown</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-700 mb-1">Powerplay</p>
            <p className="text-gray-600">Overs 1-10: Field restrictions phase</p>
          </div>
          <div>
            <p className="font-semibold text-blue-700 mb-1">Middle Overs</p>
            <p className="text-gray-600">Overs 11-40: Consolidation phase</p>
          </div>
          <div>
            <p className="font-semibold text-blue-700 mb-1">Death Overs</p>
            <p className="text-gray-600">Overs 41+: Acceleration phase</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerRoleAnalysis;