import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Target, Award, BarChart3, ArrowLeft,CircleArrowOutDownLeft,Compass,Funnel} from 'lucide-react';
import PlayerPerformanceChart from '../PlayerPerformanceChart';

function PlayerStats() {
  const { player } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/api/player-stats?player=${player}`)
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching player stats:', error);
        setLoading(false);
      });
  }, [player]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No data available for this player</p>
      </div>
    );
  }

  const initials = player.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to="/players"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Players</span>
      </Link>

      {/* Player Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{player}</h1>
            <p className="text-blue-100 text-lg">Career Statistics & Analysis</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link 
          to={`/player/${encodeURIComponent(player)}/phase-analysis`}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <BarChart3 className="w-5 h-5" />   
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Phase Analysis</span>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors rotate-180" />
          </div>
        </Link>

        <Link 
          to={`/player/${encodeURIComponent(player)}/type-against-analysis`}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Target className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Type Analysis</span>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors rotate-180" />
          </div>
        </Link>

        <Link 
          to={`/player/${encodeURIComponent(player)}/shot-analysis`}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Shot Analysis</span>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors rotate-180" />
          </div>
        </Link>

        <Link 
          to={`/player/${encodeURIComponent(player)}/bowltype-analysis`}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Funnel className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">BowlType Analysis</span>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors rotate-180" />
          </div>
        </Link>

        <Link 
          to={`/player/${encodeURIComponent(player)}/batterzone-analysis`}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <CircleArrowOutDownLeft className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Batter Zone Analysis</span>
            </div>
            < ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors rotate-180" />
          </div>
        </Link>

        <Link 
          to={`/player/${encodeURIComponent(player)}/batter-wagon`}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Batter Wagon Wheel</span>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors rotate-180" />
          </div>
        </Link>
      </div>

      {/* Batting Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Batting Statistics</h2>
        </div>
        {stats.batting && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem label="Total Runs" value={stats.batting.total_runs?.toLocaleString() || 'N/A'} />
            <StatItem label="Balls Faced" value={stats.batting.balls_faced?.toLocaleString() || 'N/A'} />
            <StatItem label="Strike Rate" value={stats.batting.strike_rate || 'N/A'} />
            <StatItem label="Average" value={stats.batting.average || 'N/A'} />
          </div>
        )}
      </div>

      {/* Bowling Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Bowling Statistics</h2>
        </div>
        {stats.bowling && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <StatItem label="Wickets" value={stats.bowling.wickets || 'N/A'} />
            <StatItem label="Runs Conceded" value={stats.bowling.runs_conceded?.toLocaleString() || 'N/A'} />
            <StatItem label="Economy Rate" value={stats.bowling.economy_rate || 'N/A'} />
            <StatItem label="Average" value={stats.bowling.average || 'N/A'} />
            <StatItem label="Strike Rate" value={stats.bowling.strike_rate || 'N/A'} />
          </div>
        )}
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Over Years</h2>
        <PlayerPerformanceChart playerName={player} />
      </div>
    </div>
  );
}

const StatItem = ({ label, value }) => (
  <div className="text-center">
    <p className="text-sm text-gray-500 mb-2">{label}</p>
    <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

export default PlayerStats;