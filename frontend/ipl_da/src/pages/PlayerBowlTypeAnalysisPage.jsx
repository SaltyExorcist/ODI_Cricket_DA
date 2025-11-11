import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import BatterBowlTypeAnalysis from '../components/BatterBowlTypeAnalysis';

function PlayerBowlTypeAnalysisPage() {
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
      <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{player}</h1>
            <p className="text-purple-100 text-lg mt-1">
              Bowl Type Analysis & other Metrics
            </p>
          </div>
        </div>
      </div>

      {/* Shot Analysis Component */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <BatterBowlTypeAnalysis player={player} />
      </div>
    </div>
  );
}

export default PlayerBowlTypeAnalysisPage;