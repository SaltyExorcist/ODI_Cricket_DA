import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import PlayerTypeAgainstAnalysis from '../components/PlayerTypeAgainstAnalysis';
import BatterLineLengthHeatmap from '../components/BatterLineLengthHeatmap';
import PlayerSkillRadar from '../components/PlayerSkillRadar';

function PlayerTypeAgainstAnalysisPage() {
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
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{player}</h1>
            <p className="text-green-100 text-lg mt-1">
              Performance Against Different Types
            </p>
          </div>
        </div>
      </div>

      {/* Type Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <PlayerTypeAgainstAnalysis playerName={player} />
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <BatterLineLengthHeatmap player={player} />
        <PlayerSkillRadar player={player}/>
      </div>
    </div>
  );
}

export default PlayerTypeAgainstAnalysisPage;