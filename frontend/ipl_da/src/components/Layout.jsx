import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, Users, BarChart3, TrendingUp } from 'lucide-react';

function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">ODI CricStats</span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              <NavLink to="/" active={isActive('/')} icon={<Home className="w-4 h-4" />}>
                Home
              </NavLink>
              <NavLink to="/players" active={isActive('/players')} icon={<Users className="w-4 h-4" />}>
                Players
              </NavLink>
              <NavLink to="/teams" active={isActive('/teams')} icon={<TrendingUp className="w-4 h-4" />}>
                Teams
              </NavLink>
              <NavLink to="/analytics" active={isActive('/analytics')} icon={<BarChart3 className="w-4 h-4" />}>
                Analytics
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2025 ODI Cricket Analytics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const NavLink = ({ to, active, icon, children }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
      active 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Layout;