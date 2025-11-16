import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import TeamPerformance from '../components/TeamPerformance';

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('${import.meta.env.VITE_API_BASE}/api/teams')
      .then(response => {
        setTeams(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setLoading(false);
      });
  }, []);

  const filteredTeams = teams.filter(team => 
    team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Team Performance</h1>
          <p className="text-gray-600 mt-1">Analyze team statistics and historical performance</p>
        </div>
        {selectedTeam && (
          <button
            onClick={() => setSelectedTeam('')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Search Bar */}
      {!selectedTeam && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      )}

      {/* Team Grid or Selected Team Performance */}
      {selectedTeam ? (
        <TeamPerformance team={selectedTeam} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, idx) => (
            <TeamCard 
              key={idx} 
              team={team} 
              onClick={() => setSelectedTeam(team)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const TeamCard = ({ team, onClick }) => {
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/api/team-performance?team=${team}`)
      .then(response => setPerformance(response.data))
      .catch(error => console.error('Error fetching team performance:', error));
  }, [team]);

  const totalMatches = performance ? performance.wins + performance.losses + performance.ties : 0;
  const winRate = performance && totalMatches > 0 
    ? Math.round((performance.wins / totalMatches) * 100) 
    : 0;

  const colors = ['from-blue-500 to-indigo-600', 'from-green-500 to-emerald-600', 'from-purple-500 to-pink-600', 'from-orange-500 to-red-600'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {team}
        </h3>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${randomColor} flex items-center justify-center text-white font-bold text-lg`}>
          {team.charAt(0)}
        </div>
      </div>

      {performance ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 text-sm">Win Rate</span>
            <div className="flex items-center space-x-2">
              {winRate >= 50 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`font-bold ${winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                {winRate}%
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all" 
              style={{width: `${winRate}%`}}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Trophy className="w-3 h-3 text-green-500" />
                <p className="text-xs text-gray-500">Wins</p>
              </div>
              <p className="font-bold text-gray-800">{performance.wins}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Loss</p>
              <p className="font-bold text-gray-800">{performance.losses}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Ties</p>
              <p className="font-bold text-gray-800">{performance.ties}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;