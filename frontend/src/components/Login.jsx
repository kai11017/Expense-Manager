import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, Cpu, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const { login, register, error: apiError, loading } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (isLogin) {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password.');
      }
    } else {
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      const success = await register(name, email, password);
      if (success) {
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
        setPassword('');
      } else {
        setError('Registration failed. Email might already be taken.');
      }
    }
  };

  const handleQuickDemo = async () => {
    setEmail('demo@finpilot.com');
    setPassword('password123');
    setError('');
    setMessage('');
    // Use timeout to let state update visually for a cool micro-effect
    setTimeout(async () => {
      await login('demo@finpilot.com', 'password123');
    }, 300);
  };

  const features = [
    { icon: '📊', text: 'AI-Powered Predictions' },
    { icon: '🌱', text: 'Life Capital Tracking' },
    { icon: '💎', text: 'Portfolio Analytics' },
    { icon: '🧠', text: 'Smart Advisor' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse-slow delay-150"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10 animate-scale-in">
        {/* Brand Header — Outside card */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-500/25">
              <Cpu size={28} />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient-brand mb-1">FinPilot</h1>
          <p className="text-sm text-[var(--text-muted)]">Wealth & Life Capital Intelligence</p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-7 glow-green">
          {/* Tab Toggle */}
          <div className="flex mb-6 bg-white/[0.03] rounded-xl p-1 border border-glassBorder">
            <button
              onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-600 text-white shadow-md' 
                  : 'text-[var(--text-muted)] hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-600 text-white shadow-md' 
                  : 'text-[var(--text-muted)] hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-500/20 text-red-300 text-sm rounded-xl flex items-center gap-2 animate-fade-in">
              <span className="text-red-400">⚠</span>
              {error || apiError}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-sm rounded-xl flex items-center gap-2 animate-fade-in">
              <span className="text-emerald-400">✓</span>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-fade-in-up">
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                    placeholder="Abhishek Sharma"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-4 items-center mt-2">
            <div className="flex-grow border-t border-glassBorder"></div>
            <span className="flex-shrink mx-4 text-[var(--text-muted)] text-[10px] uppercase tracking-[0.15em] font-semibold">Quick Access</span>
            <div className="flex-grow border-t border-glassBorder"></div>
          </div>

          {/* Demo Button */}
          <button
            onClick={handleQuickDemo}
            className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 hover:text-white border border-glassBorder hover:border-white/10 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Zap size={14} className="text-amber-400 group-hover:animate-pulse" />
            Try Quick Demo (One-Click)
          </button>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {features.map((f, i) => (
            <span 
              key={i}
              className="text-[10px] text-[var(--text-muted)] bg-white/[0.03] border border-glassBorder rounded-full px-3 py-1.5 flex items-center gap-1.5 animate-fade-in"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              {f.icon} {f.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
