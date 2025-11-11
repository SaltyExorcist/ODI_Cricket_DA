import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Swords } from 'lucide-react';
import PlayerMatchup from '../components/PlayerMatchup/PlayerMatchup';

function PlayerMatchupPage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to="/analytics"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Analytics</span>
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Swords className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Player Matchup Analysis</h1>
            <p className="text-purple-100 text-lg mt-1">
              Compare head-to-head performance between batsmen and bowlers
            </p>
          </div>
        </div>
      </div>

      {/* Matchup Component */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <PlayerMatchup />
      </div>
    </div>
  );
}

export default PlayerMatchupPage;