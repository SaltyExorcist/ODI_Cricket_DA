import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BattingStatsScatterplot from '../components/ScatterPlots/BattingStatsScatterplot';
import BowlingStatsScatterplot from '../components/ScatterPlots/BowlingStatsScatterplot';

const Scatter = () => {
  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link 
        to="/analytics"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Analytics</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Statistical Scatter Plots</h1>
        <p className="text-gray-600 mt-1">Compare player performance metrics across the board</p>
      </div>

      {/* Batting Scatter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Batting Statistics</h2>
          <p className="text-gray-600">Strike Rate vs Average for players with 25+ matches</p>
        </div>
        <BattingStatsScatterplot />
      </div>

      {/* Bowling Scatter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bowling Statistics</h2>
          <p className="text-gray-600">Economy Rate vs Average for qualified bowlers</p>
        </div>
        <BowlingStatsScatterplot />
      </div>
    </div>
  );
};

export default Scatter;