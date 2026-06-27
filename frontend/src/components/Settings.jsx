import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Edit2, Shield, Network, Sparkles, CheckCircle2, Plus, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { user, theme, setTheme } = useApp();
  
  // State for forms and toggles
  const [name, setName] = useState(user?.name || 'Eleanor Vance');
  const [email, setEmail] = useState(user?.email || 'eleanor.v@finpilot.io');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleSave = () => {
    // Simulated save action
    const btn = document.getElementById('save-btn');
    const originalText = btn.innerText;
    btn.innerText = 'Saved!';
    btn.classList.add('bg-primary', 'text-white');
    setTimeout(() => {
      btn.innerText = originalText;
      btn.classList.remove('bg-primary', 'text-white');
    }, 2000);
  };

  return (
    <div className="flex-1 p-lg md:p-xl lg:p-xxl max-w-[1440px] mx-auto w-full animate-fade-in-up mt-8">
      <div className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-[var(--text-primary)] mb-xs font-bold">Your Profile</h2>
        <p className="font-body-lg text-body-lg text-[var(--text-secondary)]">Manage your account preferences and configurations.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column (Identity & Security) */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          
          {/* Profile & Identity */}
          <section className="glass-card rounded-[18px] p-lg bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-soft)] shadow-sm">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-soft)] pb-sm mb-lg">
              Profile & Identity
            </h3>
            <div className="flex flex-col md:flex-row gap-lg items-start">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-container-highest flex-shrink-0 relative group">
                <img 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMRjjShE_B229z7RtmDXHsJnWtOvlSiqqlmBafv91yTRJwFDY65AXjhyQKw2jc41XrEWW2Tvb8U1KTcQFL-m6Dx95uuMc93KkjnTRRXayt4NVj10Af8nDqzI0qVfguP-ry9KqeD5byaaviilUh9Uw1wpKKHO8RJNA7tdJpOb4Q0SyfqLdjLzbUiecbFAoxD_008Asynn9j5FOvYhC_PCisDoXCpIc_zdQXwVZISK_vFnPh5Si41NTETczVGFwbHLSnMwrKnwdy-JM"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Edit2 className="text-white" size={24} />
                </div>
              </div>
              
              <div className="flex-1 space-y-md w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-md text-label-md font-semibold text-[var(--text-secondary)] mb-xs">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-lg px-md py-sm font-body-md text-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md font-semibold text-[var(--text-secondary)] mb-xs">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-lg px-md py-sm font-body-md text-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 focus:outline-none transition-all" 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-sm bg-[var(--bg-surface)] rounded-lg border border-[var(--border-soft)] mt-4">
                  <div className="flex items-center gap-sm">
                    <Shield className="text-tertiary" size={24} />
                    <div>
                      <p className="font-label-md text-label-md font-bold text-[var(--text-primary)]">Premium Member</p>
                      <p className="font-body-sm text-body-sm text-[var(--text-secondary)]">Active until Oct 2024</p>
                    </div>
                  </div>
                  <button className="font-label-md text-label-md font-bold text-secondary hover:text-secondary-fixed-dim transition-colors">Manage</button>
                </div>
              </div>
            </div>
            
            <div className="mt-lg flex justify-end">
              <button 
                id="save-btn"
                onClick={handleSave}
                className="bg-primary-container text-on-primary-container font-label-md text-label-md font-bold py-sm px-lg rounded-lg hover:brightness-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </section>

          {/* Security & Privacy */}
          <section className="glass-card rounded-[18px] p-lg bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-soft)] shadow-sm">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-soft)] pb-sm mb-lg">
              Security & Privacy
            </h3>
            <div className="space-y-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-label-md text-label-md font-bold text-[var(--text-primary)]">Two-Factor Authentication (2FA)</h4>
                  <p className="font-body-sm text-body-sm text-[var(--text-secondary)] mt-xs">Add an extra layer of security to your account.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={twoFactorEnabled}
                    onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${twoFactorEnabled ? 'bg-primary-container' : 'bg-[var(--bg-surface)]-variant'}`}>
                    <div className={`absolute top-[2px] left-[2px] bg-[var(--bg-surface)] border border-gray-300 rounded-full h-5 w-5 transition-transform ${twoFactorEnabled ? 'translate-x-full border-white' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className="flex flex-col border-t border-[var(--border-soft)] pt-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-label-md text-label-md font-bold text-[var(--text-primary)]">Password</h4>
                    <p className="font-body-sm text-body-sm text-[var(--text-secondary)] mt-xs">Last changed 3 months ago.</p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-label-md text-label-md font-bold py-sm px-md rounded-lg transition-all"
                  >
                    {showPasswordForm ? 'Cancel' : 'Update'}
                  </button>
                </div>
                
                {showPasswordForm && (
                  <div className="mt-md space-y-sm bg-[var(--bg-surface-hover)] p-sm rounded-lg border border-[var(--border-soft)] animate-fade-in-up">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-lg px-md py-sm font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-lg px-md py-sm font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
                    />
                    <div className="flex justify-between items-center pt-xs">
                      <span className="text-xs text-primary font-bold">{passwordMessage}</span>
                      <button 
                        onClick={() => {
                          if (currentPassword && newPassword) {
                            setPasswordMessage('Password updated successfully!');
                            setTimeout(() => {
                              setShowPasswordForm(false);
                              setPasswordMessage('');
                              setCurrentPassword('');
                              setNewPassword('');
                            }, 2000);
                          } else {
                            setPasswordMessage('Please fill all fields');
                          }
                        }}
                        className="bg-primary text-white font-label-md text-label-md font-bold py-sm px-md rounded-lg transition-all"
                      >
                        Confirm Change
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Connectivity & Appearance) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          
          {/* Financial Connectivity */}
          <section className="glass-card rounded-[18px] p-lg relative overflow-hidden border-t-2 border-[#8B5CF6] bg-[var(--bg-surface)]/80 backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <div className="absolute top-0 right-0 p-sm text-tertiary opacity-10">
              <Network size={64} />
            </div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-soft)] pb-sm mb-lg flex items-center gap-sm relative z-10">
              <Sparkles className="text-tertiary" size={20} />
              Connectivity
            </h3>
            <p className="font-body-sm text-body-sm text-[var(--text-secondary)] mb-md relative z-10">
              Smart sync active for connected institutions.
            </p>
            
            <div className="space-y-sm relative z-10">
              <div className="flex items-center justify-between p-sm bg-[var(--bg-surface)] rounded-lg border border-[var(--border-soft)]">
                <div className="flex items-center gap-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold">C</div>
                  <span className="font-body-sm text-body-sm font-semibold">Chase Bank</span>
                </div>
                <CheckCircle2 className="text-primary-container" size={18} />
              </div>
              
              <div className="flex items-center justify-between p-sm bg-[var(--bg-surface)] rounded-lg border border-[var(--border-soft)]">
                <div className="flex items-center gap-sm">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold">F</div>
                  <span className="font-body-sm text-body-sm font-semibold">Fidelity</span>
                </div>
                <CheckCircle2 className="text-primary-container" size={18} />
              </div>
            </div>
            
            <button className="w-full mt-md bg-[var(--bg-surface)] border border-dashed border-outline text-[var(--text-secondary)] font-label-md text-label-md font-bold py-sm rounded-lg hover:bg-[var(--bg-surface)]-container hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-xs relative z-10">
              <Plus size={16} /> Add Connection
            </button>
          </section>

          {/* Appearance */}
          <section className="glass-card rounded-[18px] p-lg bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-soft)] shadow-sm">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-soft)] pb-sm mb-lg">
              Appearance
            </h3>
            <div className="space-y-md">
              <div>
                <h4 className="font-label-md text-label-md font-bold text-[var(--text-primary)] mb-sm">Theme</h4>
                <div className="grid grid-cols-3 gap-sm">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-xs p-sm rounded-lg transition-colors ${
                      theme === 'light' 
                        ? 'border-2 border-primary-container bg-[var(--bg-surface)]' 
                        : 'border border-[var(--border-soft)] hover:border-outline bg-[var(--bg-surface)]'
                    }`}
                  >
                    <Sun className={theme === 'light' ? 'text-primary' : 'text-[var(--text-secondary)]'} size={20} />
                    <span className={`font-label-md text-[10px] uppercase font-bold tracking-wider ${theme === 'light' ? 'text-primary' : 'text-[var(--text-secondary)]'}`}>Light</span>
                  </button>
                  
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-xs p-sm rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'border-2 border-primary-container bg-[var(--bg-surface)]' 
                        : 'border border-[var(--border-soft)] hover:border-outline bg-[var(--bg-surface)]'
                    }`}
                  >
                    <Moon className={theme === 'dark' ? 'text-primary' : 'text-[var(--text-secondary)]'} size={20} />
                    <span className={`font-label-md text-[10px] uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-primary' : 'text-[var(--text-secondary)]'}`}>Dark</span>
                  </button>
                  
                  <button 
                    onClick={() => setTheme('auto')}
                    className={`flex flex-col items-center gap-xs p-sm rounded-lg transition-colors ${
                      theme === 'auto' 
                        ? 'border-2 border-primary-container bg-[var(--bg-surface)]' 
                        : 'border border-[var(--border-soft)] hover:border-outline bg-[var(--bg-surface)]'
                    }`}
                  >
                    <SettingsIcon className={theme === 'auto' ? 'text-primary' : 'text-[var(--text-secondary)]'} size={20} />
                    <span className={`font-label-md text-[10px] uppercase font-bold tracking-wider ${theme === 'auto' ? 'text-primary' : 'text-[var(--text-secondary)]'}`}>Auto</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
