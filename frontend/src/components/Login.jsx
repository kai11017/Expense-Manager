import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, TrendingUp, BarChart3, ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ onBack }) {
  const { login, register, loading, error, resetPassword, googleLogin } = useApp();

  // Modes: 'login', 'register', 'forgot'
  const [mode, setMode] = useState('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        await login(email, password);
        // App.jsx will automatically route based on token change
      } else if (mode === 'register') {
        if (!name || !email || !password || !confirmPassword) {
          setLocalError('All fields are required');
          return;
        }
        if (password !== confirmPassword) {
          setLocalError('Passwords do not match');
          return;
        }
        const success = await register(name, email, password);
        if (success) {
          setSuccessMsg('Registration successful!');
        }
      } else if (mode === 'forgot') {
        if (!email) {
          setLocalError('Email is required');
          return;
        }
        const success = await resetPassword(email);
        if (success) {
          setSuccessMsg('A password reset link has been sent to your email!');
          setMode('login');
          setPassword('');
        }
      }
    } catch (err) {
      setLocalError(err.message || 'An error occurred');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    await googleLogin(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    setLocalError('Google Login Failed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Inter']">

      {/* LEFT COLUMN: THE FORM */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-5 sm:px-10 lg:px-24 xl:px-32 relative bg-white border-r border-slate-200">

        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-8 left-5 sm:left-10 lg:left-24 xl:left-32 text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
          </button>
        )}

        <div className="w-full max-w-[400px] mx-auto mt-16 lg:mt-0">

          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-[#006C49] rounded-xl flex items-center justify-center shadow-lg shadow-[#006C49]/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">FinOps Premium</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {mode === 'login' && "Welcome back!"}
              {mode === 'register' && "Create an account"}
              {mode === 'forgot' && "Reset your password"}
            </h1>
            <p className="text-slate-500">
              {mode === 'login' && "Enter your details to access your premium workspace."}
              {mode === 'register' && "Start managing your finances like a pro."}
              {mode === 'forgot' && "We'll send you a password reset link to your email."}
            </p>
          </div>

          {/* OAUTH BUTTONS */}
          {mode === 'login' && (
            <div className="space-y-4 mb-8">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="400"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">or continue with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </div>
          )}

          {/* Alerts */}
          {(error || localError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error || localError}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-600 font-medium">{successMsg}</p>
            </div>
          )}

          {/* MAIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Registration specific fields */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-[#006C49] focus:border-transparent transition-all shadow-sm"
                    placeholder="Olivia Ryans"
                  />
                </div>
              </div>
            )}

            {/* Email Field - Used in multiple modes */}
            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-[#006C49] focus:border-transparent transition-all shadow-sm"
                    placeholder="olivia@example.com"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            {(mode === 'login' || mode === 'register') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => { setMode('forgot'); setLocalError(''); setSuccessMsg(''); }} className="text-sm font-semibold text-[#006C49] hover:text-[#004e35] transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-[#006C49] focus:border-transparent transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-[#006C49] focus:border-transparent transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006C49] hover:bg-[#005a3c] text-white font-semibold rounded-xl py-3.5 transition-all shadow-lg shadow-[#006C49]/25 hover:shadow-xl hover:shadow-[#006C49]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : (
                mode === 'login' ? "Log In to Workspace" :
                  mode === 'register' ? "Create Account" :
                    "Send Password Reset Link"
              )}
            </button>
          </form>

          {/* Mode switchers */}
          <div className="mt-8 text-center">
            {mode === 'login' ? (
              <p className="text-slate-600 font-medium">
                Don't have an account? <button onClick={() => { setMode('register'); setLocalError(''); setSuccessMsg(''); }} className="text-[#006C49] hover:text-[#004e35] font-semibold">Sign up</button>
              </p>
            ) : (
              <p className="text-slate-600 font-medium">
                Already have an account? <button onClick={() => { setMode('login'); setLocalError(''); setSuccessMsg(''); }} className="text-[#006C49] hover:text-[#004e35] font-semibold">Log in</button>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: VISUALS */}
      <div className="hidden lg:flex w-[55%] xl:w-[60%] relative overflow-hidden bg-gradient-to-br from-[#0B2117] via-[#0D2D20] to-[#081810]">

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#006C49]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#10b981]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 lg:p-20">

          <div className="max-w-xl text-center mb-16">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Enterprise-grade wealth management, <span className="text-[#4edea3]">now personal.</span>
            </h2>
            <p className="text-slate-300 text-lg xl:text-xl leading-relaxed">
              Join 2 million+ investors leveraging AI-driven insights, real-time analytics, and secure automated trading.
            </p>
          </div>

          {/* Floating UI Elements */}
          <div className="relative w-full max-w-[500px] h-[300px]">
            {/* Card 1 */}
            <div className="absolute top-0 left-0 w-[320px] bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Portfolio Growth</p>
                    <p className="text-slate-400 text-sm">Last 30 days</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">+84.32%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[84%] h-full bg-gradient-to-r from-emerald-500 to-[#4edea3]"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute bottom-0 right-0 w-[280px] bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl animate-[float_7s_ease-in-out_infinite_reverse]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium leading-tight mb-1">AI Recommendation</p>
                  <p className="text-slate-300 text-sm">Rebalance your tech portfolio to mitigate upcoming market volatility.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
