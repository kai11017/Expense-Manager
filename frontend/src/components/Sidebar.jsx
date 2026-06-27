import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  BrainCircuit, 
  Newspaper,
  History, 
  LogOut, 
  User as UserIcon,
  Cpu,
  ChevronRight,
  Zap,
  Menu,
  Moon,
  Sun,
  Settings,
  Repeat
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, user, logout, isSidebarCollapsed, setIsSidebarCollapsed } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Expenses', icon: Receipt },
    { id: 'portfolio', label: 'Life & Asset Portfolio', icon: Wallet },
    { id: 'advisor', label: 'AI Financial Advisor', icon: BrainCircuit },
    { id: 'history', label: 'Monthly History', icon: History },
    { id: 'news', label: 'Personalized News', icon: Newspaper },
  ];

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleProfileClick = (tab) => {
    setActiveTab(tab);
    setShowProfileMenu(false);
  };

  return (
    <aside 
      className={`bg-[var(--bg-sidebar)] border-r border-[var(--bg-sidebar)] h-[calc(100vh-2rem)] sticky top-4 left-4 flex flex-col justify-between p-5 rounded-2xl shadow-sm transition-all duration-300 z-50 ${
        isSidebarCollapsed ? 'w-[88px]' : 'w-64'
      }`}
    >
      <div>
        {/* Logo/Brand Header & Toggle */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-8 pb-4`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 bg-[var(--brand-green)] rounded-xl text-white shadow-md">
                <LayoutDashboard size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">FinPilot</h1>
              </div>
            </div>
          )}
          
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'} py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--brand-green)] text-white shadow-md'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {!isSidebarCollapsed && (
                    <span className="tracking-wide">{item.label}</span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area with Profile Menu */}
      <div className="pt-4 relative" ref={menuRef}>
        
        {/* Profile Popover Menu */}
        {showProfileMenu && !isSidebarCollapsed && (
          <div className="absolute bottom-[calc(100%+0.5rem)] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
            <div className="p-2 space-y-1">
              <button 
                onClick={() => handleProfileClick('profile')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                <UserIcon size={16} className="text-[var(--brand-green)]" />
                Your Profile
              </button>
              <button 
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                <Repeat size={16} className="text-gray-400" />
                Switch Account
              </button>
              <button 
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                <Settings size={16} className="text-gray-400" />
                Settings
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button 
                onClick={() => { setShowProfileMenu(false); logout && logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-lg font-medium transition-colors"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* User Block (Clickable) */}
        {user && !isSidebarCollapsed && (
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-full flex items-center space-x-3 px-2 py-2 rounded-xl transition-colors border ${
              showProfileMenu ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-sm font-semibold text-white truncate">{user.name || 'John Doe'}</h4>
              <p className="text-xs text-emerald-400 truncate font-medium">Premium Plan</p>
            </div>
            <div className="text-gray-400">
              <ChevronRight size={16} className={`transition-transform duration-200 ${showProfileMenu ? '-rotate-90' : ''}`} />
            </div>
          </button>
        )}
        
        {user && isSidebarCollapsed && (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer" title={user.name}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
