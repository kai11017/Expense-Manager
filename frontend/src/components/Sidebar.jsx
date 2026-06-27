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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Expenses', icon: Receipt },
    { id: 'portfolio', label: 'Life & Asset Portfolio', icon: Wallet },
    { id: 'advisor', label: 'AI Financial Advisor', icon: BrainCircuit },
    { id: 'news', label: 'Personalized News', icon: Newspaper },
  ];

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <aside 
      className={`glass-card h-[calc(100vh-2rem)] sticky top-4 left-4 flex flex-col justify-between p-5 shadow-2xl transition-all duration-500 z-50 ${
        isSidebarCollapsed ? 'w-[88px]' : 'w-72'
      }`}
    >
      <div>
        {/* Logo/Brand Header & Toggle */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-8 border-b border-glassBorder pb-6`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                  <Cpu size={20} />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-[var(--bg-surface)]"></span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-gradient-brand">FinPilot</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Zap size={10} className="text-emerald-500" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">OS</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={toggleSidebar} 
            className="p-2 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all active:scale-95"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'text-[var(--text-muted)] hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3.5">
                  {!isActive && !isSidebarCollapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 group-hover:bg-emerald-500 transition-colors"></span>
                  )}
                  <Icon size={18} className={isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'} />
                  {!isSidebarCollapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </div>
                {isActive && !isSidebarCollapsed && <ChevronRight size={16} className="text-white/80" />}
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
