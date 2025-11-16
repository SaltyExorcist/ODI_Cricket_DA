import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Award } from 'lucide-react';

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/api/players`)
      .then(response => {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
        setLoading(false);
      });
  }, []);

  const filteredPlayers = players.filter(player => 
    player.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-800">Player Statistics</h1>
          <p className="text-gray-600 mt-1">Explore detailed performance metrics for all players</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">{filteredPlayers.length} Players</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for players by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Player Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player, idx) => (
            <PlayerCard key={idx} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No players found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

const PlayerCard = ({ player }) => {
  const initials = player.split(' ').map(n => n[0]).join('').slice(0, 2);
  const colors = ['from-blue-500 to-indigo-600', 'from-green-500 to-emerald-600', 'from-purple-500 to-pink-600', 'from-orange-500 to-red-600'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Link 
      to={`/player/${encodeURIComponent(player)}`}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${randomColor} flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform`}>
          {initials}
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
          {player}
        </h3>
        <p className="text-sm text-gray-500 mb-4">View Full Stats</p>
        
        <div className="w-full pt-4 border-t border-gray-100 flex justify-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Career</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Award className="w-4 h-4" />
            <span className="text-xs">Analysis</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlayersPage;