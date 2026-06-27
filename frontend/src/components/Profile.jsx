import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard,
  Building,
  Target,
  BrainCircuit,
  Zap,
  MoreVertical,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  Wallet
} from 'lucide-react';

export default function Profile() {
  const { user } = useApp();
  const [activeSection, setActiveSection] = useState('personal');

  const navItems = [
    { id: 'personal', label: 'Personal', icon: UserIcon },
    { id: 'financial', label: 'Financial Profile', icon: CreditCard },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'portfolio', label: 'Life Portfolio', icon: Building },
    { id: 'ai', label: 'AI Personalization', icon: BrainCircuit, highlight: true },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto pb-10 flex flex-col md:flex-row gap-8 animate-fade-in-up mt-4">
      
      {/* Left Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Account Settings</h2>
        <p className="text-[var(--text-muted)] text-xs mb-8">Manage your financial identity, portfolio preferences, and AI assistant behavior.</p>
        
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeSection === item.id 
                  ? 'bg-white shadow-sm text-[var(--brand-green)] border border-gray-100' 
                  : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} className={activeSection === item.id || item.highlight ? 'text-[var(--brand-green)]' : 'text-gray-400'} />
              <span className={item.highlight ? 'text-[var(--brand-green)]' : ''}>{item.label}</span>
              {activeSection === item.id && (
                <div className="ml-auto w-1 h-5 rounded-full bg-[var(--brand-green)]"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* Personal Information */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden shadow-sm">
                  <img src="https://ui-avatars.com/api/?name=Alex+Thompson&background=0A2519&color=fff&size=150" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg border-2 border-white shadow-sm">
                  <UserIcon size={12} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Personal Information</h3>
                <p className="text-xs text-[var(--text-muted)] mb-3">Update your account identity and contact details.</p>
                <div className="flex gap-2">
                  <span className="badge badge-emerald text-[9px] py-1 uppercase font-bold tracking-wider">VERIFIED USER</span>
                  <span className="badge badge-blue text-[9px] py-1 uppercase font-bold tracking-wider bg-indigo-50 text-indigo-600">PREMIUM PLAN</span>
                </div>
              </div>
            </div>
            <button className="text-xs font-bold text-[var(--brand-green)] flex items-center gap-1 hover:text-emerald-700 transition-colors">
              EDIT PROFILE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-6 border-t border-gray-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Full Name</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name || 'Alex Thompson'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Email Address</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.email || 'alex.t@finpilot.com'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Phone Number</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">+1 (555) 0123-4567</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Location</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Financial Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 col-span-3 flex flex-col md:flex-row gap-4">
             <div className="flex items-center gap-2 mb-2 w-full md:w-auto md:mr-8 shrink-0">
               <CreditCard size={18} className="text-emerald-600" />
               <h3 className="text-sm font-bold text-[var(--text-primary)]">Financial Profile</h3>
             </div>
             
             <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Income Bracket</p>
                  <p className="text-sm font-bold text-emerald-700">$150k - $250k</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">Annual Gross</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Risk Tolerance</p>
                  <p className="text-sm font-bold text-emerald-700">Moderate Growth</p>
                  <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-[60%]"></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Net Worth Goal</p>
                  <p className="text-sm font-bold text-emerald-700">$1,240,500</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">5 Year Objective</p>
                </div>
             </div>
          </div>
        </div>

        {/* Financial Goals */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Financial Goals</h3>
            </div>
            <button className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
              MANAGE GOALS
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Retirement Portfolio</p>
                <p className="text-xs font-bold text-emerald-600">65% Achieved</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-medium">
                <span>$850,000 Current</span>
                <span>$1,250,000 Target</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Real Estate Downpayment</p>
                <p className="text-xs font-bold text-emerald-600">92% Achieved</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-medium">
                <span>$184,000 Current</span>
                <span>$200,000 Target</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Personalization */}
        <div className="glass-card p-6 relative overflow-hidden bg-gradient-to-br from-white to-purple-50/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <BrainCircuit size={18} className="text-purple-600" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Personalization</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-6 relative z-10">Customize how "Finny" interacts with your financial data and the frequency of automated smart-insights.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-2">AI Personality</label>
                <div className="relative">
                  <select className="w-full glass-input text-sm appearance-none font-semibold text-[var(--text-primary)]">
                    <option>Strategic & Analytical (Default)</option>
                    <option>Strict & Disciplined</option>
                    <option>Encouraging & Gentle</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-2">Insight Frequency</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button className="flex-1 py-1.5 text-xs font-bold bg-white text-gray-900 rounded-lg shadow-sm">Daily</button>
                  <button className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">Weekly</button>
                  <button className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">Smart</button>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100/50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-purple-600" />
                <h4 className="text-sm font-bold text-purple-900">Predictive Engine</h4>
              </div>
              <p className="text-xs text-purple-700/80 mb-4 leading-relaxed">Allow AI to run daily simulations of your portfolio based on global market volatility.</p>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                <span className="text-xs font-bold text-purple-900">Enabled</span>
                <div className="w-10 h-6 bg-purple-600 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio & Linked Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
             <div className="flex items-center gap-2 mb-6">
              <Building size={18} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Portfolio</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><TrendingUp size={14} /></div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Equities</span>
                </div>
                <span className="text-sm font-bold text-[var(--text-secondary)]">42%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Building size={14} /></div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Real Estate</span>
                  </div>
                <span className="text-sm font-bold text-[var(--text-secondary)]">38%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Wallet size={14} /></div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Commodities</span>
                </div>
                <span className="text-sm font-bold text-[var(--text-secondary)]">18%</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={18} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Linked Accounts</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl shadow-sm bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">C</div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Chase Sapphire</p>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5"><CheckCircle2 size={10}/> Connected</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl shadow-sm bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">V</div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Vanguard 401k</p>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5"><CheckCircle2 size={10}/> Connected</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
              </div>
              <button className="w-full py-3 mt-4 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-[var(--brand-green)] hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                + Link New Bank
              </button>
            </div>
          </div>
        </div>

        {/* Security & Preferences */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Security & Authentication</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-[var(--text-muted)]">Secure your account with a secondary verification method.</p>
              </div>
              <button className="btn-secondary text-xs px-4 py-2 font-bold shadow-sm">CONFIGURE</button>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Biometric Login</p>
                <p className="text-xs text-[var(--text-muted)]">Use FaceID or TouchID for mobile access.</p>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Password</p>
                <p className="text-xs text-[var(--text-muted)]">Last changed 42 days ago.</p>
              </div>
              <button className="btn-secondary text-xs px-4 py-2 font-bold shadow-sm">CHANGE</button>
            </div>
          </div>
        </div>
        
        {/* Footers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
           <div className="glass-card p-6">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">General Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Currency</label>
                  <select className="w-full glass-input text-xs font-semibold appearance-none">
                    <option>USD - United States Dollar ($)</option>
                    <option>INR - Indian Rupee (₹)</option>
                    <option>EUR - Euro (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Language</label>
                  <select className="w-full glass-input text-xs font-semibold appearance-none">
                    <option>English (US)</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
           </div>
           
           <div className="glass-card p-6">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">Email Alerts</p>
                  <div className="w-4 h-4 bg-emerald-500 rounded flex items-center justify-center text-white"><CheckCircle2 size={12}/></div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">Push Notifications</p>
                  <div className="w-4 h-4 bg-emerald-500 rounded flex items-center justify-center text-white"><CheckCircle2 size={12}/></div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">SMS Portfolio Briefing</p>
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                </div>
              </div>
           </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] pb-8 pt-4 border-t border-gray-200/50">
          <p>FinPilot OS v2.4.1<br/>Secured by AES-256 Protocol Server.</p>
          <div className="flex gap-4 font-bold text-[var(--text-secondary)]">
            <a href="#" className="hover:text-emerald-600 transition-colors">Help Documentation</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">API Reference</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </div>
  );
}
