import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Heart,
  BookOpen,
  Milestone,
  PlusCircle,
  ShieldCheck,
  Percent,
  Trash2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Portfolio() {
  const { portfolio, transactions, refreshData, getHeaders, API_BASE_URL } = useApp();
  const [activeTab, setActiveTab] = useState('financial'); // 'financial' or 'life'

  const [name, setName] = useState('');
  const [type, setType] = useState('Stock');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [symbol, setSymbol] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Stock Chart Modal State
  const [selectedChartAsset, setSelectedChartAsset] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartRange, setChartRange] = useState('1mo');

  if (!portfolio) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-400 min-h-[500px]">
        Loading portfolio context...
      </div>
    );
  }

  const { assets, summary } = portfolio;

  // Filter lists based on tab
  const lifeTypes = ["Health", "Learning", "Experiences", "Emergency Fund"];
  const financialAssets = assets.filter(a => !lifeTypes.includes(a.type));
  const portfolioLifeAssets = assets.filter(a => lifeTypes.includes(a.type));

  const transactionLifeAssets = (transactions || [])
    .filter(t => t.is_life_portfolio)
    .map(t => ({
      id: `txn-${t.id}`,
      name: t.merchant || t.category,
      type: t.life_category || 'Health',
      total_value: t.amount,
      notes: t.notes || 'Synced from Expenses',
      purchase_date: t.date,
      isFromTransaction: true,
      original_id: t.id
    }));

  const lifeAssets = [...portfolioLifeAssets, ...transactionLifeAssets];

  const currentMonthPrefix = new Date().toISOString().substring(0, 7);
  const getMonthlyInvestment = (type) => {
    return lifeAssets
      .filter(a => a.type === type && (a.purchase_date || '').startsWith(currentMonthPrefix))
      .reduce((sum, item) => sum + item.total_value, 0);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Handle asset creation
  const handleAddAsset = async (e) => {
    e.preventDefault();

    // Check validation based on type
    if (type === 'Stock') {
      if (!symbol || !purchasePrice || !quantity) {
        alert('Please fill in Symbol, Quantity, and Purchase Price.');
        return;
      }
    } else {
      if (!name || !purchasePrice || !currentValue) {
        alert('Please fill in required fields.');
        return;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: type === 'Stock' ? symbol.toUpperCase() : name,
          type,
          purchase_price: parseFloat(purchasePrice),
          current_value: type === 'Stock' ? 0.0 : parseFloat(currentValue),
          quantity: parseFloat(quantity),
          purchase_date: purchaseDate,
          notes,
          symbol: type === 'Stock' ? symbol.toUpperCase().trim() : null,
          exchange: 'NSE',
          sector: 'Equity',
          currency: 'INR'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save portfolio asset');
      }

      // Reset
      setName('');
      setPurchasePrice('');
      setCurrentValue('');
      setQuantity('1');
      setNotes('');
      setSymbol('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);

      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchChartData = async (asset, range = '1mo') => {
    setChartLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/chart/${asset.symbol}?range_str=${range}`, {
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stock history chart');
      }
      const resData = await response.json();
      setHistoryData(resData.data);
      setSelectedChartAsset(asset);
      setChartRange(range);
    } catch (err) {
      alert(err.message);
    } finally {
      setChartLoading(false);
    }
  };

  // Delete asset
  const handleDeleteAsset = async (asset) => {
    if (asset.isFromTransaction) {
      alert("This capital asset was automatically synced from your Expenses. To remove it, please delete the corresponding transaction in the Registry tab.");
      return;
    }
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Recharts data for traditional allocation
  const financialChartData = financialAssets.map(a => ({
    name: a.name,
    value: a.total_value,
    color: `#${Math.floor(randomColorSeed(a.name) * 16777215).toString(16).padStart(6, '0')}`
  }));

  // Deterministic color generation based on string name
  function randomColorSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(Math.sin(hash));
  }

  // Predefined colors for life assets
  const lifeColors = {
    "Health": "#4F46E5",       // emerald
    "Learning": "#8B5CF6",     // violet
    "Experiences": "#F97316",  // cyan
    "Emergency Fund": "#F59E0B" // amber
  };

  const lifeChartData = Object.keys(lifeColors).map(key => {
    const val = lifeAssets.filter(a => a.type === key).reduce((sum, item) => sum + item.total_value, 0);
    return { name: key, value: val, color: lifeColors[key] };
  }).filter(c => c.value > 0);

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Personal Capital Portfolios</h2>
          <p className="text-gray-400 text-sm mt-0.5">Asset allocations covering cash value, stock equity, and human potential.</p>
        </div>

        {/* Toggle tabs */}
        <div className="p-1 bg-gray-100 border border-gray-200 rounded-xl flex">
          <button
            onClick={() => {
              setActiveTab('financial');
              setType('Stock');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === 'financial'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
          >
            📈 Financial Assets
          </button>
          <button
            onClick={() => {
              setActiveTab('life');
              setType('Health');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider flex items-center space-x-1.5 ${activeTab === 'life'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/10'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
          >
            <Sparkles size={12} />
            <span>🌱 Life Portfolio</span>
          </button>
        </div>
      </div>

      {activeTab === 'financial' ? (
        // Traditional Wealth View
        <div className="space-y-6">
          {/* Traditional Wealth KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Total Financial Assets</span>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(summary.total_financial_value)}</div>
              <p className="text-[10px] text-gray-400 mt-2">Sum of stocks, mutual funds, gold, fixed deposits</p>
            </div>

            <div className="glass-card p-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Overall Gains / Losses</span>
              <div className={`text-2xl font-bold ${summary.overall_gain >= 0 ? 'text-indigo-600' : 'text-rose-400'}`}>
                {summary.overall_gain >= 0 ? '+' : ''}{formatCurrency(summary.overall_gain)}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Absolute profit across held equities and bullion</p>
            </div>

            <div className="glass-card p-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Weighted Return Rate</span>
              <div className="text-2xl font-bold text-indigo-600 flex items-center space-x-1">
                <Percent size={18} />
                <span>+{(summary.overall_gain / (summary.total_financial_value - summary.overall_gain) * 100).toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Average return on active capital basis</p>
            </div>
          </div>

          {/* Allocation & Add Asset Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset Allocation Pie Chart */}
            <div className="glass-card p-5 flex flex-col justify-between items-center">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4 w-full">Asset Allocation Share</h3>
              <div className="h-52 w-full relative flex items-center justify-center">
                {financialChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financialChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {financialChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6' }}
                        formatter={(value) => [formatCurrency(value), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-gray-500">No assets logged yet</span>
                )}
              </div>
              <div className="w-full flex flex-wrap gap-2 text-[10px] text-gray-400 border-t border-gray-200/40 pt-4 mt-2 justify-center">
                {financialChartData.map(c => (
                  <div key={c.name} className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Asset Form */}
            <div className="lg:col-span-2 glass-card p-5">
              <h3 className="text-md font-bold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
                <PlusCircle size={16} className="text-indigo-600" />
                <span>Acquire Traditional Asset</span>
              </h3>
              <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Asset Type</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      if (e.target.value === 'Stock') {
                        setName('');
                      }
                    }}
                    className="w-full p-2 glass-input text-xs"
                  >
                    <option value="Stock">Stock (Live Prices)</option>
                    <option value="Mutual Fund">Mutual Fund</option>
                    <option value="Gold">Gold</option>
                    <option value="FD">Fixed Deposit (FD)</option>
                    <option value="Crypto">Cryptocurrency</option>
                    <option value="Bonds">Bonds</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="PPF">PPF</option>
                    <option value="EPF">EPF</option>
                  </select>
                </div>

                {type === 'Stock' ? (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Stock Symbol</label>
                    <input
                      type="text"
                      required
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      className="w-full p-2 glass-input text-xs uppercase"
                      placeholder="E.g., RELIANCE, TCS, INFY"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Asset Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 glass-input text-xs"
                      placeholder="E.g., HDFC Mutual Fund, Sovereign Gold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {type === 'Stock' ? 'Average Buy Price (₹)' : 'Average Purchase Price (₹)'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="₹ 1420"
                  />
                </div>

                {type !== 'Stock' && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Current Price (₹)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      className="w-full p-2 glass-input text-xs"
                      placeholder="₹ 1510"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantity Owned</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Short Description / Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="SIP target / long term hold..."
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md active:scale-[0.98]"
                  >
                    Add Portfolio Asset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="glass-card p-5">
            <h3 className="text-md font-bold text-white mb-4">Financial Ledger Holdings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--text-primary)]">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 rounded-l-lg">Asset Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Purchase (Cost)</th>
                    <th className="py-3 px-4 text-right">Current Value</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4 text-right">Profit / Loss</th>
                    <th className="py-3 px-4 text-right">Return %</th>
                    <th className="py-3 px-4 text-right">Allocation</th>
                    <th className="py-3 px-4 rounded-r-lg text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glassBorder/30">
                  {financialAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-100 transition-all">
                      <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">
                        {asset.symbol ? (
                          <button
                            type="button"
                            onClick={() => fetchChartData(asset)}
                            className="text-left font-bold text-emerald-600 hover:text-emerald-500 hover:underline flex flex-col items-start"
                            title="Click to view live price chart"
                          >
                            <span>{asset.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium mt-0.5 normal-case">
                              {asset.symbol} • {asset.exchange} • {asset.sector} (View Chart)
                            </span>
                          </button>
                        ) : (
                          <>
                            <div>{asset.name}</div>
                            <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                              {asset.type}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full border border-white/5 uppercase tracking-wider text-gray-400">
                          {asset.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">{formatCurrency(asset.purchase_price)}</td>
                      <td className="py-3.5 px-4 text-right">{formatCurrency(asset.current_value)}</td>
                      <td className="py-3.5 px-4 text-right">{asset.quantity}</td>
                      <td className={`py-3.5 px-4 text-right font-bold ${asset.profit_loss >= 0 ? 'text-indigo-600' : 'text-rose-400'}`}>
                        {asset.profit_loss >= 0 ? '+' : ''}{formatCurrency(asset.profit_loss)}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold ${asset.return_percentage >= 0 ? 'text-indigo-600' : 'text-rose-400'}`}>
                        {asset.return_percentage >= 0 ? '+' : ''}{asset.return_percentage.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-indigo-600">{asset.allocation.toFixed(1)}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteAsset(asset)}
                          className="text-gray-500 hover:text-red-400 p-1 rounded-lg transition-all"
                          title="Sell/Remove Asset"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {financialAssets.length === 0 && (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-gray-500">
                        No financial assets registered yet. Add stocks, cryptos or gold holdings above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Life Portfolio Capital View (Differentiator)
        <div className="space-y-6 animate-fade-in">
          {/* Philosophy Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-500/20 rounded-2xl glow-purple">
            <h3 className="text-lg font-bold text-purple-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="text-purple-600 dark:text-purple-400 flex-shrink-0 animate-pulse" size={20} />
              <span>Capital is More than Money</span>
            </h3>
            <p className="text-sm text-[var(--text-primary)] mt-2 leading-relaxed">
              Traditional accounting tags expenses like fitness, courses, books, and trips as "lost capital".
              **FinPilot rewrites this logic.** When you spend money on your physical wellness, knowledge, and mental resilience, you are acquiring structural assets that yield compounding returns over your lifetime. We track these as capital allocations in your **Life Portfolio**.
            </p>
          </div>

          {/* Life Portfolio KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="glass-card p-5 flex items-center space-x-4 border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/10 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors">
              <div className="p-3 rounded-xl bg-emerald-200 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <Heart size={22} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-200/70 uppercase tracking-widest font-semibold">🏃 Health Capital</span>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Health').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 mt-1 font-medium bg-emerald-200 dark:bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                  +{formatCurrency(getMonthlyInvestment('Health'))} this month
                </div>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center space-x-4 border border-violet-500/20 bg-violet-50 dark:bg-violet-950/10 hover:bg-violet-100 dark:hover:bg-violet-950/30 transition-colors">
              <div className="p-3 rounded-xl bg-violet-200 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400">
                <BookOpen size={22} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-violet-700 dark:text-violet-200/70 uppercase tracking-widest font-semibold">📚 Learning Capital</span>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Learning').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
                <div className="text-[10px] text-violet-800 dark:text-violet-300 mt-1 font-medium bg-violet-200 dark:bg-violet-500/10 px-2 py-0.5 rounded inline-block">
                  +{formatCurrency(getMonthlyInvestment('Learning'))} this month
                </div>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center space-x-4 border border-cyan-500/20 bg-cyan-50 dark:bg-cyan-950/10 hover:bg-cyan-100 dark:hover:bg-cyan-950/30 transition-colors">
              <div className="p-3 rounded-xl bg-cyan-200 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400">
                <Milestone size={22} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-cyan-700 dark:text-cyan-200/70 uppercase tracking-widest font-semibold">✈️ Experience Capital</span>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Experiences').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
                <div className="text-[10px] text-cyan-800 dark:text-cyan-300 mt-1 font-medium bg-cyan-200 dark:bg-cyan-500/10 px-2 py-0.5 rounded inline-block">
                  +{formatCurrency(getMonthlyInvestment('Experiences'))} this month
                </div>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center space-x-4 border border-amber-500/20 bg-amber-50 dark:bg-amber-950/10 hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors">
              <div className="p-3 rounded-xl bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                <ShieldCheck size={22} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-amber-700 dark:text-amber-200/70 uppercase tracking-widest font-semibold">🛡️ Emergency Buffer</span>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Emergency Fund').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-300 mt-1 font-medium bg-amber-200 dark:bg-amber-500/10 px-2 py-0.5 rounded inline-block">
                  +{formatCurrency(getMonthlyInvestment('Emergency Fund'))} this month
                </div>
              </div>
            </div>
          </div>

          {/* Allocation & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Life Capital Allocation Pie */}
            <div className="glass-card p-5 flex flex-col justify-between items-center">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4 w-full">Life Capital Distribution</h3>
              <div className="h-52 w-full relative flex items-center justify-center">
                {lifeChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={lifeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {lifeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-soft)', borderRadius: '8px', color: 'var(--text-primary)' }}
                        formatter={(value) => [formatCurrency(value), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-[var(--text-muted)]">No life capital logged</span>
                )}
              </div>
              <div className="w-full flex flex-wrap gap-2 text-[10px] text-[var(--text-muted)] border-t border-[var(--border-soft)] pt-4 mt-2 justify-center">
                {lifeChartData.map(c => (
                  <div key={c.name} className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Life Asset Form */}
            <div className="lg:col-span-2 glass-card p-5">
              <h3 className="text-md font-bold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
                <Sparkles size={16} className="text-purple-600 dark:text-purple-400 animate-pulse" />
                <span>Log Capital Investment</span>
              </h3>
              <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Capital Item Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="E.g., Cult Fit Annual Pass, Standing Desk"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Capital Dimension</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                  >
                    <option value="Health">Health</option>
                    <option value="Learning">Learning</option>
                    <option value="Experiences">Experiences</option>
                    <option value="Emergency Fund">Emergency Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Investment Cost / Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={purchasePrice}
                    onChange={(e) => {
                      setPurchasePrice(e.target.value);
                      setCurrentValue(e.target.value); // set both identical for life asset
                    }}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="₹ 15000"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Short Description / Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="Annual fee / System Design Masterclass..."
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md active:scale-[0.98]"
                  >
                    Register Life Capital Asset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Life Portfolio list table */}
          <div className="glass-card p-5">
            <h3 className="text-md font-bold text-[var(--text-primary)] mb-4">Life Capital Assets Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--text-primary)]">
                <thead className="bg-[var(--input-bg)] border-b border-[var(--border-soft)] text-[var(--text-muted)] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 rounded-l-lg">Capital Asset</th>
                    <th className="py-3 px-4">Dimension</th>
                    <th className="py-3 px-4 text-right">Investment Amount</th>
                    <th className="py-3 px-4">Primary Benefit / Purpose</th>
                    <th className="py-3 px-4 rounded-r-lg text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glassBorder/30">
                  {lifeAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-[var(--bg-surface-hover)] transition-all">
                      <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">{asset.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider"
                          style={{
                            color: lifeColors[asset.type],
                            borderColor: `${lifeColors[asset.type]}30`,
                            backgroundColor: `${lifeColors[asset.type]}08`
                          }}>
                          {asset.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[var(--text-primary)]">{formatCurrency(asset.total_value)}</td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)] italic font-mono">{asset.notes || 'Asset values yield compounding performance'}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteAsset(asset)}
                          className="text-gray-500 hover:text-red-400 p-1 rounded-lg transition-all"
                          title="Remove Asset"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lifeAssets.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-[var(--text-muted)]">
                        No life capital assets registered. Select Life Capital checkmark when adding transactions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock History Chart Modal */}
      {selectedChartAsset && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="glass-card max-w-3xl w-full p-6 space-y-6 relative border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedChartAsset(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {selectedChartAsset.name}
                <span className="text-xs px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  {selectedChartAsset.symbol}
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Holding since: <span className="font-semibold text-white">{selectedChartAsset.purchase_date || 'N/A'}</span> •
                Avg Cost: <span className="font-semibold text-white">{formatCurrency(selectedChartAsset.purchase_price)}</span> •
                Qty: <span className="font-semibold text-white">{selectedChartAsset.quantity}</span>
              </p>
            </div>

            {/* Timeframe Selectors */}
            <div className="flex gap-2 border-b border-white/5 pb-3">
              {['5d', '1mo', '3mo', '1y'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => fetchChartData(selectedChartAsset, r)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${chartRange === r
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Chart Area */}
            <div className="h-64 w-full">
              {chartLoading ? (
                <div className="h-full flex items-center justify-center text-xs text-emerald-500 animate-pulse font-semibold">
                  Loading stock chart metrics...
                </div>
              ) : historyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6' }}
                      formatter={(value) => [formatCurrency(value), 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-500 font-semibold">
                  No historical data available for this ticker range.
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 border-t border-white/5 pt-4">
              <div>
                Current live price: <span className="font-bold text-white">{formatCurrency(selectedChartAsset.current_value)}</span>
              </div>
              <div className={`font-bold ${selectedChartAsset.profit_loss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                Holding Return: {selectedChartAsset.profit_loss >= 0 ? '+' : ''}{selectedChartAsset.return_percentage.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
