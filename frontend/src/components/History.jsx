import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History as HistoryIcon, 
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function History() {
  const { token, apiUrl } = useApp();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [year, setYear] = useState('2026');
  const [category, setCategory] = useState('All Categories');
  const [type, setType] = useState('All');

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/advisor/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-transparent border-t-emerald-500 border-r-emerald-500/30"></div>
      </div>
    );
  }

  // Calculate totals
  const totalIncome = historyData.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = historyData.reduce((acc, curr) => acc + curr.expenses, 0);
  const totalSavings = historyData.reduce((acc, curr) => acc + curr.savings, 0);
  const avgExpense = historyData.length > 0 ? totalExpense / historyData.length : 0;

  // Mock Category Breakdown for Donut Chart
  const categoryChartData = [
    { name: 'Food', value: 30200, color: '#3B82F6' },
    { name: 'Shopping', value: 34500, color: '#8B5CF6' },
    { name: 'Transport', value: 24700, color: '#F59E0B' },
    { name: 'Bills', value: 24000, color: '#10B981' },
    { name: 'Health', value: 16500, color: '#F43F5E' },
    { name: 'Others', value: 12400, color: '#6B7280' }
  ];

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">History</h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Analyze your financial history in detail</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 animate-fade-in-up delay-75">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Time Range</label>
            <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="w-full glass-input text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Year</label>
            <select value={year} onChange={e => setYear(e.target.value)} className="w-full glass-input text-sm">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full glass-input text-sm">
              <option>All Categories</option>
              <option>Food</option>
              <option>Rent</option>
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full glass-input text-sm">
              <option>All</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Date Range</label>
            <div className="glass-input text-sm flex items-center gap-2 text-[var(--text-secondary)]">
              01 Jan 2026 - 30 Jun 2026 <Calendar size={14} className="ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up delay-150">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-3 glass-card p-5">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6">Income vs Expense vs Savings</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData.slice().reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="savings" name="Savings" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                <Area type="monotone" dataKey="expenses" name="Expense" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          <div className="glass-card p-5 h-full flex flex-col justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Summary</h3>
            <p className="text-[10px] text-[var(--text-muted)] mb-6">Jan 2026 - Jun 2026</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Total Income</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Total Expense</p>
                <p className="text-lg font-bold text-rose-500">{formatCurrency(totalExpense)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Total Savings</p>
                <p className="text-lg font-bold text-blue-500">{formatCurrency(totalSavings)}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Avg Monthly Expense</p>
                <p className="text-base font-bold text-[var(--text-primary)]">{formatCurrency(avgExpense)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-225">
        
        {/* Breakdown Table */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-primary)]">
              <thead className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-2 font-semibold">Month</th>
                  <th className="py-3 px-2 font-semibold text-right">Income</th>
                  <th className="py-3 px-2 font-semibold text-right">Expense</th>
                  <th className="py-3 px-2 font-semibold text-right">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historyData.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2 font-medium">{row.month}</td>
                    <td className="py-3 px-2 text-right font-semibold text-[var(--text-primary)]">{formatCurrency(row.income)}</td>
                    <td className="py-3 px-2 text-right font-semibold text-[var(--text-primary)]">{formatCurrency(row.expenses)}</td>
                    <td className="py-3 px-2 text-right font-semibold text-[var(--text-primary)]">{formatCurrency(row.savings)}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-50/50 font-bold border-t border-gray-200">
                  <td className="py-4 px-2">Total</td>
                  <td className="py-4 px-2 text-right">{formatCurrency(totalIncome)}</td>
                  <td className="py-4 px-2 text-right">{formatCurrency(totalExpense)}</td>
                  <td className="py-4 px-2 text-right">{formatCurrency(totalSavings)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="glass-card p-5 flex flex-col">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Category Breakdown (Total Expense)</h3>
          <p className="text-[10px] text-[var(--text-muted)] mb-4">Total Expenses</p>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryChartData.map((entry, index) => (
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
              <span className="text-lg font-bold text-[var(--text-primary)]">{formatCurrency(totalExpense)}</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Total Expense</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryChartData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                <span className="text-[var(--text-secondary)] font-medium truncate w-16">{cat.name}</span>
                <span className="font-bold text-[var(--text-primary)] ml-auto">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
