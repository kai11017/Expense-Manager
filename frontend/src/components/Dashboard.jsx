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
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

export default function Dashboard() {
  const { dashboardData, transactions, portfolio, loading, setActiveTab } = useApp();

  if (loading && !dashboardData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-emerald-500 border-r-emerald-500/30"></div>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold uppercase tracking-[0.2em] animate-pulse">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] min-h-[500px] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
          <AlertTriangle size={28} className="text-amber-400" />
        </div>
        <p className="text-sm">No dashboard data available.</p>
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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Determine if it is a new user (no transactions and no assets)
  const isNewUser = (!transactions || transactions.length === 0) && (!portfolio || !portfolio.assets || portfolio.assets.length === 0);

  // Dynamic cash flow calculations
  let cashFlowData = [];
  if (isNewUser) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    cashFlowData = months.map(m => ({ month: m, Income: 0, Expense: 0, Savings: 0 }));
  } else {
    const getLast6Months = () => {
      const months = [];
      const date = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        months.push({
          label: d.toLocaleString('default', { month: 'short' }),
          key: d.toISOString().slice(0, 7) // "YYYY-MM"
        });
      }
      return months;
    };

    const last6Months = getLast6Months();
    cashFlowData = last6Months.map(m => {
      const monthTxns = (transactions || []).filter(t => t.date && t.date.startsWith(m.key));
      const income = monthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return {
        month: m.label,
        Income: income,
        Expense: expense,
        Savings: income - expense
      };
    });
  }

  // Dynamic category calculations
  const currentMonthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const currentMonthExpenses = (transactions || []).filter(t => {
    return t.type === 'expense' && t.date && t.date.startsWith(currentMonthStr);
  });
  
  const totalExpenseAmount = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  
  let categoryChartData = [];
  if (totalExpenseAmount > 0) {
    const categoryTotals = {};
    currentMonthExpenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const colors = {
      'Food': '#3B82F6',
      'Shopping': '#8B5CF6',
      'Transport': '#F59E0B',
      'Bills': '#10B981',
      'Health': '#F43F5E',
      'Others': '#6B7280'
    };
    
    categoryChartData = Object.keys(categoryTotals).map(cat => {
      const val = Math.round((categoryTotals[cat] / totalExpenseAmount) * 100);
      return {
        name: cat,
        value: val,
        color: colors[cat] || `#${Math.floor(Math.abs(Math.sin(cat.charCodeAt(0))) * 16777215).toString(16).padStart(6, '0')}`
      };
    });
  } else {
    categoryChartData = [
      { name: 'No Expenses', value: 100, color: '#E5E7EB' }
    ];
  }

  const hasIncomeOrExpense = (monthly_income > 0) || (monthly_spending > 0);
  const incomeVsExpenseData = hasIncomeOrExpense ? [
    { name: 'Income', value: monthly_income, color: '#10B981' },
    { name: 'Expense', value: monthly_spending, color: '#F43F5E' }
  ] : [
    { name: 'No Data', value: 1, color: '#E5E7EB' }
  ];

  // Dynamic Investment calculations
  const totalFinancialCost = portfolio && portfolio.assets 
    ? portfolio.assets
        .filter(a => !["Health", "Learning", "Experiences", "Emergency Fund"].includes(a.type))
        .reduce((sum, a) => sum + (a.purchase_price * a.quantity), 0)
    : 0;

  const totalInvestments = portfolio && portfolio.summary 
    ? (portfolio.summary.total_financial_value || 0) 
    : 0;

  const overallGain = portfolio && portfolio.summary 
    ? (portfolio.summary.overall_gain || 0) 
    : 0;

  const growthRate = totalFinancialCost > 0 
    ? (overallGain / totalFinancialCost) * 100 
    : 0;

  // Dynamic budget alerts
  const defaultBudgets = {
    'Food': 10000,
    'Shopping': 5000,
    'Transport': 3000,
    'Bills': 15000,
    'Health': 5000,
    'Others': 10000
  };

  const getBudgetAlerts = () => {
    if (isNewUser) return [];

    const categorySpendingMap = {};
    currentMonthExpenses.forEach(t => {
      categorySpendingMap[t.category] = (categorySpendingMap[t.category] || 0) + t.amount;
    });

    const alerts = [];
    Object.keys(defaultBudgets).forEach(category => {
      const spent = categorySpendingMap[category] || 0;
      const limit = defaultBudgets[category];
      const pct = limit > 0 ? (spent / limit) * 100 : 0;
      
      if (spent > 0) {
        let status = 'on track';
        let colorClass = 'bg-emerald-500';
        if (pct >= 100) {
          status = 'exceeded';
          colorClass = 'bg-rose-500';
        } else if (pct >= 80) {
          status = 'near limit';
          colorClass = 'bg-amber-500';
        }
        
        alerts.push({
          category,
          spent,
          limit,
          pct: Math.min(100, pct),
          status: `${category} budget ${status}`,
          colorClass
        });
      }
    });

    return alerts;
  };

  const activeBudgetAlerts = getBudgetAlerts();

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* 5 Top Cards */}
      <div id="tour-summary" className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-in-up">
        {/* Total Net Worth */}
        <div className="glass-card p-5">
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Total Net Worth</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(net_worth)}</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> {isNewUser ? '0%' : '8.6%'} vs last month
          </p>
        </div>

        {/* Monthly Spending */}
        <div className="glass-card p-5">
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Monthly Spending</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(monthly_spending)}</h3>
          <p className="text-xs font-medium text-rose-500 mt-2 flex items-center gap-1">
            <TrendingDown size={12} /> {isNewUser ? '0%' : '12.4%'} vs last month
          </p>
        </div>

        {/* Available Budget */}
        <div className="glass-card p-5">
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Available Budget</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(budget_left)}</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2">
            {isNewUser ? '0%' : '40%'} of {formatCurrency(isNewUser ? 0 : 50000)}
          </p>
        </div>

        {/* Total Investments */}
        <div className="glass-card p-5">
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Total Investments</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalInvestments)}</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> {growthRate.toFixed(1)}% Overall
          </p>
        </div>

        {/* Monthly Growth % */}
        <div className="glass-card p-5">
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Monthly Growth</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">
            {overallGain >= 0 ? '+' : ''}{formatCurrency(overallGain)}
          </h3>
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> {isNewUser ? '0%' : '11.2%'} vs last month
          </p>
        </div>
      </div>

      {/* Middle Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up delay-75">
        
        {/* Income vs Expense Donut */}
        <div className="glass-card p-5 flex flex-col">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Income vs Expense</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">This Month</p>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={incomeVsExpenseData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {incomeVsExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-[var(--text-primary)]">{formatCurrency(monthly_income)}</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Income</span>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <p className="text-[10px] text-[var(--text-muted)]">Income</p>
              <p className="text-sm font-bold text-emerald-600">{formatCurrency(monthly_income)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[var(--text-muted)]">Expense</p>
              <p className="text-sm font-bold text-rose-500">{formatCurrency(monthly_spending)}</p>
            </div>
          </div>
        </div>

        {/* Category Donut */}
        <div className="glass-card p-5 flex flex-col">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Spending by Category</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">This Month</p>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4">
              <ul className="space-y-2">
                {categoryChartData.map((cat, i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      <span className="text-[var(--text-secondary)] font-medium">{cat.name}</span>
                    </div>
                    <span className="font-bold text-[var(--text-primary)]">{cat.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(monthly_spending)}</span>
              <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Total</span>
            </div>
          </div>
        </div>

        {/* Cash Flow Line Chart */}
        <div className="glass-card p-5 flex flex-col">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Cash Flow Trend</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Last 6 Months</p>
          <div className="flex-1 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Expense" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3, fill: '#F43F5E', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Savings" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Income
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Expense
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Savings
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up delay-150">
        
        {/* Recent Transactions */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Transactions</h3>
            <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          <div className="space-y-4">
            {recent_transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'
                  }`}>
                    <Receipt size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">{t.merchant}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{t.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-[var(--text-primary)]'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Alerts */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-gray-100">Budget Alerts</h3>
          <div className="space-y-5">
            {isNewUser || activeBudgetAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-[var(--text-muted)] gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Wallet size={16} className="text-gray-400" />
                </div>
                <p className="font-semibold">No budget alerts active</p>
                <p className="scale-95 opacity-80">Tracked categories will appear here once transactions are recorded.</p>
              </div>
            ) : (
              activeBudgetAlerts.map((alert, idx) => (
                <div key={idx}>
                  <p className="text-xs font-medium text-[var(--text-primary)] mb-1 uppercase tracking-wide text-[10px]">{alert.status}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mb-2">{formatCurrency(alert.spent)} of {formatCurrency(alert.limit)}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`${alert.colorClass} h-1.5 rounded-full`} style={{ width: `${alert.pct}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Insight */}
        <div id="tour-advisor" className="glass-card p-5 flex flex-col">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            AI Insight <Sparkles size={14} className="text-emerald-500" />
          </h3>
          <div className="flex-1 text-sm text-[var(--text-secondary)] space-y-4 leading-relaxed">
            {isNewUser ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-[var(--text-muted)] gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Sparkles size={16} className="text-emerald-500 animate-pulse" />
                </div>
                <p className="font-semibold text-emerald-600">Awaiting your data</p>
                <p className="scale-95 opacity-80">Add transactions or log your assets to generate personalized wealth recommendations.</p>
              </div>
            ) : (
              <div className="whitespace-pre-line text-xs font-medium text-[var(--text-secondary)] leading-relaxed">
                {ai_advice ? (ai_advice.length > 180 ? `${ai_advice.slice(0, 180)}...` : ai_advice) : "Analyzing your financial behavior... Check back soon for custom tips."}
              </div>
            )}
          </div>
          {!isNewUser && (
            <button 
              onClick={() => setActiveTab('advisor')} 
              className="mt-auto w-full btn-primary text-xs py-2.5 shadow-none"
            >
              View Full Insight
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
