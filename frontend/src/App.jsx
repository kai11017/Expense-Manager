import React from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Portfolio from './components/Portfolio';
import AIAdvisor from './components/AIAdvisor';
import News from './components/News';
import Login from './components/Login';

export default function App() {
  const { token, activeTab, user } = useApp();

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
      case 'news':
        return <News />;
      default:
        return <Dashboard />;
    }
  };

  // Auth Guard
  if (!token) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen p-4 gap-6">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-2 max-h-[calc(100vh-2rem)]">
        {renderContent()}
      </main>
    </div>
  );
}
