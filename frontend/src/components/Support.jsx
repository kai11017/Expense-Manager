import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Rocket, 
  Wallet, 
  Shield, 
  Sparkles, 
  Bot, 
  Send, 
  MessageSquare, 
  ChevronRight,
  Mail,
  Users,
  MessageCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function Support() {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  return (
    <div className="flex-1 max-w-7xl mx-auto pb-10 pt-4 animate-fade-in-up">
      {/* Hero Search Section */}
      <section className="mb-12 text-center py-16 px-8 rounded-[32px] relative overflow-hidden bg-[var(--bg-surface-hover)] border border-[var(--border-soft)]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--text-primary) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">How can we help you today?</h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">Get instant support for your FinPilot OS environment, from technical setup to AI-driven portfolio insights.</p>
          
          <div className="max-w-3xl mx-auto relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 rounded-2xl border-[var(--border-soft)] border-2 bg-[var(--bg-surface)] px-6 pl-14 text-lg focus:ring-4 focus:ring-primary-container/20 focus:border-emerald-500 transition-all outline-none text-[var(--text-primary)] shadow-sm" 
              placeholder="Search help articles..." 
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={24} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <kbd className="bg-[var(--bg-surface-hover)] px-2 py-1 rounded text-xs text-[var(--text-secondary)] border border-[var(--border-soft)] font-mono">CMD + K</kbd>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">Suggested:</span>
            <button className="px-4 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-emerald-500/10 text-[var(--text-secondary)] hover:text-emerald-600 font-medium transition-all text-xs border border-[var(--border-soft)]">Setting up 2FA</button>
            <button className="px-4 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-emerald-500/10 text-[var(--text-secondary)] hover:text-emerald-600 font-medium transition-all text-xs border border-[var(--border-soft)]">Linking Bank Accounts</button>
            <button className="px-4 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-emerald-500/10 text-[var(--text-secondary)] hover:text-emerald-600 font-medium transition-all text-xs border border-[var(--border-soft)]">Understanding Finny's Advice</button>
          </div>
        </div>
      </section>

      {/* Bento Grid: Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* System Status (Wide) */}
        <div className="md:col-span-12 flex items-center justify-between px-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-sm text-[var(--text-primary)] font-bold">All Systems Operational</span>
          </div>
          <button className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-1">
            View Detailed Status <ArrowRight size={16} />
          </button>
        </div>

        {/* Category Cards */}
        {[
          { icon: Rocket, title: 'Getting Started', desc: 'New to FinPilot? Learn the basics of your new financial operating system.', articles: 12 },
          { icon: Wallet, title: 'Portfolio', desc: 'Managing assets, connecting brokerage accounts, and tracking performance.', articles: 24 },
          { icon: Shield, title: 'Security', desc: 'Privacy protocols, 2FA setup, and keeping your financial data secure.', articles: 18 }
        ].map((cat, idx) => (
          <div key={idx} className="md:col-span-3 group cursor-pointer active:scale-[0.98] transition-transform">
            <div className="h-full bg-[var(--bg-surface)] border border-[var(--border-soft)] p-6 rounded-[18px] hover:border-emerald-500 transition-all shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-hover)] flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 text-[var(--text-secondary)] transition-colors">
                <cat.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{cat.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] flex-1">{cat.desc}</p>
              <div className="mt-4 pt-4 border-t border-[var(--border-soft)]">
                <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 inline-block transition-transform">{cat.articles} ARTICLES →</span>
              </div>
            </div>
          </div>
        ))}

        {/* Finny Card (The AI Highlight) */}
        <div className="md:col-span-3 group cursor-pointer active:scale-[0.98] transition-transform">
          <div className="h-full bg-[var(--bg-surface)] p-6 rounded-[18px] transition-all shadow-[0_0_20px_-5px_rgba(139,92,246,0.2)] border-t-[3px] border-[#8B5CF6] border-x border-b border-[var(--border-soft)] flex flex-col relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-[#8B5CF6]">
              <Sparkles size={100} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-4 text-[#8B5CF6]">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">AI Advisor FAQs</h3>
            <p className="text-sm text-[var(--text-secondary)] flex-1 relative z-10">Understanding how Finny analyzes your spending and offers recommendations.</p>
            <div className="mt-4 pt-4 border-t border-[var(--border-soft)] relative z-10">
              <span className="text-xs font-bold text-[#8B5CF6] group-hover:translate-x-1 inline-block transition-transform">FINNY'S TIPS →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Section: AI vs Direct Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Finny Interactive Support */}
        <div className="lg:col-span-7">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[24px] p-8 h-full flex flex-col shadow-sm relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-blue-400 flex items-center justify-center text-white shadow-lg">
                  <Bot size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">Ask Finny for Support</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Instant troubleshooting and guide retrieval.</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#8B5CF6]/20">
                Always Active
              </div>
            </div>
            
            <div className="flex-1 bg-[var(--bg-surface-hover)] rounded-xl p-4 mb-4 border border-[var(--border-soft)] min-h-[160px] flex flex-col">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold shrink-0">F</div>
                <div className="bg-[var(--bg-surface)] p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-[var(--text-primary)] max-w-[85%] border border-[var(--border-soft)]">
                  Hello {user?.name?.split(' ')[0] || 'there'}! I'm here to help you navigate FinPilot. Are you having trouble with a specific feature or would you like me to walk you through a setup?
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="bg-emerald-500/10 p-4 rounded-2xl rounded-tr-none text-sm text-emerald-700 dark:text-emerald-300 max-w-[85%] border border-emerald-500/20">
                  I need help linking my Chase business account.
                </div>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-xl py-4 pl-4 pr-16 focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all outline-none text-[var(--text-primary)] shadow-sm" 
                placeholder="Type your issue..." 
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#8B5CF6] text-white rounded-lg flex items-center justify-center hover:brightness-110 transition-colors active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Live Chat Prioritized */}
          <div className="bg-emerald-600 text-white rounded-[24px] p-8 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 hover:bg-emerald-700">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare size={28} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Priority Live Chat</h4>
                <p className="text-sm text-white/80 mt-1">Typical response time: &lt; 2 mins</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 group-hover:translate-x-1 transition-transform">
              <ChevronRight size={24} />
            </div>
          </div>

          {/* Email & Forum Grid */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[24px] p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-colors cursor-pointer group">
              <div>
                <Mail className="text-[var(--text-muted)] mb-4 group-hover:text-emerald-500 transition-colors" size={24} />
                <h4 className="font-bold text-[var(--text-primary)] mb-2">Email Support</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-tight">For non-urgent technical inquiries.</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 mt-4 uppercase tracking-widest">Send Ticket</span>
            </div>
            
            <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-[24px] p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-colors cursor-pointer group">
              <div>
                <Users className="text-[var(--text-muted)] mb-4 group-hover:text-emerald-500 transition-colors" size={24} />
                <h4 className="font-bold text-[var(--text-primary)] mb-2">Community</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-tight">Discuss strategies with other operators.</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 mt-4 uppercase tracking-widest">Join Forum</span>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-[24px] p-6 flex items-center gap-4">
            <div className="text-blue-500">
              <MessageCircle size={24} />
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-bold">Missing something?</span> Help us improve by <a href="#" className="underline font-bold hover:text-blue-500">suggesting a new guide</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
