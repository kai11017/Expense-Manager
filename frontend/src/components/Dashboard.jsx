import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  AlertTriangle,
  Wallet,
  Activity,
  PlusCircle,
  PiggyBank,
  Sparkles,
  Target,
  Zap,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

export default function Dashboard() {
  const { dashboardData, loading, setActiveTab } = useApp();

  if (loading && !dashboardData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-blue-500 border-r-blue-500/30"></div>
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 border-2 border-emerald-500"></div>
          </div>
          <span className="text-[11px] text-emerald-400/80 font-semibold uppercase tracking-[0.2em] animate-pulse">Loading cockpit...</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] min-h-[500px] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-glassBorder flex items-center justify-center">
          <AlertTriangle size={28} className="text-amber-400/50" />
        </div>
        <p className="text-sm">No dashboard data available.</p>
        <p className="text-xs text-[var(--text-muted)]">Verify backend is running and database is seeded.</p>
      </div>
    );
  }

  const {
    net_worth,
    monthly_spending,
    monthly_income,
    budget_left,
    top_category,
    investment_return,
    recent_transactions,
    goals_progress,
    prediction,
    prediction_warning,
    ai_advice
  } = dashboardData;

  // Formatting helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Mock monthly historical trends for charts
  const historyData = [
    { month: 'Jan', Spending: 38000, Budget: 42000, Income: 75000 },
    { month: 'Feb', Spending: 41000, Budget: 42000, Income: 75000 },
    { month: 'Mar', Spending: 39500, Budget: 44000, Income: 75000 },
    { month: 'Apr', Spending: 44000, Budget: 44000, Income: 75000 },
    { month: 'May', Spending: 47200, Budget: 45000, Income: 75000 },
    { month: 'Jun', Spending: monthly_spending, Budget: 45000, Income: monthly_income || 75000 }
  ];

  // Category chart mapping
  const categoryChartData = [
    { name: 'Rent', value: 18000, color: '#3B82F6' },
    { name: 'Food', value: top_category === 'Food' ? 12400 : 7500, color: '#EF4444' },
    { name: 'Bills', value: 3100, color: '#F59E0B' },
    { name: 'Health', value: 6000, color: '#10B981' },
    { name: 'Learning', value: 2400, color: '#8B5CF6' },
    { name: 'Shopping', value: 4500, color: '#EC4899' },
    { name: 'Experiences', value: 3800, color: '#06B6D4' }
  ];

  // Life Portfolio Allocation chart data
  const lifeCapitalData = [
    { name: 'Health', value: 40000, fill: '#10B981' },
    { name: 'Learning', value: 16500, fill: '#8B5CF6' },
    { name: 'Experiences', value: 18000, fill: '#06B6D4' },
    { name: 'Emergency', value: 60000, fill: '#F59E0B' }
  ];

  const statCards = [
    {
      label: 'Total Net Worth',
      value: formatCurrency(net_worth),
      subtitle: 'Includes Health & Learning Assets',
      icon: Wallet,
      iconColor: 'text-emerald-400',
      glowClass: 'glow-green',
      accentClass: 'accent-line-emerald',
      subtitleColor: 'text-emerald-400',
      subtitleIcon: ArrowUpRight
    },
    {
      label: 'Monthly Spending',
      value: formatCurrency(monthly_spending),
      subtitle: `Predicted next: ${formatCurrency(prediction)}`,
      icon: Activity,
      iconColor: 'text-rose-400',
      glowClass: 'glow-rose',
      accentClass: 'accent-line-amber',
      subtitleColor: 'text-[var(--text-muted)]',
      subtitleIcon: null
    },
    {
      label: 'Available Budget',
      value: formatCurrency(budget_left || 18400),
      subtitle: 'Based on active thresholds',
      icon: PiggyBank,
      iconColor: 'text-emerald-400',
      glowClass: 'glow-green',
      accentClass: 'accent-line-emerald',
      subtitleColor: 'text-[var(--text-muted)]',
      subtitleIcon: null
    },
    {
      label: 'Financial Returns',
      value: `+${investment_return}%`,
      subtitle: 'Overall gains vs cost basis',
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      glowClass: 'glow-purple',
      accentClass: 'accent-line-purple',
      subtitleColor: 'text-emerald-400',
      subtitleIcon: null
    }
  ];

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-end animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-green">
              <Zap size={10} />
              Live
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Financial & Capital <span className="text-gradient-brand">Cockpit</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Continuous evaluation of wealth, wellbeing, and growth assets.</p>
        </div>
        <button
          onClick={() => setActiveTab('transactions')}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusCircle size={16} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Warning Banner */}
      {prediction_warning && (
        <div className="p-4 bg-amber-950/20 border border-amber-500/15 text-amber-200 rounded-2xl flex items-center space-x-3 animate-fade-in-up delay-75">
          <div className="p-2 bg-amber-500/10 rounded-xl flex-shrink-0">
            <AlertTriangle className="text-amber-400" size={20} />
          </div>
          <div className="flex-1 text-sm">
            <span className="font-bold">Automated Budget Warning:</span> {prediction_warning}
          </div>
          <button 
            onClick={() => setActiveTab('advisor')} 
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer whitespace-nowrap group"
          >
            Ask AI Advisor
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const SubIcon = card.subtitleIcon;
          return (
            <div 
              key={card.label}
              className={`glass-card glass-card-hover p-5 ${card.glowClass} animate-fade-in-up`}
              style={{ animationDelay: `${(idx + 1) * 75}ms` }}
            >
              <div className="flex justify-between items-center text-[var(--text-muted)] mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">{card.label}</span>
                <div className={`p-1.5 rounded-lg bg-white/[0.04] ${card.iconColor}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)] animate-count-up">{card.value}</div>
              <div className={`flex items-center space-x-1 text-[11px] font-medium ${card.subtitleColor} mt-2.5`}>
                {SubIcon && <SubIcon size={13} />}
                <span>{card.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Spending & Income Area Chart */}
        <div className="lg:col-span-2 glass-card p-5 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Cash Flow & Budget Trends</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">6-month historical spending vs income</p>
            </div>
            <div className="flex gap-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-[var(--text-muted)]">Spending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[var(--text-muted)]">Income</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#1E293B' }}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', backdropFilter: 'blur(12px)' }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
                <Area type="monotone" dataKey="Spending" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpend)" name="Expenses" dot={false} />
                <Area type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name="Income" dot={false} strokeDasharray="6 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="glass-card p-5 flex flex-col justify-between animate-fade-in-up delay-375">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-0.5">Spending Categories</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Monthly allocation breakdown</p>
          </div>
          <div className="h-52 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)' }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-[0.15em] font-semibold block">Top Sector</span>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{top_category || 'Rent'}</p>
            </div>
          </div>
          
          {/* Custom Legends list */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-3 border-t border-glassBorder">
            {categoryChartData.slice(0, 6).map((entry) => (
              <div key={entry.name} className="flex items-center space-x-1.5 text-[var(--text-muted)] py-0.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }}></span>
                <span className="truncate">{entry.name}</span>
                <span className="text-[var(--text-muted)] ml-auto text-[10px]">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Life Portfolio Capital Bar Chart (Differentiator) */}
        <div className="glass-card p-5 animate-fade-in-up delay-375">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Life Capital</h3>
            <span className="badge badge-green text-[9px]">Unique</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mb-4">Wellness, learning, and safety asset valuations.</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lifeCapitalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={{ stroke: '#1E293B' }}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)' }}
                  formatter={(value) => [formatCurrency(value), 'Capital Value']}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={36}>
                  {lifeCapitalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="glass-card p-5 flex flex-col animate-fade-in-up delay-450">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Recent Activity</h3>
            <button 
              onClick={() => setActiveTab('transactions')} 
              className="btn-ghost text-[11px] flex items-center gap-1 group"
            >
              View All
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 max-h-[260px] pr-1">
            {recent_transactions && recent_transactions.map((t, idx) => (
              <div 
                key={t.id} 
                className="flex justify-between items-center text-sm py-2.5 px-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    t.type === 'income' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {t.type === 'income' ? '+' : '−'}
                  </div>
                  <div>
                    <h5 className="font-semibold text-[var(--text-primary)] text-[13px] truncate max-w-[120px]">{t.merchant || 'Merchant'}</h5>
                    <span className="text-[10px] text-[var(--text-muted)]">{t.date} • {t.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-glassBorder uppercase tracking-wider">{t.payment_mode}</span>
                </div>
              </div>
            ))}
            {(!recent_transactions || recent_transactions.length === 0) && (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Receipt size={18} className="text-gray-600" />
                </div>
                <p className="text-xs text-[var(--text-muted)]">No recent transactions yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Advisory Summary snippet */}
        <div className="glass-card p-5 glow-purple flex flex-col justify-between animate-fade-in-up delay-450">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Sparkles size={16} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">AI Advisor</h3>
                <span className="badge badge-green text-[9px]">
                  <Zap size={8} />
                  Active
                </span>
              </div>
            </div>
            <div className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-[7] space-y-1 pr-1 bg-white/[0.01] rounded-xl p-3 border border-white/[0.03]">
              {ai_advice ? (
                // Strip MD headers for cleaner layout in snippet
                ai_advice.replace(/#+\s/g, '').split('\n').slice(2, 9).join('\n')
              ) : (
                'Reviewing cash-flow and life assets. Navigate to the AI Advisor tab to run full plan evaluation.'
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('advisor')}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles size={14} />
            Consult Full AI Planner
          </button>
        </div>
      </div>
    </div>
  );
}
