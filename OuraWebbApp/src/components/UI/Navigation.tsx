import React from 'react';
import { motion } from 'framer-motion';
import { Home, Moon, Target } from 'lucide-react';

type View = 'dashboard' | 'sleep' | 'readiness';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  isMobile = false 
}) => {
  const navigationItems = [
    {
      id: 'dashboard' as View,
      label: 'Dashboard',
      icon: Home,
      description: 'Overview of your health metrics'
    },
    {
      id: 'sleep' as View,
      label: 'Sleep',
      icon: Moon,
      description: 'Sleep quality and patterns'
    },
    {
      id: 'readiness' as View,
      label: 'Readiness',
      icon: Target,
      description: 'Recovery and readiness scores'
    }
  ];

  if (isMobile) {
    return (
      <nav className="flex justify-around items-center h-16 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-slate-500'}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-full bg-white border-r border-slate-200 py-6">
      <div className="flex-1 px-4 space-y-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative w-full ${
                isActive ? 'nav-link-active' : 'nav-link-inactive'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="flex items-center space-x-3 px-3">
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="px-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          <p className="mb-1">🔄 Data updates daily</p>
          <p>📊 {new Date().getFullYear()} Health Insights</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;