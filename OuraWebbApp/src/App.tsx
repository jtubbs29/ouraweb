import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import Sleep from './components/Sleep/Sleep';
import Readiness from './components/Readiness/Readiness';
import Header from './components/UI/Header';
import Navigation from './components/UI/Navigation';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/UI/ErrorBoundary';
import { AuthState } from './types';

type View = 'dashboard' | 'sleep' | 'readiness';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    sessionTimeout: 0
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const savedAuth = localStorage.getItem('oura-auth');
    if (savedAuth) {
      const parsedAuth: AuthState = JSON.parse(savedAuth);
      if (parsedAuth.sessionTimeout > Date.now()) {
        setAuthState(parsedAuth);
      } else {
        localStorage.removeItem('oura-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (password: string) => {
    const correctPassword = 'jt+cursor+agent129369';
    if (password === correctPassword) {
      const newAuthState: AuthState = {
        isAuthenticated: true,
        sessionTimeout: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      setAuthState(newAuthState);
      localStorage.setItem('oura-auth', JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      sessionTimeout: 0
    });
    localStorage.removeItem('oura-auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'sleep':
        return <Sleep />;
      case 'readiness':
        return <Readiness />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onLogout={handleLogout} />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Navigation 
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          <div className="h-full">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderCurrentView()}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <Navigation 
          currentView={currentView}
          onViewChange={setCurrentView}
          isMobile={true}
        />
      </div>
    </div>
  );
}

export default App;
