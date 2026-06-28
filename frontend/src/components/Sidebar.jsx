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
  Repeat,
  HelpCircle,
  X
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, user, logout, isSidebarCollapsed, setIsSidebarCollapsed } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Expenses', icon: Receipt },
    { id: 'portfolio', label: 'Life & Asset Portfolio', icon: Wallet },
    { id: 'analysis', label: 'Stock Analysis', icon: Cpu },
    { id: 'history', label: 'History', icon: History },
    { id: 'news', label: 'Personalized News', icon: Newspaper },
    { id: 'advisor', label: 'Finny', icon: BrainCircuit },
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
    setMobileOpen(false);
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  // ====== MOBILE BOTTOM NAV BAR ======
  const mobileBottomItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'transactions', label: 'Expenses', icon: Receipt },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'advisor', label: 'Finny', icon: BrainCircuit },
  ];

  return (
    <>
      {/* ===== DESKTOP SIDEBAR (hidden on mobile) ===== */}
      <aside 
        id="tour-sidebar"
        className={`hidden md:flex bg-[var(--bg-sidebar)] border-r border-[var(--bg-sidebar)] h-[calc(100vh-2rem)] sticky top-4 left-4 flex-col justify-between p-5 rounded-2xl shadow-sm transition-all duration-300 z-50 ${
          isSidebarCollapsed ? 'w-[88px]' : 'w-64'
        }`}
      >
        <div>
          {/* Logo/Brand Header & Toggle */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-8 pb-4`}>
            {!isSidebarCollapsed && (
              <button onClick={() => setActiveTab('dashboard')} className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity text-left">
                <div className="relative flex items-center justify-center w-10 h-10 bg-[var(--brand-green)] rounded-xl text-white shadow-md">
                  <LayoutDashboard size={18} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">FinPilot</h1>
                </div>
              </button>
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
            <div className="absolute bottom-[calc(100%+0.5rem)] left-0 w-full bg-[var(--bg-surface)] rounded-xl shadow-xl border border-[var(--border-soft)] overflow-hidden animate-fade-in-up z-50">
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => { setShowProfileMenu(false); logout && logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-lg font-medium transition-colors"
                >
                  <Repeat size={16} className="text-gray-400" />
                  Switch Account
                </button>
                <button 
                  onClick={() => handleProfileClick('settings')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-lg font-medium transition-colors"
                >
                  <UserIcon size={16} className="text-[var(--brand-green)]" />
                  Your Profile
                </button>
                <button 
                  onClick={() => handleProfileClick('support')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-lg font-medium transition-colors"
                >
                  <HelpCircle size={16} className="text-blue-500" />
                  Support
                </button>
                <div className="h-px bg-[var(--border-soft)] my-1"></div>
                <button 
                  onClick={() => { setShowProfileMenu(false); logout && logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded-lg font-medium transition-colors"
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

      {/* ===== MOBILE TOP BAR (visible only on mobile) ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--bg-sidebar)] px-4 py-3 flex items-center justify-between shadow-lg safe-top">
        <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity text-left">
          <div className="w-8 h-8 bg-[var(--brand-green)] rounded-lg flex items-center justify-center text-white">
            <LayoutDashboard size={16} />
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">FinPilot</h1>
        </button>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ===== MOBILE SLIDE-OUT DRAWER ===== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          
          {/* Drawer panel */}
          <div className="absolute top-0 right-0 w-72 h-full bg-[var(--bg-sidebar)] p-5 flex flex-col shadow-2xl animate-slide-in-right">
            {/* Drawer header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <button onClick={() => handleNavClick('dashboard')} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity text-left">
                <div className="w-9 h-9 bg-[var(--brand-green)] rounded-xl flex items-center justify-center text-white shadow-md">
                  <LayoutDashboard size={16} />
                </div>
                <h1 className="text-lg font-bold text-white">FinPilot</h1>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Drawer nav items */}
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`group w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--brand-green)] text-white shadow-md'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Drawer footer */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => handleNavClick('settings')}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white font-semibold transition-all"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button
                onClick={() => handleNavClick('support')}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white font-semibold transition-all"
              >
                <HelpCircle size={18} />
                <span>Support</span>
              </button>
              <button
                onClick={() => { setMobileOpen(false); logout && logout(); }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white font-semibold transition-all"
              >
                <Repeat size={18} />
                <span>Switch Account</span>
              </button>
              <button
                onClick={() => { setMobileOpen(false); logout && logout(); }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 font-semibold transition-all"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
              {user && (
                <div className="flex items-center gap-3 px-3.5 py-3 mt-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{user.name || 'User'}</h4>
                    <p className="text-[10px] text-emerald-400 truncate uppercase font-bold tracking-wider">Premium Plan</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-sidebar)] border-t border-white/10 safe-bottom">
        <div className="flex justify-around items-center py-2">
          {mobileBottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          {/* More button opens the drawer */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-500 hover:text-gray-300 transition-all"
          >
            <Menu size={20} strokeWidth={1.5} />
            <span className="text-[10px] font-semibold text-gray-500">More</span>
          </button>
        </div>
      </div>
    </>
  );
}
