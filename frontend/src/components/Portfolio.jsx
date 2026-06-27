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
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function Portfolio() {
  const { portfolio, refreshData, getHeaders, API_BASE_URL } = useApp();
  const [activeTab, setActiveTab] = useState('financial'); // 'financial' or 'life'
  
  // Add Asset Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Stock');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

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
  const lifeAssets = assets.filter(a => lifeTypes.includes(a.type));

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
    if (!name || !purchasePrice || !currentValue) {
      alert('Please fill in required fields.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name,
          type,
          purchase_price: parseFloat(purchasePrice),
          current_value: parseFloat(currentValue),
          quantity: parseFloat(quantity),
          notes
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
      
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete asset
  const handleDeleteAsset = async (id) => {
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
    color: `#${Math.floor(randomColorSeed(a.name)*16777215).toString(16).padStart(6, '0')}`
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
    "Health": "#10B981",       // emerald
    "Learning": "#8B5CF6",     // violet
    "Experiences": "#06B6D4",  // cyan
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
        <div className="p-1 bg-white/5 border border-glassBorder rounded-xl flex">
          <button
            onClick={() => {
              setActiveTab('financial');
              setType('Stock');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${
              activeTab === 'financial'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            📈 Financial Assets
          </button>
          <button
            onClick={() => {
              setActiveTab('life');
              setType('Health');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider flex items-center space-x-1.5 ${
              activeTab === 'life'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/10'
                : 'text-gray-400 hover:text-gray-200'
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
              <div className={`text-2xl font-bold ${summary.overall_gain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.overall_gain >= 0 ? '+' : ''}{formatCurrency(summary.overall_gain)}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Absolute profit across held equities and bullion</p>
            </div>

            <div className="glass-card p-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Weighted Return Rate</span>
              <div className="text-2xl font-bold text-emerald-400 flex items-center space-x-1">
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
              <div className="w-full flex flex-wrap gap-2 text-[10px] text-gray-400 border-t border-glassBorder/40 pt-4 mt-2 justify-center">
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
                <PlusCircle size={16} className="text-emerald-400" />
                <span>Acquire Traditional Asset</span>
              </h3>
              <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="E.g., Reliance Industries, Nifty Gold ETF"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Asset Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                  >
                    <option value="Stock">Stock</option>
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

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Average Purchase Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="₹ 2400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Current Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="₹ 2950"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2 glass-input text-xs"
                    placeholder="10"
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
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-white/5 border-b border-glassBorder text-gray-400 uppercase tracking-wider">
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
                    <tr key={asset.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3.5 px-4 font-semibold text-gray-200">{asset.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full border border-white/5 uppercase tracking-wider text-gray-400">
                          {asset.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">{formatCurrency(asset.purchase_price)}</td>
                      <td className="py-3.5 px-4 text-right">{formatCurrency(asset.current_value)}</td>
                      <td className="py-3.5 px-4 text-right">{asset.quantity}</td>
                      <td className={`py-3.5 px-4 text-right font-bold ${asset.profit_loss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.profit_loss >= 0 ? '+' : ''}{formatCurrency(asset.profit_loss)}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold ${asset.return_percentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.return_percentage >= 0 ? '+' : ''}{asset.return_percentage.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">{asset.allocation.toFixed(1)}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
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
          <div className="p-5 bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/20 rounded-2xl glow-purple">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="text-purple-400 flex-shrink-0 animate-pulse" size={20} />
              <span>Capital is More than Money</span>
            </h3>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Traditional accounting tags expenses like fitness, courses, books, and trips as "lost capital". 
              **FinPilot rewrites this logic.** When you spend money on your physical wellness, knowledge, and mental resilience, you are acquiring structural assets that yield compounding returns over your lifetime. We track these as capital allocations in your **Life Portfolio**.
            </p>
          </div>

          {/* Life Portfolio KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="glass-card p-5 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/10">
                <Heart size={22} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">🏃 Health Capital</span>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Health').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/10">
                <BookOpen size={22} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">📚 Learning Capital</span>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Learning').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/10">
                <Milestone size={22} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">✈️ Experience Capital</span>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Experiences').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/10">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">🛡️ Emergency Buffer</span>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(lifeAssets.filter(a => a.type === 'Emergency Fund').reduce((sum, item) => sum + item.total_value, 0))}
                </div>
              </div>
            </div>
          </div>

          {/* Allocation & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Life Capital Allocation Pie */}
            <div className="glass-card p-5 flex flex-col justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 w-full">Life Capital Distribution</h3>
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
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6' }}
                        formatter={(value) => [formatCurrency(value), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-gray-500">No life capital logged</span>
                )}
              </div>
              <div className="w-full flex flex-wrap gap-2 text-[10px] text-gray-400 border-t border-glassBorder/40 pt-4 mt-2 justify-center">
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
              <h3 className="text-md font-bold text-white mb-4 flex items-center space-x-2">
                <Sparkles size={16} className="text-purple-400 animate-pulse" />
                <span>Log Capital Investment</span>
              </h3>
              <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Capital Item Name</label>
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
                  <label className="block text-xs text-gray-400 mb-1">Capital Dimension</label>
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
                  <label className="block text-xs text-gray-400 mb-1">Investment Cost / Value (₹)</label>
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
                  <label className="block text-xs text-gray-400 mb-1">Short Description / Notes</label>
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
            <h3 className="text-md font-bold text-white mb-4">Life Capital Assets Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-white/5 border-b border-glassBorder text-gray-400 uppercase tracking-wider">
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
                    <tr key={asset.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3.5 px-4 font-semibold text-gray-200">{asset.name}</td>
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
                      <td className="py-3.5 px-4 text-right font-bold text-white">{formatCurrency(asset.total_value)}</td>
                      <td className="py-3.5 px-4 text-gray-400 italic font-mono">{asset.notes || 'Asset values yield compounding performance'}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
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
                      <td colSpan="5" className="py-8 text-center text-gray-500">
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
    </div>
  );
}
