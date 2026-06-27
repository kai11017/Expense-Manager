import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  BrainCircuit, 
  Newspaper, 
  LogOut, 
  User as UserIcon,
  Cpu,
  ChevronRight,
  Zap,
  Menu,
  Moon,
  Sun
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, user, logout, isSidebarCollapsed, setIsSidebarCollapsed, theme, setTheme } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'blue' },
    { id: 'transactions', label: 'Expenses', icon: Receipt, color: 'amber' },
    { id: 'portfolio', label: 'Life & Asset Portfolio', icon: Wallet, color: 'emerald' },
    { id: 'advisor', label: 'AI Financial Advisor', icon: BrainCircuit, color: 'purple' },
    { id: 'news', label: 'Personalized News', icon: Newspaper, color: 'rose' },
  ];

  const colorMap = {
    blue: { bg: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20', dot: 'bg-emerald-400' },
    amber: { bg: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20', dot: 'bg-amber-400' },
    emerald: { bg: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20', dot: 'bg-emerald-400' },
    purple: { bg: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20', dot: 'bg-purple-400' },
    rose: { bg: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20', dot: 'bg-rose-400' },
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <aside 
      className={`glass-card h-[calc(100vh-2rem)] sticky top-4 left-4 flex flex-col justify-between p-4 shadow-xl transition-all duration-300 z-50 ${
        isSidebarCollapsed ? 'w-[80px]' : 'w-64'
      }`}
    >
      <div>
        {/* Logo/Brand Header & Toggle */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-6 border-b border-glassBorder pb-4`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/25">
                  <Cpu size={18} />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-[var(--bg-surface)]"></span>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-wide text-gradient-brand">FinPilot</h1>
                <div className="flex items-center gap-1.5">
                  <Zap size={10} className="text-amber-400" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">OS</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const colors = colorMap[item.color];
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${colors.bg} text-white shadow-md ${colors.shadow}`
                    : 'text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/[0.04] hover:text-[var(--text-primary)]'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3">
                  {!isActive && !isSidebarCollapsed && (
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} opacity-50`}></span>
                  )}
                  <Icon size={17} className={isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-gray-700 dark:group-hover:text-gray-300'} />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
                {isActive && !isSidebarCollapsed && <ChevronRight size={14} className="text-white/60" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="border-t border-glassBorder pt-4 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3 px-3.5'} py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/[0.04] hover:text-[var(--text-primary)] transition-all`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {!isSidebarCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {user && !isSidebarCollapsed && (
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/10 flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name || 'User'}</h4>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-2.5 px-3.5'} py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group`}
          title="Sign Out"
        >
          <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          {!isSidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
