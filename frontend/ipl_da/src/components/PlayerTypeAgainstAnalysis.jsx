import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

function PlayerTypeAgainstAnalysis({ playerName }) {
  const [data, setData] = useState({ batting: [], bowling: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [battingStatType, setBattingStatType] = useState('runs');
  const [bowlingStatType, setBowlingStatType] = useState('wickets');

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5000/api/player-typeagainst-analysis?player=${playerName}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching player type against analysis:', error);
        setError('Failed to fetch player type against analysis data');
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

  const battingData = data.batting.map(item => ({ ...item, stat: item[battingStatType] }));
  const bowlingData = data.bowling.map(item => ({ ...item, stat: item[bowlingStatType] }));
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const battingOptions = [
    { value: 'runs', label: 'Runs Scored' },
    { value: 'strike_rate', label: 'Strike Rate' },
    { value: 'average', label: 'Batting Average' }
  ];

  const bowlingOptions = [
    { value: 'wickets', label: 'Wickets Taken' },
    { value: 'economy_rate', label: 'Economy Rate' },
    { value: 'strike_rate', label: 'Strike Rate' },
    { value: 'average', label: 'Bowling Average' }
  ];

  return (
    <div className="space-y-8">
      {/* Batting Against Different Bowling Types */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Batting vs Bowling Types</h3>
            <p className="text-gray-600">Performance against different bowling styles</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <label htmlFor="battingStatType" className="text-sm text-gray-600 font-medium">Metric:</label>
            <select 
              id="battingStatType" 
              value={battingStatType} 
              onChange={(e) => setBattingStatType(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {battingOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {battingData.length > 0 ? (
          <div className="bg-gray-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={battingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="type" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="stat" 
                  name={battingOptions.find(o => o.value === battingStatType)?.label}
                  radius={[8, 8, 0, 0]}
                >
                  {battingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No batting data available</div>
        )}
      </div>
      
      {/* Bowling Against Different Batting Types */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Bowling vs Batting Types</h3>
            <p className="text-gray-600">Performance against different batting hands</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <label htmlFor="bowlingStatType" className="text-sm text-gray-600 font-medium">Metric:</label>
            <select 
              id="bowlingStatType" 
              value={bowlingStatType} 
              onChange={(e) => setBowlingStatType(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {bowlingOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {bowlingData.length > 0 ? (
          <div className="bg-gray-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={bowlingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="type" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="stat" 
                  name={bowlingOptions.find(o => o.value === bowlingStatType)?.label}
                  radius={[8, 8, 0, 0]}
                >
                  {bowlingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No bowling data available</div>
        )}
      </div>
    </div>
  );
}

export default PlayerTypeAgainstAnalysis;