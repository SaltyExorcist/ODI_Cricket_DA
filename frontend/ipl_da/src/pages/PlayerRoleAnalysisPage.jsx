import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import PlayerRoleAnalysis from '../components/PlayerRoleAnalysis';

function PlayerRoleAnalysisPage() {
  const { player } = useParams();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to={`/player/${encodeURIComponent(player)}`}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to {player}</span>
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{player}</h1>
            <p className="text-blue-100 text-lg mt-1">
              Phase-Wise Performance Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Component */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <PlayerRoleAnalysis playerName={player} />
      </div>
    </div>
  );
}

export default PlayerRoleAnalysisPage;