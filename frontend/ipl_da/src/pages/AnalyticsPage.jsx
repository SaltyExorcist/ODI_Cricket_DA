import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Activity, Users, Target, ChevronRight,Hexagon,Grid3x3,ChartScatter} from 'lucide-react';

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Advanced Analytics</h1>
        <p className="text-gray-600 mt-1">Explore in-depth statistical analysis and visualizations</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisCard
          title="Batting Statistics Scatter"
          description="Compare strike rates and averages across all players with minimum 25 matches"
          icon={<ChartScatter className="w-6 h-6" />}
          color="blue"
          to="/scatter"
        />
        
        <AnalysisCard
          title="Bowling Statistics Scatter"
          description="Analyze economy rates and bowling averages for qualified bowlers"
          icon={<ChartScatter className="w-6 h-6" />}
          color="green"
          to="/scatter"
        />
        
        <AnalysisCard
          title="Player Matchup Analysis"
          description="Head-to-head performance statistics between specific batsmen and bowlers"
          icon={<Users className="w-6 h-6" />}
          color="purple"
          to="/player-matchup"
        />
        
        <AnalysisCard
          title="Role-Based Performance"
          description="Performance breakdown across powerplay, middle overs, and death overs"
          icon={<Target className="w-6 h-6" />}
          color="orange"
          badge="Player Specific"
          info="Available on individual player pages"
        />

        <AnalysisCard
          title="Batter Heatmap Analysis"
          description="Heatmap of batsman Strike Rate grouped by line and length"
          icon={<Grid3x3 className="w-6 h-6" />}
          color="green"
          to="/batter-heatmap"
        />

        <AnalysisCard
          title="Bowler Heatmap Analysis"
          description="Heatmap of Bowler wickets grouped by line and length"
          icon={<Grid3x3 className="w-6 h-6" />}
          color="green"
          to="/bowler-heatmap"
        />

        <AnalysisCard
          title="Batter Spider Chart Analysis"
          description="Spider chart of two batters based on different metrics for comparison"
          icon={< Hexagon className="w-6 h-6" />}
          color="purple"
          to="/compare-batter"
        />

        <AnalysisCard
          title="Bowler Spider Chart Analysis"
          description="Spider chart of two bowlers based on different metrics for comparison"
          icon={< Hexagon className="w-6 h-6" />}
          color="purple"
          to="/compare-bowler"
        />

      </div>

      {/* Additional Features Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Player-Specific Analytics</h2>
        <p className="text-gray-600 mb-6">
          Access detailed analytics for individual players including:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <FeatureItem text="Performance by bowling type (pace, spin, etc.)" />
          <FeatureItem text="Line and length heatmaps" />
          <FeatureItem text="Shot selection analysis" />
          <FeatureItem text="Opposition-specific statistics" />
        </div>
        <Link 
          to="/players"
          className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
        >
          <span>Browse Players</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

const AnalysisCard = ({ title, description, icon, color, to, badge, info }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const content = (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}>
          {icon}
        </div>
        {badge && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      {info ? (
        <p className="text-xs text-gray-500 italic">{info}</p>
      ) : (
        <div className="flex items-center text-blue-600 font-medium text-sm">
          <span>View Analysis</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
};

const FeatureItem = ({ text }) => (
  <div className="flex items-start space-x-2">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
    <p className="text-gray-700">{text}</p>
  </div>
);

export default AnalyticsPage;