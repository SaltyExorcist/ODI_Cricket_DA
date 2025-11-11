import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Target, Activity, Award, ArrowUpDown } from 'lucide-react';

function BatterShotAnalysis({ player }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total_runs', direction: 'desc' });

  useEffect(() => {
    if (!player) return;

    setLoading(true);
    setError(null);

    axios.get(`http://localhost:5000/api/batter-shot-types?player=${encodeURIComponent(player)}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching shot analysis:', error);
        setError('Failed to fetch shot analysis data');
        setLoading(false);
      });
  }, [player]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    return sorted;
  }, [data, sortConfig]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600">No shot analysis data available</p>
      </div>
    );
  }

  // Calculate totals for summary cards
  const totals = data.reduce((acc, shot) => ({
    runs: acc.runs + (parseFloat(shot.total_runs) || 0),
    balls: acc.balls + (parseInt(shot.total_balls) || 0),
    outs: acc.outs + (parseInt(shot.total_outs) || 0)
  }), { runs: 0, balls: 0, outs: 0 });

  const overallStrikeRate = totals.balls > 0 ? ((totals.runs / totals.balls) * 100).toFixed(2) : '0.00';
  const overallAverage = totals.outs > 0 ? (totals.runs / totals.outs).toFixed(2) : totals.runs.toFixed(2);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Runs"
          value={totals.runs.toLocaleString()}
          color="blue"
        />
        <SummaryCard
          icon={<Activity className="w-5 h-5" />}
          label="Balls Faced"
          value={totals.balls.toLocaleString()}
          color="green"
        />
        <SummaryCard
          icon={<Target className="w-5 h-5" />}
          label="Strike Rate"
          value={overallStrikeRate}
          color="purple"
        />
        <SummaryCard
          icon={<Award className="w-5 h-5" />}
          label="Average"
          value={overallAverage}
          color="orange"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader
                  label="Shot Type"
                  sortKey="shot"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Runs"
                  sortKey="total_runs"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Balls"
                  sortKey="total_balls"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Strike Rate"
                  sortKey="strike_rate"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Average"
                  sortKey="average"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Dismissals"
                  sortKey="total_outs"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Control %"
                  sortKey="control_pct"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((shot, index) => (
                <tr 
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {formatShotName(shot.shot)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-blue-600">
                      {parseFloat(shot.total_runs).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {parseInt(shot.total_balls).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StrikeRateBadge value={parseFloat(shot.strike_rate)} />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {parseFloat(shot.average).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      parseInt(shot.total_outs) === 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {parseInt(shot.total_outs)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ControlBar value={parseFloat(shot.control_pct)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Shot Analysis Metrics:</p>
            <ul className="space-y-1 text-gray-600">
              <li><strong>Strike Rate:</strong> Runs scored per 100 balls for each shot type</li>
              <li><strong>Control %:</strong> Percentage of balls played with good control</li>
              <li><strong>Average:</strong> Runs scored before getting out playing this shot</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const SummaryCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const SortableHeader = ({ label, sortKey, currentSort, onSort }) => {
  const isActive = currentSort.key === sortKey;
  
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <ArrowUpDown className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        {isActive && (
          <span className="text-blue-600 text-xs">
            {currentSort.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
};

const StrikeRateBadge = ({ value }) => {
  let colorClass = 'bg-gray-100 text-gray-800';
  
  if (value >= 120) colorClass = 'bg-green-100 text-green-800';
  else if (value >= 90) colorClass = 'bg-blue-100 text-blue-800';
  else if (value >= 70) colorClass = 'bg-yellow-100 text-yellow-800';
  else colorClass = 'bg-red-100 text-red-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {value.toFixed(2)}
    </span>
  );
};

const ControlBar = ({ value }) => {
  const percentage = Math.min(100, Math.max(0, value));
  
  let colorClass = 'bg-red-500';
  if (percentage >= 80) colorClass = 'bg-green-500';
  else if (percentage >= 60) colorClass = 'bg-blue-500';
  else if (percentage >= 40) colorClass = 'bg-yellow-500';

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
        <div 
          className={`h-2 rounded-full ${colorClass} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-xs font-medium text-gray-600 w-12 text-right">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
};

// Helper function to format shot names
const formatShotName = (shot) => {
  if (!shot) return 'Unknown';
  return shot
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default BatterShotAnalysis;