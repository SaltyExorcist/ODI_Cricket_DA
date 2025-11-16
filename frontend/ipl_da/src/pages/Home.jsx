import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, Target, Activity, Award, TrendingUp, BarChart3, Zap, ChevronRight } from 'lucide-react';

function Home() {
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    matches: 0,
    seasons: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teamsRes, playersRes, matchesRes, seasonsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE}/api/teams`),
          axios.get(`${import.meta.env.VITE_API_BASE}/api/players`),
          axios.get(`${import.meta.env.VITE_API_BASE}/api/matches`),
          axios.get(`${import.meta.env.VITE_API_BASE}/api/seasons`)
        ]);

        setStats({
          teams: teamsRes.data.length,
          players: playersRes.data.length,
          matches: matchesRes.data.length,
          seasons: seasonsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ODI Cricket Analytics
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Explore comprehensive statistics, player performance, and team insights from years of ODI cricket data
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/players"
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg inline-block"
            >
              Explore Players
            </Link>
            <Link 
              to="/analytics"
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-400 transition-all inline-block"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="w-8 h-8" />}
          title="Teams"
          value={stats.teams}
          change="International teams"
          color="blue"
        />
        <StatCard 
          icon={<Target className="w-8 h-8" />}
          title="Players"
          value={stats.players}
          change="Active & retired"
          color="green"
        />
        <StatCard 
          icon={<Activity className="w-8 h-8" />}
          title="Matches"
          value={stats.matches}
          change="Analyzed"
          color="purple"
        />
        <StatCard 
          icon={<Award className="w-8 h-8" />}
          title="Seasons"
          value={stats.seasons}
          change="Years of data"
          color="orange"
        />
      </div>

      {/* Featured Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureCard
          title="Player Performance"
          description="Dive deep into individual player statistics, trends, and matchups"
          icon={<TrendingUp className="w-6 h-6" />}
          to="/players"
        />
        <FeatureCard
          title="Team Analysis"
          description="Compare teams, analyze season performance, and track win rates"
          icon={<Users className="w-6 h-6" />}
          to="/teams"
        />
        <FeatureCard
          title="Advanced Analytics"
          description="Explore scatter plots, heatmaps, and role-based analysis"
          icon={<BarChart3 className="w-6 h-6" />}
          to="/analytics"
        />
        <FeatureCard
          title="Player Matchups"
          description="Analyze head-to-head performance between batsmen and bowlers"
          icon={<Zap className="w-6 h-6" />}
          to="/player-matchup"
        />
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, change, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, to }) => (
  <Link 
    to={to}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group block"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-all">
        {icon}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default Home;