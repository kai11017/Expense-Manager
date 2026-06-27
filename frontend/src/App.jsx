import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Portfolio from './components/Portfolio';
import AIAdvisor from './components/AIAdvisor';
import History from './components/History';
import News from './components/News';
import Login from './components/Login';
import Landing from './components/Landing';
import Settings from './components/Settings';
import OnboardingTour from './components/OnboardingTour';
import StockAnalysis from './components/StockAnalysis';
import Support from './components/Support';

export default function App() {
  const { token, activeTab, user } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  // Route components based on tab state
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Expenses />;
      case 'portfolio':
        return <Portfolio />;
      case 'advisor':
        return <AIAdvisor />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      case 'news':
        return <News />;
      case 'analysis':
        return <StockAnalysis />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  // Auth Guard
  if (!token) {
    return showLogin 
      ? <Login onBack={() => setShowLogin(false)} /> 
      : <Landing onLoginClick={() => setShowLogin(true)} />;
  }

  return (
    <div className="flex min-h-screen p-4 gap-6">
      {/* Onboarding Tour */}
      <OnboardingTour />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-2 max-h-[calc(100vh-2rem)]">
        {renderContent()}
      </main>
    </div>
  );
}
